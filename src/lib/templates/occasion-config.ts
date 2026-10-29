import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type OccasionTemplateId = Extract<
  TemplateId,
  'sweet-oh-baby' | 'grad-gala-night'
>;

export function isOccasionTemplateId(id: TemplateId): id is OccasionTemplateId {
  return id === 'sweet-oh-baby' || id === 'grad-gala-night';
}

export const occasionSectionCopy: Record<
  OccasionTemplateId,
  {
    countdownEyebrow: string;
    countdownTitle: string;
    locationEyebrow: string;
    locationTitle: string;
    timelineEyebrow: string;
    timelineTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    dressEyebrow: string;
    dressLeft: string;
    dressRight: string;
    giftsTitle: string;
  }
> = {
  'sweet-oh-baby': {
    countdownEyebrow: 'La dulce espera',
    countdownTitle: 'Cada día falta un poquito menos',
    locationEyebrow: 'Nuestro punto de encuentro',
    locationTitle: 'Una tarde para celebrar',
    timelineEyebrow: 'Pequeños momentos',
    timelineTitle: 'El plan de la tarde',
    galleryEyebrow: 'Luna, papel y ternura',
    galleryTitle: 'Un mundo listo para recibirte',
    dressEyebrow: 'Paleta de la celebración',
    dressLeft: 'Looks fluidos',
    dressRight: 'Looks relajados',
    giftsTitle: 'Detalles para el bebé',
  },
  'grad-gala-night': {
    countdownEyebrow: 'Commencement countdown',
    countdownTitle: 'La generación toma el escenario en',
    locationEyebrow: 'The venue',
    locationTitle: 'Donde comienza la noche',
    timelineEyebrow: 'Order of ceremony',
    timelineTitle: 'El protocolo de la gala',
    galleryEyebrow: 'Legacy in the making',
    galleryTitle: 'Símbolos de una meta cumplida',
    dressEyebrow: 'Evening protocol',
    dressLeft: 'Invitadas',
    dressRight: 'Invitados',
    giftsTitle: 'Detalles',
  },
};

function isGenericDemoTitle(title: string) {
  return /^(?:nuestra celebraci[oó]n|mi celebraci[oó]n)$/i.test(title.trim());
}

export function occasionDisplayTitle(id: OccasionTemplateId, title: string) {
  if (!isGenericDemoTitle(title)) return title;
  return id === 'sweet-oh-baby' ? 'Baby en camino' : 'Generación 2026';
}

export function applyOccasionDefaults(
  config: InvitationConfig,
  id: OccasionTemplateId,
  rawTitle: string
) {
  const title = occasionDisplayTitle(id, rawTitle);
  config.audio.enabled = false;
  config.content.accommodation = [];
  config.content.rsvp.customConfirmationMessage =
    'Este pase es una vista previa local. La asistencia aún no se ha enviado.';

  if (id === 'sweet-oh-baby') {
    config.sectionsOrder = config.sectionsOrder.map((section) => ({
      ...section,
      enabled: section.id === 'accommodation' ? false : section.enabled,
    }));
    config.theme.envelope.sealMonogram = '☾';
    config.content.hero = {
      ...config.content.hero,
      mainTitle: title,
      badgeText: 'UN PEQUEÑO MILAGRO',
      tagline: 'Luna, abrazos y una dulce espera que queremos compartir contigo',
      coverImageUrl: '/images/sweet-oh-baby/nursery-mobile.jpg',
      focalPoint: { x: 50, y: 45 },
    };
    config.content.quoteStory = {
      quoteText:
        'Hay una nueva vida creciendo, y con ella crecen también nuestros sueños, la emoción y todo el amor que ya la espera.',
      quoteAuthor: title,
      storyBlocks: [
        {
          title: 'Un deseo que florece',
          description:
            'Cada pequeño detalle de esta espera se ha convertido en una razón para sonreír.',
        },
        {
          title: 'Una tarde contigo',
          description:
            'Queremos guardar tus abrazos, consejos y buenos deseos como parte de sus primeros recuerdos.',
        },
      ],
    };
    config.content.vipParents = {
      blessingMessage:
        'Con mucha ilusión, quienes ya aman a este bebé te invitan a celebrar su llegada',
      groups: [
        { groupTitle: 'Mamá', names: ['Mariana'] },
        { groupTitle: 'Papá', names: ['Sebastián'] },
        { groupTitle: 'Con cariño', names: ['Familia y amistades'] },
      ],
    };
    config.content.locations = [
      {
        ...config.content.locations[1],
        id: 'baby-shower-afternoon',
        type: 'reception',
        title: 'Baby shower',
        venueName: 'Casa del Olivo',
        time: '13:00 HRS',
        address: 'San Miguel de Allende, Guanajuato',
        imageUrl: '/images/sweet-oh-baby/moon-table.jpg',
      },
    ];
    config.content.timeline = [
      {
        id: 'baby-1',
        time: '13:00 HRS',
        title: 'Abrazos de bienvenida',
        description: 'Llegada, fotos y un detalle para cada invitado.',
        icon: 'cocktail',
      },
      {
        id: 'baby-2',
        time: '14:00 HRS',
        title: 'Juegos y buenos deseos',
        description: 'Una pausa para imaginar, reír y compartir consejos.',
        icon: 'party',
      },
      {
        id: 'baby-3',
        time: '15:00 HRS',
        title: 'Mesa dulce',
        description: 'Pastel, brindis sin prisa y muchos recuerdos.',
        icon: 'cake',
      },
    ];
    config.content.gallery = {
      layout: 'polaroid-scatter',
      images: [
        {
          url: '/images/sweet-oh-baby/nursery-mobile.jpg',
          caption: 'Sueños que ya se mueven con la brisa',
        },
        {
          url: '/images/sweet-oh-baby/moon-table.jpg',
          caption: 'Una mesa para compartir la espera',
        },
      ],
    };
    config.content.dressCode = {
      title: 'Pasteles, lino y sonrisas',
      womenNotes:
        'Vestido, conjunto o look cómodo en tonos suaves y materiales naturales.',
      menNotes:
        'Camisa, polo o look casual pulido en tonos claros y cálidos.',
      reservedColors: [
        { name: 'Salvia', hex: '#8FB9A8' },
        { name: 'Durazno', hex: '#F4A28C' },
        { name: 'Cielo', hex: '#B7D8E8' },
      ],
      reservedNote: 'Una paleta sugerida, nunca una regla: ven como te sientas tú.',
    };
    config.content.gifts = {
      introMessage:
        'Tu compañía y tus buenos deseos son el mejor regalo. Si quieres sumar un detalle, estas opciones son una guía sencilla.',
      registries: [
        { storeName: 'Mesa para el bebé', url: 'https://www.amazon.com.mx/baby-reg' },
      ],
      cashEnvelopeAtVenue: false,
    };
    config.content.socialFeatures = {
      enableSongRequests: false,
      enableAudioGuestbook: true,
      enableLiveDisposableCamera: true,
      hashtag: '#DulceEspera',
    };
    config.content.rsvp.allowChildrenSelection = true;
    return;
  }

  config.sectionsOrder = config.sectionsOrder.map((section) => ({
    ...section,
    enabled: ['vip_parents', 'gifts', 'accommodation'].includes(section.id)
      ? false
      : section.enabled,
  }));
  config.theme.envelope.sealMonogram = '26';
  config.content.hero = {
    ...config.content.hero,
    mainTitle: title,
    badgeText: 'COMMENCEMENT · GALA 2026',
    tagline: 'Una meta conquistada · una noche para honrar el camino',
    coverImageUrl: '/images/grad-gala-night/prestige-stage.jpg',
    focalPoint: { x: 50, y: 46 },
  };
  config.content.quoteStory = {
    quoteText:
      'No llegamos hasta aquí por casualidad: cada desvelo, cada reto y cada persona que caminó a nuestro lado forman parte de este logro.',
    quoteAuthor: title,
    storyBlocks: [
      {
        title: 'El camino recorrido',
        description:
          'Años de trabajo, aprendizajes y amistades que transformaron una generación.',
      },
      {
        title: 'Lo que sigue',
        description:
          'La ceremonia termina; la ambición, la curiosidad y nuestra historia apenas comienzan.',
      },
    ],
  };
  config.content.vipParents = { blessingMessage: '', groups: [] };
  config.content.locations = [
    {
      ...config.content.locations[1],
      id: 'grad-gala-stage',
      type: 'reception',
      title: 'Ceremonia y cena de gala',
      venueName: 'Gran Salón Metropolitano',
      time: '18:30 HRS',
      address: 'Ciudad de México',
      imageUrl: '/images/grad-gala-night/prestige-stage.jpg',
    },
  ];
  config.content.timeline = [
    {
      id: 'grad-1',
      time: '18:30 HRS',
      title: 'Acceso y registro',
      description: 'Presenta tu pase QR y toma tu lugar en el salón.',
      icon: 'car',
    },
    {
      id: 'grad-2',
      time: '19:15 HRS',
      title: 'Ceremonia de graduación',
      description: 'Reconocimientos y entrega de diplomas.',
      icon: 'party',
    },
    {
      id: 'grad-3',
      time: '20:30 HRS',
      title: 'Último pase de lista',
      description: 'Un momento para nombrar lo que construimos juntos.',
      icon: 'waltz',
    },
    {
      id: 'grad-4',
      time: '21:00 HRS',
      title: 'Cena y brindis',
      description: 'Por los logros de hoy y los proyectos que siguen.',
      icon: 'dinner',
    },
    {
      id: 'grad-5',
      time: '22:30 HRS',
      title: 'After party',
      description: 'La generación toma la pista.',
      icon: 'party',
    },
  ];
  config.content.gallery = {
    layout: 'cinema-slider',
    images: [
      {
        url: '/images/grad-gala-night/prestige-stage.jpg',
        caption: 'El escenario de una meta cumplida',
      },
      {
        url: '/images/grad-gala-night/regalia-still-life.jpg',
        caption: 'Tradición, disciplina y futuro',
      },
    ],
  };
  config.content.dressCode = {
    title: 'Black tie · Gala académica',
    womenNotes: 'Vestido largo o conjunto de noche con líneas sobrias.',
    menNotes: 'Smoking o traje oscuro, camisa formal y calzado de vestir.',
    reservedColors: [{ name: 'Oro académico', hex: '#D4AF37' }],
    reservedNote:
      'El oro académico se reserva para los distintivos de la generación y el protocolo.',
  };
  config.content.gifts = {
    introMessage: '',
    registries: [],
    cashEnvelopeAtVenue: false,
  };
  config.content.socialFeatures = {
    enableSongRequests: true,
    enableAudioGuestbook: true,
    enableLiveDisposableCamera: true,
    hashtag: '#Generacion2026',
  };
  config.content.rsvp.allowChildrenSelection = false;
}
