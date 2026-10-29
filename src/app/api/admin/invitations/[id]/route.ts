import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; const db = await createClient();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Inicia sesión' }, { status: 401 });
    const { data: event, error: readError } = await db.from('events').select('id').eq('id', id).single();
    if (readError || !event) return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    for (const bucket of ['event-assets', 'guest-memories']) {
      const paths: string[] = []; let offset = 0;
      while (true) { const { data, error } = await db.storage.from(bucket).list(id, { limit: 100, offset }); if (error) throw error; paths.push(...data.map(f => `${id}/${f.name}`)); if (data.length < 100) break; offset += data.length; }
      if (paths.length) { const { error } = await db.storage.from(bucket).remove(paths); if (error) throw error; }
    }
    const { error } = await db.from('events').delete().eq('id', id).select('id').single();
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'No se pudo eliminar la invitación y sus archivos. Inténtalo de nuevo.' }, { status: 500 }); }
}
