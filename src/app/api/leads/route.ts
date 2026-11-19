import { NextResponse } from 'next/server';
import { saveLead, getLeads, updateLeadStatus, updateLead, deleteLead } from '@/lib/leadsStorage';
import { LeadSubmission } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.full_name || !body.phone) {
      return NextResponse.json({ error: 'Nombre y teléfono son obligatorios.' }, { status: 400 });
    }

    const cleanDigits = String(body.phone).replace(/\D/g, '');
    if (cleanDigits.length < 10 || cleanDigits.length > 15) {
      return NextResponse.json({ error: 'El número de teléfono debe incluir código de área u operadora (ej. 0414 1234567 o internacional).' }, { status: 400 });
    }

    const saved = await saveLead(body);
    return NextResponse.json({ success: true, lead: saved });
  } catch (err: any) {
    console.error('API /api/leads error:', err);
    return NextResponse.json({ error: 'Error procesando solicitud.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get('authorization') || searchParams.get('adminKey');
  const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

  if (authHeader !== expectedPassword && authHeader !== `Bearer ${expectedPassword}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ success: true, leads });
}

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

    if (authHeader !== `Bearer ${expectedPassword}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, advisor_name, advisor_slug } = body;
    if (!id) {
      return NextResponse.json({ error: 'Falta el id del prospecto' }, { status: 400 });
    }

    const updates: Partial<LeadSubmission> = {};
    if (status !== undefined) updates.status = status;
    if (advisor_name !== undefined) updates.advisor_name = advisor_name;
    if (advisor_slug !== undefined) updates.advisor_slug = advisor_slug;

    await updateLead(id, updates);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('authorization') || searchParams.get('adminKey');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'kia2026';

    if (authHeader !== expectedPassword && authHeader !== `Bearer ${expectedPassword}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = searchParams.get('id') || (await req.json().catch(() => ({}))).id;
    if (!id) {
      return NextResponse.json({ error: 'Falta el id del prospecto' }, { status: 400 });
    }

    await deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
