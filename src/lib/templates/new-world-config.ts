import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type NewWorldTemplateId = Extract<TemplateId, 'opera-carmesi' | 'pequeno-atlas' | 'archivo-futuro'>;
export const isNewWorldTemplateId = (id: TemplateId): id is NewWorldTemplateId =>
  id === 'opera-carmesi' || id === 'pequeno-atlas' || id === 'archivo-futuro';

const image = (id: NewWorldTemplateId, name: string) => `/images/${id}/${name}.webp`;

const worlds = {
  'opera-carmesi': {
    badge: 'MIS XV · UNA NOCHE EN ESCENA', tagline: 'El telón se abre para celebrar mis quince años',
    quote: 'Cada recuerdo fue un ensayo, cada sueño una luz. Hoy se abre el telón de una nueva etapa y quiero vivirla con ustedes.',
    beats: ['El primer acto', 'La gran entrada', 'Un brindis inolvidable', 'El baile final'],
    details: ['La emoción antes de abrir el telón.', 'Una entrada para recordar.', 'Una mesa para celebrar juntos.', 'Bailamos hasta que caiga el telón.'],
    venue: 'Teatro de la Ciudad', location: 'Centro Histórico, Ciudad de México',
    coordinates: { lat: 19.4365, lng: -99.1414 },
    titles: ['CAPÍTULO I · EL LIBRETO', 'EL ELENCO DE MI VIDA', 'TERCERA LLAMADA', 'EL GRAN ESCENARIO', 'ORDEN DE LA FUNCIÓN', 'POSTALES DE LA NOCHE'],
    open: 'Presenta tu boleto para entrar', monogram: 'XV', hashtag: '#MiNocheEnEscena',
  },
  'pequeno-atlas': {
    badge: 'UNA NUEVA AVENTURA COMIENZA', tagline: 'Un pequeño viajero está por llegar',
    quote: 'Todavía no conocemos sus pasos, pero ya imaginamos todos los caminos que recorrerá. Nos encantará comenzar esta aventura contigo.',
    beats: ['El primer mapa', 'Un cielo por descubrir', 'La mesa de los deseos', 'El camino que comienza'],
    details: ['Pequeñas pistas de una gran noticia.', 'Nos reunimos bajo el mismo cielo.', 'Mensajes y regalos para guardar.', 'La aventura apenas comienza.'],
    venue: 'Jardín de la Casa Azul', location: 'Coyoacán, Ciudad de México',
    coordinates: { lat: 19.3553, lng: -99.1629 },
    titles: ['PÁGINA 01 · NUESTRO MAPA', 'COMPAÑEROS DE VIAJE', 'LA RUTA SE ACERCA', 'PUNTO DE ENCUENTRO', 'ITINERARIO DE LA AVENTURA', 'POSTALES DEL CAMINO'],
    open: 'Despliega nuestro mapa', monogram: '✦', hashtag: '#PequenoAtlas',
  },
  'archivo-futuro': {
    badge: 'GENERACIÓN 2026 · EDICIÓN 01', tagline: 'Lo que viene empieza aquí',
    quote: 'Cada proyecto, cada madrugada y cada intento nos trajo a este punto. Hoy celebramos lo que logramos y todo lo que estamos por construir.',
    beats: ['La idea', 'El proceso', 'La meta', 'El siguiente capítulo'],
    details: ['Todo empezó con una pregunta.', 'Aprendimos a intentarlo una vez más.', 'Una generación alcanza la cima.', 'Ahora comienza lo mejor.'],
    venue: 'Foro de Arquitectura', location: 'Ciudad Universitaria, Ciudad de México',
    coordinates: { lat: 19.3467, lng: -99.1617 },
    titles: ['REGISTRO 01 · EL CAMINO', 'PERSONAS CLAVE', 'CUENTA ATRÁS', 'COORDENADAS', 'PROGRAMA DE ACTOS', 'ARCHIVO VISUAL'],
    open: 'Abre tu acreditación', monogram: '26', hashtag: '#GeneracionFuturo',
  },
} as const;

export function applyNewWorldDefaults(config: InvitationConfig, id: NewWorldTemplateId, rawTitle: string) {
  const world = worlds[id];
  const title = /^(nuestra|mi) celebraci[oó]n$/i.test(rawTitle.trim())
    ? id === 'opera-carmesi' ? 'Valentina' : id === 'pequeno-atlas' ? 'Baby en camino' : 'Generación 2026'
    : rawTitle;
  config.audio.enabled = false;
  config.sectionsOrder = config.sectionsOrder.map(section => ({
    ...section, enabled: section.id === 'accommodation' ? false : id === 'archivo-futuro' && ['vip_parents', 'gifts'].includes(section.id) ? false : section.enabled,
  }));
  config.theme.envelope.sealMonogram = world.monogram;
  config.theme.envelope.openButtonText = world.open;
  config.content.hero = { ...config.content.hero, mainTitle: title, badgeText: world.badge, tagline: world.tagline, coverImageUrl: image(id, 'hero'), focalPoint: { x: 50, y: 50 } };
  config.content.quoteStory = {
    quoteText: world.quote, quoteAuthor: title,
    storyBlocks: world.beats.slice(0, 3).map((beat, index) => ({ title: beat, description: world.details[index], imageUrl: image(id, `scene-${index + 1}`) })),
  };
  config.content.vipParents = id === 'opera-carmesi'
    ? { blessingMessage: 'Con todo mi cariño, las personas que hacen posible esta noche', groups: [{ groupTitle: 'Mis padres', names: ['Mariana y Rodrigo'] }, { groupTitle: 'Mis padrinos', names: ['Daniela y Alberto'] }, { groupTitle: 'Mi gente favorita', names: ['Familia y amistades'] }] }
    : { blessingMessage: 'Las personas que comparten esta nueva aventura', groups: [{ groupTitle: 'Mamá', names: ['Mariana'] }, { groupTitle: 'Papá', names: ['Sebastián'] }, { groupTitle: 'Nuestra tribu', names: ['Familia y amigos'] }] };
  const baseLocation = config.content.locations[1] ?? config.content.locations[0];
  config.content.locations = [{ ...baseLocation, id: `${id}-venue`, type: 'reception', title: id === 'opera-carmesi' ? 'La función' : id === 'pequeno-atlas' ? 'Baby shower' : 'Ceremonia y celebración', venueName: world.venue, address: world.location, time: id === 'pequeno-atlas' ? '13:00 HRS' : '19:00 HRS', imageUrl: image(id, 'scene-3'), coordinates: world.coordinates, googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(world.venue + ' ' + world.location)}`, wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(world.venue + ' ' + world.location)}&navigate=yes` }];
  config.content.timeline = world.beats.map((beat, index) => ({ id: `${id}-${index}`, time: `${id === 'pequeno-atlas' ? 13 + index : 19 + index}:00 HRS`, title: beat, description: world.details[index], icon: index === 3 ? 'party' : index === 2 ? 'dinner' : 'cocktail' }));
  config.content.gallery = { layout: 'bento-grid', images: world.beats.map((beat, index) => ({ url: image(id, `scene-${index + 1}`), caption: beat })) };
  config.content.dressCode = id === 'opera-carmesi'
    ? { title: 'Elegancia de teatro', womenNotes: 'Vestido de noche en tonos profundos. Evita carmesí.', menNotes: 'Traje oscuro o formal.', reservedColors: [{ name: 'Carmesí', hex: '#6B1729' }], reservedNote: 'El carmesí está reservado para la festejada.' }
    : id === 'pequeno-atlas'
      ? { title: 'Aventura en tonos suaves', womenNotes: 'Prendas cómodas de lino o algodón.', menNotes: 'Casual en tonos claros.', reservedColors: [{ name: 'Salvia', hex: '#9EAE93' }, { name: 'Cielo', hex: '#B9CFDC' }], reservedNote: 'Sugerencias para nuestra foto de grupo.' }
      : { title: 'Formal contemporáneo', womenNotes: 'Vestimenta de cóctel con un toque de color.', menNotes: 'Traje o conjunto formal contemporáneo.', reservedColors: [{ name: 'Cobalto', hex: '#1E47A0' }], reservedNote: 'El cobalto identifica a la generación.' };
  config.content.gifts = { introMessage: 'Tu compañía es el mejor regalo. Si deseas sumar un detalle, aquí hay una opción.', registries: [{ storeName: 'Mesa de regalos', url: 'https://www.amazon.com.mx/' }], cashEnvelopeAtVenue: false };
  config.content.accommodation = [];
  config.content.socialFeatures = { ...config.content.socialFeatures, hashtag: world.hashtag };
  config.content.sectionHeadings = {
    quote_story: { eyebrow: world.titles[0] }, vip_parents: { eyebrow: world.titles[1], title: id === 'opera-carmesi' ? 'Con ustedes, todo es posible' : 'Quienes nos acompañan' },
    countdown: { eyebrow: world.titles[2], title: 'Cada día estamos más cerca' }, locations: { eyebrow: world.titles[3], title: world.venue },
    timeline: { eyebrow: world.titles[4], title: 'Así viviremos el día' }, gallery: { eyebrow: world.titles[5], title: 'Un vistazo a nuestro mundo' },
    dress_code: { eyebrow: 'CÓDIGO DE VESTIMENTA' }, gifts: { eyebrow: 'UN DETALLE ESPECIAL' }, rsvp: { eyebrow: 'TU LUGAR ESTÁ RESERVADO', title: 'Confirma tu asistencia' },
  };
  config.content.rsvp.customConfirmationMessage = 'Gracias por confirmar. Guarda tu pase digital con QR para el evento.';
}
