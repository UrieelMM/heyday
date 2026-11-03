import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type KidsWorldTemplateId = Extract<TemplateId, 'pirate-treasure-voyage' | 'dino-jungle-expedition' | 'safari-sunrise-adventure' | 'cowboy-ranch-roundup' | 'mickey-mouse-birthday' | 'minecraft-birthday'>;

export function isKidsWorldTemplateId(id: TemplateId): id is KidsWorldTemplateId {
  return id === 'pirate-treasure-voyage' || id === 'dino-jungle-expedition' || id === 'safari-sunrise-adventure' || id === 'cowboy-ranch-roundup' || id === 'mickey-mouse-birthday' || id === 'minecraft-birthday';
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

function applyMinecraftDefaults(config: InvitationConfig, name: string) {
  const asset = (file: string) => image('minecraft-birthday', file);
  const content = config.content;
  config.audio.enabled = false;
  config.sectionsOrder = config.sectionsOrder.map(section => ({
    ...section,
    enabled: section.id === 'accommodation' ? false : section.enabled,
  }));
  config.theme.envelope.sealMonogram = '◆';
  config.theme.envelope.openButtonText = 'Entrar al mundo de cumpleaños';
  content.hero = {
    ...content.hero,
    mainTitle: /^(nuestra|mi) celebraci[oó]n$/i.test(name) ? 'Santiago cumple 8' : content.hero.mainTitle,
    badgeText: 'NUEVO MUNDO DESBLOQUEADO · CUMPLEAÑOS',
    tagline: 'Construye, explora y celebra con nosotros',
    coverImageUrl: asset('heroes'),
    focalPoint: { x: 50, y: 50 },
  };
  const player = kidsWorldName(content.hero.mainTitle);
  content.quoteStory = {
    quoteText: `Se ha generado un mundo nuevo para celebrar a ${player}. Esta aventura necesita exploradores, amigos y muchas ganas de construir recuerdos. ¡Tu lugar en el equipo ya está reservado!`,
    quoteAuthor: `Equipo de ${player}`,
    storyBlocks: [
      { title: 'El mundo se abre', description: 'Un nuevo mapa está listo para nuestra gran aventura.', imageUrl: asset('grass-block') },
      { title: 'Arma tu equipo', description: 'Con amigos, cada misión se vuelve más divertida.', imageUrl: asset('friends') },
      { title: 'Encuentra la sorpresa', description: 'Juegos, pastel y un botín de momentos para guardar.', imageUrl: asset('chicken') },
    ],
  };
  content.vipParents = {
    blessingMessage: `La familia de ${player} te invita a formar parte de su mejor equipo`,
    groups: [
      { groupTitle: 'Anfitriones', names: [`La familia de ${player}`] },
      { groupTitle: 'Equipo explorador', names: ['Amigos y familia'] },
      { groupTitle: 'Jugador especial', names: ['¡Tú!'] },
    ],
  };
  const address = 'Parque México, Condesa, Ciudad de México';
  const query = encodeURIComponent(address);
  content.locations = [{
    id: 'minecraft-spawn', type: 'reception', title: 'Punto de aparición',
    venueName: 'Parque México', address, time: '13:00 HRS', imageUrl: asset('friends'),
    coordinates: { lat: 19.4115, lng: -99.1691 },
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    wazeUrl: `https://waze.com/ul?q=${query}&navigate=yes`,
  }];
  content.timeline = [
    { id: 'minecraft-1', time: '13:00 HRS', title: 'Entramos al mundo', description: 'Aparecemos en la base y reunimos al equipo.', icon: 'party' },
    { id: 'minecraft-2', time: '14:00 HRS', title: 'Modo creativo', description: 'Construcciones, retos y juegos por descubrir.', icon: 'party' },
    { id: 'minecraft-3', time: '15:00 HRS', title: 'Misión en equipo', description: 'Nos unimos para encontrar la gran sorpresa.', icon: 'party' },
    { id: 'minecraft-4', time: '16:00 HRS', title: 'Pastel desbloqueado', description: 'Soplamos las velitas y celebramos la victoria.', icon: 'cake' },
  ];
  content.gallery = { layout: 'bento-grid', images: [
    { url: asset('heroes'), caption: 'Los exploradores del mundo' },
    { url: asset('grass-block'), caption: 'Un mundo por construir' },
    { url: asset('adventure'), caption: 'Aventura en equipo' },
    { url: '/images/minecraft-birthday/pixel-cake.svg', caption: 'Pastel desbloqueado' },
    { url: asset('chicken'), caption: 'Una sorpresa del mapa' },
    { url: asset('steve'), caption: 'Héroe de la partida' },
  ] };
  content.dressCode = {
    title: 'Equipo de exploración',
    womenNotes: 'Ropa cómoda y tenis para completar todas las misiones. Un look de explorador es bienvenido.',
    menNotes: 'Ropa fresca, calzado cómodo y energía para jugar todo el día.',
    reservedColors: [], reservedNote: '',
  };
  content.gifts = {
    introMessage: 'Tu compañía es el mejor botín. Si deseas dejar un detalle, habrá un cofre de felicitaciones durante la fiesta.',
    registries: [], cashEnvelopeAtVenue: true,
  };
  content.accommodation = [];
  content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#MundoDe${player.replace(/\s+/g, '')}` };
  content.rsvp = { ...content.rsvp, askDietaryRestrictions: false, allowChildrenSelection: true, customConfirmationMessage: '¡Misión aceptada! Guarda tu pase digital con QR para entrar al mundo de cumpleaños.' };
  content.sectionHeadings = {
    quote_story: { eyebrow: '01 / NUEVO MUNDO', title: 'Una aventura hecha para ti' },
    vip_parents: { eyebrow: '03 / MULTIJUGADOR', title: 'Nuestro mejor equipo' },
    countdown: { eyebrow: '04 / CARGANDO PARTIDA', title: 'La aventura comienza en' },
    locations: { eyebrow: '05 / COORDENADAS', title: 'Punto de aparición' },
    timeline: { eyebrow: '06 / RUTA DE MISIÓN', title: 'El plan del día' },
    gallery: { eyebrow: '07 / CAPTURAS DEL MUNDO', title: 'Explora la aventura' },
    dress_code: { eyebrow: '08 / EQUIPAMIENTO', title: 'Listos para jugar' },
    gifts: { eyebrow: '09 / COFRE DE DETALLES', title: 'El mejor botín eres tú' },
    social_features: { eyebrow: '10 / MEMORIAS GUARDADAS', title: 'Comparte tus hallazgos' },
    rsvp: { eyebrow: '11 / ACCESO AL MUNDO', title: 'Confirma tu misión' },
  };
}

function applyMickeyDefaults(config: InvitationConfig, name: string) {
  const asset = (file: string) => image('mickey-mouse-birthday', file);
  const content = config.content;
  config.audio.enabled = false;
  config.sectionsOrder = config.sectionsOrder.map(section => ({
    ...section,
    enabled: section.id === 'accommodation' ? false : section.enabled,
  }));
  config.theme.envelope.sealMonogram = '★';
  config.theme.envelope.openButtonText = 'Abre tu pase al Club de Cumpleaños';
  content.hero = {
    ...content.hero,
    mainTitle: /^(nuestra|mi) celebraci[oó]n$/i.test(name) ? 'Mateo cumple 5' : content.hero.mainTitle,
    badgeText: 'EL CLUB DE CUMPLEAÑOS · EDICIÓN ESPECIAL',
    tagline: 'Globos, risas y una fiesta hecha para compartir',
    coverImageUrl: asset('mickey-hero'),
    focalPoint: { x: 50, y: 50 },
  };
  const birthdayName = kidsWorldName(content.hero.mainTitle);
  content.quoteStory = {
    quoteText: `¡Ya casi llega el gran día de ${birthdayName}! Mickey y sus amigos nos esperan para jugar, reír y soplar las velitas. Lo único que falta para que la magia esté completa eres tú.`,
    quoteAuthor: `La familia de ${birthdayName}`,
    storyBlocks: [
      { title: 'La invitación', description: 'Un pase especial para nuestra pandilla favorita.', imageUrl: asset('mickey-gift') },
      { title: 'La aventura', description: 'Juegos, sorpresas y amigos en cada rincón.', imageUrl: asset('mickey-play') },
      { title: 'El gran deseo', description: 'Cantamos juntos y celebramos frente al pastel.', imageUrl: asset('mickey-cake') },
    ],
  };
  content.vipParents = {
    blessingMessage: `Con muchísima emoción, la familia de ${birthdayName} te invita a celebrar`,
    groups: [
      { groupTitle: 'Anfitriones', names: [`La familia de ${birthdayName}`] },
      { groupTitle: 'La pandilla', names: ['Amigos y familia'] },
      { groupTitle: 'Invitado estrella', names: ['¡Tú!'] },
    ],
  };
  const address = 'Parque México, Condesa, Ciudad de México';
  const query = encodeURIComponent(address);
  content.locations = [{
    id: 'mickey-party-place', type: 'reception', title: 'La gran fiesta',
    venueName: 'Parque México', address, time: '13:00 HRS',
    imageUrl: asset('mickey-friends'),
    coordinates: { lat: 19.4115, lng: -99.1691 },
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    wazeUrl: `https://waze.com/ul?q=${query}&navigate=yes`,
  }];
  content.timeline = [
    { id: 'mickey-1', time: '13:00 HRS', title: '¡Bienvenidos al club!', description: 'Recibimos a la pandilla con globos y sonrisas.', icon: 'party' },
    { id: 'mickey-2', time: '14:00 HRS', title: 'A jugar se ha dicho', description: 'Retos, brincos y muchas sorpresas para todos.', icon: 'party' },
    { id: 'mickey-3', time: '15:00 HRS', title: 'Foto con la pandilla', description: 'Un recuerdo junto a nuestros amigos favoritos.', icon: 'party' },
    { id: 'mickey-4', time: '16:00 HRS', title: 'Pastel y deseos', description: 'Las velitas se encienden para el gran momento.', icon: 'cake' },
  ];
  content.gallery = { layout: 'bento-grid', images: [
    { url: asset('mickey-gift'), caption: 'Una sorpresa para ti' },
    { url: asset('mickey-play'), caption: 'Diversión sin parar' },
    { url: asset('mickey-friends'), caption: 'Toda la pandilla reunida' },
    { url: asset('mickey-cake'), caption: 'El momento del pastel' },
  ] };
  content.dressCode = {
    title: 'Cómodos para jugar',
    womenNotes: 'Ropa cómoda, tenis y ganas de bailar. ¡Los colores del club son bienvenidos!',
    menNotes: 'Ropa fresca y zapatos cómodos para jugar toda la tarde.',
    reservedColors: [], reservedNote: '',
  };
  content.gifts = {
    introMessage: 'Tu presencia es el mejor regalo. Si deseas tener un detalle, habrá un buzón de felicitaciones durante la fiesta.',
    registries: [], cashEnvelopeAtVenue: true,
  };
  content.accommodation = [];
  content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#Cumple${birthdayName.replace(/\s+/g, '')}` };
  content.rsvp = { ...content.rsvp, askDietaryRestrictions: false, allowChildrenSelection: true, customConfirmationMessage: '¡Gracias por confirmar! Guarda tu pase digital con QR para entrar al club.' };
  content.sectionHeadings = {
    quote_story: { eyebrow: '01 / UNA INVITACIÓN ESPECIAL', title: 'La magia empieza contigo' },
    vip_parents: { eyebrow: '03 / NUESTRA PANDILLA', title: 'Juntos es mejor' },
    countdown: { eyebrow: '04 / CUENTA REGRESIVA', title: 'Falta poquito para jugar' },
    locations: { eyebrow: '05 / PUNTO DE ENCUENTRO', title: 'Aquí nos vemos' },
    timeline: { eyebrow: '06 / EL GRAN PLAN', title: 'Así será nuestro día' },
    gallery: { eyebrow: '07 / POSTALES DEL CLUB', title: 'Momentos para imaginar' },
    dress_code: { eyebrow: '08 / CÓDIGO DE DIVERSIÓN', title: 'Listos para jugar' },
    gifts: { eyebrow: '09 / CON CARIÑO', title: 'Tu sonrisa es el regalo' },
    social_features: { eyebrow: '10 / RECUERDOS COMPARTIDOS', title: 'Compartamos la alegría' },
    rsvp: { eyebrow: '11 / TU PASE ESTRELLA', title: 'Confirma tu lugar' },
  };
}

export function applyKidsWorldDefaults(config: InvitationConfig, id: KidsWorldTemplateId, title: string) {
  const name = kidsWorldName(title);
  if (id === 'minecraft-birthday') {
    applyMinecraftDefaults(config, name);
    return;
  }
  if (id === 'mickey-mouse-birthday') {
    applyMickeyDefaults(config, name);
    return;
  }
  if (id === 'safari-sunrise-adventure' || id === 'cowboy-ranch-roundup') {
    applySafariOrCowboyDefaults(config, id, name);
    return;
  }
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
    coverImageUrl: image(id, 'hero-mobile'),
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

type NewKidsWorldId = Extract<KidsWorldTemplateId, 'safari-sunrise-adventure' | 'cowboy-ranch-roundup'>;

function applySafariOrCowboyDefaults(config: InvitationConfig, id: NewKidsWorldId, name: string) {
  const safari = id === 'safari-sunrise-adventure';
  const content = config.content;
  config.audio.enabled = false;
  content.accommodation = [];
  config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : section.enabled }));
  config.theme.envelope.sealMonogram = safari ? '◉' : '★';
  config.theme.envelope.openButtonText = safari ? 'Abre tu pase de explorador' : 'Abre tu pase al rancho';
  content.hero = {
    ...content.hero,
    badgeText: safari ? 'SAFARI DE CUMPLEAÑOS' : 'FIESTA EN EL RANCHO',
    tagline: safari ? 'Una aventura entre jirafas, cebras y sonrisas' : 'Botas, ponis y una tarde para celebrar',
    coverImageUrl: image(id, 'hero-mobile'),
    focalPoint: { x: 50, y: 50 },
  };
  content.quoteStory = safari ? {
    quoteText: `¡El safari de ${name} está por comenzar! Prepara tu espíritu explorador para seguir huellas, conocer nuevos amigos y celebrar bajo el sol de la sabana.`,
    quoteAuthor: `La familia de ${name}`,
    storyBlocks: [
      { title: 'El primer avistamiento', description: 'Cada invitado llega con una sonrisa y una historia por descubrir.', imageUrl: image(id, 'hero-mobile') },
      { title: 'Juntos en la sabana', description: 'Jugaremos entre pistas, animales y caminos dorados.', imageUrl: image(id, 'trail') },
      { title: 'Nuestro mejor recuerdo', description: 'Terminamos el recorrido con pastel y amigos.', imageUrl: image(id, 'party') },
    ],
  } : {
    quoteText: `¡Abre las puertas del rancho de ${name}! Nos esperan ponis, juegos de feria, pastel y una tarde de aventuras bajo el cielo del oeste.`,
    quoteAuthor: `La familia de ${name}`,
    storyBlocks: [
      { title: 'Bienvenidos al rancho', description: 'La aventura empieza donde se encuentran los amigos.', imageUrl: image(id, 'hero-mobile') },
      { title: 'Un día del oeste', description: 'Juegos, risas y pistas por el sendero.', imageUrl: image(id, 'rodeo') },
      { title: 'El gran festejo', description: 'Cerramos con pastel y recuerdos al atardecer.', imageUrl: image(id, 'party') },
    ],
  };
  content.vipParents = {
    blessingMessage: safari ? `La familia de ${name} te invita a vivir juntos esta aventura` : `Con mucho cariño, la familia de ${name} te espera en el rancho`,
    groups: safari ? [
      { groupTitle: 'Guías del safari', names: [`La familia de ${name}`] },
      { groupTitle: 'Equipo explorador', names: ['Amigos y familia'] },
      { groupTitle: 'Invitado especial', names: ['¡Tú!'] },
    ] : [
      { groupTitle: 'Anfitriones del rancho', names: [`La familia de ${name}`] },
      { groupTitle: 'La pandilla vaquera', names: ['Amigos y familia'] },
      { groupTitle: 'Invitado especial', names: ['¡Tú!'] },
    ],
  };
  content.locations = [{
    ...content.locations[1],
    id: safari ? 'safari-camp' : 'cowboy-ranch',
    type: 'reception',
    title: safari ? 'Campamento del safari' : 'El gran rancho',
    time: '13:30 HRS',
    imageUrl: image(id, 'trail'),
  }];
  content.timeline = safari ? [
    { id: 'safari-1', time: '13:30 HRS', title: 'Bienvenidos al campamento', description: 'Recibimos a los exploradores y preparamos el mapa.', icon: 'party' },
    { id: 'safari-2', time: '14:15 HRS', title: 'Sigamos las huellas', description: 'Juegos y pistas a través de la sabana.', icon: 'party' },
    { id: 'safari-3', time: '15:15 HRS', title: 'Amigos de la sabana', description: 'Un encuentro lleno de sorpresas y risas.', icon: 'party' },
    { id: 'safari-4', time: '16:00 HRS', title: 'Picnic y pastel', description: 'Soplamos las velitas bajo el sol dorado.', icon: 'cake' },
  ] : [
    { id: 'cowboy-1', time: '13:30 HRS', title: 'Puertas del rancho', description: 'Recibimos a la pandilla vaquera.', icon: 'party' },
    { id: 'cowboy-2', time: '14:15 HRS', title: 'Juegos del oeste', description: 'Herraduras, pistas y muchas risas.', icon: 'party' },
    { id: 'cowboy-3', time: '15:15 HRS', title: 'Paseo por el sendero', description: 'Una aventura para pequeños vaqueros.', icon: 'party' },
    { id: 'cowboy-4', time: '16:00 HRS', title: 'Pastel al atardecer', description: 'Velitas y celebración en el rancho.', icon: 'cake' },
  ];
  content.gallery = {
    layout: 'bento-grid',
    images: safari ? [
      { url: image(id, 'hero-mobile'), caption: 'Comienza el safari' },
      { url: image(id, 'trail'), caption: 'El sendero dorado' },
      { url: image(id, 'animals'), caption: 'Amigos de la sabana' },
      { url: image(id, 'party'), caption: 'Picnic de cumpleaños' },
    ] : [
      { url: image(id, 'hero-mobile'), caption: 'Nuestro amigo del rancho' },
      { url: image(id, 'trail'), caption: 'La ruta del oeste' },
      { url: image(id, 'rodeo'), caption: 'Juegos vaqueros' },
      { url: image(id, 'party'), caption: 'Pastel en el rancho' },
    ],
  };
  content.dressCode = {
    title: safari ? 'Listos para la aventura' : 'Listos para el rancho',
    womenNotes: safari ? 'Ropa fresca, sombrero y tenis para seguir las huellas.' : 'Botas o tenis cómodos y un sombrero vaquero si te gusta.',
    menNotes: safari ? 'Ropa cómoda, protector solar y muchas ganas de explorar.' : 'Ropa fresca y calzado cómodo para jugar en el rancho.',
    reservedColors: [], reservedNote: '',
  };
  content.gifts = { introMessage: safari ? 'Tu compañía hace especial este safari. Si deseas dejar un detalle, habrá un rincón para sobres en el campamento.' : 'Tu compañía es el mejor regalo del rancho. Si deseas dejar un detalle, habrá un buzón para sobres en la fiesta.', registries: [], cashEnvelopeAtVenue: true };
  content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: false, hashtag: `#Cumple${name.replace(/\s+/g, '')}` };
  content.rsvp.customConfirmationMessage = 'Este pase es una vista previa local. La asistencia aún no se ha enviado.';
  content.sectionHeadings = {
    quote_story: { eyebrow: safari ? 'CAPÍTULO 01 · LA LLAMADA DE LA SABANA' : 'CAPÍTULO 01 · CARTA DEL RANCHO' },
    vip_parents: { eyebrow: safari ? 'EL EQUIPO DE SAFARI' : 'LA PANDILLA VAQUERA', title: safari ? 'Nuestros exploradores' : 'Nuestra pandilla' },
    countdown: { eyebrow: safari ? 'CUENTA DE EXPLORADORES' : 'ANTES DEL RODEO', title: safari ? 'El safari comienza en' : 'El rancho abre en' },
    locations: { eyebrow: safari ? 'BASE DE EXPLORACIÓN' : 'COORDENADAS DEL RANCHO', title: safari ? 'Aquí inicia la ruta' : 'Aquí nos vemos' },
    timeline: { eyebrow: safari ? 'RUTA DE LA SABANA' : 'PLAN DEL RANCHO', title: safari ? 'Nuestro recorrido' : 'Nuestra tarde vaquera' },
    gallery: { eyebrow: safari ? 'ÁLBUM DE EXPLORADORES' : 'POSTALES DEL OESTE', title: safari ? 'Postales del safari' : 'Recuerdos del rancho' },
    dress_code: { eyebrow: safari ? 'EQUIPO DE CAMPO' : 'EQUIPO VAQUERO', title: content.dressCode.title },
    gifts: { eyebrow: safari ? 'RINCÓN DE DETALLES' : 'BUZÓN DEL RANCHO', title: safari ? 'Un pequeño detalle' : 'Detalles del rancho' },
    social_features: { eyebrow: safari ? 'BITÁCORA DEL SAFARI' : 'ÁLBUM DEL RANCHO', title: safari ? 'Comparte la aventura' : 'Comparte el festejo' },
  };
}
