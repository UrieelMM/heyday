import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await createClient(); const id = (await params).id; const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Inicia sesión' }, { status: 401 });
    const { data: event } = await db.from('events').select('id').eq('id', id).maybeSingle(); if (!event) return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    const [memories, songs] = await Promise.all([db.from('event_memories').select('id,type,storage_path,thumbnail_path,author_name,created_at').eq('event_id', id).order('created_at', { ascending: false }), db.from('song_requests').select('id,track_title,artist_name,suggested_by_name,votes_count').eq('event_id', id).order('votes_count', { ascending: false })]);
    if (memories.error || songs.error) throw memories.error || songs.error;
    const items = await Promise.all((memories.data || []).map(async m => { const signed = await db.storage.from('guest-memories').createSignedUrl(m.type === 'photo' && m.thumbnail_path ? m.thumbnail_path : m.storage_path, 3600); if (signed.error) throw signed.error; return { id: m.id, type: m.type, author: m.author_name, url: signed.data.signedUrl }; }));
    return NextResponse.json({ memories: items, songs: songs.data });
  } catch { return NextResponse.json({ error: 'No se pudieron cargar los recuerdos' }, { status: 500 }); }
}
