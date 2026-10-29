import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  InvitationConfig,
  SectionId,
  TemplateId,
} from '@/types/invitation.types';
import {
  createDefaultInvitationConfig,
  TEMPLATES_CATALOG,
} from '@/lib/templates/templates-catalog';
import type { ClientInvitationRecord } from '@/stores/useEventsStore';

export type BuilderViewport = 'mobile' | 'tablet' | 'desktop';

interface BuilderState {
  eventId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  slug: string;
  title: string;
  eventDate: string;
  templateId: TemplateId;
  viewport: BuilderViewport;
  activeSection: SectionId;
  previewEnvelopeOpen: boolean;
  config: InvitationConfig;
  isDirty: boolean;

  loadInvitationRecord: (record: ClientInvitationRecord) => void;
  setTemplate: (templateId: TemplateId) => void;
  setViewport: (viewport: BuilderViewport) => void;
  setActiveSection: (section: SectionId) => void;
  setPreviewEnvelopeOpen: (open: boolean) => void;
  setMeta: (
    meta: Partial<{
      slug: string;
      title: string;
      clientName: string;
      clientEmail: string;
      clientPhone: string;
      eventDate: string;
    }>
  ) => void;
  updateThemeColors: (
    colors: Partial<InvitationConfig['theme']['colors']>
  ) => void;
  updateEnvelope: (
    envelope: Partial<InvitationConfig['theme']['envelope']>
  ) => void;
  toggleSection: (sectionId: SectionId) => void;
  reorderSections: (sectionsOrder: InvitationConfig['sectionsOrder']) => void;
  updateHero: (hero: Partial<InvitationConfig['content']['hero']>) => void;
  updateSocialFeatures: (patch: Partial<InvitationConfig['content']['socialFeatures']>) => void;
  updateGallery: (images: InvitationConfig['content']['gallery']['images']) => void;
  updateQuoteStory: (
    quoteStory: Partial<InvitationConfig['content']['quoteStory']>
  ) => void;
  updateDressCode: (
    dressCode: Partial<InvitationConfig['content']['dressCode']>
  ) => void;
  updateGifts: (gifts: Partial<InvitationConfig['content']['gifts']>) => void;
  resetWithTemplate: (templateId: TemplateId, title?: string) => void;
}

export const useBuilderStore = create<BuilderState>()(
  temporal((set) => ({
    eventId: 'inv-001',
    clientName: 'Sofía Villarreal & Mateo Mendoza',
    clientEmail: 'sofia.villarreal@email.com',
    clientPhone: '+52 55 1234 5678',
    slug: 'boda-sofia-y-mateo',
    title: 'Sofía & Mateo',
    eventDate: '2026-11-14T17:00:00-06:00',
    templateId: 'eternal-elegance',
    viewport: 'mobile',
    activeSection: 'hero',
    previewEnvelopeOpen: true,
    config: createDefaultInvitationConfig('eternal-elegance', 'Sofía & Mateo'),
    isDirty: false,

    loadInvitationRecord: (record) =>
      set({
        eventId: record.id,
        clientName: record.clientName,
        clientEmail: record.clientEmail,
        clientPhone: record.clientPhone,
        slug: record.slug,
        title: record.title,
        eventDate: record.eventDate,
        templateId: record.templateId,
        config: structuredClone(record.config),
        isDirty: false,
      }),

    setTemplate: (templateId) =>
      set((state) => {
        const tpl =
          TEMPLATES_CATALOG.find((t) => t.id === templateId) ||
          TEMPLATES_CATALOG[0];
        return {
          templateId,
          isDirty: true,
          config: {
            ...state.config,
            theme: {
              ...state.config.theme,
              colors: { ...tpl.colors },
              fonts: { ...tpl.fonts },
              envelope: {
                ...state.config.theme.envelope,
                variant: tpl.envelopeVariant,
                sealColor: tpl.colors.accentPrimary,
              },
              ambientEffect: tpl.ambientEffect,
            },
          },
        };
      }),

    setViewport: (viewport) => set({ viewport }),
    setActiveSection: (activeSection) => set({ activeSection }),
    setPreviewEnvelopeOpen: (previewEnvelopeOpen) =>
      set({ previewEnvelopeOpen }),
    setMeta: (meta) => set((state) => ({ ...state, ...meta, isDirty: true })),

    updateThemeColors: (colors) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          theme: {
            ...state.config.theme,
            colors: { ...state.config.theme.colors, ...colors },
          },
        },
      })),

    updateEnvelope: (envelope) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          theme: {
            ...state.config.theme,
            envelope: { ...state.config.theme.envelope, ...envelope },
          },
        },
      })),

    toggleSection: (sectionId) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          sectionsOrder: state.config.sectionsOrder.map((sec) =>
            sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
          ),
        },
      })),

    reorderSections: (sectionsOrder) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          sectionsOrder,
        },
      })),

    updateHero: (hero) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          content: {
            ...state.config.content,
            hero: { ...state.config.content.hero, ...hero },
          },
        },
      })),

    updateSocialFeatures: (patch) => set((state) => ({ isDirty: true, config: { ...state.config, content: { ...state.config.content, socialFeatures: { ...state.config.content.socialFeatures, ...patch } } } })),

    updateGallery: (images) => set((state) => ({ isDirty: true, config: { ...state.config, content: { ...state.config.content, gallery: { ...state.config.content.gallery, images } } } })),

    updateQuoteStory: (quoteStory) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          content: {
            ...state.config.content,
            quoteStory: {
              ...state.config.content.quoteStory,
              ...quoteStory,
            },
          },
        },
      })),

    updateDressCode: (dressCode) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          content: {
            ...state.config.content,
            dressCode: { ...state.config.content.dressCode, ...dressCode },
          },
        },
      })),

    updateGifts: (gifts) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          content: {
            ...state.config.content,
            gifts: { ...state.config.content.gifts, ...gifts },
          },
        },
      })),

    resetWithTemplate: (templateId, title = 'Sofía & Mateo') =>
      set({
        templateId,
        title,
        isDirty: false,
        config: createDefaultInvitationConfig(templateId, title),
      }),
  }))
);
