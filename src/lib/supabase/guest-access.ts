import 'server-only';
import { createAdminClient } from './admin';
export async function guestAccess(slug: string, token: string) {
  const db = createAdminClient();
  const { data: event, error } = await db.from('events').select('id,config').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (error) throw error;
  if (!event || !token) return null;
  const { data: group, error: groupError } = await db.from('guest_groups').select('id,group_name').eq('event_id', event.id).eq('guest_token', token).maybeSingle();
  if (groupError) throw groupError;
  return group ? { db, event, group } : null;
}
