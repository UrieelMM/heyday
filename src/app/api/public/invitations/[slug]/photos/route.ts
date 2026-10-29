import { NextResponse } from 'next/server';
import { compressPhoto } from '@/lib/media/compress-photo';
import { validatePhoto } from '@/lib/media/validate';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

async function access(slug: string, token: string) {
  const db = createAdminClient();
  const { data: event } = await db
    .from('events')
    .select('id,album_expires_at,album_purged_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!event || !token) return null;
  const { data: group } = await db
    .from('guest_groups')
    .select('id,group_name')
    .eq('event_id', event.id)
    .eq('guest_token', token)
    .maybeSingle();
  return group ? { db, event, group } : null;
}

function albumExpired(event: { album_expires_at: string; album_purged_at: string | null }) {
  return Boolean(event.album_purged_at) || new Date(event.album_expires_at) <= new Date();
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const authorization = await access(slug, new URL(request.url).searchParams.get('g') || '');
    if (!authorization) return NextResponse.json({ error: 'Necesitas tu enlace personal para ver el álbum' }, { status: 403 });
    if (albumExpired(authorization.event)) return NextResponse.json({ error: 'Este álbum ya venció' }, { status: 410 });

    const { data, error } = await authorization.db
      .from('event_memories')
      .select('id,storage_path,thumbnail_path,guest_group_id')
      .eq('event_id', authorization.event.id)
      .eq('type', 'photo')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const photos = await Promise.all((data || []).map(async photo => {
      const [full, thumbnail] = await Promise.all([
        authorization.db.storage.from('guest-memories').createSignedUrl(photo.storage_path, 3600),
        authorization.db.storage.from('guest-memories').createSignedUrl(photo.thumbnail_path || photo.storage_path, 3600),
      ]);
      if (full.error || thumbnail.error) throw full.error || thumbnail.error;
      return { id: photo.id, url: thumbnail.data.signedUrl, fullUrl: full.data.signedUrl };
    }));

    return NextResponse.json({
      photos,
      ownCount: (data || []).filter(photo => photo.guest_group_id === authorization.group.id).length,
      total: photos.length,
      expiresAt: authorization.event.album_expires_at,
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar el álbum' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  let uploaded: { db: ReturnType<typeof createAdminClient>; paths: string[] } | undefined;
  try {
    const { slug } = await params;
    const form = await request.formData();
    const token = form.get('token');
    const file = form.get('file');
    const authorization = await access(slug, typeof token === 'string' ? token : '');
    if (!authorization) return NextResponse.json({ error: 'Necesitas tu enlace personal para subir fotos' }, { status: 403 });
    if (albumExpired(authorization.event)) return NextResponse.json({ error: 'Este álbum ya venció' }, { status: 410 });
    if (!(file instanceof File)) return NextResponse.json({ error: 'Selecciona una foto' }, { status: 400 });

    await validatePhoto(file);
    const compressed = await compressPhoto(file);
    const photoId = crypto.randomUUID();
    const path = `${authorization.event.id}/${photoId}.${compressed.extension}`;
    const thumbnailPath = `${authorization.event.id}/thumb-${photoId}.${compressed.extension}`;
    uploaded = { db: authorization.db, paths: [] };

    const { error: photoError } = await authorization.db.storage
      .from('guest-memories')
      .upload(path, compressed.image, { contentType: compressed.contentType, cacheControl: '31536000' });
    if (photoError) throw photoError;
    uploaded.paths.push(path);

    const { error: thumbnailError } = await authorization.db.storage
      .from('guest-memories')
      .upload(thumbnailPath, compressed.thumbnail, { contentType: compressed.contentType, cacheControl: '31536000' });
    if (thumbnailError) throw thumbnailError;
    uploaded.paths.push(thumbnailPath);

    const { error } = await authorization.db.from('event_memories').insert({
      event_id: authorization.event.id,
      guest_group_id: authorization.group.id,
      type: 'photo',
      storage_path: path,
      thumbnail_path: thumbnailPath,
      author_name: authorization.group.group_name,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (uploaded?.paths.length) await uploaded.db.storage.from('guest-memories').remove(uploaded.paths);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo subir la foto' }, { status: 400 });
  }
}
