import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  EventCategory,
  GuestGroup,
  InvitationConfig,
  TemplateId,
} from '@/types/invitation.types';
import {
  createDefaultInvitationConfig,
  TEMPLATES_CATALOG,
} from '@/lib/templates/templates-catalog';
import { refreshCelebrationConfig } from '@/lib/templates/refresh-celebration-config';

export interface ClientInvitationRecord {
  id: string;
  slug: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  title: string;
  category: EventCategory;
  templateId: TemplateId;
  status: 'published' | 'draft' | 'archived';
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  config: InvitationConfig;
  guests: GuestGroup[];
}

function buildSeedRecord(params: {
  id: string;
  slug: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  title: string;
  templateId: TemplateId;
  status: 'published' | 'draft' | 'archived';
  eventDate: string;
  createdAt: string;
  viewsCount: number;
  tagline?: string;
}): ClientInvitationRecord {
  const tpl =
    TEMPLATES_CATALOG.find((t) => t.id === params.templateId) ||
    TEMPLATES_CATALOG[0];
  const config = createDefaultInvitationConfig(params.templateId, params.title);
  if (params.tagline) {
    config.content.hero.tagline = params.tagline;
  }

  return {
    id: params.id,
    slug: params.slug,
    clientName: params.clientName,
    clientEmail: params.clientEmail,
    clientPhone: params.clientPhone,
    title: params.title,
    category: tpl.category,
    templateId: params.templateId,
    status: params.status,
    eventDate: params.eventDate,
    createdAt: params.createdAt,
    updatedAt: params.createdAt,
    viewsCount: params.viewsCount,
    config,
    guests: [
      {
        id: `${params.id}-g1`,
        eventId: params.id,
        guestToken: 'fam-lopez-8a2f',
        groupName: 'Familia López García',
        whatsappPhone: '525512345678',
        groupTag: 'Familia Principal',
        allocatedAdults: 4,
        allocatedChildren: 1,
        rsvpStatus: 'confirmed',
        confirmedAdults: 4,
        confirmedChildren: 1,
        tableName: 'Mesa 1',
        checkedInCount: 0,
      },
      {
        id: `${params.id}-g2`,
        eventId: params.id,
        guestToken: 'fam-mendoza-3b9c',
        groupName: 'Familia Mendoza Ruiz',
        whatsappPhone: '525587654321',
        groupTag: 'Amigos VIP',
        allocatedAdults: 2,
        allocatedChildren: 0,
        rsvpStatus: 'viewed',
        confirmedAdults: 0,
        confirmedChildren: 0,
        tableName: 'Mesa 2',
        checkedInCount: 0,
      },
    ],
  };
}

export const INITIAL_CLIENT_INVITATIONS: ClientInvitationRecord[] = [
  buildSeedRecord({
    id: 'inv-001',
    slug: 'boda-sofia-y-mateo',
    clientName: 'Sofía Villarreal & Mateo Mendoza',
    clientEmail: 'sofia.villarreal@email.com',
    clientPhone: '+52 55 1234 5678',
    title: 'Sofía & Mateo',
    templateId: 'eternal-elegance',
    status: 'published',
    eventDate: '2026-11-14T17:00:00-06:00',
    createdAt: '2026-10-01T10:30:00-06:00',
    viewsCount: 342,
    tagline: '14 de Noviembre de 2026 • San Miguel de Allende, Gto.',
  }),
  buildSeedRecord({
    id: 'inv-002',
    slug: 'boda-camila-y-diego',
    clientName: 'Camila Elizondo & Diego Garza',
    clientEmail: 'camila.elizondo@email.com',
    clientPhone: '+52 81 2345 6789',
    title: 'Camila & Diego',
    templateId: 'eternal-elegance',
    status: 'published',
    eventDate: '2026-12-05T18:00:00-06:00',
    createdAt: '2026-10-05T14:20:00-06:00',
    viewsCount: 289,
    tagline: '05 de Diciembre de 2026 • Monterrey, N.L.',
  }),
  buildSeedRecord({
    id: 'inv-003',
    slug: 'boda-valeria-y-sebastian',
    clientName: 'Valeria Montes & Sebastián Herrera',
    clientEmail: 'valeria.montes@email.com',
    clientPhone: '+52 33 9876 5432',
    title: 'Valeria & Sebastián',
    templateId: 'eternal-elegance',
    status: 'draft',
    eventDate: '2027-01-23T16:30:00-06:00',
    createdAt: '2026-10-12T09:15:00-06:00',
    viewsCount: 45,
    tagline: '23 de Enero de 2027 • Hacienda Labor de Rivera, Jal.',
  }),
  buildSeedRecord({
    id: 'inv-004',
    slug: 'boda-andrea-y-rodrigo',
    clientName: 'Andrea Solís & Rodrigo Altamirano',
    clientEmail: 'andrea.solis@email.com',
    clientPhone: '+52 55 4433 2211',
    title: 'Andrea & Rodrigo',
    templateId: 'boho-terracotta',
    status: 'published',
    eventDate: '2026-11-28T16:00:00-06:00',
    createdAt: '2026-10-08T11:00:00-06:00',
    viewsCount: 412,
    tagline: '28 de Noviembre de 2026 • Valle de Guadalupe, B.C.',
  }),
  buildSeedRecord({
    id: 'inv-005',
    slug: 'boda-mariana-y-javier',
    clientName: 'Mariana Cárdenas & Javier Orozco',
    clientEmail: 'mariana.cardenas@email.com',
    clientPhone: '+52 999 112 2334',
    title: 'Mariana & Javier',
    templateId: 'boho-terracotta',
    status: 'published',
    eventDate: '2027-02-14T17:30:00-06:00',
    createdAt: '2026-10-15T16:40:00-06:00',
    viewsCount: 198,
    tagline: '14 de Febrero de 2027 • Mérida, Yucatán',
  }),
  buildSeedRecord({
    id: 'inv-006',
    slug: 'boda-civil-fernanda-y-luis',
    clientName: 'Fernanda Ríos & Luis Castrejón',
    clientEmail: 'fer.rios@email.com',
    clientPhone: '+52 55 6677 8899',
    title: 'Fernanda & Luis',
    templateId: 'modern-minimal-noir',
    status: 'published',
    eventDate: '2026-11-20T19:00:00-06:00',
    createdAt: '2026-10-10T12:10:00-06:00',
    viewsCount: 230,
    tagline: '20 de Noviembre de 2026 • Museo Soumaya, CDMX',
  }),
  buildSeedRecord({
    id: 'inv-007',
    slug: 'xv-valentina-imperial',
    clientName: 'Familia Salazar (XV Valentina)',
    clientEmail: 'patricia.salazar@email.com',
    clientPhone: '+52 55 3344 5566',
    title: 'Mis XV: Valentina',
    templateId: 'royal-xv-enchanted',
    status: 'published',
    eventDate: '2026-12-12T18:00:00-06:00',
    createdAt: '2026-10-14T18:00:00-06:00',
    viewsCount: 520,
    tagline: '12 de Diciembre de 2026 • Colegio de las Vizcaínas, CDMX',
  }),
  buildSeedRecord({
    id: 'inv-008',
    slug: 'xv-regina-gala',
    clientName: 'Familia Domínguez (XV Regina)',
    clientEmail: 'jorge.dominguez@email.com',
    clientPhone: '+52 222 445 6677',
    title: 'Mis XV: Regina',
    templateId: 'royal-xv-enchanted',
    status: 'published',
    eventDate: '2027-01-16T19:00:00-06:00',
    createdAt: '2026-10-18T13:25:00-06:00',
    viewsCount: 310,
    tagline: '16 de Enero de 2027 • Cholula, Puebla',
  }),
  buildSeedRecord({
    id: 'inv-009',
    slug: 'xv-isabella-neon',
    clientName: 'Familia Cervantes (XV Isabella)',
    clientEmail: 'claudia.cervantes@email.com',
    clientPhone: '+52 33 5566 7788',
    title: 'Isabella XV Night',
    templateId: 'neon-xv-euphoria',
    status: 'published',
    eventDate: '2026-11-27T20:30:00-06:00',
    createdAt: '2026-10-19T15:50:00-06:00',
    viewsCount: 475,
    tagline: '27 de Noviembre de 2026 • Zapopan, Jalisco',
  }),
  buildSeedRecord({
    id: 'inv-010',
    slug: '50-aniversario-alejandro',
    clientName: 'Arq. Alejandro Navarro',
    clientEmail: 'alejandro.navarro@email.com',
    clientPhone: '+52 55 9988 7766',
    title: 'Los 50 de Alejandro',
    templateId: 'golden-jubilee',
    status: 'published',
    eventDate: '2026-11-21T20:00:00-06:00',
    createdAt: '2026-10-20T10:00:00-06:00',
    viewsCount: 185,
    tagline: '21 de Noviembre de 2026 • Lomas de Chapultepec, CDMX',
  }),
  buildSeedRecord({
    id: 'inv-011',
    slug: 'cumple-leo-6-aventura',
    clientName: 'Mariana y Daniel (Papás de Leo)',
    clientEmail: 'daniel.perez@email.com',
    clientPhone: '+52 55 2233 4455',
    title: '¡Leo Cumple 6 Años!',
    templateId: 'fiesta-kids-adventure',
    status: 'published',
    eventDate: '2026-11-15T13:30:00-06:00',
    createdAt: '2026-10-21T17:10:00-06:00',
    viewsCount: 164,
    tagline: '15 de Noviembre de 2026 • Jardín Las Lomas',
  }),
  buildSeedRecord({
    id: 'inv-012',
    slug: 'bautizo-santiago-2026',
    clientName: 'Familia Ibarra Morales',
    clientEmail: 'ibarra.familia@email.com',
    clientPhone: '+52 442 334 5566',
    title: 'Mi Bautizo: Santiago',
    templateId: 'celestial-baptism',
    status: 'published',
    eventDate: '2026-12-06T12:00:00-06:00',
    createdAt: '2026-10-22T11:30:00-06:00',
    viewsCount: 215,
    tagline: '06 de Diciembre de 2026 • Querétaro, Qro.',
  }),
  buildSeedRecord({
    id: 'inv-013',
    slug: 'baby-shower-julieta',
    clientName: 'Paulina & Emiliano',
    clientEmail: 'paulina.vega@email.com',
    clientPhone: '+52 55 7788 9900',
    title: 'Baby Shower de Julieta',
    templateId: 'sweet-oh-baby',
    status: 'published',
    eventDate: '2026-11-22T10:30:00-06:00',
    createdAt: '2026-10-24T09:45:00-06:00',
    viewsCount: 142,
    tagline: '22 de Noviembre de 2026 • Polanco, CDMX',
  }),
  buildSeedRecord({
    id: 'inv-014',
    slug: 'graduacion-medicina-2026',
    clientName: 'Comité Generación Medicina 2026',
    clientEmail: 'comite.medicina26@email.com',
    clientPhone: '+52 55 1199 8822',
    title: 'Gala de Graduación Medicina 2022–2026',
    templateId: 'grad-gala-night',
    status: 'published',
    eventDate: '2026-12-18T20:00:00-06:00',
    createdAt: '2026-10-25T19:00:00-06:00',
    viewsCount: 890,
    tagline: '18 de Diciembre de 2026 • Expo Santa Fe, CDMX',
  }),
];

interface EventsStoreState {
  invitations: ClientInvitationRecord[];
  addInvitation: (input: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    title: string;
    slug: string;
    templateId: TemplateId;
    eventDate: string;
  }) => ClientInvitationRecord;
  updateInvitation: (
    id: string,
    patch: Partial<
      Pick<
        ClientInvitationRecord,
        | 'slug'
        | 'clientName'
        | 'clientEmail'
        | 'clientPhone'
        | 'title'
        | 'templateId'
        | 'status'
        | 'eventDate'
        | 'config'
        | 'guests'
      >
    >
  ) => void;
  deleteInvitation: (id: string) => void;
  getBySlug: (slug: string) => ClientInvitationRecord | undefined;
}

export const useEventsStore = create<EventsStoreState>()(
  persist(
    (set, get) => ({
      invitations: INITIAL_CLIENT_INVITATIONS,

      addInvitation: (input) => {
        const tpl =
          TEMPLATES_CATALOG.find((t) => t.id === input.templateId) ||
          TEMPLATES_CATALOG[0];
        const now = new Date().toISOString();
        const id = `inv-${Date.now()}`;
        const config = createDefaultInvitationConfig(
          input.templateId,
          input.title
        );

        const newRecord: ClientInvitationRecord = {
          id,
          slug: input.slug,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          title: input.title,
          category: tpl.category,
          templateId: input.templateId,
          status: 'published',
          eventDate: input.eventDate,
          createdAt: now,
          updatedAt: now,
          viewsCount: 1,
          config,
          guests: [
            {
              id: `${id}-g1`,
              eventId: id,
              guestToken: 'fam-invitada-vip',
              groupName: `Invitados de ${input.title}`,
              whatsappPhone: input.clientPhone.replace(/[^\d]/g, ''),
              groupTag: 'VIP',
              allocatedAdults: 2,
              allocatedChildren: 0,
              rsvpStatus: 'pending',
              confirmedAdults: 0,
              confirmedChildren: 0,
              tableName: 'Mesa 1',
              checkedInCount: 0,
            },
          ],
        };

        set((state) => ({
          invitations: [newRecord, ...state.invitations],
        }));

        return newRecord;
      },

      updateInvitation: (id, patch) =>
        set((state) => ({
          invitations: state.invitations.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        })),

      deleteInvitation: (id) =>
        set((state) => ({
          invitations: state.invitations.filter((item) => item.id !== id),
        })),

      getBySlug: (slug) =>
        get().invitations.find(
          (item) => item.slug.toLowerCase() === slug.toLowerCase()
        ),
    }),
    {
      name: 'atelier-client-invitations-v1',
      merge: (persistedState, currentState) => {
        const savedInvitations = (persistedState as Partial<EventsStoreState> | undefined)?.invitations;
        if (!Array.isArray(savedInvitations)) return currentState;

        return {
          ...currentState,
          invitations: savedInvitations.map((record) => {
            const config = refreshCelebrationConfig(record.config, record.templateId, record.title);
            return config === record.config ? record : { ...record, config };
          }),
        };
      },
    }
  )
);
