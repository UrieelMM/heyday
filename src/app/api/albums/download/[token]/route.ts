import { ZipArchive } from 'archiver';
import { PassThrough, Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function safeFilename(value: string) {
  const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'album';
}

function photoExtension(storagePath: string) {
  const extension = storagePath.split('.').pop()?.toLowerCase();
  return extension && ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
}

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Enlace de descarga inválido' }, { status: 404 });

  const db = createAdminClient();
  const { data: event, error: eventError } = await db
    .from('events')
    .select('id,title,album_expires_at,album_purged_at')
    .eq('album_download_token', token)
    .maybeSingle();
  if (eventError) return NextResponse.json({ error: 'No se pudo preparar la descarga' }, { status: 500 });
  if (!event) return NextResponse.json({ error: 'Enlace de descarga inválido' }, { status: 404 });
  if (event.album_purged_at || new Date(event.album_expires_at) <= new Date()) {
    return NextResponse.json({ error: 'El álbum ya venció y sus fotografías fueron eliminadas' }, { status: 410 });
  }

  const { data: photos, error: photosError } = await db
    .from('event_memories')
    .select('storage_path')
    .eq('event_id', event.id)
    .eq('type', 'photo')
    .eq('is_approved', true)
    .order('created_at', { ascending: true });
  if (photosError) return NextResponse.json({ error: 'No se pudo preparar la descarga' }, { status: 500 });
  if (!photos?.length) return NextResponse.json({ error: 'El álbum todavía no tiene fotografías' }, { status: 404 });

  // Create every signed URL before sending headers so authorization/storage
  // failures still produce a normal JSON response instead of a broken ZIP.
  const signedPhotos: Array<{ url: string; extension: string }> = [];
  for (const photo of photos) {
    const { data, error } = await db.storage.from('guest-memories').createSignedUrl(photo.storage_path, 900);
    if (error) return NextResponse.json({ error: 'No se pudo preparar una fotografía' }, { status: 500 });
    signedPhotos.push({ url: data.signedUrl, extension: photoExtension(photo.storage_path) });
  }

  const output = new PassThrough();
  const zip = new ZipArchive({ zlib: { level: 6 } });
  zip.on('error', error => output.destroy(error));
  zip.pipe(output);

  void (async () => {
    try {
      for (const [index, photo] of signedPhotos.entries()) {
        const response = await fetch(photo.url, { cache: 'no-store' });
        if (!response.ok || !response.body) throw new Error(`No se pudo leer la fotografía ${index + 1}`);
        zip.append(Readable.fromWeb(response.body as import('node:stream/web').ReadableStream), {
          name: `foto-${String(index + 1).padStart(2, '0')}.${photo.extension}`,
        });
      }
      await zip.finalize();
    } catch (error) {
      output.destroy(error instanceof Error ? error : new Error('No se pudo generar el ZIP'));
    }
  })();

  const filename = `${safeFilename(event.title)}-fotos.zip`;
  return new NextResponse(Readable.toWeb(output) as ReadableStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
