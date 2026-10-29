import { notFound } from 'next/navigation';
import { PublicInvitationClientView } from '@/components/invitation/core/PublicInvitationClientView';
import { createAdminClient } from '@/lib/supabase/admin';
import type { GuestGroup, InvitationConfig, TemplateId } from '@/types/invitation.types';

export const dynamic = 'force-dynamic';
export default async function PublicInvitationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ g?: string }> }) {
  const { slug } = await params;
  const { g } = await searchParams;
  const db = createAdminClient();
  const { data: event, error } = await db.from('events').select('id,title,template_id,event_date,config').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (error) throw new Error('No se pudo cargar la invitación');
  if (!event) notFound();
  let guest: GuestGroup | null = null;
  if (g) {
    const { data, error: guestError } = await db.from('guest_groups').select('id,event_id,guest_token,group_name,allocated_adults,allocated_children,rsvp_status,confirmed_adults,confirmed_children,table_name_fallback,checked_in_count').eq('event_id', event.id).eq('guest_token', g).maybeSingle();
    if (guestError) throw new Error('No se pudo cargar el pase');
    if (!data) notFound();
    guest = { id: data.id, eventId: data.event_id, guestToken: data.guest_token, groupName: data.group_name, allocatedAdults: data.allocated_adults, allocatedChildren: data.allocated_children, rsvpStatus: data.rsvp_status, confirmedAdults: data.confirmed_adults, confirmedChildren: data.confirmed_children, tableName: data.table_name_fallback || '', checkedInCount: data.checked_in_count };
  }
  return <PublicInvitationClientView slug={slug} fallbackTemplateId={event.template_id as TemplateId} fallbackEventDate={event.event_date} fallbackConfig={event.config as InvitationConfig} fallbackGuestGroup={guest} guestToken={g} />;
}
