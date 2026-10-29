import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { canEditEvent } from './access';

export async function authorizedEvent(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const db = createAdminClient();
  const { data, error } = await db.from('events')
    .select('id,slug,title,client_name,template_id,event_date,status,config,updated_at,editor_pin_version')
    .eq('slug', slug).maybeSingle();
  if (error && error.code !== '42703') throw error;
  // Permite que el administrador use el editor mientras se aplica la migración.
  const legacy = error ? await db.from('events')
    .select('id,slug,title,client_name,template_id,event_date,status,config,updated_at')
    .eq('slug', slug).maybeSingle() : null;
  if (legacy?.error) throw legacy.error;
  const event = data || (legacy?.data ? { ...legacy.data, editor_pin_version: '' } : null);
  if (!event || !(await canEditEvent(event))) return null;
  return { db, event };
}

export function publicEditorEvent(event: {
  id: string; slug: string; title: string; client_name: string; template_id: string;
  event_date: string; status: string; config: unknown; updated_at: string;
}) {
  return {
    id: event.id, slug: event.slug, title: event.title,
    clientName: event.client_name, templateId: event.template_id,
    eventDate: event.event_date, status: event.status,
    config: event.config, updatedAt: event.updated_at,
  };
}
