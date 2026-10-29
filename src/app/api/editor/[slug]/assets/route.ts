import { NextResponse } from 'next/server';
import { authorizedEvent } from '@/lib/editor/event';
import { sameOrigin } from '@/lib/editor/access';
import { validateEventMedia } from '@/lib/media/validate';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido' }, { status: 403 });
  const { slug } = await params;
  const access = await authorizedEvent(slug);
  if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Selecciona un archivo' }, { status: 400 });
    const ext = await validateEventMedia(file);
    const path = `${access.event.id}/${crypto.randomUUID()}.${ext}`;
    const bucket = access.db.storage.from('event-assets');
    const { error } = await bucket.upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return NextResponse.json({ url: bucket.getPublicUrl(path).data.publicUrl }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo subir la foto' }, { status: 400 });
  }
}
