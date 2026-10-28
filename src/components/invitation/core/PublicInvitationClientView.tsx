'use client';

import React, { useEffect, useState } from 'react';
import { InvitationRenderer } from './InvitationRenderer';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { useEventsStore } from '@/stores/useEventsStore';
import type {
  GuestGroup,
  InvitationConfig,
  TemplateId,
} from '@/types/invitation.types';

interface PublicInvitationClientViewProps {
  slug: string;
  fallbackTemplateId: TemplateId;
  fallbackEventDate: string;
  fallbackConfig: InvitationConfig;
  fallbackGuestGroup: GuestGroup | null;
  guestToken?: string;
}

export function PublicInvitationClientView({
  slug,
  fallbackTemplateId,
  fallbackEventDate,
  fallbackConfig,
  fallbackGuestGroup,
  guestToken,
}: PublicInvitationClientViewProps) {
  const getBySlug = useEventsStore((s) => s.getBySlug);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const savedRecord = hydrated ? getBySlug(slug) : undefined;

  const activeTemplateId = savedRecord?.templateId || fallbackTemplateId;
  const activeEventDate = savedRecord?.eventDate || fallbackEventDate;
  const activeConfig = savedRecord?.config || fallbackConfig;

  const activeGuestGroup =
    savedRecord && guestToken
      ? savedRecord.guests.find((g) => g.guestToken === guestToken) ||
        fallbackGuestGroup
      : fallbackGuestGroup;

  return (
    <SmoothScrollProvider>
      <InvitationRenderer
        slug={slug}
        templateId={activeTemplateId}
        eventDate={activeEventDate}
        config={activeConfig}
        guestGroup={activeGuestGroup}
      />
    </SmoothScrollProvider>
  );
}
