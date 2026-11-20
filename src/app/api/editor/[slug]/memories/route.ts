import { NextResponse } from 'next/server';
import { authorizedEvent } from '@/lib/editor/event';
import { eventMemories } from '@/lib/albums/event-memories';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const access = await authorizedEvent((await params).slug);
    if (!access) return NextResponse.json({ error: 'Acceso denegado' }, { status: 401 });
    return NextResponse.json(await eventMemories(access.db, access.event.id), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'No se pudieron cargar los recuerdos' }, { status: 500 });
  }
}
