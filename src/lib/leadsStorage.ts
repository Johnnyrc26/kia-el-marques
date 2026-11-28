import fs from 'fs';
import path from 'path';
import { LeadSubmission } from '@/types';
import { INITIAL_LEADS } from '@/data/initialLeads';
import { getStore } from '@netlify/blobs';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');
const TMP_LEADS_PATH = path.join('/tmp', 'leads.json');

// In-memory cache for ultra-fast serverless responses
let memoryLeads: LeadSubmission[] = [...INITIAL_LEADS];

// Helper to safely get the Netlify Blob store
function getBlobStore() {
  try {
    return getStore('kia_leads');
  } catch {
    return null;
  }
}

// Timeout wrapper con límite estricto de 3.5 segundos para jamás provocar un 504 Gateway Timeout
function withFastTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout exceeded')), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function mergeLeads(base: LeadSubmission[], newer: LeadSubmission[]): LeadSubmission[] {
  const map = new Map<string, LeadSubmission>();
  base.forEach((l) => {
    if (l.id) map.set(l.id, l);
  });
  newer.forEach((l) => {
    if (l.id) {
      const existing = map.get(l.id) || {};
      map.set(l.id, { ...existing, ...l });
    }
  });
  return Array.from(map.values()).sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

export async function saveLead(data: LeadSubmission): Promise<LeadSubmission> {
  const leadWithMeta: LeadSubmission = {
    ...data,
    id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: data.created_at || new Date().toISOString(),
    status: data.status || 'nuevo',
  };

  const currentLeads = await getLeads();
  const updatedList = [leadWithMeta, ...currentLeads.filter((l) => l.id !== leadWithMeta.id)];
  memoryLeads = updatedList;

  // 1. Immutable Server Log Backup
  console.log('[PROSPECTO_RECIBIDO_KIA]', JSON.stringify({
    id: leadWithMeta.id,
    fecha: leadWithMeta.created_at,
    nombre: leadWithMeta.full_name,
    telefono: leadWithMeta.phone,
    email: leadWithMeta.email || 'N/A',
    modelo: leadWithMeta.model_interest,
    uso: leadWithMeta.primary_use,
    financiamiento: leadWithMeta.financing_interest,
    tiempo: leadWithMeta.timeline,
    asesor: leadWithMeta.advisor_name || 'Showroom General',
  }));

  // 2. Writable /tmp disk backup
  try {
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error escribiendo en /tmp/leads.json:', err);
  }

  // 3. Local src/data/leads.json disk backup (desarrollo local)
  try {
    if (fs.existsSync(path.dirname(LEADS_FILE_PATH))) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
    }
  } catch {
    // Ignorado en lambdas de solo lectura
  }

  // 4. Netlify Blobs (Cloud Persistence con timeout rápido de 3.5s)
  try {
    const store = getBlobStore();
    if (store) {
      await withFastTimeout(store.setJSON('all_leads', updatedList), 3500);
    }
  } catch (err) {
    console.warn('Netlify Blobs save note:', err);
  }

  // 5. Alerta Push Inmediata
  try {
    fetch('https://ntfy.sh/kia_elmarques_leads_caracas_2026', {
      method: 'POST',
      headers: {
        'Title': `Nuevo Prospecto: ${leadWithMeta.full_name} (${leadWithMeta.advisor_name ? `Asesor: ${leadWithMeta.advisor_name}` : 'General'})`,
        'Priority': 'urgent',
        'Tags': 'car,incoming_envelope',
      },
      body: `Asesor: ${leadWithMeta.advisor_name || 'Showroom General'}\nModelo: ${leadWithMeta.model_interest}\nTeléfono: ${leadWithMeta.phone}\nEmail: ${leadWithMeta.email || 'N/A'}\nFinanciamiento: ${leadWithMeta.financing_interest || 'N/A'}\nUso: ${leadWithMeta.primary_use || 'N/A'}\nFecha: ${leadWithMeta.created_at}`,
    }).catch(() => {});
  } catch {
    // ignore
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  // Base inicial garantizada
  let consolidated: LeadSubmission[] = [...INITIAL_LEADS];

  // 1. Cargar archivo local src/data/leads.json si existe
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        consolidated = mergeLeads(consolidated, parsed);
      }
    }
  } catch {
    // ignore
  }

  // 2. Sobreponer datos en vivo desde /tmp/leads.json
  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const tmpContent = fs.readFileSync(TMP_LEADS_PATH, 'utf-8');
      const parsed = JSON.parse(tmpContent || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        consolidated = mergeLeads(consolidated, parsed);
      }
    }
  } catch {
    // ignore
  }

  // 3. Sobreponer memoria del proceso actual
  if (memoryLeads && memoryLeads.length > 0) {
    consolidated = mergeLeads(consolidated, memoryLeads);
  }

  // 4. Consultar Netlify Blobs si está configurado en producción (con timeout de 3.5s)
  try {
    const store = getBlobStore();
    if (store) {
      const blobPromise = store.get('all_leads', { type: 'json' });
      const blobLeads = (await withFastTimeout(blobPromise, 3500)) as LeadSubmission[];
      if (blobLeads && Array.isArray(blobLeads) && blobLeads.length > 0) {
        consolidated = mergeLeads(consolidated, blobLeads);
      }
    }
  } catch {
    // fallback seguro a consolidated inmediato
  }

  memoryLeads = consolidated;
  return consolidated;
}

export async function updateLead(id: string, updates: Partial<LeadSubmission>): Promise<boolean> {
  const currentLeads = await getLeads();

  let found = false;
  const updatedList = currentLeads.map((lead) => {
    if (lead.id === id) {
      found = true;
      return { ...lead, ...updates };
    }
    return lead;
  });

  if (!found) {
    const fallback = memoryLeads.find((l) => l.id === id) || INITIAL_LEADS.find((l) => l.id === id);
    if (fallback) {
      updatedList.unshift({ ...fallback, ...updates });
    }
  }

  memoryLeads = updatedList;

  try {
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error guardando en /tmp/leads.json:', err);
  }

  try {
    const store = getBlobStore();
    if (store) {
      await withFastTimeout(store.setJSON('all_leads', updatedList), 3500);
    }
  } catch (err) {
    console.warn('Error al actualizar Netlify Blobs:', err);
  }

  try {
    if (fs.existsSync(path.dirname(LEADS_FILE_PATH))) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
    }
  } catch {
    // Ignorado en lambdas de solo lectura
  }

  return true;
}

export async function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): Promise<boolean> {
  return updateLead(id, { status: newStatus });
}

export async function deleteLead(id: string): Promise<boolean> {
  const currentLeads = await getLeads();
  const updatedList = currentLeads.filter((l) => l.id !== id);
  memoryLeads = updatedList;

  try {
    const store = getBlobStore();
    if (store) {
      const deletePromise = store.setJSON('all_leads', updatedList);
      await withFastTimeout(deletePromise, 3500);
    }
  } catch (err) {
    console.warn('Error al eliminar en Netlify Blobs:', err);
  }

  try {
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  try {
    if (fs.existsSync(path.dirname(LEADS_FILE_PATH))) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }

  return true;
}
