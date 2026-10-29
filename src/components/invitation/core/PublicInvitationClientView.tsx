'use client';
import { useEffect } from 'react';
import { InvitationRenderer } from './InvitationRenderer';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import type { GuestGroup, InvitationConfig, TemplateId } from '@/types/invitation.types';
export function PublicInvitationClientView({ slug, fallbackTemplateId, fallbackEventDate, fallbackConfig, fallbackGuestGroup, demo = false }: { slug: string; fallbackTemplateId: TemplateId; fallbackEventDate: string; fallbackConfig: InvitationConfig; fallbackGuestGroup: GuestGroup | null; guestToken?: string; demo?: boolean }) {
  useEffect(() => {
    if (demo) return;
    const key = `heyday-view:${slug}`;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { /* Storage can be blocked. */ }
    void fetch(`/api/public/invitations/${encodeURIComponent(slug)}/view`, { method: 'POST', keepalive: true }).then(response => { if (!response.ok) { try { sessionStorage.removeItem(key); } catch {} } }).catch(() => { try { sessionStorage.removeItem(key); } catch {} });
  }, [slug, demo]);
  return <SmoothScrollProvider><InvitationRenderer slug={slug} templateId={fallbackTemplateId} eventDate={fallbackEventDate} config={fallbackConfig} guestGroup={fallbackGuestGroup} /></SmoothScrollProvider>;
}
