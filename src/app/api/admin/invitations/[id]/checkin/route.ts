import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyQrPass } from '@/lib/crypto/qr-signer';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await createClient(); const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Inicia sesión' }, { status: 401 });
    const { payload } = await request.json(); const secret = process.env.QR_MASTER_SECRET;
    if (!secret || secret.length < 32) throw new Error('Falta configurar la firma QR');
    if (typeof payload !== 'string' || payload.length > 300) return NextResponse.json({ error: 'Código inválido' }, { status: 400 });
    const result = verifyQrPass(payload, secret); const id = (await params).id;
    if (!result.valid || !result.data || result.data.eventId !== id) return NextResponse.json({ error: 'El pase no es válido para esta invitación' }, { status: 400 });
    const { data, error } = await db.rpc('check_in_group', { p_event: id, p_group: result.data.groupId, p_adults: result.data.confirmedAdults, p_children: result.data.confirmedChildren });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ result: data[0] });
  } catch { return NextResponse.json({ error: 'No se pudo validar el pase' }, { status: 500 }); }
}
