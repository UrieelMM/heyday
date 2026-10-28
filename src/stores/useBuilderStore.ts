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

export type BuilderViewport = 'mobile' | 'tablet' | 'desktop';

interface BuilderState {
  eventId: string;
  slug: string;
  title: string;
  eventDate: string;
  templateId: TemplateId;
  viewport: BuilderViewport;
  activeSection: SectionId;
  previewEnvelopeOpen: boolean;
  config: InvitationConfig;
  isDirty: boolean;

  setTemplate: (templateId: TemplateId) => void;
  setViewport: (viewport: BuilderViewport) => void;
  setActiveSection: (section: SectionId) => void;
  setPreviewEnvelopeOpen: (open: boolean) => void;
  setMeta: (meta: Partial<{ slug: string; title: string; eventDate: string }>) => void;
  updateThemeColors: (colors: Partial<InvitationConfig['theme']['colors']>) => void;
  updateEnvelope: (envelope: Partial<InvitationConfig['theme']['envelope']>) => void;
  toggleSection: (sectionId: SectionId) => void;
  reorderSections: (sectionsOrder: InvitationConfig['sectionsOrder']) => void;
  updateHero: (hero: Partial<InvitationConfig['content']['hero']>) => void;
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
    eventId: 'demo-event-001',
    slug: 'boda-sofia-y-mateo',
    title: 'Sofía & Mateo',
    eventDate: '2026-12-19T17:00:00-06:00',
    templateId: 'eternal-elegance',
    viewport: 'mobile',
    activeSection: 'hero',
    previewEnvelopeOpen: true,
    config: createDefaultInvitationConfig('eternal-elegance', 'Sofía & Mateo'),
    isDirty: false,

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
    setPreviewEnvelopeOpen: (previewEnvelopeOpen) => set({ previewEnvelopeOpen }),
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

    updateQuoteStory: (quoteStory) =>
      set((state) => ({
        isDirty: true,
        config: {
          ...state.config,
          content: {
            ...state.config.content,
            quoteStory: { ...state.config.content.quoteStory, ...quoteStory },
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
