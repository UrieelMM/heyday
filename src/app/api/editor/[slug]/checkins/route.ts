import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizedEvent } from '@/lib/editor/event';
import { sameOrigin } from '@/lib/editor/access';
import { verifyQrPass } from '@/lib/crypto/qr-signer';
import { receptionHistory } from '@/lib/reception/history';

type Context = { params: Promise<{ slug: string }> };
const payloadSchema = z.object({ payload: z.string().trim().min(1).max(300) });

export async function GET(request: Request, { params }: Context) {
  const access = await authorizedEvent((await params).slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const search = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, Math.trunc(Number(search.get('page')) || 1)));
  try {
    return NextResponse.json(await receptionHistory(access.db, access.event.id, page, 10), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar la recepción' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const access = await authorizedEvent((await params).slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Código QR inválido' }, { status: 400 });
  const secret = process.env.QR_MASTER_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: 'El escáner no está configurado' }, { status: 503 });
  const pass = verifyQrPass(parsed.data.payload, secret);
  if (!pass.valid || !pass.data || pass.data.eventId !== access.event.id) {
    return NextResponse.json({ error: 'El pase no pertenece a esta invitación o fue alterado' }, { status: 400 });
  }
  const { data, error } = await access.db.rpc('check_in_group', {
    p_event: access.event.id,
    p_group: pass.data.groupId,
    p_adults: pass.data.confirmedAdults,
    p_children: pass.data.confirmedChildren,
  });
  if (error) {
    const message = error.code === '23505' || error.message.includes('ya fue registrado') ? 'Este pase ya fue registrado' :
      error.message.includes('no está vigente') ? 'El pase no está vigente o cambió su confirmación' :
      'No se pudo registrar la entrada';
    return NextResponse.json({ error: message }, { status: message.includes('ya fue') ? 409 : 400 });
  }
  return NextResponse.json({ result: data[0] }, { headers: { 'Cache-Control': 'no-store' } });
}
