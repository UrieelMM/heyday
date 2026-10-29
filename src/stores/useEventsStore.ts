import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import type { EventCategory, GuestGroup, InvitationConfig, TemplateId } from '@/types/invitation.types';

export interface ClientInvitationRecord {
  id: string; slug: string; clientName: string; clientEmail: string; clientPhone: string;
  title: string; category: EventCategory; templateId: TemplateId; status: 'published' | 'draft' | 'archived';
  eventDate: string; createdAt: string; updatedAt: string; viewsCount: number;
  config: InvitationConfig; guests: GuestGroup[];
}
type NewInvitation = Pick<ClientInvitationRecord, 'clientName' | 'clientEmail' | 'clientPhone' | 'title' | 'slug' | 'templateId' | 'eventDate'>;
type Patch = Partial<Pick<ClientInvitationRecord, 'slug' | 'clientName' | 'clientEmail' | 'clientPhone' | 'title' | 'templateId' | 'status' | 'eventDate' | 'config' | 'guests'>>;
// Database rows are converted at the boundary; no private data is persisted in the browser.
function guest(row: any): GuestGroup {
  return { id: row.id, eventId: row.event_id, guestToken: row.guest_token, groupName: row.group_name, whatsappPhone: row.whatsapp_phone || '', groupTag: row.group_tag || '', allocatedAdults: row.allocated_adults, allocatedChildren: row.allocated_children, rsvpStatus: row.rsvp_status, confirmedAdults: row.confirmed_adults, confirmedChildren: row.confirmed_children, tableName: row.table_name_fallback || '', checkedInCount: row.checked_in_count };
}
function record(row: any): ClientInvitationRecord {
  return { id: row.id, slug: row.slug, clientName: row.client_name, clientEmail: row.client_email || '', clientPhone: row.client_phone || '', title: row.title, category: row.category, templateId: row.template_id, status: row.status, eventDate: row.event_date, createdAt: row.created_at, updatedAt: row.updated_at, viewsCount: row.views_count, config: row.config, guests: (row.guest_groups || []).map(guest) };
}
interface State {
  invitations: ClientInvitationRecord[]; loading: boolean; error: string | null;
  load: () => Promise<void>; addInvitation: (input: NewInvitation) => Promise<{ invitation: ClientInvitationRecord; pin: string }>;
  updateInvitation: (id: string, patch: Patch) => Promise<void>; deleteInvitation: (id: string) => Promise<void>;
}
export const useEventsStore = create<State>((set, get) => ({
  invitations: [], loading: true, error: null,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await createClient().from('events').select('id,slug,client_name,client_email,client_phone,title,category,template_id,status,event_date,created_at,updated_at,views_count,config,guest_groups(*)').order('created_at', { ascending: false });
      if (error) throw error;
      set({ invitations: (data || []).map(record), loading: false });
    } catch (error) { set({ loading: false, error: error instanceof Error ? error.message : 'Error de conexión' }); }
  },
  addInvitation: async (input) => {
    const response = await fetch('/api/admin/invitations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo crear la invitación');
    const created = record(result.invitation);
    set(state => ({ invitations: [created, ...state.invitations] }));
    return { invitation: created, pin: result.pin };
  },
  updateInvitation: async (id, patch) => {
    const db = createClient();
    const { guests, ...eventPatch } = patch;
    const fields: Record<string, unknown> = {};
    const names: Record<string, string> = { clientName: 'client_name', clientEmail: 'client_email', clientPhone: 'client_phone', templateId: 'template_id', eventDate: 'event_date' };
    for (const [key, value] of Object.entries(eventPatch)) fields[names[key] || key] = value;
    if (patch.templateId) fields.category = TEMPLATES_CATALOG.find(t => t.id === patch.templateId)?.category;
    if (Object.keys(fields).length) { const { error } = await db.from('events').update(fields).eq('id', id).select('id').single(); if (error) throw new Error(error.message); }
    if (guests) {
      const existing = get().invitations.find(i => i.id === id)?.guests || [];
      for (const g of guests) {
        const old = existing.find(x => x.id === g.id);
        if (old && JSON.stringify(old) === JSON.stringify(g)) continue;
        const values = { event_id: id, guest_token: g.guestToken, group_name: g.groupName, whatsapp_phone: g.whatsappPhone || null, group_tag: g.groupTag || null, allocated_adults: g.allocatedAdults, allocated_children: g.allocatedChildren, rsvp_status: g.rsvpStatus, confirmed_adults: g.confirmedAdults, confirmed_children: g.confirmedChildren, table_name_fallback: g.tableName, checked_in_count: g.checkedInCount };
        const result = old ? await db.from('guest_groups').update(values).eq('id', g.id) : await db.from('guest_groups').insert(values);
        if (result.error) throw new Error(result.error.message);
      }
    }
    await get().load();
    if (get().error) throw new Error(get().error!);
  },
  deleteInvitation: async (id) => {
    const response = await fetch(`/api/admin/invitations/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'No se pudo eliminar'); }
    set(state => ({ invitations: state.invitations.filter(i => i.id !== id) }));
  },
}));
