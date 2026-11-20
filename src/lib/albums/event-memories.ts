import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { addMonths } from 'date-fns';
import { ALBUM_RETENTION_MONTHS } from './retention';

// Call only after authorizing access to this event (admin or its editor PIN).
export async function eventMemories(db: SupabaseClient, eventId: string) {
  const [memories, songs, event] = await Promise.all([
    db.from('event_memories').select('id,type,storage_path,thumbnail_path,author_name,created_at')
      .eq('event_id', eventId).order('created_at', { ascending: false }).order('id'),
    db.from('song_requests').select('id,track_title,artist_name,suggested_by_name,votes_count')
      .eq('event_id', eventId).order('votes_count', { ascending: false }).order('created_at'),
    db.from('events').select('album_expires_at,album_purged_at').eq('id', eventId).single(),
  ]);
  let album: { expiresAt: string; purgedAt: string | null };
  if (event.error?.code === '42703' && event.error.message.includes('album_')) {
    const legacyEvent = await db.from('events').select('created_at').eq('id', eventId).single();
    if (legacyEvent.error) throw legacyEvent.error;
    album = { expiresAt: addMonths(new Date(legacyEvent.data.created_at), ALBUM_RETENTION_MONTHS).toISOString(), purgedAt: null };
  } else {
    if (event.error) throw event.error;
    album = { expiresAt: event.data.album_expires_at, purgedAt: event.data.album_purged_at };
  }
  // Older installations can still hold photos without generated thumbnails.
  const legacy = memories.error?.code === '42703' && memories.error.message.includes('thumbnail_path')
    ? await db.from('event_memories').select('id,type,storage_path,author_name,created_at')
      .eq('event_id', eventId).order('created_at', { ascending: false }).order('id')
    : null;
  if (songs.error) throw songs.error;
  if (legacy?.error) throw legacy.error;
  if (memories.error && !legacy) throw memories.error;

  const rows = legacy ? (legacy.data || []).map(memory => ({ ...memory, thumbnail_path: null })) : memories.data || [];
  if (!rows.length) return { memories: [], songs: songs.data || [], album };

  const storage = db.storage.from('guest-memories');
  const fullPaths = [...new Set(rows.map(memory => memory.storage_path))];
  const thumbnailPaths = [...new Set(rows.map(memory => memory.type === 'photo' && memory.thumbnail_path ? memory.thumbnail_path : memory.storage_path))];
  const photoPaths = rows.filter(memory => memory.type === 'photo').map(memory => memory.storage_path);
  const [full, thumbnails, downloads] = await Promise.all([
    storage.createSignedUrls(fullPaths, 3600),
    storage.createSignedUrls(thumbnailPaths, 3600),
    photoPaths.length ? storage.createSignedUrls(photoPaths, 3600, { download: true }) : Promise.resolve({ data: [], error: null }),
  ]);
  if (full.error || thumbnails.error || downloads.error) throw full.error || thumbnails.error || downloads.error;

  function urlMap(items: { path: string | null; signedUrl: string | null; error: string | null }[] | null) {
    const result = new Map<string, string>();
    for (const item of items || []) {
      if (item.error || !item.path || !item.signedUrl) throw new Error('No se pudo preparar un recuerdo');
      result.set(item.path, item.signedUrl);
    }
    return result;
  }
  const fullUrls = urlMap(full.data);
  const thumbnailUrls = urlMap(thumbnails.data);
  const downloadUrls = urlMap(downloads.data);

  return {
    memories: rows.map(memory => ({
      id: memory.id,
      type: memory.type,
      author: memory.author_name,
      createdAt: memory.created_at,
      url: thumbnailUrls.get(memory.type === 'photo' && memory.thumbnail_path ? memory.thumbnail_path : memory.storage_path)!,
      fullUrl: fullUrls.get(memory.storage_path)!,
      downloadUrl: downloadUrls.get(memory.storage_path),
    })),
    songs: songs.data || [],
    album,
  };
}
