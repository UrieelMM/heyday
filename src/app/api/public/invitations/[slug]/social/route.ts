import { NextResponse } from 'next/server';
import { guestAccess } from '@/lib/supabase/guest-access';
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
function enabled(config: any, key: 'enableSongRequests' | 'enableAudioGuestbook') { return config?.sectionsOrder?.some((s: any) => s.id === 'social_features' && s.enabled) && config?.content?.socialFeatures?.[key] === true; }
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const a = await guestAccess((await params).slug, new URL(request.url).searchParams.get('g') || '');
    if (!a) return fail('Abre tu enlace personal para participar', 403);
    if (!enabled(a.event.config, 'enableSongRequests')) return NextResponse.json({ songs: [], voted: [] });
    const [{ data: songs, error }, { data: votes, error: voteError }] = await Promise.all([
      a.db.from('song_requests').select('id,track_title,artist_name,suggested_by_name,votes_count').eq('event_id', a.event.id).eq('is_approved', true).order('votes_count', { ascending: false }).limit(100),
      a.db.from('song_votes').select('song_id').eq('guest_group_id', a.group.id),
    ]);
    if (error || voteError) throw error || voteError;
    return NextResponse.json({ songs, voted: (votes || []).map(v => v.song_id) });
  } catch { return fail('No se pudo cargar la playlist', 500); }
}
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  let uploaded: { db: NonNullable<Awaited<ReturnType<typeof guestAccess>>>['db']; path: string } | undefined;
  try {
    const size = Number(request.headers.get('content-length') || 0);
    if (size > 2 * 1024 * 1024 + 65536) return fail('El archivo es demasiado grande', 413);
    const form = await request.formData(); const a = await guestAccess((await params).slug, String(form.get('token') || ''));
    if (!a) return fail('Abre tu enlace personal para participar', 403);
    const action = form.get('action');
    if (action === 'song' && enabled(a.event.config, 'enableSongRequests')) {
      const title = String(form.get('title') || '').trim(); const artist = String(form.get('artist') || '').trim();
      if (!title || title.length > 120 || artist.length > 120) return fail('Escribe una canción de hasta 120 caracteres');
      const { data, error } = await a.db.from('song_requests').insert({ event_id: a.event.id, track_title: title, artist_name: artist || 'Artista no especificado', suggested_by_name: a.group.group_name, votes_count: 0 }).select('id').single();
      if (error) throw error;
      const { error: voteError } = await a.db.rpc('vote_for_song', { p_song: data.id, p_group: a.group.id });
      if (voteError) { await a.db.from('song_requests').delete().eq('id', data.id); throw voteError; }
      return NextResponse.json({ success: true });
    }
    if (action === 'vote' && enabled(a.event.config, 'enableSongRequests')) {
      const { error } = await a.db.rpc('vote_for_song', { p_song: String(form.get('songId') || ''), p_group: a.group.id });
      if (error) return fail(error.code === '23505' ? 'Este pase ya votó por esa canción' : 'No se pudo registrar el voto');
      return NextResponse.json({ success: true });
    }
    if (action === 'audio' && enabled(a.event.config, 'enableAudioGuestbook')) {
      const file = form.get('file'); if (!(file instanceof File) || !file.size || file.size > 2 * 1024 * 1024) return fail('El audio debe pesar hasta 2 MB');
      const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const webm = bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
      const mp4 = String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp';
      if (!webm && !mp4) return fail('Formato de audio no compatible');
      const path = `${a.event.id}/${crypto.randomUUID()}.${webm ? 'webm' : 'm4a'}`;
      const { error } = await a.db.storage.from('guest-memories').upload(path, file, { contentType: webm ? 'audio/webm' : 'audio/mp4' }); if (error) throw error;
      uploaded = { db: a.db, path };
      const { error: insertError } = await a.db.from('event_memories').insert({ event_id: a.event.id, guest_group_id: a.group.id, type: 'audio_message', storage_path: path, author_name: a.group.group_name });
      if (insertError) throw insertError;
      return NextResponse.json({ success: true });
    }
    return fail('Esta función no está disponible');
  } catch (error) { if (uploaded) await uploaded.db.storage.from('guest-memories').remove([uploaded.path]); return fail(error instanceof Error ? error.message : 'No se pudo guardar'); }
}
