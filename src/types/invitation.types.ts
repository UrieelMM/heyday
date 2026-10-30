export type EventCategory =
  | 'wedding'
  | 'xv_years'
  | 'adult_birthday'
  | 'kids_birthday'
  | 'baptism_communion'
  | 'baby_shower'
  | 'graduation_gala';

export type TemplateId =
  | 'eternal-elegance'
  | 'boho-terracotta'
  | 'modern-minimal-noir'
  | 'royal-xv-enchanted'
  | 'neon-xv-euphoria'
  | 'golden-jubilee'
  | 'fiesta-kids-adventure'
  | 'celestial-baptism'
  | 'sweet-oh-baby'
  | 'grad-gala-night'
  | 'marea-azul'
  | 'ritmo-de-dos'
  | 'mini-cosmos'
  | 'atelier-xv';

export type EnvelopeVariant =
  | 'wax-seal-classic'
  | 'editorial-curtain'
  | 'pass-ticket-tear';

export type AmbientEffect =
  | 'none'
  | 'gold-sparkles'
  | 'white-petals'
  | 'soft-stars'
  | 'confetti';

export type SectionId =
  | 'hero'
  | 'quote_story'
  | 'vip_parents'
  | 'countdown'
  | 'locations'
  | 'timeline'
  | 'gallery'
  | 'dress_code'
  | 'gifts'
  | 'accommodation'
  | 'social_features'
  | 'rsvp';

export type RsvpMode = 'closed_list' | 'open_registration';
export type RsvpStatus = 'pending' | 'viewed' | 'confirmed' | 'declined';

export interface InvitationConfig {
  theme: {
    colors: {
      bgPrimary: string;
      bgSecondary: string;
      textPrimary: string;
      textMuted: string;
      accentPrimary: string;
      accentSecondary: string;
    };
    fonts: {
      headingFont: string;
      scriptFont: string;
      bodyFont: string;
    };
    envelope: {
      variant: EnvelopeVariant;
      sealMonogram: string;
      sealColor: string;
      openButtonText: string;
    };
    ambientEffect: AmbientEffect;
  };
  audio: {
    enabled: boolean;
    trackUrl: string;
    trackTitle?: string;
    startSecond?: number;
    autoplayOnEnvelopeOpen: boolean;
  };
  sectionsOrder: Array<{
    id: SectionId;
    enabled: boolean;
  }>;
  content: {
    sectionHeadings?: Partial<Record<SectionId, { eyebrow?: string; title?: string }>>;
    hero: {
      badgeText: string;
      mainTitle: string;
      tagline: string;
      coverImageUrl: string;
      coverVideoUrl?: string;
      focalPoint: { x: number; y: number };
    };
    quoteStory: {
      quoteText: string;
      quoteAuthor?: string;
      storyBlocks?: Array<{
        title: string;
        description: string;
        imageUrl?: string;
      }>;
    };
    vipParents: {
      blessingMessage: string;
      groups: Array<{
        groupTitle: string;
        names: string[];
      }>;
    };
    locations: Array<{
      id: string;
      type: 'religious_ceremony' | 'civil_ceremony' | 'reception' | 'after_party';
      title: string;
      venueName: string;
      time: string;
      address: string;
      imageUrl?: string;
      coordinates: { lat: number; lng: number };
      googleMapsUrl: string;
      wazeUrl: string;
    }>;
    timeline: Array<{
      id: string;
      time: string;
      title: string;
      description?: string;
      icon:
        | 'church'
        | 'rings'
        | 'cocktail'
        | 'dinner'
        | 'waltz'
        | 'party'
        | 'cake'
        | 'car';
    }>;
    gallery: {
      layout: 'bento-grid' | 'polaroid-scatter' | 'cinema-slider';
      images: Array<{
        url: string;
        caption?: string;
        aspectRatio?: number;
      }>;
    };
    dressCode: {
      title: string;
      womenNotes: string;
      menNotes: string;
      reservedColors: Array<{ name: string; hex: string }>;
      reservedNote: string;
      pinterestBoardUrl?: string;
    };
    gifts: {
      introMessage: string;
      registries: Array<{
        storeName: string;
        eventNumber?: string;
        url: string;
      }>;
      bankTransfer?: {
        enabled: boolean;
        bankName: string;
        accountHolder: string;
        clabe: string;
        accountNumber?: string;
        conceptNote?: string;
      };
      cashEnvelopeAtVenue: boolean;
    };
    accommodation: Array<{
      hotelName: string;
      distanceNote: string;
      discountCode?: string;
      bookingUrl?: string;
      phone?: string;
    }>;
    socialFeatures: {
      enableSongRequests: boolean;
      enableAudioGuestbook: boolean;
      enableLiveDisposableCamera: boolean;
      hashtag?: string;
    };
    rsvp: {
      askDietaryRestrictions: boolean;
      allowChildrenSelection: boolean;
      customConfirmationMessage: string;
      plannerContactWhatsapp?: string;
    };
  };
}

export interface GuestGroup {
  id: string;
  eventId: string;
  guestToken: string;
  groupName: string;
  whatsappPhone?: string;
  email?: string;
  groupTag?: string;
  allocatedAdults: number;
  allocatedChildren: number;
  rsvpStatus: RsvpStatus;
  confirmedAdults: number;
  confirmedChildren: number;
  dietaryNotes?: string;
  guestMessage?: string;
  tableName?: string;
  checkedInCount: number;
}

export interface EventInvitation {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  templateId: TemplateId;
  status: 'draft' | 'published' | 'archived';
  eventDate: string;
  timezone: string;
  rsvpMode: RsvpMode;
  rsvpDeadlineAt?: string;
  maxGuestsPerOpenRsvp: number;
  viewsCount: number;
  config: InvitationConfig;
}
