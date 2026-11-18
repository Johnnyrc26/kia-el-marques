import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import { LeadSubmission } from '@/types';
import { INITIAL_LEADS } from '@/data/initialLeads';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');

// Ensure the local storage file exists
function ensureLocalFile() {
  const dir = path.dirname(LEADS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE_PATH)) {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(INITIAL_LEADS, null, 2), 'utf-8');
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

  // 1. Always save locally to guaranteed disk storage
  try {
    ensureLocalFile();
    const fileContent = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    const existing: LeadSubmission[] = JSON.parse(fileContent || '[]');
    existing.unshift(leadWithMeta);
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving to local leads.json:', err);
  }

  // 2. Attempt sync with Supabase table `vehicle_leads` with timeout
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
  } catch (err) {
    console.warn('Could not reach Supabase endpoint, local copy preserved');
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  // 1. Try fetching from Supabase with timeout
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
  } catch (err) {
    console.warn('Supabase unreachable or timed out, loading local fallback');
  }

  // 2. Fallback to local storage or INITIAL_LEADS
  try {
    ensureLocalFile();
    const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    const parsed: LeadSubmission[] = JSON.parse(content || '[]');
    if (parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LEADS;
  } catch (err) {
    console.error('Error reading local leads, returning initial set:', err);
    return INITIAL_LEADS;
  }
}

export async function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): Promise<boolean> {
  // Update local file
  try {
    ensureLocalFile();
    const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    const leads: LeadSubmission[] = JSON.parse(content || '[]');
    const index = leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      leads[index].status = newStatus;
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error updating local lead status:', err);
  }

  // Update Supabase
  try {
    if (supabase) {
      await supabase.from('vehicle_leads').update({ status: newStatus }).eq('id', id);
    }
  } catch (err) {
    console.warn('Error updating status in Supabase:', err);
  }

  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  // Delete from local file
  try {
    ensureLocalFile();
    const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    const leads: LeadSubmission[] = JSON.parse(content || '[]');
    const filtered = leads.filter((l) => l.id !== id);
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error deleting local lead:', err);
  }

  // Delete from Supabase
  try {
    if (supabase) {
      await supabase.from('vehicle_leads').delete().eq('id', id);
    }
  } catch (err) {
    console.warn('Error deleting lead in Supabase:', err);
  }

  return true;
}
