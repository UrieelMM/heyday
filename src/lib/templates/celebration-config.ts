import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type CelebrationTemplateId = Extract<TemplateId, 'golden-jubilee' | 'fiesta-kids-adventure' | 'celestial-baptism'>;

export function isCelebrationTemplateId(id: TemplateId): id is CelebrationTemplateId {
  return id === 'golden-jubilee' || id === 'fiesta-kids-adventure' || id === 'celestial-baptism';
}

export function celebrationName(id: CelebrationTemplateId, title: string) {
  if (id === 'golden-jubilee') {
    return title.replace(/^(?:los\s+)?\d+\s+(?:años\s+)?de\s+/i, '').trim() || title;
  }
  if (id === 'fiesta-kids-adventure') {
    return title.match(/^¡?(.+?)\s+cumple\s+#?\d+/i)?.[1]?.trim()
      || title.replace(/^cumple\s*#?\d+\s+de\s+/i, '').trim()
      || title;
  }
  return title.replace(/^(?:mi\s+)?(?:bautizo|(?:primera\s+)?comuni[oó]n)\s*(?::|de)?\s*/i, '').trim() || title;
}

export function isFirstCommunion(title: string) {
  return /comuni[oó]n/i.test(title);
}

export function celebrationAge(id: CelebrationTemplateId, title: string) {
  if (id === 'celestial-baptism') return '';
  return title.match(/\b(\d{1,3})\b/)?.[1] || '';
}

export function applyCelebrationDefaults(config: InvitationConfig, id: CelebrationTemplateId, title: string) {
  const name = celebrationName(id, title);
  const age = celebrationAge(id, title);
  const communion = id === 'celestial-baptism' && isFirstCommunion(title);
  config.audio.enabled = false;
  config.content.accommodation = [];
  config.content.gifts = { introMessage: '', registries: [], cashEnvelopeAtVenue: false };
  config.content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';

  if (id === 'golden-jubilee') {
    config.sectionsOrder = config.sectionsOrder.map((section) => ({
      ...section,
      enabled: ['vip_parents', 'gifts', 'accommodation', 'social_features'].includes(section.id) ? false : section.enabled,
    }));
    config.content.hero = {
      ...config.content.hero,
      badgeText: 'UNA NOCHE PARA BRINDAR',
      tagline: 'Una vida de historias · una noche de celebración',
      focalPoint: { x: 50, y: 50 },
    };
    config.theme.envelope.sealMonogram = age || '✦';
    config.content.quoteStory = {
      quoteText: `${age ? `${age} años` : 'Una vida'} de momentos, aprendizajes y personas que han hecho cada capítulo inolvidable. Hoy quiero brindar contigo por todo lo vivido y por lo que viene.`,
      quoteAuthor: name,
      storyBlocks: [
        { title: 'Lo vivido', description: 'Cada encuentro, cada reto y cada alegría nos trajeron hasta esta noche.' },
        { title: 'El brindis', description: 'Una mesa compartida para celebrar la vida y las personas que la llenan de sentido.' },
      ],
    };
    config.content.vipParents = { blessingMessage: '', groups: [] };
    config.content.locations = [{
      ...config.content.locations[1], id: 'golden-gala', type: 'reception',
      title: 'Cena y celebración', time: '20:00 HRS', imageUrl: '/images/golden-jubilee/deco-ballroom.jpg',
    }];
    config.content.timeline = [
      { id: 'golden-1', time: '20:00 HRS', title: 'Recepción', description: 'Nos encontramos para comenzar una noche especial.', icon: 'cocktail' },
      { id: 'golden-2', time: '21:00 HRS', title: 'Cena', description: 'Buena conversación y un lugar en la mesa para ti.', icon: 'dinner' },
      { id: 'golden-3', time: '22:30 HRS', title: 'El gran brindis', description: 'Por los recuerdos que nos unen y los que aún esperan.', icon: 'party' },
    ];
    config.content.gallery = { layout: 'cinema-slider', images: [
      { url: '/images/golden-jubilee/deco-ballroom.jpg', caption: 'La noche que nos reúne' },
      { url: '/images/golden-jubilee/champagne-detail.jpg', caption: 'Un brindis por la vida' },
    ] };
    config.content.dressCode = {
      title: 'Etiqueta de gala', womenNotes: 'Vestido o conjunto formal para una celebración de noche.',
      menNotes: 'Traje oscuro o atuendo formal de noche.', reservedColors: [], reservedNote: '',
    };
    config.content.socialFeatures = { enableSongRequests: false, enableAudioGuestbook: false, enableLiveDisposableCamera: false };
    return;
  }

  if (id === 'fiesta-kids-adventure') {
    config.sectionsOrder = config.sectionsOrder.map((section) => ({
      ...section,
      enabled: section.id === 'accommodation' ? false : section.enabled,
    }));
    config.content.hero = {
      ...config.content.hero,
      badgeText: '¡MISIÓN CUMPLEAÑOS!',
      tagline: 'Juegos, pastel y un mundo por descubrir',
      coverImageUrl: '/images/fiesta-kids-adventure/hero-mobile.webp',
      focalPoint: { x: 50, y: 50 },
    };
    config.content.quoteStory = {
      quoteText: `¡La aventura de ${name} está por comenzar! Habrá juegos, risas, pastel y un montón de sorpresas. Lo mejor será vivirla contigo.`,
      quoteAuthor: `La familia de ${name}`,
      storyBlocks: [
        { title: 'La invitación', description: 'Una tarde para salir a explorar, reír a carcajadas y descubrir nuevas sorpresas.', imageUrl: '/images/fiesta-kids-adventure/adventure-island.webp' },
        { title: 'Tu misión', description: 'Trae tus ganas de jugar, explorar y hacer nuevos recuerdos.', imageUrl: '/images/fiesta-kids-adventure/explorer-camp.webp' },
        { title: 'La recompensa', description: 'Pastel, amigos y una tarde llena de diversión.', imageUrl: '/images/fiesta-kids-adventure/birthday-feast.webp' },
      ],
    };
    config.content.vipParents = {
      blessingMessage: `Con mucha ilusión, la familia de ${name} te invita a su fiesta`,
      groups: [{ groupTitle: 'Tus anfitriones', names: [`La familia de ${name}`] }],
    };
    config.content.locations = [{
      ...config.content.locations[1], id: 'kids-party', type: 'reception',
      title: 'Juegos y pastel', time: '13:30 HRS', imageUrl: '/images/fiesta-kids-adventure/explorer-camp.webp',
    }];
    config.content.timeline = [
      { id: 'kids-1', time: '13:30 HRS', title: '¡Llegó la pandilla!', description: 'Bienvenida y primeros juegos.', icon: 'party' },
      { id: 'kids-2', time: '15:00 HRS', title: 'Gran aventura', description: 'Sorpresas para pequeños exploradores.', icon: 'party' },
      { id: 'kids-3', time: '16:00 HRS', title: 'Pastel y deseos', description: 'Cantamos y soplamos velitas.', icon: 'cake' },
      { id: 'kids-4', time: '16:30 HRS', title: 'El gran tesoro', description: 'Nos llevamos recuerdos para contar una y otra vez.', icon: 'party' },
    ];
    config.content.gallery = { layout: 'bento-grid', images: [
      { url: '/images/fiesta-kids-adventure/adventure-island.webp', caption: 'El mapa de la aventura' },
      { url: '/images/fiesta-kids-adventure/explorer-camp.webp', caption: 'Campamento explorador' },
      { url: '/images/fiesta-kids-adventure/paper-adventure.webp', caption: 'Un mundo por descubrir' },
      { url: '/images/fiesta-kids-adventure/birthday-feast.webp', caption: '¡Pastel para todos!' },
      { url: '/images/fiesta-kids-adventure/birthday-picnic.webp', caption: 'Una tarde de fiesta' },
    ] };
    config.content.dressCode = {
      title: 'Ven listo para jugar', womenNotes: 'Ropa cómoda y tenis para correr, saltar y explorar.',
      menNotes: 'Ropa casual y calzado cómodo para acompañar la aventura.', reservedColors: [], reservedNote: '',
    };
    config.content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#Cumple${name.replace(/\s+/g, '')}` };
    config.content.gifts = { introMessage: 'Tu compañía es nuestro mejor regalo. Si quieres dejar un detalle, tendremos una pequeña cápsula de sobres en la fiesta.', registries: [], cashEnvelopeAtVenue: true };
    config.content.sectionHeadings = {
      ...config.content.sectionHeadings,
      gifts: { title: 'La cápsula de regalos' },
      social_features: { eyebrow: 'RECUERDOS DE LA AVENTURA', title: 'Comparte tus momentos' },
    };
    return;
  }

  config.sectionsOrder = config.sectionsOrder.map((section) => ({
    ...section,
    enabled: ['gifts', 'accommodation', 'social_features'].includes(section.id) ? false : section.enabled,
  }));
  config.content.hero = {
    ...config.content.hero,
    badgeText: 'UN DÍA DE LUZ Y BENDICIONES',
    tagline: communion ? 'Una celebración de fe y gratitud' : 'Una celebración de fe y familia',
    coverImageUrl: communion ? '/images/celestial-grace/communion-chalice.jpg' : config.content.hero.coverImageUrl,
    focalPoint: { x: 48, y: 49 },
  };
  config.theme.envelope.sealMonogram = name.charAt(0).toUpperCase() || '✦';
  config.content.quoteStory = {
    quoteText: communion
      ? `Con gratitud y alegría, celebramos la Primera Comunión de ${name}. Que este encuentro de fe esté rodeado del amor de quienes le acompañan.`
      : `Con gratitud y alegría, celebramos el bautizo de ${name}. Que esta nueva vida de fe esté siempre rodeada de amor y de la luz de quienes lo acompañan.`,
    quoteAuthor: `La familia de ${name}`,
    storyBlocks: communion
      ? [
          { title: 'Un encuentro de fe', description: 'El pan compartido nos reúne en gratitud y esperanza.' },
          { title: 'Acompañados de amor', description: 'Nuestra familia se reúne para vivir este momento especial.' },
        ]
      : [
          { title: 'Un nuevo comienzo', description: 'El agua nos recuerda la vida nueva que hoy celebramos.' },
          { title: 'Acompañados de amor', description: 'Familia y padrinos nos reunimos para compartir este momento de fe.' },
        ],
  };
  config.content.vipParents = {
    blessingMessage: `Con amor, acompañamos a ${name} en este día de gracia`,
    groups: communion
      ? [{ groupTitle: 'Su familia', names: [`La familia de ${name}`] }]
      : [
          { groupTitle: 'Sus papás', names: ['María y Daniel'] },
          { groupTitle: 'Sus padrinos', names: ['Ana y José'] },
        ],
  };
  config.content.locations = [
    { ...config.content.locations[0], id: 'celestial-ceremony', title: communion ? 'Misa de Primera Comunión' : 'Ceremonia de bautizo', time: '12:00 HRS', imageUrl: communion ? '/images/celestial-grace/communion-chalice.jpg' : '/images/celestial-grace/baptism-font.jpg' },
    { ...config.content.locations[1], id: 'celestial-reception', title: 'Convivencia familiar', time: '14:00 HRS', imageUrl: '/images/celestial-grace/candle-detail.jpg' },
  ];
  config.content.timeline = [
    { id: 'grace-1', time: '12:00 HRS', title: 'La ceremonia', description: communion ? `Nos reunimos para acompañar a ${name} en su Primera Comunión.` : `Nos reunimos para acompañar a ${name} en su bautizo.`, icon: 'church' },
    { id: 'grace-2', time: '14:00 HRS', title: 'Convivencia', description: 'Después compartiremos la mesa y un momento en familia.', icon: 'dinner' },
  ];
  config.content.gallery = { layout: 'bento-grid', images: [
    { url: communion ? '/images/celestial-grace/communion-chalice.jpg' : '/images/celestial-grace/baptism-font.jpg', caption: communion ? 'El encuentro en la fe' : 'Una nueva vida en la fe' },
    { url: '/images/celestial-grace/candle-detail.jpg', caption: 'Una luz para acompañarlo' },
  ] };
  config.content.dressCode = {
    title: 'Ceremonia de día', womenNotes: 'Vestimenta respetuosa y cómoda para la ceremonia y la convivencia.',
    menNotes: 'Camisa o atuendo semiformal apropiado para la ceremonia.', reservedColors: [], reservedNote: '',
  };
  config.content.socialFeatures = { enableSongRequests: false, enableAudioGuestbook: false, enableLiveDisposableCamera: false };
}
