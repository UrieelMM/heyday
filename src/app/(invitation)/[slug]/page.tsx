import type { Metadata } from 'next';
import { PublicInvitationClientView } from '@/components/invitation/core/PublicInvitationClientView';
import {
  createDefaultInvitationConfig,
  TEMPLATES_CATALOG,
} from '@/lib/templates/templates-catalog';
import { INITIAL_CLIENT_INVITATIONS } from '@/stores/useEventsStore';
import type { GuestGroup, TemplateId } from '@/types/invitation.types';

const DEMO_GUEST_GROUPS: Record<string, GuestGroup> = {
  'fam-lopez-8a2f': {
    id: 'grp-1',
    eventId: 'demo-event-001',
    guestToken: 'fam-lopez-8a2f',
    groupName: 'Familia López García',
    whatsappPhone: '+525512345678',
    groupTag: 'Familia Novia',
    allocatedAdults: 4,
    allocatedChildren: 1,
    rsvpStatus: 'viewed',
    confirmedAdults: 0,
    confirmedChildren: 0,
    tableName: 'Mesa 4 • Jardín Central',
    checkedInCount: 0,
  },
  'fam-invitada': {
    id: 'grp-2',
    eventId: 'demo-event-001',
    guestToken: 'fam-invitada',
    groupName: 'Familia Ramírez Villarreal',
    whatsappPhone: '+525598765432',
    groupTag: 'VIP',
    allocatedAdults: 2,
    allocatedChildren: 0,
    rsvpStatus: 'pending',
    confirmedAdults: 0,
    confirmedChildren: 0,
    tableName: 'Mesa 1 • Honor',
    checkedInCount: 0,
  },
};

function resolveTemplateAndTitle(slug: string, queryTemplate?: string): {
  templateId: TemplateId;
  title: string;
} {
  const seedMatch = INITIAL_CLIENT_INVITATIONS.find(
    (inv) => inv.slug.toLowerCase() === slug.toLowerCase()
  );
  if (seedMatch && !queryTemplate) {
    return {
      templateId: seedMatch.templateId,
      title: seedMatch.title,
    };
  }

  const validTemplate = TEMPLATES_CATALOG.find(
    (t) => t.id === queryTemplate || slug === `demo-${t.id}`
  );
  const templateId: TemplateId = validTemplate
    ? validTemplate.id
    : slug.includes('xv')
      ? 'royal-xv-enchanted'
      : 'eternal-elegance';

  const titleByCategory: Record<string, string> = {
    wedding: 'Sofía & Mateo',
    xv_years: 'Mis XV: Valentina',
    adult_birthday: '50 Años de Alejandro',
    kids_birthday: 'Cumple #6 de Leo',
    baptism_communion: 'Bautizo de Santiago',
    baby_shower: 'Baby Shower de Baby Julieta',
    graduation_gala: 'Graduación Medicina Gen 2026',
  };

  const category =
    TEMPLATES_CATALOG.find((t) => t.id === templateId)?.category || 'wedding';

  return {
    templateId,
    title: titleByCategory[category] || 'Sofía & Mateo',
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; template?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { g, template } = await searchParams;
  const { title } = resolveTemplateAndTitle(slug, template);
  const guest = g ? DEMO_GUEST_GROUPS[g] : undefined;

  return {
    title: guest
      ? `${guest.groupName} — Invitación a ${title}`
      : `${title} — Invitación Digital Interactiva`,
    description:
      'Toca para abrir tu sobre digital personalizado, conocer la ubicación y confirmar tu asistencia.',
  };
}

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; template?: string }>;
}) {
  const { slug } = await params;
  const { g, template } = await searchParams;

  const { templateId, title } = resolveTemplateAndTitle(slug, template);
  const config = createDefaultInvitationConfig(templateId, title);
  const guestGroup: GuestGroup | null = g
    ? DEMO_GUEST_GROUPS[g] || {
        id: 'grp-custom',
        eventId: 'demo-event-001',
        guestToken: g,
        groupName: g
          .replace(/^fam-/, 'Familia ')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        allocatedAdults: 3,
        allocatedChildren: 1,
        rsvpStatus: 'viewed',
        confirmedAdults: 0,
        confirmedChildren: 0,
        tableName: 'Mesa 5 • Recepción',
        checkedInCount: 0,
      }
    : null;

  return (
    <PublicInvitationClientView
      slug={slug}
      fallbackTemplateId={templateId}
      fallbackEventDate="2026-12-19T17:00:00-06:00"
      fallbackConfig={config}
      fallbackGuestGroup={guestGroup}
      guestToken={g}
    />
  );
}
