import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizedEvent } from '@/lib/editor/event';
import { sameOrigin } from '@/lib/editor/access';

const patchSchema = z.object({
  groupName: z.string().trim().min(1).max(160),
  whatsappPhone: z.string().trim().max(40),
  email: z.union([z.string().email().max(200), z.literal('')]),
  groupTag: z.string().trim().max(80),
  allocatedAdults: z.number().int().min(0).max(20),
  allocatedChildren: z.number().int().min(0).max(20),
  tableName: z.string().trim().max(80),
}).refine(value => value.allocatedAdults + value.allocatedChildren > 0);

type Context = { params: Promise<{ slug: string; id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug, id } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del invitado' }, { status: 400 });
  const guest = parsed.data;
  const { data, error } = await access.db.from('guest_groups').update({
    group_name: guest.groupName, whatsapp_phone: guest.whatsappPhone || null,
    email: guest.email || null, group_tag: guest.groupTag || null,
    allocated_adults: guest.allocatedAdults, allocated_children: guest.allocatedChildren,
    table_name_fallback: guest.tableName || null,
  }).eq('id', id).eq('event_id', access.event.id)
    .select('id,guest_token,group_name,whatsapp_phone,email,group_tag,allocated_adults,allocated_children,rsvp_status,confirmed_adults,confirmed_children,table_name_fallback,checked_in_count').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'Invitado no encontrado' }, { status: 404 });
  return NextResponse.json({ guest: data });
}

export async function DELETE(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug, id } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const { data, error } = await access.db.from('guest_groups').delete()
    .eq('id', id).eq('event_id', access.event.id).select('id').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'Invitado no encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
