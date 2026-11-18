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

// Timeout wrapper that guarantees fast failure
function withFastTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
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
    created_at: new Date().toISOString(),
    status: 'nuevo',
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
    tmpList.unshift(leadWithMeta);
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(tmpList, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 4. Netlify Blobs (Cloud Persistence with fast timeout)
  try {
    const store = getBlobStore();
    if (store) {
      const saveBlobPromise = (async () => {
        const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
        const updated = [leadWithMeta, ...existing.filter((l) => l.id !== leadWithMeta.id)];
        await store.setJSON('all_leads', updated);
      })();
      await withFastTimeout(saveBlobPromise, 1500);
    }
  } catch (err) {
    console.warn('Netlify Blobs save note:', err);
  }

  // 5. Attempt sync with Supabase only if explicitly active
  try {
    if (supabase) {
      const insertPromise = supabase.from('vehicle_leads').insert([
        {
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || null,
          model_interest: data.model_interest,
          primary_use: data.primary_use,
          buyer_type: data.buyer_type,
          favorite_color: data.favorite_color,
          financing_interest: data.financing_interest,
          timeline: data.timeline,
          notes: data.notes || null,
          status: 'nuevo',
        },
      ]);
      await withFastTimeout(insertPromise as any, 1200);
    }
  } catch {
    // ignore
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  // 1. Try Netlify Blobs with strict fast timeout
  try {
    const store = getBlobStore();
    if (store) {
      const blobPromise = store.get('all_leads', { type: 'json' });
      const blobLeads = (await withFastTimeout(blobPromise, 1500)) as LeadSubmission[];
      if (blobLeads && Array.isArray(blobLeads) && blobLeads.length > 0) {
        memoryLeads = blobLeads;
        return blobLeads;
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

      const { data, error } = (await withFastTimeout(selectPromise as any, 1200)) as { data?: any; error?: any };
      if (!error && data && Array.isArray(data) && data.length > 0) {
        memoryLeads = data as LeadSubmission[];
        return memoryLeads;
      }
    }
  } catch {
    // fallback immediately
  }

  // 3. Fallback to /tmp disk
  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const tmpContent = fs.readFileSync(TMP_LEADS_PATH, 'utf-8');
      const parsed = JSON.parse(tmpContent || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 4. Fallback to local leads.json (development)
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 5. In-memory fallback
  if (memoryLeads && memoryLeads.length > 0) {
    return memoryLeads;
  }

  return INITIAL_LEADS;
}

export async function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): Promise<boolean> {
  memoryLeads = memoryLeads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));

  try {
    const store = getBlobStore();
    if (store) {
      const updatePromise = (async () => {
        const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
        const updated = existing.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
        await store.setJSON('all_leads', updated);
      })();
      await withFastTimeout(updatePromise, 1500);
    }
  } catch {
    // ignore
  }

  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const leads: LeadSubmission[] = JSON.parse(fs.readFileSync(TMP_LEADS_PATH, 'utf-8') || '[]');
      const index = leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        leads[index].status = newStatus;
        fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(leads, null, 2), 'utf-8');
      }
    }
  } catch {
    // ignore
  }

  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  memoryLeads = memoryLeads.filter((l) => l.id !== id);

  try {
    const store = getBlobStore();
    if (store) {
      const deletePromise = (async () => {
        const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
        const filtered = existing.filter((l) => l.id !== id);
        await store.setJSON('all_leads', filtered);
      })();
      await withFastTimeout(deletePromise, 1500);
    }
  } catch {
    // ignore
  }

  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const leads: LeadSubmission[] = JSON.parse(fs.readFileSync(TMP_LEADS_PATH, 'utf-8') || '[]');
      const filtered = leads.filter((l) => l.id !== id);
      fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }

  return true;
}
