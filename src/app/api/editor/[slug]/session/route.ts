import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { clearEditorSession, sameOrigin, setEditorSession, verifyPin } from '@/lib/editor/access';

const pinSchema = z.object({ pin: z.string().regex(/^\d{4}$/) });

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug } = await params;
  const input = pinSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Escribe los 4 dígitos' }, { status: 400 });
  const db = createAdminClient();
  const { data: event, error } = await db.from('events')
    .select('id,editor_pin_hash,editor_pin_version')
    .eq('slug', slug).maybeSingle();
  if (error) throw error;
  if (!event?.editor_pin_hash) return NextResponse.json({ error: 'Acceso no disponible. Contacta al administrador.' }, { status: 404 });
  const { data: attempts, error: attemptError } = await db.rpc('begin_editor_pin_attempt', { p_event_id: event.id });
  if (attemptError) throw attemptError;
  if (attempts === -1) return NextResponse.json({ error: 'Demasiados intentos. Inténtalo en 15 minutos.' }, { status: 429 });
  if (!verifyPin(input.data.pin, event.editor_pin_hash)) {
    return NextResponse.json({ error: attempts >= 5 ? 'Demasiados intentos. Inténtalo en 15 minutos.' : 'Contraseña incorrecta' }, { status: attempts >= 5 ? 429 : 401 });
  }
  await db.from('events').update({ editor_failed_attempts: 0, editor_locked_until: null }).eq('id', event.id);
  await setEditorSession(event.id, event.editor_pin_version);
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  await clearEditorSession();
  return NextResponse.json({ ok: true });
}
