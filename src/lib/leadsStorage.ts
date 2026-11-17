import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import { LeadSubmission } from '@/types';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');

// Ensure the local storage file exists
function ensureLocalFile() {
  const dir = path.dirname(LEADS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE_PATH)) {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
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

  // 2. Attempt sync with Supabase table `vehicle_leads`
  try {
    if (supabase) {
      const { error } = await supabase.from('vehicle_leads').insert([
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
      if (error) {
        console.warn('Supabase insert note (table may need schema creation):', error.message);
      }
    }
  } catch (err) {
    console.warn('Could not reach Supabase endpoint, local copy preserved:', err);
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  // 1. Try fetching from Supabase
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('vehicle_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as LeadSubmission[];
      }
    }
  } catch (err) {
    console.warn('Supabase unreachable, loading local leads:', err);
  }

  // 2. Fallback to local storage
  try {
    ensureLocalFile();
    const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading local leads:', err);
    return [];
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
