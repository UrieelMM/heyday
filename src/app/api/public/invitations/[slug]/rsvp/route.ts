import { NextResponse } from 'next/server';
import { rsvpSubmissionSchema } from '@/lib/schemas/invitation-config.schema';
import { signQrPass } from '@/lib/crypto/qr-signer';
import { createAdminClient } from '@/lib/supabase/admin';
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params; const parsed = rsvpSubmissionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Datos de confirmación inválidos' }, { status: 400 });
    const data = parsed.data; const db = createAdminClient();
    const { data: event } = await db.from('events').select('id,rsvp_deadline_at').eq('slug', slug).eq('status', 'published').maybeSingle();
    if (!event || !data.guestToken) return NextResponse.json({ error: 'Abre tu enlace personal para confirmar' }, { status: 403 });
    if (event.rsvp_deadline_at && new Date(event.rsvp_deadline_at) < new Date()) return NextResponse.json({ error: 'El plazo para confirmar ha terminado' }, { status: 400 });
    const { data: group } = await db.from('guest_groups').select('id,group_name,allocated_adults,allocated_children,table_name_fallback,checked_in_count').eq('event_id', event.id).eq('guest_token', data.guestToken).maybeSingle();
    if (!group) return NextResponse.json({ error: 'Pase no válido' }, { status: 403 });
    const adults = data.willAttend ? data.confirmedAdults : 0; const children = data.willAttend ? data.confirmedChildren : 0;
    if (adults > group.allocated_adults || children > group.allocated_children || (data.willAttend && adults + children < 1) || adults + children < group.checked_in_count) return NextResponse.json({ error: 'La cantidad no corresponde a los pases disponibles' }, { status: 400 });
    const secret = process.env.QR_MASTER_SECRET;
    if (!secret || secret.length < 32) throw new Error('QR_MASTER_SECRET no está configurado');
    const { error } = await db.from('guest_groups').update({ rsvp_status: data.willAttend ? 'confirmed' : 'declined', confirmed_adults: adults, confirmed_children: children, dietary_notes: data.dietaryNotes || null, guest_message: data.guestMessage || null, responded_at: new Date().toISOString() }).eq('id', group.id);
    if (error) throw error;
    const qrPayload = data.willAttend ? signQrPass({ eventId: event.id, groupId: group.id, confirmedAdults: adults, confirmedChildren: children }, secret) : null;
    return NextResponse.json({ success: true, pass: qrPayload ? { qrPayload, groupName: group.group_name, confirmedAdults: adults, confirmedChildren: children, tableName: group.table_name_fallback } : null });
  } catch { return NextResponse.json({ error: 'No se pudo guardar la respuesta' }, { status: 500 }); }
}
