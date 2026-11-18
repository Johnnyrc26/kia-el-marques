import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import { LeadSubmission } from '@/types';
import { INITIAL_LEADS } from '@/data/initialLeads';
import { getStore } from '@netlify/blobs';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');
const TMP_LEADS_PATH = path.join('/tmp', 'leads.json');

// Helper to safely get the Netlify Blob store
function getBlobStore() {
  try {
    return getStore('kia_leads');
  } catch {
    return null;
  }
}

// Ensure the local storage file exists (dev fallback)
function ensureLocalFile() {
  try {
    const dir = path.dirname(LEADS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE_PATH)) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(INITIAL_LEADS, null, 2), 'utf-8');
    }
  } catch {
    // Serverless environments may have read-only filesystems
  }
}

// Helper to prevent hanging if remote DB is paused or unreachable
function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Supabase request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function saveLead(data: LeadSubmission): Promise<LeadSubmission> {
  const leadWithMeta: LeadSubmission = {
    ...data,
    id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    status: 'nuevo',
  };

  // 1. Immutable Server Log Backup (Permanently readable via Netlify CLI logs)
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

  // 2. Netlify Blobs (Primary Cloud Persistence for Serverless)
  try {
    const store = getBlobStore();
    if (store) {
      const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
      const updated = [leadWithMeta, ...existing.filter((l) => l.id !== leadWithMeta.id)];
      await store.setJSON('all_leads', updated);
    }
  } catch (err) {
    console.warn('Netlify Blobs save note:', err);
  }

  // 3. Writable /tmp disk backup
  try {
    let tmpList: LeadSubmission[] = [];
    if (fs.existsSync(TMP_LEADS_PATH)) {
      tmpList = JSON.parse(fs.readFileSync(TMP_LEADS_PATH, 'utf-8') || '[]');
    }
    tmpList.unshift(leadWithMeta);
    fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(tmpList, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // 4. Local dev file backup
  try {
    ensureLocalFile();
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const fileContent = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const existing: LeadSubmission[] = JSON.parse(fileContent || '[]');
      existing.unshift(leadWithMeta);
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
    }
  } catch {
    // EROFS in serverless, handled gracefully
  }

  // 5. Attempt sync with Supabase if active
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
      const { error } = (await withTimeout(insertPromise as any, 2500)) as { error?: any };
      if (error) {
        console.warn('Supabase insert note:', error.message);
      }
    }
  } catch {
    // Supabase paused/unavailable
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  // 1. Try Netlify Blobs (Primary Cloud Persistence)
  try {
    const store = getBlobStore();
    if (store) {
      const blobLeads = (await store.get('all_leads', { type: 'json' })) as LeadSubmission[];
      if (blobLeads && Array.isArray(blobLeads) && blobLeads.length > 0) {
        return blobLeads;
      }
    }
  } catch (err) {
    console.warn('Netlify Blobs get note:', err);
  }

  // 2. Try Supabase
  try {
    if (supabase) {
      const selectPromise = supabase
        .from('vehicle_leads')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = (await withTimeout(selectPromise as any, 2500)) as { data?: any; error?: any };
      if (!error && data && data.length > 0) {
        return data as LeadSubmission[];
      }
    }
  } catch {
    // Supabase unreachable
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
      const parsed: LeadSubmission[] = JSON.parse(content || '[]');
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return INITIAL_LEADS;
}

export async function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): Promise<boolean> {
  // Update in Netlify Blobs
  try {
    const store = getBlobStore();
    if (store) {
      const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
      const updated = existing.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
      await store.setJSON('all_leads', updated);
    }
  } catch (err) {
    console.warn('Netlify Blobs update note:', err);
  }

  // Update in /tmp
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

  // Update local file if writable
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const leads: LeadSubmission[] = JSON.parse(content || '[]');
      const index = leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        leads[index].status = newStatus;
        fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
      }
    }
  } catch {
    // ignore
  }

  // Update Supabase
  try {
    if (supabase) {
      await supabase.from('vehicle_leads').update({ status: newStatus }).eq('id', id);
    }
  } catch {
    // ignore
  }

  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  // Delete from Netlify Blobs
  try {
    const store = getBlobStore();
    if (store) {
      const existing = ((await store.get('all_leads', { type: 'json' })) as LeadSubmission[]) || [];
      const filtered = existing.filter((l) => l.id !== id);
      await store.setJSON('all_leads', filtered);
    }
  } catch (err) {
    console.warn('Netlify Blobs delete note:', err);
  }

  // Delete from /tmp
  try {
    if (fs.existsSync(TMP_LEADS_PATH)) {
      const leads: LeadSubmission[] = JSON.parse(fs.readFileSync(TMP_LEADS_PATH, 'utf-8') || '[]');
      const filtered = leads.filter((l) => l.id !== id);
      fs.writeFileSync(TMP_LEADS_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }

  // Delete from local file
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const leads: LeadSubmission[] = JSON.parse(content || '[]');
      const filtered = leads.filter((l) => l.id !== id);
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }

  // Delete from Supabase
  try {
    if (supabase) {
      await supabase.from('vehicle_leads').delete().eq('id', id);
    }
  } catch {
    // ignore
  }

  return true;
}
