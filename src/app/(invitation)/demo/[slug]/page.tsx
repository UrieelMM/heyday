import { notFound } from 'next/navigation';
import { createDefaultInvitationConfig, TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import { PublicInvitationClientView } from '@/components/invitation/core/PublicInvitationClientView';
export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = TEMPLATES_CATALOG.find(t => t.id === slug);
  if (!template) notFound();
  const demoTitles: Record<string, string> = {
    'marea-azul': 'Lucía & Andrés',
    'ritmo-de-dos': 'Marina & Pablo',
    'mini-cosmos': 'Leo cumple 6',
    'atelier-xv': 'Valentina',
  };
  const demoTime = slug === 'mini-cosmos' ? '13:30:00' : slug === 'atelier-xv' ? '19:00:00' : '17:00:00';
  return <PublicInvitationClientView demo slug={slug} fallbackTemplateId={template.id} fallbackEventDate={`2026-12-19T${demoTime}-06:00`} fallbackConfig={createDefaultInvitationConfig(template.id, demoTitles[slug] || 'Nuestra celebración')} fallbackGuestGroup={null} />;
}
