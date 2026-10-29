import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashPin, makePin, requireAdmin, sameOrigin } from '@/lib/editor/access';
import { createDefaultInvitationConfig, TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';

const inputSchema = z.object({
  clientName: z.string().trim().min(1).max(160),
  clientEmail: z.string().trim().max(200),
  clientPhone: z.string().trim().max(40),
  title: z.string().trim().min(1).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(3).max(60),
  templateId: z.string(),
  eventDate: z.string().datetime({ offset: true }),
});

export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await requireAdmin())) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de la invitación' }, { status: 400 });
  const input = parsed.data;
  const template = TEMPLATES_CATALOG.find(item => item.id === input.templateId);
  if (!template) return NextResponse.json({ error: 'Plantilla inválida' }, { status: 400 });
  const pin = makePin();
  const db = createAdminClient();
  const { data, error } = await db.from('events').insert({
    client_name: input.clientName,
    client_email: input.clientEmail || null,
    client_phone: input.clientPhone || null,
    title: input.title,
    slug: input.slug,
    template_id: template.id,
    category: template.category,
    event_date: input.eventDate,
    status: 'draft',
    config: createDefaultInvitationConfig(template.id, input.title),
    editor_pin_hash: hashPin(pin),
  }).select('id,slug,client_name,client_email,client_phone,title,category,template_id,status,event_date,created_at,updated_at,views_count,config').single();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Esta URL ya está en uso' : error.message }, { status: 400 });
  return NextResponse.json({ invitation: { ...data, guest_groups: [] }, pin }, { headers: { 'Cache-Control': 'no-store' } });
}
