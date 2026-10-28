import type {
  AmbientEffect,
  EnvelopeVariant,
  EventCategory,
  InvitationConfig,
  TemplateId,
} from '@/types/invitation.types';

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
      'Orgánica y cálida con tonos terracota, verde salvia y arena, texturas de papel algodón e ilustraciones botánicas.',
    signatureAnimation: 'Botanical Sway + Polaroid Stack',
    previewImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
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
      'Blanco y negro de alto contraste con estética de revista editorial, tipografía cinética y carrusel horizontal.',
    signatureAnimation: 'Theme Inversion + Horizontal Pin Scroll',
    previewImage:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
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
      scriptFont: 'Pinyon Script',
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
      'Romántica e imperial en rosa cuarzo, oro rosa metálico y ciruela, con partículas de destellos dorados y cortejo de honor.',
    signatureAnimation: 'Golden Sparkle Canvas + SVG Crown Draw',
    previewImage:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80',
    colors: {
      bgPrimary: '#FFF9FB',
      bgSecondary: '#F9EBEF',
      textPrimary: '#2D1920',
      textMuted: '#734F5A',
      accentPrimary: '#D4AF37',
      accentSecondary: '#B76E79',
    },
    fonts: {
      headingFont: 'Cinzel',
      scriptFont: 'Great Vibes',
      bodyFont: 'Plus Jakarta Sans',
    },
    envelopeVariant: 'wax-seal-classic',
    ambientEffect: 'gold-sparkles',
  },
  {
    id: 'neon-xv-euphoria',
    name: 'Neon XV Euphoria',
    category: 'xv_years',
    categoryLabel: 'XV Años Moderno / Nocturno',
    badge: 'Tendencia Nocturna',
    description:
      'Estética glassmorphism sobre fondo midnight con acentos magenta y cian eléctrico, pase VIP y playlist interactiva.',
    signatureAnimation: 'Neon Glow Scrub + VIP Ticket Tear',
    previewImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
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
      scriptFont: 'Great Vibes',
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
      'Sofisticación Art Déco en negro ónix y dorado imperial con burbujas ascendentes y números monumentales con parallax.',
    signatureAnimation: 'Champagne Bubbles + Monumental Parallax',
    previewImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    colors: {
      bgPrimary: '#0D0D0D',
      bgSecondary: '#171614',
      textPrimary: '#F5F0E6',
      textMuted: '#A39B8B',
      accentPrimary: '#E5C158',
      accentSecondary: '#9E7B4F',
    },
    fonts: {
      headingFont: 'Playfair Display',
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
      'Diseño alegre estilo Bento con tarjetas redondeadas, animaciones con rebote elástico y explosión de confeti al abrir.',
    signatureAnimation: 'Elastic Bento Bounce + Confetti Burst',
    previewImage:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
    colors: {
      bgPrimary: '#FFFDF7',
      bgSecondary: '#FFF3D6',
      textPrimary: '#1E293B',
      textMuted: '#64748B',
      accentPrimary: '#FF6B6B',
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
      'Etérea y luminosa en azul cielo empolvado, blanco nube y dorado suave, con protagonismo para padres y padrinos.',
    signatureAnimation: 'Soft Cloud Parallax + Olive Branch SVG',
    previewImage:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    colors: {
      bgPrimary: '#F8FAFC',
      bgSecondary: '#EDF4F8',
      textPrimary: '#1E2D3D',
      textMuted: '#5B7083',
      accentPrimary: '#C9A96E',
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
    badge: 'Incluye Votación Reveal',
    description:
      'Tonos pastel salvia y durazno cálido con módulo interactivo para que los invitados voten Team Niña o Team Niño.',
    signatureAnimation: 'Floating Nursery Elements + Live Poll',
    previewImage:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
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
    previewImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
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

  return {
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
}
