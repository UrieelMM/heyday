import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

export async function receptionHistory(db: SupabaseClient, eventId: string, page: number, pageSize: number) {
  const [groups, logs] = await Promise.all([
    db.from('guest_groups')
      .select('id,group_name,table_name_fallback,rsvp_status,confirmed_adults,confirmed_children,checked_in_count,last_checked_in_at')
      .eq('event_id', eventId).order('group_name'),
    db.from('rsvp_checkin_logs')
      .select('id,group_id,adults_count,children_count,created_at', { count: 'exact' })
      .eq('event_id', eventId).eq('action_type', 'qr_checkin')
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1),
  ]);
  if (groups.error || logs.error) throw groups.error || logs.error;
  const guests = groups.data || [];
  const names = new Map(guests.map(group => [group.id, group.group_name]));
  return {
    guests,
    logs: (logs.data || []).map(log => ({ ...log, group_name: names.get(log.group_id) || 'Pase eliminado' })),
    total: logs.count || 0,
    page,
    pageSize,
  };
}
