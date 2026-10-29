import { notFound } from 'next/navigation';
import { authorizedEvent } from '@/lib/editor/event';
import { EditorPreview } from '@/components/editor/EditorPreview';
import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export const dynamic = 'force-dynamic';

export default async function EditorPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const access = await authorizedEvent(slug);
  if (!access) notFound();
  return <EditorPreview slug={slug} templateId={access.event.template_id as TemplateId} eventDate={access.event.event_date} initialConfig={access.event.config as InvitationConfig} />;
}
