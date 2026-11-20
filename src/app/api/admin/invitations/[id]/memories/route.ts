import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { eventMemories } from '@/lib/albums/event-memories';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await createClient(); const id = (await params).id; const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Inicia sesión' }, { status: 401 });
    const { data: event } = await db.from('events').select('id').eq('id', id).maybeSingle(); if (!event) return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    return NextResponse.json(await eventMemories(db, id), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return NextResponse.json({ error: 'No se pudieron cargar los recuerdos' }, { status: 500 }); }
}
