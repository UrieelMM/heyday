import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizedEvent } from '@/lib/editor/event';
import { sameOrigin } from '@/lib/editor/access';

const guestSchema = z.object({
  groupName: z.string().trim().min(1).max(160),
  whatsappPhone: z.string().trim().max(40).default(''),
  email: z.union([z.string().email().max(200), z.literal('')]).default(''),
  groupTag: z.string().trim().max(80).default(''),
  allocatedAdults: z.number().int().min(0).max(20),
  allocatedChildren: z.number().int().min(0).max(20),
  tableName: z.string().trim().max(80).default(''),
}).refine(value => value.allocatedAdults + value.allocatedChildren > 0, 'Asigna al menos un pase');

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const parsed = guestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del invitado' }, { status: 400 });
  const guest = parsed.data;
  const { data, error } = await access.db.from('guest_groups').insert({
    event_id: access.event.id, guest_token: randomBytes(16).toString('hex'),
    group_name: guest.groupName, whatsapp_phone: guest.whatsappPhone || null,
    email: guest.email || null, group_tag: guest.groupTag || null,
    allocated_adults: guest.allocatedAdults, allocated_children: guest.allocatedChildren,
    table_name_fallback: guest.tableName || null,
  }).select('id,guest_token,group_name,whatsapp_phone,email,group_tag,allocated_adults,allocated_children,rsvp_status,confirmed_adults,confirmed_children,table_name_fallback,checked_in_count').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ guest: data });
}
