'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { InvitationRenderer } from './InvitationRenderer';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { useEventsStore } from '@/stores/useEventsStore';
import { refreshCelebrationConfig } from '@/lib/templates/refresh-celebration-config';
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
  const [hydrated, setHydrated] = useState(false);
  const savedRecord = useEventsStore((state) =>
    hydrated
      ? state.invitations.find((record) => record.slug.toLowerCase() === slug.toLowerCase())
      : undefined
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeTemplateId = savedRecord?.templateId || fallbackTemplateId;
  const activeEventDate = savedRecord?.eventDate || fallbackEventDate;
  const activeConfig = useMemo(
    () => savedRecord
      ? refreshCelebrationConfig(savedRecord.config, savedRecord.templateId, savedRecord.title)
      : fallbackConfig,
    [savedRecord, fallbackConfig]
  );

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
