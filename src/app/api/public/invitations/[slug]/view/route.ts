import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try { const { error } = await createAdminClient().rpc('increment_event_views', { target_slug: (await params).slug }); if (error) throw error; return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: 'No se pudo registrar la visita' }, { status: 500 }); }
}
