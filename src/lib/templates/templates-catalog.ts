import type {
  AmbientEffect,
  EnvelopeVariant,
  EventCategory,
  InvitationConfig,
  TemplateId,
} from '@/types/invitation.types';
import { applyCelebrationDefaults, isCelebrationTemplateId } from './celebration-config';
import { applyOccasionDefaults, isOccasionTemplateId } from './occasion-config';

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  category: EventCategory;
  categoryLabel: string;
  badge: string;
  description: string;
  signatureAnimation: string;
  previewImage: string;
  colors: InvitationConfig['theme']['colors'];
  fonts: InvitationConfig['theme']['fonts'];
  envelopeVariant: EnvelopeVariant;
  ambientEffect: AmbientEffect;
}

export const TEMPLATES_CATALOG: TemplateMetadata[] = [
  {
    id: 'eternal-elegance',
    name: 'Eternal Elegance',
    category: 'wedding',
    categoryLabel: 'Boda Clásica / Luxury',
    badge: 'Bestseller Bodas',
    description:
      'Una invitación de boda como pieza de papelería editorial: sobre nominal, arcos fotográficos, ilustración botánica y capítulos que se revelan al recorrerla.',
    signatureAnimation: 'Sobre de lacre + Scrollytelling botánico',
    previewImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    colors: {
      bgPrimary: '#FAF7F2',
      bgSecondary: '#F2ECE1',
      textPrimary: '#1E1B18',
      textMuted: '#6E655F',
      accentPrimary: '#C5A059',
      accentSecondary: '#8C7355',
    },
    fonts: {
      headingFont: 'Cormorant Garamond',
      scriptFont: 'Pinyon Script',
      bodyFont: 'Montserrat',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'gold-sparkles',
  },
  {
    id: 'boho-terracotta',
    name: 'Boho Terracotta',
    category: 'wedding',
    categoryLabel: 'Boda Jardín / Playa / Destino',
    badge: 'Ideal Bodas Destino',
    description:
      'Boda de jardín con luz de atardecer, papel cálido, botánicos dibujados y recuerdos en fotografías sueltas.',
    signatureAnimation: 'Sunlit Botanical Hero + Polaroid Scroll',
    previewImage: '/images/boho-terracotta/sunset-garden.jpg',
    colors: {
      bgPrimary: '#FBF6F0',
      bgSecondary: '#EFE5DC',
      textPrimary: '#2C221E',
      textMuted: '#6D5B53',
      accentPrimary: '#C86D51',
      accentSecondary: '#6B7F6E',
    },
    fonts: {
      headingFont: 'Playfair Display',
      scriptFont: 'Pinyon Script',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'white-petals',
  },
  {
    id: 'modern-minimal-noir',
    name: 'Modern Minimal Noir',
    category: 'wedding',
    categoryLabel: 'Boda Civil / Contemporánea',
    badge: 'Estilo Vogue',
    description:
      'Boda civil en blanco y negro como una edición de revista: grilla precisa, fotografía monocroma y titulares monumentales.',
    signatureAnimation: 'Editorial Cover Expansion + Monochrome Chapters',
    previewImage: '/images/modern-minimal-noir/civil-architecture.jpg',
    colors: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#0F0F0F',
      textPrimary: '#0A0A0A',
      textMuted: '#666666',
      accentPrimary: '#111111',
      accentSecondary: '#7A7A7A',
    },
    fonts: {
      headingFont: 'Cormorant Garamond',
      scriptFont: 'Cormorant Garamond',
      bodyFont: 'Inter',
    },
    envelopeVariant: 'editorial-curtain',
    ambientEffect: 'none',
  },
  {
    id: 'royal-xv-enchanted',
    name: 'Royal XV Enchanted',
    category: 'xv_years',
    categoryLabel: 'XV Años Gala Real',
    badge: 'Favorito XV Años',
    description:
      'Un jardín encantado de lavanda, ciruela y rosa empolvado: mariposas, destellos y una experiencia de XV años con carácter propio.',
    signatureAnimation: 'Cinematic XV Portal + Scroll Chapters',
    previewImage: '/images/royal-xv/enchanted-portal.jpg',
    colors: {
      bgPrimary: '#FAF5FA',
      bgSecondary: '#F1E5F2',
      textPrimary: '#35223F',
      textMuted: '#725D79',
      accentPrimary: '#9A5C86',
      accentSecondary: '#C88FA6',
    },
    fonts: {
      headingFont: 'Cinzel',
      scriptFont: 'Great Vibes',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'soft-stars',
  },
  {
    id: 'neon-xv-euphoria',
    name: 'Neon XV Euphoria',
    category: 'xv_years',
    categoryLabel: 'XV Años Moderno / Nocturno',
    badge: 'Tendencia Nocturna',
    description:
      'XV años como una noche de club: luces magenta y cian, tipografía eléctrica, órbitas luminosas y pase VIP.',
    signatureAnimation: 'Electric Orbit Reveal + VIP Ticket Exit',
    previewImage: '/images/neon-xv-euphoria/night-stage.jpg',
    colors: {
      bgPrimary: '#090614',
      bgSecondary: '#140E29',
      textPrimary: '#F8F7FF',
      textMuted: '#A39BBF',
      accentPrimary: '#FF2E93',
      accentSecondary: '#00F0FF',
    },
    fonts: {
      headingFont: 'Syne',
      scriptFont: 'Syne',
      bodyFont: 'Space Grotesk',
    },
    envelopeVariant: 'pass-ticket-tear',
    ambientEffect: 'soft-stars',
  },
  {
    id: 'golden-jubilee',
    name: 'Golden Jubilee',
    category: 'adult_birthday',
    categoryLabel: 'Cumpleaños 30s, 40s, 50s / Aniversario',
    badge: 'Gala Nocturna',
    description:
      'Cumpleaños adulto de gala inspirado en la geometría Art Déco: un salón dorado se abre hacia el brindis de una vida.',
    signatureAnimation: 'Art Deco Frame Expansion + Golden Chapters',
    previewImage: '/images/golden-jubilee/deco-ballroom.jpg',
    colors: {
      bgPrimary: '#0D0D0D',
      bgSecondary: '#171614',
      textPrimary: '#F5F0E6',
      textMuted: '#A39B8B',
      accentPrimary: '#E5C158',
      accentSecondary: '#9E7B4F',
    },
    fonts: {
      headingFont: 'Cinzel',
      scriptFont: 'Pinyon Script',
      bodyFont: 'Inter',
    },
    envelopeVariant: 'editorial-curtain',
    ambientEffect: 'gold-sparkles',
  },
  {
    id: 'fiesta-kids-adventure',
    name: 'Fiesta Kids Adventure',
    category: 'kids_birthday',
    categoryLabel: 'Cumpleaños Infantil',
    badge: 'Interactivo',
    description:
      'Cumpleaños infantil como cuento de exploración en papel recortado: sol, camino y tarjetas llenas de juego.',
    signatureAnimation: 'Paper Adventure Hero + Playful Bento Scroll',
    previewImage: '/images/fiesta-kids-adventure/paper-adventure.jpg',
    colors: {
      bgPrimary: '#FFFDF7',
      bgSecondary: '#FFF3D6',
      textPrimary: '#1E293B',
      textMuted: '#64748B',
      accentPrimary: '#B84444',
      accentSecondary: '#4ECDC4',
    },
    fonts: {
      headingFont: 'Fredoka',
      scriptFont: 'Fredoka',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'pass-ticket-tear',
    ambientEffect: 'confetti',
  },
  {
    id: 'celestial-baptism',
    name: 'Celestial Grace',
    category: 'baptism_communion',
    categoryLabel: 'Bautizo / Primera Comunión',
    badge: 'Ceremonia Religiosa',
    description:
      'Bautizo o Primera Comunión con agua o cáliz, vela, lino blanco y ramas de olivo; una invitación luminosa centrada en la fe y la familia.',
    signatureAnimation: 'Baptismal Light Reveal + Olive Branch Scroll',
    previewImage: '/images/celestial-grace/baptism-font.jpg',
    colors: {
      bgPrimary: '#F8FAFC',
      bgSecondary: '#EDF4F8',
      textPrimary: '#1E2D3D',
      textMuted: '#5B7083',
      accentPrimary: '#80633B',
      accentSecondary: '#7FA6C4',
    },
    fonts: {
      headingFont: 'Cormorant Garamond',
      scriptFont: 'Great Vibes',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'soft-stars',
  },
  {
    id: 'sweet-oh-baby',
    name: 'Sweet Oh Baby!',
    category: 'baby_shower',
    categoryLabel: 'Baby Shower / Gender Reveal',
    badge: 'Móvil de Ensueño',
    description:
      'Baby shower editorial en salvia y durazno, con un móvil artesanal que flota y se abre hacia una tarde llena de buenos deseos.',
    signatureAnimation: 'Floating Nursery Mobile + Paper Chapters',
    previewImage: '/images/sweet-oh-baby/nursery-mobile.jpg',
    colors: {
      bgPrimary: '#FCF9F5',
      bgSecondary: '#F2EFE9',
      textPrimary: '#3D352E',
      textMuted: '#7A6F66',
      accentPrimary: '#8FB9A8',
      accentSecondary: '#F4A28C',
    },
    fonts: {
      headingFont: 'Playfair Display',
      scriptFont: 'Great Vibes',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'white-petals',
  },
  {
    id: 'grad-gala-night',
    name: 'Grad & Gala Prestige',
    category: 'graduation_gala',
    categoryLabel: 'Graduación / Gala Corporativa',
    badge: 'Control QR Ejecutivo',
    description:
      'Solemne y ejecutiva en azul marino noche y oro académico, diseñada para cenas de graduación con control de boletos QR.',
    signatureAnimation: 'Academic Crest Reveal + Timeline Scrub',
    previewImage: '/images/grad-gala-night/prestige-stage.jpg',
    colors: {
      bgPrimary: '#0B132B',
      bgSecondary: '#1C2541',
      textPrimary: '#F8F9FA',
      textMuted: '#94A3B8',
      accentPrimary: '#D4AF37',
      accentSecondary: '#5BC0BE',
    },
    fonts: {
      headingFont: 'Cinzel',
      scriptFont: 'Pinyon Script',
      bodyFont: 'Inter',
    },
    envelopeVariant: 'pass-ticket-tear',
    ambientEffect: 'gold-sparkles',
  },
];

export function createDefaultInvitationConfig(
  templateId: TemplateId = 'eternal-elegance',
  customTitle = 'Sofía & Mateo'
): InvitationConfig {
  const tpl =
    TEMPLATES_CATALOG.find((t) => t.id === templateId) || TEMPLATES_CATALOG[0];

  const config: InvitationConfig = {
    theme: {
      colors: { ...tpl.colors },
      fonts: { ...tpl.fonts },
      envelope: {
        variant: tpl.envelopeVariant,
        sealMonogram:
          tpl.category === 'xv_years'
            ? 'XV'
            : customTitle
                .split(' ')
                .filter((w) => w.length > 1)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join(' & ') || 'S & M',
        sealColor: tpl.colors.accentPrimary,
        openButtonText: 'Toca el sello para abrir tu invitación',
      },
      ambientEffect: tpl.ambientEffect,
    },
    audio: {
      enabled: true,
      trackUrl:
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      trackTitle: 'Melodía Instrumental de Bienvenida',
      startSecond: 0,
      autoplayOnEnvelopeOpen: true,
    },
    sectionsOrder: [
      { id: 'hero', enabled: true },
      { id: 'quote_story', enabled: true },
      { id: 'vip_parents', enabled: true },
      { id: 'countdown', enabled: true },
      { id: 'locations', enabled: true },
      { id: 'timeline', enabled: true },
      { id: 'gallery', enabled: true },
      { id: 'dress_code', enabled: true },
      { id: 'gifts', enabled: true },
      { id: 'accommodation', enabled: true },
      { id: 'social_features', enabled: true },
      { id: 'rsvp', enabled: true },
    ],
    content: {
      hero: {
        badgeText:
          tpl.category === 'xv_years'
            ? 'MIS XV AÑOS'
            : tpl.category === 'wedding'
              ? '¡NOS CASAMOS!'
              : 'ESTÁS CORDIALMENTE INVITADO',
        mainTitle: customTitle,
        tagline: '24 de Octubre de 2026 • San Miguel de Allende, Gto.',
        coverImageUrl: tpl.previewImage,
        coverVideoUrl: '',
        focalPoint: { x: 50, y: 35 },
      },
      quoteStory: {
        quoteText:
          '“En el momento en que nuestros caminos se cruzaron, supimos que cada instante nos había traído hasta aquí. Queremos celebrar con ustedes el inicio de nuestro para siempre.”',
        quoteAuthor: customTitle,
        storyBlocks: [
          {
            title: 'Nuestro Comienzo',
            description:
              'Una tarde inolvidable llena de risas y complicidad que cambió nuestras vidas para siempre.',
          },
          {
            title: 'El Gran Día',
            description:
              'Hoy damos el siguiente paso rodeados de las personas que más amamos en el mundo.',
          },
        ],
      },
      vipParents: {
        blessingMessage:
          'Con la bendición de Dios y el amor incondicional de nuestros padres y padrinos',
        groups: [
          {
            groupTitle: 'Padres de la Novia',
            names: ['Sra. Elena Martínez de Villarreal', 'Sr. Alejandro Villarreal'],
          },
          {
            groupTitle: 'Padres del Novio',
            names: ['Sra. Lucía Fernández de Mendoza', 'Sr. Carlos Mendoza'],
          },
          {
            groupTitle: 'Padrinos de Honor',
            names: ['Sra. Mariana Villarreal', 'Ing. Roberto Domínguez'],
          },
        ],
      },
      locations: [
        {
          id: 'loc-ceremony',
          type: 'religious_ceremony',
          title: 'Ceremonia Religiosa',
          venueName: 'Parroquia de San Miguel Arcángel',
          time: '17:00 HRS',
          address: 'Principal S/N, Zona Centro, 37700 San Miguel de Allende, Gto.',
          imageUrl:
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
          coordinates: { lat: 20.9144, lng: -100.7439 },
          googleMapsUrl:
            'https://www.google.com/maps/search/?api=1&query=20.9144,-100.7439',
          wazeUrl: 'https://waze.com/ul?ll=20.9144,-100.7439&navigate=yes',
        },
        {
          id: 'loc-reception',
          type: 'reception',
          title: 'Recepción y Banquete',
          venueName: 'Hacienda Los Arcángeles',
          time: '19:30 HRS',
          address: 'Salida Real a Querétaro 189, Centro, San Miguel de Allende, Gto.',
          imageUrl:
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
          coordinates: { lat: 20.9092, lng: -100.7351 },
          googleMapsUrl:
            'https://www.google.com/maps/search/?api=1&query=20.9092,-100.7351',
          wazeUrl: 'https://waze.com/ul?ll=20.9092,-100.7351&navigate=yes',
        },
      ],
      timeline: [
        {
          id: 'tl-1',
          time: '17:00 HRS',
          title: 'Ceremonia Religiosa',
          description: 'Puntualidad agradecida en la Parroquia.',
          icon: 'church',
        },
        {
          id: 'tl-2',
          time: '19:00 HRS',
          title: 'Cóctel de Bienvenida',
          description: 'Mixología de autor y música de cuerdas en los jardines.',
          icon: 'cocktail',
        },
        {
          id: 'tl-3',
          time: '20:30 HRS',
          title: 'Cena de Gala',
          description: 'Banquete de cuatro tiempos y brindis de honor.',
          icon: 'dinner',
        },
        {
          id: 'tl-4',
          time: '22:00 HRS',
          title: 'Primer Baile y Fiesta',
          description: 'Apertura de pista con DJ y sorpresas toda la noche.',
          icon: 'party',
        },
      ],
      gallery: {
        layout: 'bento-grid',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
            caption: 'Nuestro compromiso',
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
            caption: 'Atardecer en San Miguel',
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
            caption: 'Por siempre juntos',
          },
          {
            url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80',
            caption: 'Cuenta regresiva',
          },
        ],
      },
      dressCode: {
        title: 'Etiqueta Formal Rigurosa',
        womenNotes: 'Vestido largo de noche (evitar tonos claros o marfil).',
        menNotes: 'Smoking o traje formal oscuro con corbata.',
        reservedColors: [
          { name: 'Blanco', hex: '#FFFFFF' },
          { name: 'Marfil', hex: '#FAF0E6' },
          { name: 'Champagne', hex: '#F7E7CE' },
        ],
        reservedNote:
          'Los tonos blanco, marfil y champagne están reservados exclusivamente para los festejados.',
        pinterestBoardUrl: 'https://www.pinterest.com',
      },
      gifts: {
        introMessage:
          'Su presencia en este día tan especial es nuestro mejor regalo. Si desean tener un detalle adicional con nosotros, ponemos a su disposición nuestras opciones:',
        registries: [
          {
            storeName: 'Liverpool',
            eventNumber: 'Evento #51489203',
            url: 'https://mesaderegalos.liverpool.com.mx',
          },
          {
            storeName: 'Amazon Mesa de Regalos',
            eventNumber: 'ID #SOFIA-MATEO-26',
            url: 'https://www.amazon.com.mx/wedding',
          },
        ],
        bankTransfer: {
          enabled: true,
          bankName: 'BBVA México',
          accountHolder: 'Sofía Villarreal / Mateo Mendoza',
          clabe: '012180015482910482',
          accountNumber: '1548 2910 48',
          conceptNote: 'Regalo Boda + Tu Nombre',
        },
        cashEnvelopeAtVenue: true,
      },
      accommodation: [
        {
          hotelName: 'Hotel Real de Minas San Miguel',
          distanceNote: 'A 4 minutos de la recepción',
          discountCode: 'BODASOFIA26',
          bookingUrl: 'https://www.google.com/maps',
          phone: '+52 415 152 2626',
        },
        {
          hotelName: 'Rosewood San Miguel de Allende',
          distanceNote: 'A 6 minutos de la parroquia',
          discountCode: 'SOFIAYMATEO',
          bookingUrl: 'https://www.google.com/maps',
          phone: '+52 415 152 9700',
        },
      ],
      socialFeatures: {
        enableSongRequests: true,
        enableAudioGuestbook: true,
        enableLiveDisposableCamera: true,
        hashtag: '#SofiaYMateo2026',
      },
      rsvp: {
        askDietaryRestrictions: true,
        allowChildrenSelection: true,
        customConfirmationMessage:
          '¡Gracias por confirmar! Aquí tienes tu Pase Digital VIP con código QR. Guárdalo en tu celular para mostrarlo en la recepción.',
        plannerContactWhatsapp: '+5215512345678',
      },
    },
  };

  if (isCelebrationTemplateId(templateId)) {
    applyCelebrationDefaults(config, templateId, customTitle);
  }

  if (isOccasionTemplateId(templateId)) {
    applyOccasionDefaults(config, templateId, customTitle);
  }

  if (templateId === 'boho-terracotta') {
    config.content.hero = {
      ...config.content.hero,
      badgeText: 'NUESTRO GRAN DÍA',
      tagline: 'Entre jardines y atardeceres · San Miguel de Allende',
      focalPoint: { x: 50, y: 45 },
    };
    config.content.quoteStory = {
      quoteText: 'Nuestro amor creció entre caminos inesperados. Hoy queremos celebrarlo a cielo abierto, rodeados de quienes lo hicieron florecer.',
      quoteAuthor: customTitle,
      storyBlocks: [
        { title: 'Donde comenzó', description: 'Una historia sencilla, hecha de conversaciones largas, viajes y tardes compartidas.' },
        { title: 'Lo que viene', description: 'Un nuevo camino que queremos empezar con ustedes cerca de nosotros.' },
      ],
    };
    config.content.vipParents.blessingMessage = 'Con el amor de nuestras familias, celebramos esta nueva etapa';
    config.content.locations = [{
      ...config.content.locations[1], id: 'boho-garden', type: 'reception',
      title: 'Ceremonia y celebración al aire libre', time: '17:00 HRS',
      imageUrl: '/images/boho-terracotta/sunset-garden.jpg',
    }];
    config.content.timeline = [
      { id: 'boho-1', time: '17:00 HRS', title: 'Ceremonia entre jardines', description: 'Nos encontramos bajo la luz de la tarde.', icon: 'rings' },
      { id: 'boho-2', time: '18:30 HRS', title: 'Brindis al atardecer', description: 'Un momento para abrazarnos y compartir.', icon: 'cocktail' },
      { id: 'boho-3', time: '20:00 HRS', title: 'Cena y baile', description: 'La celebración continúa alrededor de la mesa y la pista.', icon: 'dinner' },
    ];
    config.content.gallery = {
      layout: 'polaroid-scatter',
      images: [
        { url: '/images/boho-terracotta/sunset-garden.jpg', caption: 'Un lugar para encontrarnos' },
        { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', caption: 'Pequeños instantes' },
        { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', caption: 'Nuestro lugar favorito' },
      ],
    };
    config.content.dressCode = {
      title: 'Elegante y natural', womenNotes: 'Vestido fluido o conjunto elegante; recomendamos calzado cómodo para jardín.',
      menNotes: 'Traje ligero o saco con pantalón de vestir.',
      reservedColors: [{ name: 'Marfil', hex: '#FAF0E6' }, { name: 'Blanco', hex: '#FFFFFF' }],
      reservedNote: 'El blanco y el marfil están reservados para la pareja.',
    };
    config.content.socialFeatures.hashtag = '#SofiaYMateoAlAtardecer';
    config.content.socialFeatures.enableAudioGuestbook = false;
    config.content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';
  }

  if (templateId === 'modern-minimal-noir') {
    config.audio.enabled = false;
    config.content.hero = {
      ...config.content.hero,
      badgeText: 'THE WEDDING EDIT',
      tagline: 'Una celebración civil · San Miguel de Allende',
      focalPoint: { x: 50, y: 40 },
    };
    config.content.quoteStory = {
      quoteText: 'Entre todos los caminos posibles, elegimos recorrer el mismo. Este es nuestro sí, y queremos vivirlo contigo.',
      quoteAuthor: customTitle,
      storyBlocks: [
        { title: 'Capítulo uno', description: 'El encuentro que cambió nuestra manera de mirar el futuro.' },
        { title: 'Capítulo dos', description: 'Una fecha, una promesa y todas las personas que forman parte de nuestra historia.' },
      ],
    };
    config.content.vipParents.blessingMessage = 'Con nuestras familias y amigos como testigos de este momento';
    config.content.locations = [{
      ...config.content.locations[1], id: 'noir-civil', type: 'civil_ceremony',
      title: 'Ceremonia civil y recepción', time: '17:00 HRS',
      imageUrl: '/images/modern-minimal-noir/civil-architecture.jpg',
    }];
    config.content.timeline = [
      { id: 'noir-1', time: '17:00 HRS', title: 'El sí', description: 'Ceremonia civil.', icon: 'rings' },
      { id: 'noir-2', time: '18:30 HRS', title: 'El brindis', description: 'Cóctel y fotografías.', icon: 'cocktail' },
      { id: 'noir-3', time: '20:00 HRS', title: 'La noche', description: 'Cena, música y celebración.', icon: 'party' },
    ];
    config.content.gallery.layout = 'cinema-slider';
    config.content.gallery.images = config.content.gallery.images.slice(0, 3).map((image, index) => ({
      ...image, url: index === 0 ? '/images/modern-minimal-noir/civil-architecture.jpg' : image.url,
      caption: ['El encuentro', 'La historia', 'El futuro'][index],
    }));
    config.content.dressCode = {
      title: 'Black tie opcional', womenNotes: 'Vestido de noche o conjunto sastre en tonos oscuros.',
      menNotes: 'Smoking o traje negro con camisa formal.',
      reservedColors: [{ name: 'Blanco', hex: '#FFFFFF' }],
      reservedNote: 'El blanco está reservado para la pareja.',
    };
    config.content.socialFeatures = { enableSongRequests: false, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: '#SofiaYMateoEdit' };
    config.content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';
  }

  if (templateId === 'neon-xv-euphoria') {
    const quinceName = customTitle.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || customTitle;
    config.audio.enabled = false;
    config.content.hero = {
      ...config.content.hero,
      badgeText: 'MIS XV / ONE NIGHT ONLY',
      tagline: 'Una noche para brillar · San Miguel de Allende',
      focalPoint: { x: 50, y: 50 },
    };
    config.content.quoteStory = {
      quoteText: 'Quince años de música, amigos y momentos inolvidables. Ahora empieza mi noche favorita, y quiero que seas parte de ella.',
      quoteAuthor: quinceName,
      storyBlocks: [
        { title: 'Mi energía', description: 'Todo lo que soy y todo lo que sueño se encuentra en esta pista.' },
        { title: 'Nuestra noche', description: 'Bailar, reír y vivir un recuerdo que nos acompañe siempre.' },
      ],
    };
    config.content.vipParents = {
      blessingMessage: 'Con el amor de mi familia y la alegría de celebrar contigo',
      groups: [
        { groupTitle: 'Mis papás', names: ['Patricia Salazar', 'Alejandro Ríos'] },
        { groupTitle: 'Mis padrinos', names: ['Mariana Salazar', 'Roberto Ríos'] },
      ],
    };
    config.content.locations = [{
      ...config.content.locations[1], id: 'neon-party', type: 'reception',
      title: 'Mi fiesta de XV años', time: '19:00 HRS',
      imageUrl: '/images/neon-xv-euphoria/night-stage.jpg',
    }];
    config.content.timeline = [
      { id: 'neon-1', time: '19:00 HRS', title: 'Check-in VIP', description: 'Llega, saluda y prepárate para brillar.', icon: 'party' },
      { id: 'neon-2', time: '20:00 HRS', title: 'Mi entrada', description: 'El momento de encender la noche.', icon: 'waltz' },
      { id: 'neon-3', time: '21:00 HRS', title: 'La pista es nuestra', description: 'DJ, luces y nuestras canciones favoritas.', icon: 'party' },
    ];
    config.content.gallery = {
      layout: 'cinema-slider',
      images: [
        { url: '/images/neon-xv-euphoria/night-stage.jpg', caption: 'Luces de la noche' },
        { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80', caption: 'La música' },
        { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80', caption: 'Todos juntos' },
      ],
    };
    config.content.dressCode = {
      title: 'Glow party', womenNotes: 'Look de noche con un detalle neón, metálico o brillante.',
      menNotes: 'Look formal de noche con un acento de color o brillo.',
      reservedColors: [{ name: 'Magenta', hex: '#FF2E93' }],
      reservedNote: 'El magenta es el color protagonista de la quinceañera.',
    };
    config.content.gifts = {
      introMessage: 'Tu presencia es el mejor regalo. Si quieres tener un detalle, habrá un espacio para lluvia de sobres durante la fiesta.',
      registries: [], cashEnvelopeAtVenue: true,
    };
    config.content.accommodation = [];
    config.content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: `#XV${quinceName.replace(/\s+/g, '')}` };
    config.content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';
  }

  if (templateId === 'royal-xv-enchanted') {
    const quinceName = customTitle.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || customTitle;
    const venueAddress = 'Vizcaínas 21, Centro Histórico, 06080 Ciudad de México';
    const mapQuery = encodeURIComponent(`Colegio de las Vizcaínas, ${venueAddress}`);
    config.content.hero = {
      ...config.content.hero,
      badgeText: 'UNA NOCHE PARA RECORDAR',
      tagline: 'Una noche de ensueño • Ciudad de México',
      coverImageUrl: '/images/royal-xv/enchanted-portal.jpg',
      focalPoint: { x: 50, y: 46 },
    };
    config.content.quoteStory = {
      quoteText: 'Hay momentos que parecen sacados de un cuento. Este es el comienzo de uno que quiero vivir contigo.',
      quoteAuthor: quinceName,
      storyBlocks: [
        { title: 'Un nuevo capítulo', description: 'Quince años de sueños, aventuras y personas que han hecho mi mundo más bonito.' },
        { title: 'Mi noche especial', description: 'Una celebración para bailar, reír y crear recuerdos que duren para siempre.' },
      ],
    };
    config.content.vipParents = {
      blessingMessage: 'Con el amor de mi familia y la alegría de compartir este momento contigo',
      groups: [
        { groupTitle: 'Mis papás', names: ['Patricia Salazar', 'Alejandro Ríos'] },
        { groupTitle: 'Mis padrinos', names: ['Mariana Salazar', 'Roberto Ríos'] },
      ],
    };
    config.content.locations = [{
      id: 'loc-royal-xv', type: 'reception', title: 'Ceremonia y celebración',
      venueName: 'Colegio de las Vizcaínas', time: '18:00 HRS', address: venueAddress,
      imageUrl: '/images/royal-xv/enchanted-garden.jpg',
      coordinates: { lat: 19.4285, lng: -99.1417 },
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      wazeUrl: `https://waze.com/ul?q=${mapQuery}&navigate=yes`,
    }];
    config.content.timeline = [
      { id: 'xv-1', time: '18:00 HRS', title: 'La bienvenida', description: 'Lleguen con tiempo para encontrarnos y tomar fotos.', icon: 'cocktail' },
      { id: 'xv-2', time: '19:00 HRS', title: 'Mi gran entrada', description: 'El momento que he esperado tanto tiempo.', icon: 'party' },
      { id: 'xv-3', time: '20:00 HRS', title: 'Vals y brindis', description: 'Un instante para compartir con quienes más quiero.', icon: 'waltz' },
      { id: 'xv-4', time: '21:00 HRS', title: '¡A bailar!', description: 'La pista es nuestra hasta que se apaguen las estrellas.', icon: 'party' },
    ];
    config.content.gallery = {
      layout: 'polaroid-scatter',
      images: [
        { url: '/images/royal-xv/enchanted-garden.jpg', caption: 'Mi noche soñada' },
        { url: '/images/royal-xv/enchanted-details.jpg', caption: 'Los pequeños detalles' },
        { url: '/images/royal-xv/enchanted-ballroom.jpg', caption: 'Una fiesta para recordar' },
      ],
    };
    config.content.dressCode = {
      title: 'Formal, con un toque de magia', womenNotes: 'Vestido de noche o conjunto formal en el color que te haga sentir increíble.',
      menNotes: 'Traje formal o saco con tu mejor estilo.',
      reservedColors: [{ name: 'Lavanda', hex: '#B99ACB' }, { name: 'Lila', hex: '#8C6FA4' }],
      reservedNote: 'Los tonos lavanda y lila están reservados para la quinceañera.',
    };
    config.content.gifts = {
      introMessage: 'Tu compañía es mi regalo favorito. Si deseas tener un detalle, habrá un espacio para lluvia de sobres durante la celebración.',
      registries: [], cashEnvelopeAtVenue: true,
    };
    config.content.accommodation = [];
    config.content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: `#XV${quinceName.replace(/\s+/g, '')}` };
    config.content.rsvp.customConfirmationMessage = '¡Qué emoción que me acompañes! Guarda tu pase digital para mostrarlo al llegar.';
  }

  return config;
}
