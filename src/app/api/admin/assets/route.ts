import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validatePhoto } from '@/lib/media/validate';
export async function POST(request: Request) {
  try {
    const db = await createClient();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Inicia sesión' }, { status: 401 });
    const form = await request.formData();
    const eventId = form.get('eventId'); const file = form.get('file');
    if (typeof eventId !== 'string' || !(file instanceof File)) return NextResponse.json({ error: 'Selecciona una foto' }, { status: 400 });
    const { data: event } = await db.from('events').select('id').eq('id', eventId).maybeSingle();
    if (!event) return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    const ext = await validatePhoto(file);
    const path = `${eventId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from('event-assets').upload(path, file, { contentType: file.type });
    if (error) throw error;
    return NextResponse.json({ url: db.storage.from('event-assets').getPublicUrl(path).data.publicUrl });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo subir la foto' }, { status: 400 }); }
}
