import type { InvitationConfig, SectionId, TemplateId } from '@/types/invitation.types';

export type NewSceneTemplateId = Extract<TemplateId, 'marea-azul' | 'ritmo-de-dos' | 'mini-cosmos' | 'atelier-xv'>;

export function isNewSceneTemplateId(id: TemplateId): id is NewSceneTemplateId {
  return id === 'marea-azul' || id === 'ritmo-de-dos' || id === 'mini-cosmos' || id === 'atelier-xv';
}

type Heading = { eyebrow: string; title: string };
const headings: Record<NewSceneTemplateId, Partial<Record<SectionId, Heading>>> = {
  'marea-azul': {
    quote_story: { eyebrow: 'Nuestra travesía', title: 'Cómo llegamos aquí' }, vip_parents: { eyebrow: 'Quienes nos acompañan', title: 'Nuestra gente' },
    countdown: { eyebrow: 'La marea se acerca', title: 'Nos vemos pronto' }, locations: { eyebrow: 'Coordenadas del encuentro', title: 'El destino' },
    timeline: { eyebrow: 'El rumbo del día', title: 'Nuestra ruta' }, gallery: { eyebrow: 'Postales', title: 'Instantes junto al mar' },
    dress_code: { eyebrow: 'Para disfrutar la costa', title: 'Cómo venir' }, gifts: { eyebrow: 'Con cariño', title: 'Detalles' },
    accommodation: { eyebrow: 'Tu estancia', title: 'Dónde descansar' }, social_features: { eyebrow: 'Recuerdos compartidos', title: 'Nuestra colección' },
    rsvp: { eyebrow: 'Reserva tu lugar', title: 'Nos encantará verte' },
  },
  'ritmo-de-dos': {
    quote_story: { eyebrow: 'Lado A', title: 'Cómo comenzó todo' }, vip_parents: { eyebrow: 'La banda', title: 'Nuestra gente' },
    countdown: { eyebrow: 'Cuenta atrás', title: 'Falta para el gran tema' }, locations: { eyebrow: 'La sede', title: 'Nos vemos aquí' },
    timeline: { eyebrow: 'Setlist', title: 'Así suena el día' }, gallery: { eyebrow: 'Recuerdos en vinilo', title: 'Nuestros momentos' },
    dress_code: { eyebrow: 'Código de estilo', title: 'Ven a tu ritmo' }, gifts: { eyebrow: 'Un detalle', title: 'Regalos' },
    accommodation: { eyebrow: 'Después del baile', title: 'Dónde quedarte' }, social_features: { eyebrow: 'Lado B', title: 'Haz parte del recuerdo' },
    rsvp: { eyebrow: 'En la lista', title: 'Confirma tu asistencia' },
  },
  'mini-cosmos': {
    quote_story: { eyebrow: 'Bitácora de misión', title: 'Una aventura especial' }, vip_parents: { eyebrow: 'Tripulación', title: 'Quienes celebramos' },
    countdown: { eyebrow: 'Cuenta de despegue', title: 'La misión empieza en' }, locations: { eyebrow: 'Base espacial', title: 'Punto de encuentro' },
    timeline: { eyebrow: 'Plan de vuelo', title: 'La aventura del día' }, gallery: { eyebrow: 'Exploraciones', title: 'Momentos de otro planeta' },
    dress_code: { eyebrow: 'Equipo de exploración', title: 'Ven listo para jugar' }, gifts: { eyebrow: 'Sorpresas', title: 'Regalos' },
    accommodation: { eyebrow: 'Estación de descanso', title: 'Dónde quedarte' }, social_features: { eyebrow: 'Recuerdos de misión', title: 'Nuestro álbum' },
    rsvp: { eyebrow: 'Pase de abordaje', title: 'Confirma tu lugar' },
  },
  'atelier-xv': {
    quote_story: { eyebrow: 'Capítulo 01', title: 'Mi propia historia' }, vip_parents: { eyebrow: 'Mi círculo', title: 'Quienes me acompañan' },
    countdown: { eyebrow: 'La espera termina', title: 'Cuenta regresiva' }, locations: { eyebrow: 'El escenario', title: 'Dónde nos vemos' },
    timeline: { eyebrow: 'La colección de la noche', title: 'Momentos clave' }, gallery: { eyebrow: 'Mi mundo', title: 'Retratos y recuerdos' },
    dress_code: { eyebrow: 'Dress notes', title: 'Código de estilo' }, gifts: { eyebrow: 'Con cariño', title: 'Detalles' },
    accommodation: { eyebrow: 'Tu estancia', title: 'Dónde quedarte' }, social_features: { eyebrow: 'Backstage', title: 'Nuestra memoria' },
    rsvp: { eyebrow: 'Estás en la lista', title: 'Confirma tu asistencia' },
  },
};

export function applyNewSceneDefaults(config: InvitationConfig, id: NewSceneTemplateId, title: string) {
  const content = config.content;
  const cover = `/images/${id}/cover.svg`;
  const directions = (place: string) => {
    const query = encodeURIComponent(place);
    return { googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`, wazeUrl: `https://waze.com/ul?q=${query}&navigate=yes` };
  };
  config.audio.enabled = false;
  content.rsvp.plannerContactWhatsapp = undefined;
  config.theme.envelope.openButtonText = id === 'mini-cosmos' ? 'Abre tu pase de misión' : id === 'ritmo-de-dos' ? 'Abre tu boleto' : 'Abre tu invitación';
  content.sectionHeadings = { ...content.sectionHeadings, ...headings[id] };
  content.hero.coverImageUrl = cover;
  content.hero.focalPoint = { x: 50, y: 50 };
  content.rsvp.customConfirmationMessage = 'Tu confirmación quedó registrada. Guarda tu pase digital para mostrarlo al llegar.';

  if (id === 'marea-azul') {
    content.hero.badgeText = 'UNA BODA JUNTO AL MAR';
    content.hero.tagline = 'Un nuevo horizonte · Bahías de Huatulco, Oaxaca';
    content.quoteStory = { quoteText: 'Nuestra historia nos llevó por muchos caminos. Ahora elegimos el mismo horizonte y queremos celebrarlo contigo.', quoteAuthor: title,
      storyBlocks: [{ title: 'El encuentro', description: 'Descubrimos que los mejores planes suceden cuando caminamos juntos.' }, { title: 'El siguiente viaje', description: 'Comenzamos una nueva etapa con nuestra familia y amistades cerca.' }] };
    content.vipParents = { blessingMessage: '', groups: [] };
    content.locations = [{ ...content.locations[1], id: 'marea-celebracion', type: 'reception', title: 'Ceremonia y celebración',
      venueName: 'Playa Santa Cruz', address: 'Bahía Santa Cruz, Santa María Huatulco, Oaxaca', time: '17:00 HRS',
      coordinates: { lat: 15.75315, lng: -96.13118 }, ...directions('Playa Santa Cruz, Bahías de Huatulco, Oaxaca'), imageUrl: cover }];
    content.timeline = [
      { id: 'marea-1', time: '17:00 HRS', title: 'El encuentro', description: 'Nos reunimos para la ceremonia.', icon: 'rings' },
      { id: 'marea-2', time: '18:30 HRS', title: 'Brindis', description: 'Una copa por este nuevo horizonte.', icon: 'cocktail' },
      { id: 'marea-3', time: '20:00 HRS', title: 'Cena y baile', description: 'Compartimos la mesa y celebramos.', icon: 'party' },
    ];
    content.gallery = { layout: 'bento-grid', images: [{ url: cover, caption: 'Nuestro horizonte' }, { url: '/images/marea-azul/detail.svg', caption: 'Un día para encontrarnos' }] };
    content.dressCode = { title: 'Elegancia fresca', womenNotes: 'Vestido o conjunto ligero y elegante.', menNotes: 'Traje ligero o saco con pantalón de vestir.', reservedColors: [{ name: 'Blanco', hex: '#FFFFFF' }], reservedNote: 'El blanco está reservado para la pareja.' };
    content.gifts = { introMessage: '', registries: [], cashEnvelopeAtVenue: false };
    content.accommodation = [];
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: ['vip_parents', 'gifts', 'accommodation'].includes(section.id) ? false : section.enabled }));
    content.socialFeatures.hashtag = '#NuestroNuevoHorizonte';
  } else if (id === 'ritmo-de-dos') {
    content.hero.badgeText = 'NUESTRO GRAN CONCIERTO';
    content.hero.tagline = 'Dos historias, un mismo ritmo · Ciudad de México';
    content.quoteStory = { quoteText: 'Nos encontramos, sonó nuestra canción y desde entonces elegimos bailar la vida juntos. Celebra este nuevo comienzo con nosotros.', quoteAuthor: title,
      storyBlocks: [{ title: 'La primera canción', description: 'Una conversación que se volvió nuestro lugar favorito.' }, { title: 'Nuestro coro', description: 'Ustedes son parte de todo lo que hoy celebramos.' }] };
    content.vipParents = { blessingMessage: '', groups: [] };
    content.locations = [{ ...content.locations[1], id: 'ritmo-venue', type: 'reception', title: 'Ceremonia y fiesta',
      venueName: 'Foro Roma', address: 'Coahuila 92, Roma Sur, 06760 Ciudad de México', time: '17:00 HRS',
      coordinates: { lat: 19.407, lng: -99.164 }, ...directions('Foro Roma, Coahuila 92, Roma Sur, Ciudad de México'), imageUrl: cover }];
    content.timeline = [
      { id: 'ritmo-1', time: '17:00 HRS', title: 'La apertura', description: 'Ceremonia.', icon: 'rings' },
      { id: 'ritmo-2', time: '18:30 HRS', title: 'Primer brindis', description: 'Nos encontramos en la pista.', icon: 'cocktail' },
      { id: 'ritmo-3', time: '20:00 HRS', title: 'El gran baile', description: 'Cena, música y fiesta.', icon: 'party' },
    ];
    content.gallery = { layout: 'bento-grid', images: [{ url: cover, caption: 'Nuestra canción' }, { url: '/images/ritmo-de-dos/detail.svg', caption: 'El lado B de nuestra historia' }] };
    content.dressCode = { title: 'Elegante con personalidad', womenNotes: 'Un look de fiesta con el que puedas bailar.', menNotes: 'Traje o conjunto elegante para celebrar.', reservedColors: [{ name: 'Marfil', hex: '#FAF0E6' }], reservedNote: 'El marfil está reservado para la pareja.' };
    content.gifts = { introMessage: '', registries: [], cashEnvelopeAtVenue: false };
    content.accommodation = [];
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: ['vip_parents', 'gifts', 'accommodation'].includes(section.id) ? false : section.enabled }));
    content.socialFeatures.hashtag = '#RitmoDeDos';
  } else if (id === 'mini-cosmos') {
    const name = title.replace(/^¡?(.+?)\s+cumple\s+#?\d+!?$/i, '$1').trim();
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: ['gifts', 'accommodation'].includes(section.id) ? false : section.enabled }));
    content.hero.badgeText = 'MISIÓN CUMPLEAÑOS';
    content.hero.tagline = 'Juegos, pastel y nuevos planetas · Ciudad de México';
    content.quoteStory = { quoteText: `¡La misión de ${name} está a punto de despegar! Ven a jugar, reír y celebrar una vuelta más alrededor del sol.`, quoteAuthor: `La familia de ${name}`,
      storyBlocks: [{ title: 'Tu misión', description: 'Trae tus ganas de jugar y explorar con amigos.' }, { title: 'La recompensa', description: 'Pastel, sorpresas y una tarde para recordar.' }] };
    content.vipParents = { blessingMessage: `La familia de ${name} te espera con mucha ilusión.`, groups: [{ groupTitle: 'Tripulación anfitriona', names: [`Familia de ${name}`] }] };
    content.locations = [{ ...content.locations[1], id: 'cosmos-base', type: 'reception', title: 'Juegos y pastel', time: '13:30 HRS',
      venueName: 'Papalote Museo del Niño', address: 'Av. Constituyentes 268, 2da Sección de Chapultepec, Ciudad de México',
      coordinates: { lat: 19.411, lng: -99.193 }, ...directions('Papalote Museo del Niño, Av. Constituyentes 268, Ciudad de México'), imageUrl: cover }];
    content.timeline = [
      { id: 'cosmos-1', time: '13:30 HRS', title: 'Abordaje', description: 'Bienvenida y juegos para empezar.', icon: 'party' },
      { id: 'cosmos-2', time: '15:00 HRS', title: 'Exploración', description: 'Actividades y aventuras en equipo.', icon: 'party' },
      { id: 'cosmos-3', time: '16:00 HRS', title: 'Pastel estelar', description: 'Cantamos y pedimos deseos.', icon: 'cake' },
    ];
    content.gallery = { layout: 'bento-grid', images: [{ url: cover, caption: 'Nuestra misión' }, { url: '/images/mini-cosmos/detail.svg', caption: 'El planeta de los juegos' }] };
    content.dressCode = { title: 'Listos para jugar', womenNotes: 'Ropa cómoda y tenis para moverse.', menNotes: 'Ropa casual y calzado cómodo.', reservedColors: [], reservedNote: '' };
    content.gifts = { introMessage: '', registries: [], cashEnvelopeAtVenue: false };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: false, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#Mision${name.replace(/\s+/g, '')}` };
    content.rsvp.askDietaryRestrictions = true;
    content.rsvp.allowChildrenSelection = true;
    config.theme.envelope.sealMonogram = '★';
  } else {
    const name = title.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || title;
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : section.enabled }));
    content.hero.badgeText = 'MI EDICIÓN XV';
    content.hero.tagline = 'Una noche para ser yo · Ciudad de México';
    content.quoteStory = { quoteText: 'Quince años de sueños, decisiones y personas que me acompañan. Hoy escribo mi siguiente capítulo y quiero compartirlo contigo.', quoteAuthor: name,
      storyBlocks: [{ title: 'Lo que soy', description: 'Cada recuerdo y cada persona han dado forma a mi historia.' }, { title: 'Lo que viene', description: 'Esta noche celebro todo lo que puedo llegar a ser.' }] };
    content.vipParents = { blessingMessage: 'Con amor de mi familia, celebro este momento contigo.', groups: [{ groupTitle: 'Mis papás', names: ['Laura y Daniel'] }, { groupTitle: 'Mis padrinos', names: ['Elena y Mauricio'] }] };
    content.locations = [{ ...content.locations[1], id: 'atelier-gala', type: 'reception', title: 'Mi fiesta de XV años', time: '19:00 HRS',
      venueName: 'Museo Franz Mayer', address: 'Av. Hidalgo 45, Centro Histórico, Ciudad de México',
      coordinates: { lat: 19.437, lng: -99.144 }, ...directions('Museo Franz Mayer, Av. Hidalgo 45, Ciudad de México'), imageUrl: cover }];
    content.timeline = [
      { id: 'atelier-1', time: '19:00 HRS', title: 'Bienvenida', description: 'Nos encontramos para comenzar.', icon: 'party' },
      { id: 'atelier-2', time: '20:00 HRS', title: 'Mi entrada', description: 'Un momento para compartir con todos.', icon: 'waltz' },
      { id: 'atelier-3', time: '21:00 HRS', title: 'La celebración', description: 'Cena, baile y recuerdos juntos.', icon: 'party' },
    ];
    content.gallery = { layout: 'bento-grid', images: [{ url: cover, caption: 'Mi edición' }, { url: '/images/atelier-xv/detail.svg', caption: 'Detalles de la noche' }] };
    content.dressCode = { title: 'Gala contemporánea', womenNotes: 'Vestido o conjunto elegante en el que te sientas tú.', menNotes: 'Traje o conjunto formal de noche.', reservedColors: [{ name: 'Azul cobalto', hex: '#315BA1' }], reservedNote: 'El azul cobalto es el color protagonista de la quinceañera.' };
    content.gifts = { introMessage: 'Tu presencia es mi mejor regalo. Si deseas tener un detalle, habrá un espacio para sobres durante la celebración.', registries: [], cashEnvelopeAtVenue: true };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: `#XV${name.replace(/\s+/g, '')}` };
    config.theme.envelope.sealMonogram = 'XV';
  }
}
