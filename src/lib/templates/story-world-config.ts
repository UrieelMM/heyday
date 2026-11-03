import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type StoryWorldTemplateId = Extract<TemplateId, 'ohana-lilo-stitch' | 'stitch-birthday' | 'solar-pop-xv' | 'cafe-para-siempre'>;

export const isStoryWorldTemplateId = (id: TemplateId): id is StoryWorldTemplateId =>
  id === 'ohana-lilo-stitch' || id === 'stitch-birthday' || id === 'solar-pop-xv' || id === 'cafe-para-siempre';

const image = (id: StoryWorldTemplateId, name: string) => `/images/${id}/${name}.webp`;

export function storyWorldDesktopSrc(src: string): string | undefined {
  return /^\/images\/(ohana-lilo-stitch|solar-pop-xv|cafe-para-siempre)\/hero-mobile\.webp$/.test(src)
    ? src.replace('hero-mobile.webp', 'hero-desktop.webp') : undefined;
}

const worlds = {
  'ohana-lilo-stitch': {
    fallback: 'Maya cumple 6', badge: 'FIESTA OHANA · UNA ISLA PARA TODOS', tagline: 'Una aventura tropical para nuestra familia',
    quote: 'Ohana significa familia: nadie se queda atrás. Ven a jugar entre olas, flores y abrazos en un cumpleaños que recordaremos siempre.',
    moments: ['Bienvenida a la isla', 'Juegos entre olas', 'Pastel tropical', 'Baile al atardecer'],
    descriptions: ['Collares de flores y sonrisas para comenzar.', 'Surf, búsquedas y diversión para todos.', 'Un deseo frente al mar.', 'La isla se ilumina para bailar juntos.'],
    venue: 'Jardín de la Palapa', address: 'Cancún, Quintana Roo', coords: { lat: 21.1619, lng: -86.8515 },
    chapters: ['01 · EL ESPÍRITU OHANA', 'NUESTRA TRIBU', 'LA ISLA NOS ESPERA', 'LLEGADA A LA ISLA', 'RUTA DE AVENTURA', 'POSTALES DE OHANA'],
    open: 'Abre tu postal de la isla', seal: 'OH', hashtag: '#OhanaDeMaya',
  },
  'stitch-birthday': {
    fallback: 'Kai cumple 6', badge: 'STITCH · FIESTA HAWAIANA', tagline: 'Una ola de diversión nos reúne hoy',
    quote: 'Un pequeño extraterrestre encontró su lugar en la isla. Hoy nuestra fiesta se llena de travesuras, música y personas que hacen que cada aventura sea mejor.',
    moments: ['Aloha, Stitch', 'Olas y aventuras', 'Hora del pastel', 'Baile bajo las palmeras'],
    descriptions: ['Stitch nos recibe con los brazos abiertos.', 'Surf, tortugas y juegos para explorar.', 'Un deseo tan grande como el océano.', 'Hula, ukulele y una fiesta que no termina.'],
    venue: 'Jardín Bahía Azul', address: 'Cancún, Quintana Roo', coords: { lat: 21.1619, lng: -86.8515 },
    chapters: ['01 · NUESTRA AVENTURA', 'LA TRIPULACIÓN DE STITCH', 'CUENTA REGRESIVA A LA ISLA', 'NOS VEMOS EN LA BAHÍA', 'RUTA DE LA FIESTA', 'POSTALES DE STITCH'],
    open: 'Abre tu postal de Stitch', seal: 'ST', hashtag: '#FiestaDeKaiYStitch',
  },
  'solar-pop-xv': {
    fallback: 'Renata XV', badge: 'XV SOLAR POP · EDICIÓN ÚNICA', tagline: 'Quince vueltas al sol. Una fiesta enorme.',
    quote: 'No vine a pasar desapercibida. Este día reúne todos mis colores, mis sueños y a las personas que hacen que cada vuelta al sol valga la pena.',
    moments: ['La primera chispa', 'El gran brillo', 'Mesa de color', 'Hasta el amanecer'],
    descriptions: ['Llegamos llenos de energía.', 'Mi entrada al universo Solar Pop.', 'Sabores, flores y personas favoritas.', 'La pista se enciende para todos.'],
    venue: 'Foro de las Artes', address: 'Ciudad de México', coords: { lat: 19.4326, lng: -99.1332 },
    chapters: ['01 · MANIFIESTO SOLAR', 'MI CONSTELACIÓN', 'CUENTA DE COLOR', 'DÓNDE BRILLAMOS', 'EL PROGRAMA', 'DESTELLOS PARA RECORDAR'],
    open: 'Activa la fiesta', seal: 'XV', hashtag: '#RenataSolarPop',
  },
  'cafe-para-siempre': {
    fallback: 'Clara & Julián', badge: 'CAFÉ PARA SIEMPRE · NUESTRA BODA', tagline: 'Una mesa para dos. Una historia para todos.',
    quote: 'Entre cafés largos, conversaciones sin prisa y calles compartidas, encontramos nuestro lugar favorito: estar juntos. Hoy queremos reservarte un sitio en nuestra historia.',
    moments: ['El primer café', 'La conversación', 'La mesa compartida', 'Nuestro para siempre'],
    descriptions: ['Todo comenzó con una invitación sencilla.', 'Las horas pasaron sin que nos diéramos cuenta.', 'Celebramos con quienes más queremos.', 'Brindamos por todos los días que vienen.'],
    venue: 'Café del Sena', address: 'París, Francia', coords: { lat: 48.8584, lng: 2.2945 },
    chapters: ['01 · NUESTRA HISTORIA', 'NUESTRAS FAMILIAS', 'LA RESERVA SE ACERCA', 'DÓNDE NOS VEMOS', 'MENÚ DEL DÍA', 'POSTALES DEL CAFÉ'],
    open: 'Abre nuestra carta', seal: 'C&J', hashtag: '#CafeParaSiempre',
  },
} as const;

export function applyStoryWorldDefaults(config: InvitationConfig, id: StoryWorldTemplateId, rawTitle: string) {
  const world = worlds[id];
  const title = /^(nuestra|mi) celebraci[oó]n$/i.test(rawTitle.trim()) ? world.fallback : rawTitle;
  config.audio.enabled = false;
  config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : section.enabled }));
  config.theme.envelope.sealMonogram = world.seal;
  config.theme.envelope.openButtonText = world.open;
  config.content.hero = { ...config.content.hero, mainTitle: title, badgeText: world.badge, tagline: world.tagline, coverImageUrl: id === 'stitch-birthday' ? image(id, 'stitch-with-open-arms') : image(id, 'hero-mobile'), focalPoint: { x: 50, y: 50 } };
  config.content.quoteStory = {
    quoteText: world.quote, quoteAuthor: title,
    storyBlocks: world.moments.slice(0, 3).map((moment, index) => ({ title: moment, description: world.descriptions[index], imageUrl: image(id, id === 'stitch-birthday' ? ['stitch-surfing', 'stitch-sea-turtles', 'stitch-cookies'][index] : `scene-${index + 1}`) })),
  };
  config.content.vipParents = id === 'cafe-para-siempre'
    ? { blessingMessage: 'Con el amor de nuestras familias, esta mesa está completa', groups: [{ groupTitle: 'Familia de Clara', names: ['Elena y Rafael'] }, { groupTitle: 'Familia de Julián', names: ['Marta y Luis'] }, { groupTitle: 'Testigos', names: ['Nuestros amigos de siempre'] }] }
    : id === 'solar-pop-xv'
      ? { blessingMessage: 'Quienes han iluminado cada vuelta al sol', groups: [{ groupTitle: 'Mis padres', names: ['Laura y Fernando'] }, { groupTitle: 'Mis padrinos', names: ['Camila y Andrés'] }, { groupTitle: 'Mi gente', names: ['Familia y amistades'] }] }
      : { blessingMessage: 'Nuestra tribu hace la fiesta posible', groups: [{ groupTitle: 'Mamá', names: ['Alejandra'] }, { groupTitle: 'Papá', names: ['Diego'] }, { groupTitle: 'Ohana', names: ['Familia y amigos'] }] };
  const venue = config.content.locations[1] ?? config.content.locations[0];
  const locationQuery = encodeURIComponent(`${world.venue} ${world.address}`);
  config.content.locations = [{ ...venue, id: `${id}-venue`, type: 'reception', title: id === 'cafe-para-siempre' ? 'Recepción' : 'Fiesta', venueName: world.venue, address: world.address, time: id === 'ohana-lilo-stitch' || id === 'stitch-birthday' ? '13:00 HRS' : id === 'solar-pop-xv' ? '19:00 HRS' : '18:00 HRS', imageUrl: image(id, id === 'stitch-birthday' ? 'stitch-hula-dancing' : 'scene-3'), coordinates: world.coords, googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${locationQuery}`, wazeUrl: `https://waze.com/ul?q=${locationQuery}&navigate=yes` }];
  const startHour = id === 'ohana-lilo-stitch' || id === 'stitch-birthday' ? 13 : id === 'solar-pop-xv' ? 19 : 18;
  config.content.timeline = world.moments.map((moment, index) => ({ id: `${id}-${index}`, time: `${startHour + index}:00 HRS`, title: moment, description: world.descriptions[index], icon: index === 2 ? 'cake' : index === 3 ? 'party' : 'cocktail' }));
  config.content.gallery = { layout: 'bento-grid', images: world.moments.map((moment, index) => ({ url: image(id, id === 'stitch-birthday' ? ['stitch-with-open-arms', 'stitch-surfing', 'stitch-cookies', 'stitch-playing-the-ukulele'][index] : `scene-${index + 1}`), caption: moment })) };
  config.content.dressCode = id === 'ohana-lilo-stitch' || id === 'stitch-birthday'
    ? { title: 'Colores de la isla', womenNotes: 'Ropa fresca, sandalias y ganas de jugar.', menNotes: 'Camisa ligera y zapatos cómodos.', reservedColors: [{ name: 'Turquesa', hex: '#28BFC1' }, { name: 'Coral', hex: '#F27E6D' }], reservedNote: 'Ven cómodo: habrá juegos y arena.' }
    : id === 'solar-pop-xv'
      ? { title: 'Brilla a tu manera', womenNotes: 'Looks de fiesta en colores vibrantes. Evita fucsia.', menNotes: 'Traje o conjunto de fiesta con un toque de color.', reservedColors: [{ name: 'Fucsia', hex: '#F43D9A' }], reservedNote: 'El fucsia está reservado para la festejada.' }
      : { title: 'Cóctel de ciudad', womenNotes: 'Vestido o conjunto elegante en tonos de temporada.', menNotes: 'Traje o saco de cóctel.', reservedColors: [{ name: 'Marfil', hex: '#F8F3E8' }], reservedNote: 'El marfil está reservado para la pareja.' };
  config.content.gifts = { introMessage: 'Tu presencia es nuestro mejor regalo. Si quieres tener un detalle, aquí encontrarás una opción.', registries: [{ storeName: 'Mesa de regalos', url: 'https://www.amazon.com.mx/' }], cashEnvelopeAtVenue: false };
  config.content.accommodation = [];
  config.content.socialFeatures = { ...config.content.socialFeatures, hashtag: world.hashtag };
  config.content.sectionHeadings = {
    quote_story: { eyebrow: world.chapters[0] }, vip_parents: { eyebrow: world.chapters[1], title: id === 'cafe-para-siempre' ? 'Una mesa para todos' : 'Con ellos, todo es mejor' },
    countdown: { eyebrow: world.chapters[2], title: 'Falta cada vez menos' }, locations: { eyebrow: world.chapters[3], title: world.venue },
    timeline: { eyebrow: world.chapters[4], title: id === 'cafe-para-siempre' ? 'Nuestra carta del día' : 'Así se vive la fiesta' },
    gallery: { eyebrow: world.chapters[5], title: 'Instantes para guardar' }, dress_code: { eyebrow: 'CÓDIGO DE VESTIMENTA' }, gifts: { eyebrow: 'CON CARIÑO' },
    rsvp: { eyebrow: 'UN LUGAR PARA TI', title: 'Confirma tu asistencia' },
  };
  config.content.rsvp.customConfirmationMessage = 'Gracias por confirmar. Guarda tu pase digital con QR para entrar a la celebración.';
}
