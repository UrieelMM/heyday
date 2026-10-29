import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizedEvent, publicEditorEvent } from '@/lib/editor/event';
import { sameOrigin } from '@/lib/editor/access';
import { invitationConfigSchema } from '@/lib/schemas/invitation-config.schema';

const patchSchema = z.object({
  title: z.string().trim().min(1).max(160),
  eventDate: z.string().datetime({ offset: true }),
  config: invitationConfigSchema,
  updatedAt: z.string(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Introduce la contraseña para editar' }, { status: 401 });
  const { data: guests, error } = await access.db.from('guest_groups')
    .select('id,guest_token,group_name,whatsapp_phone,email,group_tag,allocated_adults,allocated_children,rsvp_status,confirmed_adults,confirmed_children,table_name_fallback,checked_in_count')
    .eq('event_id', access.event.id).order('created_at');
  if (error) throw error;
  return NextResponse.json({ event: publicEditorEvent(access.event), guests }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const input = patchSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Revisa los campos de la invitación', details: input.error.flatten() }, { status: 400 });
  if (access.event.updated_at !== input.data.updatedAt) {
    return NextResponse.json({ error: 'La invitación cambió en otra sesión. Recarga antes de guardar.' }, { status: 409 });
  }
  const { data, error } = await access.db.from('events')
    .update({ title: input.data.title, event_date: input.data.eventDate, config: input.data.config })
    .eq('id', access.event.id).eq('updated_at', input.data.updatedAt)
    .select('id,slug,title,client_name,template_id,event_date,status,config,updated_at').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'La invitación cambió en otra sesión. Recarga antes de guardar.' }, { status: 409 });
  return NextResponse.json({ event: publicEditorEvent(data) }, { headers: { 'Cache-Control': 'no-store' } });
}
