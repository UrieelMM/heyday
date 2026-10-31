import type { InvitationConfig, TemplateId } from '@/types/invitation.types';
import { isCelebrationTemplateId } from './celebration-config';
import { createDefaultInvitationConfig } from './templates-catalog';

// Earlier releases saved the wedding sample inside every category. Replace only
// values that still match that sample so edits made by a client stay intact.
const legacyCovers = {
  'golden-jubilee': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
  'fiesta-kids-adventure': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
  'celestial-baptism': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
} as const;

const legacyWeddingQuote = '“En el momento en que nuestros caminos se cruzaron, supimos que cada instante nos había traído hasta aquí. Queremos celebrar con ustedes el inicio de nuestro para siempre.”';
const legacyStoryTitles = ['Nuestro Comienzo', 'El Gran Día'];
const legacyStoryDescriptions = [
  'Una tarde inolvidable llena de risas y complicidad que cambió nuestras vidas para siempre.',
  'Hoy damos el siguiente paso rodeados de las personas que más amamos en el mundo.',
];
const legacyGalleryUrls = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80',
];
const legacyCeremonyImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
const legacyReceptionImage = 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80';
const legacyAudio = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
const legacyTimelineTitles = ['Ceremonia Religiosa', 'Cóctel de Bienvenida', 'Cena de Gala', 'Primer Baile y Fiesta'];
const legacyTimelineTimes = ['17:00 HRS', '19:00 HRS', '20:30 HRS', '22:00 HRS'];
const legacyTimelineDescriptions = [
  'Puntualidad agradecida en la Parroquia.',
  'Mixología de autor y música de cuerdas en los jardines.',
  'Banquete de cuatro tiempos y brindis de honor.',
  'Apertura de pista con DJ y sorpresas toda la noche.',
];
const legacyGalleryCaptions = ['Nuestro compromiso', 'Atardecer en San Miguel', 'Por siempre juntos', 'Cuenta regresiva'];

export function refreshCelebrationConfig(config: InvitationConfig, templateId: TemplateId, title: string): InvitationConfig {
  if (!isCelebrationTemplateId(templateId)) return config;

  const defaults = createDefaultInvitationConfig(templateId, title);
  const updated = structuredClone(config);
  const content = updated.content;
  let changed = false;
  const replace = (condition: boolean, action: () => void) => {
    if (!condition) return;
    action();
    changed = true;
  };

  replace(config.content.hero.coverImageUrl === legacyCovers[templateId], () => {
    content.hero.coverImageUrl = defaults.content.hero.coverImageUrl;
    if (config.content.hero.focalPoint.x === 50 && config.content.hero.focalPoint.y === 35) {
      content.hero.focalPoint = defaults.content.hero.focalPoint;
    }
  });
  replace(config.content.hero.badgeText === 'ESTÁS CORDIALMENTE INVITADO', () => {
    content.hero.badgeText = defaults.content.hero.badgeText;
  });
  replace(config.content.hero.tagline === '24 de Octubre de 2026 • San Miguel de Allende, Gto.', () => {
    content.hero.tagline = defaults.content.hero.tagline;
  });
  replace(config.content.quoteStory.quoteText === legacyWeddingQuote, () => {
    content.quoteStory.quoteText = defaults.content.quoteStory.quoteText;
  });
  replace(config.content.quoteStory.quoteAuthor === title, () => {
    content.quoteStory.quoteAuthor = defaults.content.quoteStory.quoteAuthor;
  });
  replace(config.content.quoteStory.storyBlocks?.length === 2 &&
    config.content.quoteStory.storyBlocks.every((block, index) => block.title === legacyStoryTitles[index] && block.description === legacyStoryDescriptions[index]), () => {
    content.quoteStory.storyBlocks = defaults.content.quoteStory.storyBlocks;
  });

  const oldFamily = config.content.vipParents.groups.length === 3 &&
    config.content.vipParents.groups[0].groupTitle === 'Padres de la Novia' &&
    config.content.vipParents.groups[0].names.join('|') === 'Sra. Elena Martínez de Villarreal|Sr. Alejandro Villarreal' &&
    config.content.vipParents.groups[1].groupTitle === 'Padres del Novio' &&
    config.content.vipParents.groups[1].names.join('|') === 'Sra. Lucía Fernández de Mendoza|Sr. Carlos Mendoza' &&
    config.content.vipParents.groups[2].groupTitle === 'Padrinos de Honor' &&
    config.content.vipParents.groups[2].names.join('|') === 'Sra. Mariana Villarreal|Ing. Roberto Domínguez';
  replace(oldFamily && config.content.vipParents.blessingMessage === 'Con la bendición de Dios y el amor incondicional de nuestros padres y padrinos', () => {
    content.vipParents = defaults.content.vipParents;
  });

  const oldLocations = config.content.locations.length === 2 &&
    config.content.locations[0].id === 'loc-ceremony' &&
    config.content.locations[0].title === 'Ceremonia Religiosa' &&
    config.content.locations[1].id === 'loc-reception' &&
    config.content.locations[1].title === 'Recepción y Banquete';
  replace(oldLocations, () => {
    const originals = config.content.locations;
    const sources = templateId === 'celestial-baptism' ? originals : [originals[1]];
    content.locations = defaults.content.locations.map((location, index) => {
      const original = sources[index];
      const oldImage = original.imageUrl === (original.type === 'reception' ? legacyReceptionImage : legacyCeremonyImage);
      return {
        ...location,
        venueName: original.venueName,
        time: original.time === (original.type === 'reception' ? '19:30 HRS' : '17:00 HRS') ? location.time : original.time,
        address: original.address,
        coordinates: original.coordinates,
        googleMapsUrl: original.googleMapsUrl,
        wazeUrl: original.wazeUrl,
        imageUrl: oldImage ? location.imageUrl : original.imageUrl,
      };
    });
  });

  replace(config.content.timeline.length === 4 &&
    config.content.timeline.every((item, index) => item.id === `tl-${index + 1}` && item.title === legacyTimelineTitles[index] && item.time === legacyTimelineTimes[index] && item.description === legacyTimelineDescriptions[index]), () => {
    content.timeline = defaults.content.timeline;
  });
  const untouchedWeddingGallery = config.content.gallery.images.length === legacyGalleryUrls.length &&
    config.content.gallery.images.every((image, index) => image.url === legacyGalleryUrls[index] && image.caption === legacyGalleryCaptions[index]);
  replace(config.content.gallery.images.some((image) => legacyGalleryUrls.includes(image.url)), () => {
    const personalImages = config.content.gallery.images.filter((image) => !legacyGalleryUrls.includes(image.url));
    content.gallery = untouchedWeddingGallery
      ? defaults.content.gallery
      : { ...config.content.gallery, images: [...personalImages, ...defaults.content.gallery.images] };
  });

  replace(config.content.dressCode.title === 'Etiqueta Formal Rigurosa', () => {
    content.dressCode.title = defaults.content.dressCode.title;
  });
  replace(config.content.dressCode.womenNotes === 'Vestido largo de noche (evitar tonos claros o marfil).', () => {
    content.dressCode.womenNotes = defaults.content.dressCode.womenNotes;
  });
  replace(config.content.dressCode.menNotes === 'Smoking o traje formal oscuro con corbata.', () => {
    content.dressCode.menNotes = defaults.content.dressCode.menNotes;
  });
  replace(config.content.dressCode.reservedColors.map((color) => `${color.name}:${color.hex}`).join('|') === 'Blanco:#FFFFFF|Marfil:#FAF0E6|Champagne:#F7E7CE', () => {
    content.dressCode.reservedColors = defaults.content.dressCode.reservedColors;
    content.dressCode.reservedNote = defaults.content.dressCode.reservedNote;
  });
  replace(config.content.dressCode.pinterestBoardUrl === 'https://www.pinterest.com', () => {
    content.dressCode.pinterestBoardUrl = defaults.content.dressCode.pinterestBoardUrl;
  });

  const oldGifts = config.content.gifts.bankTransfer?.accountHolder === 'Sofía Villarreal / Mateo Mendoza' &&
    config.content.gifts.bankTransfer.clabe === '012180015482910482' &&
    config.content.gifts.registries.map((registry) => registry.storeName).join('|') === 'Liverpool|Amazon Mesa de Regalos';
  replace(oldGifts, () => { content.gifts = defaults.content.gifts; });
  const oldAccommodation = config.content.accommodation.length === 2 &&
    config.content.accommodation[0]?.discountCode === 'BODASOFIA26' &&
    config.content.accommodation[1]?.discountCode === 'SOFIAYMATEO';
  replace(oldAccommodation, () => { content.accommodation = defaults.content.accommodation; });
  const oldSocial = config.content.socialFeatures.hashtag === '#SofiaYMateo2026' &&
    config.content.socialFeatures.enableSongRequests &&
    config.content.socialFeatures.enableAudioGuestbook &&
    config.content.socialFeatures.enableLiveDisposableCamera;
  replace(oldSocial, () => { content.socialFeatures = defaults.content.socialFeatures; });
  replace(config.content.rsvp.customConfirmationMessage.startsWith('¡Gracias por confirmar! Aquí tienes tu Pase Digital VIP'), () => {
    content.rsvp.customConfirmationMessage = defaults.content.rsvp.customConfirmationMessage;
  });
  replace(config.audio.enabled && config.audio.trackUrl === legacyAudio && config.audio.trackTitle === 'Melodía Instrumental de Bienvenida', () => {
    updated.audio.enabled = defaults.audio.enabled;
  });

  if (oldFamily || oldGifts || oldAccommodation || oldSocial) {
    updated.sectionsOrder = config.sectionsOrder.map((section) => {
      const stockSection = (section.id === 'vip_parents' && oldFamily) ||
        (section.id === 'gifts' && oldGifts) ||
        (section.id === 'accommodation' && oldAccommodation) ||
        (section.id === 'social_features' && oldSocial);
      return stockSection ? { ...section, enabled: defaults.sectionsOrder.find((item) => item.id === section.id)?.enabled ?? section.enabled } : section;
    });
    changed = true;
  }

  const oldMonogram = title.split(' ').filter((word) => word.length > 1).slice(0, 2).map((word) => word[0]?.toUpperCase()).join(' & ');
  replace(config.theme.envelope.sealMonogram === oldMonogram && config.theme.envelope.sealMonogram !== defaults.theme.envelope.sealMonogram, () => {
    updated.theme.envelope.sealMonogram = defaults.theme.envelope.sealMonogram;
  });
  if (templateId === 'fiesta-kids-adventure') {
    const oldCover = '/images/fiesta-kids-adventure/paper-adventure.jpg';
    replace(config.content.hero.coverImageUrl === oldCover, () => {
      content.hero.coverImageUrl = defaults.content.hero.coverImageUrl;
      if (config.content.hero.focalPoint.x === 53 && config.content.hero.focalPoint.y === 50) {
        content.hero.focalPoint = defaults.content.hero.focalPoint;
      }
    });
    replace(config.content.quoteStory.storyBlocks?.length === 2 &&
      config.content.quoteStory.storyBlocks[0]?.title === 'Tu misión' &&
      config.content.quoteStory.storyBlocks[1]?.title === 'La recompensa' &&
      config.content.quoteStory.storyBlocks[0]?.description === 'Trae tus ganas de jugar, explorar y hacer nuevos recuerdos.' &&
      config.content.quoteStory.storyBlocks[1]?.description === 'Pastel, amigos y una tarde llena de diversión.' &&
      !config.content.quoteStory.storyBlocks[0]?.imageUrl, () => {
      content.quoteStory.storyBlocks = defaults.content.quoteStory.storyBlocks;
    });
    replace(config.content.locations.length === 1 &&
      config.content.locations[0]?.id === 'kids-party' &&
      config.content.locations[0]?.imageUrl === oldCover, () => {
      content.locations[0].imageUrl = defaults.content.locations[0].imageUrl;
    });
    replace(config.content.timeline.length === 3 &&
      config.content.timeline.map((item) => item.id).join('|') === 'kids-1|kids-2|kids-3' &&
      config.content.timeline[0].description === 'Bienvenida y primeros juegos.' &&
      config.content.timeline[1].description === 'Sorpresas para pequeños exploradores.' &&
      config.content.timeline[2].description === 'Cantamos, soplamos velitas y celebramos juntos.', () => {
      content.timeline = defaults.content.timeline;
    });
    replace(config.content.gallery.images.length === 2 &&
      config.content.gallery.images[0]?.url === oldCover &&
      config.content.gallery.images[0]?.caption === 'El mapa de la aventura' &&
      config.content.gallery.images[1]?.url === '/images/fiesta-kids-adventure/birthday-picnic.jpg' &&
      config.content.gallery.images[1]?.caption === '¡Pastel para todos!', () => {
      content.gallery = defaults.content.gallery;
    });
    const untouchedGifts = !config.content.gifts.introMessage &&
      config.content.gifts.registries.length === 0 &&
      !config.content.gifts.cashEnvelopeAtVenue &&
      !config.content.gifts.bankTransfer?.enabled;
    replace(untouchedGifts, () => {
      content.gifts = defaults.content.gifts;
      updated.sectionsOrder = updated.sectionsOrder.map((section) => section.id === 'gifts' ? { ...section, enabled: true } : section);
      content.sectionHeadings = { ...content.sectionHeadings, gifts: content.sectionHeadings?.gifts ?? defaults.content.sectionHeadings?.gifts };
    });
    replace(!config.content.sectionHeadings?.social_features, () => {
      content.sectionHeadings = { ...content.sectionHeadings, social_features: defaults.content.sectionHeadings?.social_features };
    });
  }
  replace(templateId === 'golden-jubilee' && config.theme.fonts.headingFont === 'Playfair Display', () => {
    updated.theme.fonts.headingFont = defaults.theme.fonts.headingFont;
  });
  replace(templateId === 'fiesta-kids-adventure' && config.theme.colors.accentPrimary === '#FF6B6B', () => {
    updated.theme.colors.accentPrimary = defaults.theme.colors.accentPrimary;
    updated.theme.envelope.sealColor = defaults.theme.envelope.sealColor;
  });
  replace(templateId === 'celestial-baptism' && config.theme.colors.accentPrimary === '#C9A96E', () => {
    updated.theme.colors.accentPrimary = defaults.theme.colors.accentPrimary;
    updated.theme.envelope.sealColor = defaults.theme.envelope.sealColor;
  });

  return changed ? updated : config;
}
