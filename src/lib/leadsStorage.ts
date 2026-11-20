import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
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

// Timeout wrapper
function withFastTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
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

export async function saveLead(data: LeadSubmission): Promise<LeadSubmission> {
  const leadWithMeta: LeadSubmission = {
    ...data,
    id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: data.created_at || new Date().toISOString(),
    status: data.status || 'nuevo',
  };

  // 1. Update in-memory cache immediately
  memoryLeads = [leadWithMeta, ...memoryLeads.filter((l) => l.id !== leadWithMeta.id)];

  // 2. Immutable Server Log Backup (Permanently queryable via Netlify CLI logs)
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

  // 3. Writable /tmp disk backup
  try {
    let tmpList: LeadSubmission[] = [];
    if (fs.existsSync(TMP_LEADS_PATH)) {
      try {
        tmpList = JSON.parse(fs.readFileSync(TMP_LEADS_PATH, 'utf-8') || '[]');
      } catch {
        tmpList = [];
      }
    }
    tmpList = [leadWithMeta, ...tmpList.filter((l) => l.id !== leadWithMeta.id)];
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(tmpList, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 4. Local src/data/leads.json disk backup
  try {
    if (fs.existsSync(path.dirname(LEADS_FILE_PATH))) {
      let localList: LeadSubmission[] = [];
      if (fs.existsSync(LEADS_FILE_PATH)) {
        try {
          localList = JSON.parse(fs.readFileSync(LEADS_FILE_PATH, 'utf-8') || '[]');
        } catch {
          localList = [];
        }
      }
      localList = [leadWithMeta, ...localList.filter((l) => l.id !== leadWithMeta.id)];
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(localList, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }

  // 5. Netlify Blobs (Cloud Persistence with 5s timeout)
  try {
    const store = getBlobStore();
    if (store) {
      const saveBlobPromise = (async () => {
        const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
        const updated = [leadWithMeta, ...existing.filter((l) => l.id !== leadWithMeta.id)];
        await store.setJSON('all_leads', updated);
      })();
      await withFastTimeout(saveBlobPromise, 5000);
    }
  } catch (err) {
    console.warn('Netlify Blobs save note:', err);
  }

  // 6. Alerta Push Inmediata
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
  // 1. Try Netlify Blobs
  try {
    const store = getBlobStore();
    if (store) {
      const blobPromise = store.get('all_leads', { type: 'json' });
      const blobLeads = (await withFastTimeout(blobPromise, 5000)) as LeadSubmission[];
      if (blobLeads && Array.isArray(blobLeads) && blobLeads.length > 0) {
        const ids = new Set(blobLeads.map((l) => l.id));
        const merged = [...blobLeads];
        for (const initLead of INITIAL_LEADS) {
          if (!ids.has(initLead.id)) {
            merged.push(initLead);
          }
        }
        memoryLeads = merged;
        return merged;
      }
    }
  } catch {
    // fallback immediately
  }

  // 2. Try Supabase only if explicitly configured
  try {
    if (supabase) {
      const selectPromise = supabase
        .from('vehicle_leads')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = (await withFastTimeout(selectPromise as any, 2000)) as { data?: any; error?: any };
      if (!error && data && Array.isArray(data) && data.length > 0) {
        const ids = new Set(data.map((l: any) => l.id));
        const merged = [...data];
        for (const initLead of INITIAL_LEADS) {
          if (!ids.has(initLead.id)) {
            merged.push(initLead);
          }
        }
        memoryLeads = merged as LeadSubmission[];
        return memoryLeads;
      }
    }
  } catch {
    // fallback immediately
  }

  // 3. Fallback to local src/data/leads.json disk
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        const ids = new Set(parsed.map((l: any) => l.id));
        const merged = [...parsed];
        for (const initLead of INITIAL_LEADS) {
          if (!ids.has(initLead.id)) {
            merged.push(initLead);
          }
        }
        memoryLeads = merged;
        return merged;
      }
    }
  } catch {
    // ignore
  }

  // 4. Fallback to /tmp disk
  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const tmpContent = fs.readFileSync(TMP_LEADS_PATH, 'utf-8');
      const parsed = JSON.parse(tmpContent || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        const ids = new Set(parsed.map((l: any) => l.id));
        const merged = [...parsed];
        for (const initLead of INITIAL_LEADS) {
          if (!ids.has(initLead.id)) {
            merged.push(initLead);
          }
        }
        memoryLeads = merged;
        return merged;
      }
    }
  } catch {
    // ignore
  }

  // 5. In-memory fallback
  if (memoryLeads && memoryLeads.length > 0) {
    const ids = new Set(memoryLeads.map((l) => l.id));
    const merged = [...memoryLeads];
    for (const initLead of INITIAL_LEADS) {
      if (!ids.has(initLead.id)) {
        merged.push(initLead);
      }
    }
    return merged;
  }

  return INITIAL_LEADS;
}

export async function updateLead(id: string, updates: Partial<LeadSubmission>): Promise<boolean> {
  // 1. Obtener la lista consolidada COMPLETA (incluyendo INITIAL_LEADS y Blobs)
  const currentLeads = await getLeads();

  // 2. Aplicar actualizaciones al prospecto
  let found = false;
  const updatedList = currentLeads.map((lead) => {
    if (lead.id === id) {
      found = true;
      return { ...lead, ...updates };
    }
    return lead;
  });

  // Si no estaba en la lista consolidada, intentar buscarlo en memoryLeads o INITIAL_LEADS
  if (!found) {
    const fallback = memoryLeads.find((l) => l.id === id) || INITIAL_LEADS.find((l) => l.id === id);
    if (fallback) {
      updatedList.unshift({ ...fallback, ...updates });
    }
  }

  // 3. Actualizar memoria inmediata
  memoryLeads = updatedList;

  // 4. Guardar en Netlify Blobs (incluye ahora todos los leads con sus asesores)
  try {
    const store = getBlobStore();
    if (store) {
      const updatePromise = store.setJSON('all_leads', updatedList);
      await withFastTimeout(updatePromise, 5000);
    }
  } catch (err) {
    console.warn('Error al actualizar Netlify Blobs:', err);
  }

  // 5. Guardar en /tmp/leads.json
  try {
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch (err) {
    // ignore
  }

  // 6. Guardar en src/data/leads.json si el directorio existe
  try {
    if (fs.existsSync(path.dirname(LEADS_FILE_PATH))) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(updatedList, null, 2), 'utf-8');
    }
  } catch (err) {
    // ignore
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
      await withFastTimeout(deletePromise, 5000);
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
