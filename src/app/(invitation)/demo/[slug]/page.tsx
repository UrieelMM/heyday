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
    'mickey-mouse-birthday': 'Mateo cumple 5',
    'minecraft-birthday': 'Santiago cumple 8',
    'fiesta-kids-adventure': 'Luna cumple 7',
    'pirate-treasure-voyage': 'Mateo cumple 7',
    'dino-jungle-expedition': 'Nico cumple 5',
    'safari-sunrise-adventure': 'Emma cumple 6',
    'cowboy-ranch-roundup': 'Diego cumple 7',
    'glass-garden-vows': 'Elena & Tomás',
    'midnight-constellation': 'Isabel & Daniel',
    'golden-harvest-vineyard': 'Valeria & Andrés',
    'opera-carmesi': 'Valentina',
    'pequeno-atlas': 'Baby en camino',
    'archivo-futuro': 'Generación 2026',
    'ohana-lilo-stitch': 'Maya cumple 6',
    'stitch-birthday': 'Kai cumple 6',
    'solar-pop-xv': 'Renata XV',
    'cafe-para-siempre': 'Clara & Julián',
    'atelier-xv': 'Valentina',
  };
  const demoTime = slug === 'mickey-mouse-birthday' || slug === 'minecraft-birthday' ? '13:00:00' : ['mini-cosmos', 'fiesta-kids-adventure', 'pirate-treasure-voyage', 'dino-jungle-expedition', 'safari-sunrise-adventure', 'cowboy-ranch-roundup', 'ohana-lilo-stitch', 'stitch-birthday'].includes(slug) ? '13:30:00' : ['atelier-xv', 'solar-pop-xv'].includes(slug) ? '19:00:00' : '17:00:00';
  return <PublicInvitationClientView demo slug={slug} fallbackTemplateId={template.id} fallbackEventDate={`2026-12-19T${demoTime}-06:00`} fallbackConfig={createDefaultInvitationConfig(template.id, demoTitles[slug] || 'Nuestra celebración')} fallbackGuestGroup={null} />;
}
