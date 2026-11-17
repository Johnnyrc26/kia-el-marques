import { NextResponse } from 'next/server';
import { saveLead, getLeads, updateLeadStatus } from '@/lib/leadsStorage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.full_name || !body.phone) {
      return NextResponse.json({ error: 'Nombre y teléfono son obligatorios.' }, { status: 400 });
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

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    await updateLeadStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
