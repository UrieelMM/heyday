'use client';

import { useEffect, useState } from 'react';
import { InvitationRenderer } from '@/components/invitation/core/InvitationRenderer';
import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

type PreviewMessage = { type: 'heyday:preview'; config: InvitationConfig; eventDate: string; templateId: TemplateId };

export function EditorPreview({ slug, templateId, eventDate, initialConfig }: { slug: string; templateId: TemplateId; eventDate: string; initialConfig: InvitationConfig }) {
  const [preview, setPreview] = useState({ config: initialConfig, eventDate, templateId });
  useEffect(() => {
    const receive = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'heyday:preview') return;
      setPreview({ config: event.data.config, eventDate: event.data.eventDate, templateId: event.data.templateId });
    };
    window.addEventListener('message', receive);
    window.parent.postMessage({ type: 'heyday:preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);
  return <InvitationRenderer slug={slug} templateId={preview.templateId} eventDate={preview.eventDate} config={preview.config} forceEnvelopeOpen isBuilderPreview />;
}
