import fs from 'fs';
import path from 'path';
import { LeadSubmission } from '@/types';
import { INITIAL_LEADS } from '@/data/initialLeads';
import { getStore } from '@netlify/blobs';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');
const LEAD_ID_REGEX = /^lead_[A-Za-z0-9_]{5,60}$/;
const MIGRATION_MARKER_KEY = 'meta/migrated_v2';
const LEGACY_BLOB_KEY = 'all_leads';
const BATCH_SIZE = 20;

let migrationPromise: Promise<void> | null = null;

function getBlobStore() {
  try {
    return getStore({ name: 'kia_leads', consistency: 'strong' });
  } catch {
    return null;
  }
}

function sortLeadsDesc(leads: LeadSubmission[]): LeadSubmission[] {
  return [...leads].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

function readLocalLeads(): LeadSubmission[] {
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const content = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed)) {
        return sortLeadsDesc(parsed);
      }
    }
  } catch (err) {
    console.warn('Error leyendo src/data/leads.json:', err);
  }
  return sortLeadsDesc(INITIAL_LEADS);
}

function writeLocalLeads(leads: LeadSubmission[]): void {
  const dir = path.dirname(LEADS_FILE_PATH);
  if (fs.existsSync(dir)) {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(sortLeadsDesc(leads), null, 2), 'utf-8');
  }
}

async function ensureMigrated(store: ReturnType<typeof getStore>): Promise<void> {
  if (migrationPromise) {
    return migrationPromise;
  }

  migrationPromise = (async () => {
    const marker = await store.get(MIGRATION_MARKER_KEY, { type: 'json' });
    if (marker) return;

    const legacyBlob = (await store.get(LEGACY_BLOB_KEY, { type: 'json' }).catch(() => null)) as
      | LeadSubmission[]
      | null;

    const map = new Map<string, LeadSubmission>();
    for (const l of INITIAL_LEADS) {
      if (l.id) map.set(l.id, l);
    }
    if (Array.isArray(legacyBlob)) {
      for (const l of legacyBlob) {
        if (l.id) {
          const prev = map.get(l.id) || {};
          map.set(l.id, { ...prev, ...l });
        }
      }
    }

    const entries = Array.from(map.values());
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const chunk = entries.slice(i, i + BATCH_SIZE);
      await Promise.all(
        chunk.map(async (lead) => {
          const key = `lead/${lead.id}`;
          const existingMeta = await store.getMetadata(key);
          if (!existingMeta) {
            await store.setJSON(key, lead);
          }
        })
      );
    }

    await store.setJSON(MIGRATION_MARKER_KEY, {
      at: new Date().toISOString(),
      count: entries.length,
    });
  })().catch((err) => {
    migrationPromise = null;
    throw err;
  });

  return migrationPromise;
}

export async function saveLead(data: LeadSubmission): Promise<LeadSubmission> {
  const validClientId = data.id && LEAD_ID_REGEX.test(data.id) ? data.id : null;
  const leadWithMeta: LeadSubmission = {
    ...data,
    id: validClientId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: data.created_at || new Date().toISOString(),
    status: data.status || 'nuevo',
  };

  const store = getBlobStore();
  let isNewLead = true;

  if (store) {
    const key = `lead/${leadWithMeta.id}`;
    const existing = await store.getMetadata(key).catch(() => null);
    if (existing) {
      isNewLead = false;
    }

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await store.setJSON(key, leadWithMeta);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr) {
      throw lastErr;
    }
  } else {
    const current = readLocalLeads();
    isNewLead = !current.some((l) => l.id === leadWithMeta.id);
    const updated = [leadWithMeta, ...current.filter((l) => l.id !== leadWithMeta.id)];
    writeLocalLeads(updated);
  }

  // Backup inmutable en logs del servidor
  console.log(
    '[PROSPECTO_RECIBIDO_KIA]',
    JSON.stringify({
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
    })
  );

  // Alerta Push Inmediata (solo si es nuevo para evitar duplicados en reintentos)
  if (isNewLead) {
    try {
      fetch('https://ntfy.sh/kia_elmarques_leads_caracas_2026', {
        method: 'POST',
        headers: {
          Title: `Nuevo Prospecto: ${leadWithMeta.full_name} (${leadWithMeta.advisor_name ? `Asesor: ${leadWithMeta.advisor_name}` : 'General'})`,
          Priority: 'urgent',
          Tags: 'car,incoming_envelope',
        },
        body: `Asesor: ${leadWithMeta.advisor_name || 'Showroom General'}\nModelo: ${leadWithMeta.model_interest}\nTeléfono: ${leadWithMeta.phone}\nEmail: ${leadWithMeta.email || 'N/A'}\nFinanciamiento: ${leadWithMeta.financing_interest || 'N/A'}\nUso: ${leadWithMeta.primary_use || 'N/A'}\nFecha: ${leadWithMeta.created_at}`,
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  return leadWithMeta;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  const store = getBlobStore();
  if (!store) {
    return readLocalLeads();
  }

  await ensureMigrated(store);

  const keys: string[] = [];
  for await (const page of store.list({ prefix: 'lead/', paginate: true })) {
    for (const blob of page.blobs) {
      keys.push(blob.key);
    }
  }

  const leads: LeadSubmission[] = [];
  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const chunk = keys.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      chunk.map((key) => store.get(key, { type: 'json' }) as Promise<LeadSubmission | null>)
    );
    for (const item of results) {
      if (item && item.id) {
        leads.push(item);
      }
    }
  }

  return sortLeadsDesc(leads);
}

export async function updateLead(id: string, updates: Partial<LeadSubmission>): Promise<boolean> {
  const store = getBlobStore();
  if (!store) {
    const current = readLocalLeads();
    const idx = current.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    current[idx] = { ...current[idx], ...updates, id };
    writeLocalLeads(current);
    return true;
  }

  const key = `lead/${id}`;
  const existing = (await store.get(key, { type: 'json' })) as LeadSubmission | null;
  if (!existing) return false;

  const updated: LeadSubmission = { ...existing, ...updates, id };
  await store.setJSON(key, updated);
  return true;
}

export async function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): Promise<boolean> {
  return updateLead(id, { status: newStatus });
}

export async function deleteLead(id: string): Promise<boolean> {
  const store = getBlobStore();
  if (!store) {
    const current = readLocalLeads();
    const filtered = current.filter((l) => l.id !== id);
    writeLocalLeads(filtered);
    return true;
  }

  await store.delete(`lead/${id}`);
  return true;
}
