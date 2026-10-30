import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/editor/access';
import { receptionHistory } from '@/lib/reception/history';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const db = createAdminClient();
  const { id } = await params;
  const { data: event } = await db.from('events').select('id').eq('id', id).maybeSingle();
  if (!event) return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
  const page = Math.max(1, Math.min(10000, Math.trunc(Number(new URL(request.url).searchParams.get('page')) || 1)));
  try {
    return NextResponse.json(await receptionHistory(db, id, page, 10), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar la recepción' }, { status: 500 });
  }
}
