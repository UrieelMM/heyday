import { z } from 'zod';

export const invitationConfigSchema = z.object({
  theme: z.object({
    colors: z.object({
      bgPrimary: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      bgSecondary: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      textPrimary: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      textMuted: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      accentPrimary: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      accentSecondary: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
    }),
    fonts: z.object({
      headingFont: z.string().min(1),
      scriptFont: z.string().min(1),
      bodyFont: z.string().min(1),
    }),
    envelope: z.object({
      variant: z.enum(['wax-seal-classic', 'editorial-curtain', 'pass-ticket-tear']),
      sealMonogram: z.string().max(12),
      sealColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      openButtonText: z.string().min(1).max(80),
    }),
    ambientEffect: z.enum([
      'none',
      'gold-sparkles',
      'white-petals',
      'soft-stars',
      'confetti',
    ]),
  }),
  audio: z.object({
    enabled: z.boolean(),
    trackUrl: z.string(),
    trackTitle: z.string().optional(),
    startSecond: z.number().min(0).optional(),
    autoplayOnEnvelopeOpen: z.boolean(),
  }),
  sectionsOrder: z.array(
    z.object({
      id: z.enum([
        'hero',
        'quote_story',
        'vip_parents',
        'countdown',
        'locations',
        'timeline',
        'gallery',
        'dress_code',
        'gifts',
        'accommodation',
        'social_features',
        'rsvp',
      ]),
      enabled: z.boolean(),
    })
  ),
  content: z.object({
    sectionHeadings: z.record(z.enum(['hero', 'quote_story', 'vip_parents', 'countdown', 'locations', 'timeline', 'gallery', 'dress_code', 'gifts', 'accommodation', 'social_features', 'rsvp']), z.object({ eyebrow: z.string().max(120).optional(), title: z.string().max(160).optional() })).optional(),
    hero: z.object({
      badgeText: z.string(),
      mainTitle: z.string().min(1),
      tagline: z.string(),
      coverImageUrl: z.string(),
      coverVideoUrl: z.string().optional(),
      focalPoint: z.object({
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
      }),
    }),
    quoteStory: z.object({
      quoteText: z.string(),
      quoteAuthor: z.string().optional(),
      storyBlocks: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            imageUrl: z.string().optional(),
          })
        )
        .optional(),
    }),
    vipParents: z.object({
      blessingMessage: z.string(),
      groups: z.array(
        z.object({
          groupTitle: z.string(),
          names: z.array(z.string()),
        })
      ),
    }),
    locations: z.array(
      z.object({
        id: z.string(),
        type: z.enum([
          'religious_ceremony',
          'civil_ceremony',
          'reception',
          'after_party',
        ]),
        title: z.string(),
        venueName: z.string(),
        time: z.string(),
        address: z.string(),
        imageUrl: z.string().optional(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        googleMapsUrl: z.string(),
        wazeUrl: z.string(),
      })
    ),
    timeline: z.array(
      z.object({
        id: z.string(),
        time: z.string(),
        title: z.string(),
        description: z.string().optional(),
        icon: z.enum([
          'church',
          'rings',
          'cocktail',
          'dinner',
          'waltz',
          'party',
          'cake',
          'car',
        ]),
      })
    ),
    gallery: z.object({
      layout: z.enum(['bento-grid', 'polaroid-scatter', 'cinema-slider']),
      images: z.array(
        z.object({
          url: z.string(),
          caption: z.string().optional(),
          aspectRatio: z.number().optional(),
        })
      ),
    }),
    dressCode: z.object({
      title: z.string(),
      womenNotes: z.string(),
      menNotes: z.string(),
      reservedColors: z.array(
        z.object({
          name: z.string(),
          hex: z.string(),
        })
      ),
      reservedNote: z.string(),
      pinterestBoardUrl: z.string().optional(),
    }),
    gifts: z.object({
      introMessage: z.string(),
      registries: z.array(
        z.object({
          storeName: z.string(),
          eventNumber: z.string().optional(),
          url: z.string(),
        })
      ),
      bankTransfer: z
        .object({
          enabled: z.boolean(),
          bankName: z.string(),
          accountHolder: z.string(),
          clabe: z.string(),
          accountNumber: z.string().optional(),
          conceptNote: z.string().optional(),
        })
        .optional(),
      cashEnvelopeAtVenue: z.boolean(),
    }),
    accommodation: z.array(
      z.object({
        hotelName: z.string(),
        distanceNote: z.string(),
        discountCode: z.string().optional(),
        bookingUrl: z.string().optional(),
        phone: z.string().optional(),
      })
    ),
    socialFeatures: z.object({
      enableSongRequests: z.boolean(),
      enableAudioGuestbook: z.boolean(),
      enableLiveDisposableCamera: z.boolean(),
      hashtag: z.string().optional(),
    }),
    rsvp: z.object({
      askDietaryRestrictions: z.boolean(),
      allowChildrenSelection: z.boolean(),
      customConfirmationMessage: z.string(),
      plannerContactWhatsapp: z.string().optional(),
    }),
  }),
});

export const rsvpSubmissionSchema = z.object({
  guestToken: z.string().optional(),
  groupName: z.string().min(2, 'Ingresa tu nombre o familia'),
  whatsappPhone: z.string().optional(),
  willAttend: z.boolean(),
  confirmedAdults: z.number().int().min(0).max(20),
  confirmedChildren: z.number().int().min(0).max(20),
  dietaryNotes: z.string().max(400).optional(),
  guestMessage: z.string().max(600).optional(),
});

export type RsvpSubmissionInput = z.infer<typeof rsvpSubmissionSchema>;
