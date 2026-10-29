import { notFound } from 'next/navigation';
import { createDefaultInvitationConfig, TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import { PublicInvitationClientView } from '@/components/invitation/core/PublicInvitationClientView';
export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = TEMPLATES_CATALOG.find(t => t.id === slug);
  if (!template) notFound();
  return <PublicInvitationClientView demo slug={slug} fallbackTemplateId={template.id} fallbackEventDate="2026-12-19T17:00:00-06:00" fallbackConfig={createDefaultInvitationConfig(template.id, 'Nuestra celebración')} fallbackGuestGroup={null} />;
}
