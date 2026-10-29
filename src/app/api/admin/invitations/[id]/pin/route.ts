import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashPin, makePin, requireAdmin, sameOrigin } from '@/lib/editor/access';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request) || !(await requireAdmin())) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Invitación inválida' }, { status: 400 });
  const pin = makePin();
  const { data, error } = await createAdminClient().from('events').update({
    editor_pin_hash: hashPin(pin), editor_pin_version: randomUUID(),
    editor_failed_attempts: 0, editor_locked_until: null,
  }).eq('id', id).select('slug').maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'No se pudo generar el acceso' }, { status: 404 });
  return NextResponse.json({ slug: data.slug, pin }, { headers: { 'Cache-Control': 'no-store' } });
}
