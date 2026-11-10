import type { InvitationConfig, SectionId } from '@/types/invitation.types';

export const sectionLabels: Record<SectionId, string> = {
  hero: 'Portada', quote_story: 'Historia', vip_parents: 'Familia y padrinos',
  countdown: 'Cuenta regresiva', locations: 'Lugares', timeline: 'Programa',
  gallery: 'Galería', dress_code: 'Vestimenta', gifts: 'Regalos',
  accommodation: 'Hospedaje', social_features: 'Funciones sociales', rsvp: 'Confirmación',
};

export function editableConfig(config: InvitationConfig): InvitationConfig {
  const content = config.content;
  const sectionsOrder = [...config.sectionsOrder];
  for (const id of Object.keys(sectionLabels) as SectionId[]) {
    if (!sectionsOrder.some(section => section.id === id)) sectionsOrder.push({ id, enabled: true });
  }
  return {
    ...config,
    sectionsOrder,
    audio: { ...config.audio, trackTitle: config.audio.trackTitle ?? '', startSecond: config.audio.startSecond ?? 0 },
    content: {
      ...content,
      hero: { ...content.hero, coverVideoUrl: content.hero.coverVideoUrl ?? '' },
      quoteStory: {
        ...content.quoteStory,
        quoteAuthor: content.quoteStory.quoteAuthor ?? '',
        storyBlocks: (content.quoteStory.storyBlocks ?? []).map(block => ({ ...block, imageUrl: block.imageUrl ?? '' })),
      },
      locations: content.locations.map(location => ({ ...location, imageUrl: location.imageUrl ?? '' })),
      timeline: content.timeline.map(item => ({ ...item, description: item.description ?? '' })),
      dressCode: { ...content.dressCode, pinterestBoardUrl: content.dressCode.pinterestBoardUrl ?? '' },
      gifts: {
        ...content.gifts,
        registries: content.gifts.registries.map(registry => ({ ...registry, eventNumber: registry.eventNumber ?? '' })),
        bankTransfer: {
          enabled: false, bankName: '', accountHolder: '', clabe: '',
          ...content.gifts.bankTransfer,
          accountNumber: content.gifts.bankTransfer?.accountNumber ?? '',
          conceptNote: content.gifts.bankTransfer?.conceptNote ?? '',
        },
      },
      accommodation: content.accommodation.map(hotel => ({
        ...hotel, discountCode: hotel.discountCode ?? '', bookingUrl: hotel.bookingUrl ?? '', phone: hotel.phone ?? '',
      })),
      socialFeatures: { ...content.socialFeatures, hashtag: content.socialFeatures.hashtag ?? '' },
      rsvp: { ...content.rsvp, plannerContactWhatsapp: content.rsvp.plannerContactWhatsapp ?? '' },
    },
  };
}
