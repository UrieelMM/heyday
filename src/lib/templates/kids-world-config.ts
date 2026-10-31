import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type KidsWorldTemplateId = Extract<TemplateId, 'pirate-treasure-voyage' | 'dino-jungle-expedition'>;

export function isKidsWorldTemplateId(id: TemplateId): id is KidsWorldTemplateId {
  return id === 'pirate-treasure-voyage' || id === 'dino-jungle-expedition';
}

export function kidsWorldName(title: string) {
  return title.match(/^¡?(.+?)\s+cumple\s+#?\d+/i)?.[1]?.trim()
    || title.replace(/^cumple\s*#?\d+\s+de\s+/i, '').trim()
    || title;
}

export function kidsWorldAge(title: string) {
  return title.match(/\b(\d{1,2})\b/)?.[1] || '';
}

const image = (id: KidsWorldTemplateId, name: string) => `/images/${id}/${name}.webp`;

export function applyKidsWorldDefaults(config: InvitationConfig, id: KidsWorldTemplateId, title: string) {
  const name = kidsWorldName(title);
  const pirate = id === 'pirate-treasure-voyage';
  config.audio.enabled = false;
  config.content.accommodation = [];
  config.sectionsOrder = config.sectionsOrder.map((section) => ({
    ...section,
    enabled: section.id === 'accommodation' ? false : section.enabled,
  }));
  config.theme.envelope.sealMonogram = pirate ? '☸' : '✦';
  config.theme.envelope.openButtonText = pirate ? 'Toca el pase para abordar' : 'Toca el fósil para entrar';
  config.content.hero = {
    ...config.content.hero,
    badgeText: pirate ? 'TRAVESÍA DE CUMPLEAÑOS' : 'EXPEDICIÓN JURÁSICA',
    tagline: pirate ? 'Un mapa, una tripulación y un tesoro por descubrir' : 'Huellas, fósiles y una fiesta de otro tiempo',
    coverImageUrl: image(id, pirate ? 'ship' : 'triceratops'),
    focalPoint: { x: 50, y: 50 },
  };
  config.content.quoteStory = pirate ? {
    quoteText: `¡La tripulación de ${name} zarpa hacia una fiesta inolvidable! Entre pistas, juegos y pastel, el mejor tesoro será compartir la aventura contigo.`,
    quoteAuthor: `La tripulación de ${name}`,
    storyBlocks: [
      { title: 'La carta del capitán', description: 'Una invitación para navegar juntos hacia una tarde llena de sorpresas.', imageUrl: image(id, 'map') },
      { title: 'La ruta secreta', description: 'Seguiremos las pistas con nuestra tripulación de amigos.', imageUrl: image(id, 'ship') },
      { title: 'El verdadero tesoro', description: 'Risas, pastel y recuerdos para llevar a casa.', imageUrl: image(id, 'treasure') },
    ],
  } : {
    quoteText: `¡La expedición de ${name} está por comenzar! Nos esperan huellas gigantes, fósiles, juegos y un gran pastel prehistórico.`,
    quoteAuthor: `La familia de ${name}`,
    storyBlocks: [
      { title: 'Una huella especial', description: 'Cada invitado hace que esta aventura sea más grande.', imageUrl: image(id, 'triceratops') },
      { title: 'Explora y descubre', description: 'Encontraremos fósiles y sorpresas entre la selva.', imageUrl: image(id, 'fossils') },
      { title: 'La era de la fiesta', description: 'Celebraremos juntos con pastel y muchas sonrisas.', imageUrl: image(id, 'party') },
    ],
  };
  config.content.vipParents = pirate ? {
    blessingMessage: `Con mucha emoción, la familia de ${name} te invita a zarpar con nosotros`,
    groups: [
      { groupTitle: 'Capitanes', names: [`La familia de ${name}`] },
      { groupTitle: 'Tripulación', names: ['Amigos y familia'] },
      { groupTitle: 'Invitado especial', names: ['¡Tú!'] },
    ],
  } : {
    blessingMessage: `Con mucha ilusión, la familia de ${name} te espera en esta expedición`,
    groups: [
      { groupTitle: 'Guías de la expedición', names: [`La familia de ${name}`] },
      { groupTitle: 'Equipo explorador', names: ['Amigos y familia'] },
      { groupTitle: 'Invitado especial', names: ['¡Tú!'] },
    ],
  };
  config.content.locations = [{
    ...config.content.locations[1],
    id: pirate ? 'pirate-port' : 'dino-base',
    type: 'reception',
    title: pirate ? 'Puerto de la fiesta' : 'Base de la expedición',
    time: '13:30 HRS',
    imageUrl: image(id, pirate ? 'treasure' : 'waterfall'),
  }];
  config.content.timeline = pirate ? [
    { id: 'pirate-1', time: '13:30 HRS', title: 'Todos a bordo', description: 'Nos reunimos en el puerto y recibimos nuestro mapa.', icon: 'party' },
    { id: 'pirate-2', time: '14:15 HRS', title: 'La ruta del tesoro', description: 'Juegos y pistas para descubrir la isla.', icon: 'party' },
    { id: 'pirate-3', time: '15:15 HRS', title: 'El cofre se abre', description: 'Una sorpresa para nuestra tripulación.', icon: 'party' },
    { id: 'pirate-4', time: '16:00 HRS', title: 'Pastel en cubierta', description: 'Velitas, deseos y un gran brindis pirata.', icon: 'cake' },
  ] : [
    { id: 'dino-1', time: '13:30 HRS', title: 'Bienvenidos a la selva', description: 'Comienza la expedición y conocemos nuestra base.', icon: 'party' },
    { id: 'dino-2', time: '14:15 HRS', title: 'Busca las huellas', description: 'Juegos y pistas entre las hojas gigantes.', icon: 'party' },
    { id: 'dino-3', time: '15:15 HRS', title: 'Excava un fósil', description: 'Una sorpresa escondida bajo la tierra.', icon: 'party' },
    { id: 'dino-4', time: '16:00 HRS', title: 'Pastel prehistórico', description: 'Velitas y celebración para terminar la misión.', icon: 'cake' },
  ];
  config.content.gallery = {
    layout: 'bento-grid',
    images: pirate ? [
      { url: image(id, 'ship'), caption: 'El barco de la aventura' },
      { url: image(id, 'map'), caption: 'La carta secreta' },
      { url: image(id, 'treasure'), caption: 'El cofre del tesoro' },
      { url: image(id, 'party'), caption: 'Pastel en cubierta' },
    ] : [
      { url: image(id, 'triceratops'), caption: 'Nuestro amigo jurásico' },
      { url: image(id, 'fossils'), caption: 'El rincón de los fósiles' },
      { url: image(id, 'waterfall'), caption: 'La selva escondida' },
      { url: image(id, 'party'), caption: 'Fiesta prehistórica' },
    ],
  };
  config.content.dressCode = {
    title: pirate ? 'Listos para zarpar' : 'Listos para explorar',
    womenNotes: pirate ? 'Ropa cómoda, tenis y muchas ganas de jugar. Un toque pirata es bienvenido.' : 'Ropa cómoda y tenis para seguir las huellas sin parar.',
    menNotes: pirate ? 'Ropa fresca y calzado cómodo para navegar con la tripulación.' : 'Ropa fresca y calzado cómodo para caminar por la selva.',
    reservedColors: [], reservedNote: '',
  };
  config.content.gifts = {
    introMessage: pirate ? 'Tu compañía es el mejor tesoro. Si deseas dejar un detalle, habrá un cofre para sobres durante la fiesta.' : 'Tu compañía hace esta expedición especial. Si deseas dejar un detalle, habrá un nido de sobres en la fiesta.',
    registries: [], cashEnvelopeAtVenue: true,
  };
  config.content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#Cumple${name.replace(/\s+/g, '')}` };
  config.content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';
  config.content.sectionHeadings = {
    quote_story: { eyebrow: pirate ? 'CAPÍTULO 01 · MENSAJE EN UNA BOTELLA' : 'CAPÍTULO 01 · EL COMIENZO' },
    vip_parents: { eyebrow: pirate ? 'LA TRIPULACIÓN' : 'EL EQUIPO EXPLORADOR', title: pirate ? 'Nuestra tripulación' : 'Nuestra manada' },
    countdown: { eyebrow: pirate ? 'ANTES DE ZARPAR' : 'CUENTA JURÁSICA', title: pirate ? 'La travesía empieza en' : 'La expedición comienza en' },
    locations: { eyebrow: pirate ? 'COORDENADAS DEL PUERTO' : 'COORDENADAS DE LA BASE', title: pirate ? 'Aquí nos encontramos' : 'Aquí empieza la aventura' },
    timeline: { eyebrow: pirate ? 'CARTA DE NAVEGACIÓN' : 'RUTA DE HUELLAS', title: pirate ? 'Nuestro plan de abordaje' : 'Nuestro recorrido jurásico' },
    gallery: { eyebrow: pirate ? 'ARCHIVO DEL CAPITÁN' : 'ARCHIVO DE FÓSILES', title: pirate ? 'Postales de la isla' : 'Escenas de otra era' },
    dress_code: { eyebrow: pirate ? 'EQUIPO DE CUBIERTA' : 'EQUIPO DE CAMPO', title: config.content.dressCode.title },
    gifts: { eyebrow: pirate ? 'COFRE DE DETALLES' : 'NIDO DE DETALLES', title: pirate ? 'El cofre de regalos' : 'El nido de regalos' },
    social_features: { eyebrow: pirate ? 'BITÁCORA COMPARTIDA' : 'ÁLBUM DE LA EXPEDICIÓN', title: pirate ? 'Guarda la aventura' : 'Comparte tus hallazgos' },
  };
}
