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
    const mareaCover = '/images/marea-azul/cover.jpg';
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : true }));
    content.hero.coverImageUrl = mareaCover;
    content.hero.badgeText = 'UNA BODA JUNTO AL MAR';
    content.hero.tagline = 'Un nuevo horizonte · Bahías de Huatulco, Oaxaca';
    content.quoteStory = {
      quoteText: 'Nuestra historia nos llevó por muchos caminos. Ahora elegimos el mismo horizonte y queremos celebrarlo contigo frente al mar.',
      quoteAuthor: title,
      storyBlocks: [
        { title: 'La primera marea', description: 'Entre viajes, sobremesas largas y atardeceres frente al mar descubrimos que nuestros caminos siempre buscaban la misma orilla.' },
        { title: 'El mismo horizonte', description: 'Aprendimos a navegar cada estación en equipo, celebrando la calma de los días simples y la emoción de cada nueva travesía.' },
        { title: 'Puerto de encuentro', description: 'Hoy reunimos a las personas que más queremos frente a las aguas de Huatulco para zarpar hacia nuestra siguiente etapa juntos.' },
      ],
    };
    content.vipParents = {
      blessingMessage: 'Con la bendición de nuestras familias y el cariño de quienes han acompañado nuestra travesía.',
      groups: [
        { groupTitle: 'Padres de la novia', names: ['Elena y Fernando'] },
        { groupTitle: 'Padres del novio', names: ['María del Carmen y Jorge'] },
        { groupTitle: 'Padrinos de horizonte', names: ['Camila, Santiago y nuestra familia'] },
      ],
    };
    content.locations = [{ ...content.locations[1], id: 'marea-celebracion', type: 'reception', title: 'Ceremonia, Coctel y Celebración',
      venueName: 'Playa Santa Cruz', address: 'Bahía Santa Cruz, Santa María Huatulco, Oaxaca', time: '17:00 HRS',
      coordinates: { lat: 15.75315, lng: -96.13118 }, ...directions('Playa Santa Cruz, Bahías de Huatulco, Oaxaca'), imageUrl: '/images/marea-azul/venue.jpg' }];
    content.timeline = [
      { id: 'marea-1', time: '16:30 HRS', title: 'Arribo y brisa de bienvenida', description: 'Recepción frente a la bahía con aguas frescas, cocos fríos y abanicos de palma.', icon: 'cocktail' },
      { id: 'marea-2', time: '17:00 HRS', title: 'Ceremonia frente al mar', description: 'Nos damos el sí con el sonido de las olas y la luz dorada de la costa.', icon: 'rings' },
      { id: 'marea-3', time: '18:30 HRS', title: 'Brindis de sol terracota', description: 'Mezcal artesanal, coctelería costera y música acústica al caer el sol.', icon: 'cocktail' },
      { id: 'marea-4', time: '20:00 HRS', title: 'Cena mediterránea y fiesta bajo las estrellas', description: 'Mesa compartida entre azulejos de cobalto, linternas cálidas y baile junto al mar.', icon: 'party' },
    ];
    content.gallery = {
      layout: 'bento-grid',
      images: [
        { url: '/images/marea-azul/cover.jpg', caption: 'Postal 01 · Nuestro horizonte en la bahía' },
        { url: '/images/marea-azul/sail.jpg', caption: 'Postal 02 · Travesía bajo el sol de la tarde' },
        { url: '/images/marea-azul/table.jpg', caption: 'Postal 03 · Lino, sal y cerámica de cobalto' },
        { url: '/images/marea-azul/toast.jpg', caption: 'Postal 04 · Brindis frente al Pacífico' },
      ],
    };
    content.dressCode = {
      title: 'Elegancia Costera / Lino Mediterráneo',
      womenNotes: 'Vestido largo o midi fluido en telas frescas y ligeras; sandalias de tacón ancho o cuñas aptas para terraza y arena.',
      menNotes: 'Traje de lino o algodón ligero en tonos arena, hueso, azul pizarra o salvia; sin corbata.',
      reservedColors: [
        { name: 'Blanco Cal', hex: '#FFFFFF' },
        { name: 'Marfil Lino', hex: '#F7F4E9' },
      ],
      reservedNote: 'El blanco y marfil están reservados exclusivamente para la pareja.',
    };
    content.gifts = {
      introMessage: 'El mejor regalo es que viajes a compartir este horizonte con nosotros. Si deseas hacernos un obsequio para nuestra nueva vida juntos, tendremos buzón de sobres en recepción.',
      registries: [],
      cashEnvelopeAtVenue: true,
    };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: '#NuestroNuevoHorizonte' };
    config.theme.envelope.sealMonogram = 'S&M';
  } else if (id === 'ritmo-de-dos') {
    const ritmoCover = '/images/ritmo-de-dos/cover.jpg';
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : true }));
    content.hero.coverImageUrl = ritmoCover;
    content.hero.badgeText = 'SESIÓN EN VIVO · LADO A';
    content.hero.tagline = 'Dos historias, un mismo ritmo · Colonia Roma, Ciudad de México';
    content.quoteStory = {
      quoteText: 'Nos encontramos entre discos, cafés y conversaciones interminables; sonó nuestra canción y desde entonces elegimos bailar la vida juntos.',
      quoteAuthor: title,
      storyBlocks: [
        { title: 'Primer compás', description: 'Una conversación casual que se convirtió en nuestro lugar favorito y nuestra primera lista de reproducción.' },
        { title: 'El puente', description: 'Viajes en carretera, conciertos bajo la lluvia y la certeza de querer escuchar todos los discos en la misma casa.' },
        { title: 'Nuestro coro', description: 'Hoy subimos el volumen rodeados de nuestra familia y amigos para grabar la noche más especial.' },
      ],
    };
    content.vipParents = {
      blessingMessage: 'Con el amor y la alegría de nuestras familias, te invitamos a compartir la pista en esta sesión única.',
      groups: [
        { groupTitle: 'Padres de la novia', names: ['Claudia y Roberto'] },
        { groupTitle: 'Padres del novio', names: ['Patricia y Alejandro'] },
        { groupTitle: 'Testigos de honor', names: ['Sofía, Diego y nuestros amigos'] },
      ],
    };
    content.locations = [{ ...content.locations[1], id: 'ritmo-venue', type: 'reception', title: 'Ceremonia, Coctel y Fiesta',
      venueName: 'Foro Roma', address: 'Coahuila 92, Roma Sur, 06760 Ciudad de México', time: '17:00 HRS',
      coordinates: { lat: 19.407, lng: -99.164 }, ...directions('Foro Roma, Coahuila 92, Roma Sur, Ciudad de México'), imageUrl: '/images/ritmo-de-dos/venue.jpg' }];
    content.timeline = [
      { id: 'ritmo-1', time: '17:00 HRS', title: 'Soundcheck & Ceremonia', description: 'Nos damos el sí entre luces cálidas y cuerdas acústicas.', icon: 'rings' },
      { id: 'ritmo-2', time: '18:30 HRS', title: 'Coctel Lado A', description: 'Mezcal artesanal, vinilos girando y brindis al atardecer.', icon: 'cocktail' },
      { id: 'ritmo-3', time: '20:00 HRS', title: 'Banquete en la terraza', description: 'Mesa compartida, discursos y nuestras canciones favoritas.', icon: 'dinner' },
      { id: 'ritmo-4', time: '21:30 HRS', title: 'Lado B: Pista Abierta', description: 'Primer baile, tornamesa en vivo y fiesta hasta el último encore.', icon: 'party' },
    ];
    content.gallery = {
      layout: 'bento-grid',
      images: [
        { url: '/images/ritmo-de-dos/cover.jpg', caption: 'Lado A · Sesión en estudio de vinilos' },
        { url: '/images/ritmo-de-dos/dance.jpg', caption: 'Nuestro compás favorito' },
        { url: '/images/ritmo-de-dos/vinyl.jpg', caption: 'Bulbos cálidos y 33⅓ RPM' },
        { url: '/images/ritmo-de-dos/toast.jpg', caption: 'Brindis de aguja dorada' },
      ],
    };
    content.dressCode = {
      title: 'Cóctel Retro con Personalidad',
      womenNotes: 'Vestido midi o largo en tonos cálidos o vibrantes con calzado cómodo para dominar la pista.',
      menNotes: 'Traje relajado en tonos tierra, tabaco, verde salvia o azul profundo; corbata opcional.',
      reservedColors: [
        { name: 'Marfil Seda', hex: '#FAF0E6' },
        { name: 'Blanco Hueso', hex: '#FFFDF7' },
      ],
      reservedNote: 'El blanco y marfil están reservados exclusivamente para la novia.',
    };
    content.gifts = {
      introMessage: 'Tu presencia en la pista es nuestro mejor regalo. Si deseas acompañarnos con un detalle para nuestro viaje y colección de vinilos, tendremos buzón de sobres en recepción.',
      registries: [],
      cashEnvelopeAtVenue: true,
    };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: '#RitmoDeDos' };
    config.theme.envelope.sealMonogram = 'M&P';
  } else if (id === 'mini-cosmos') {
    const name = title.replace(/^¡?(.+?)\s+cumple\s+#?\d+!?$/i, '$1').trim();
    const cosmosCover = '/images/mini-cosmos/astronaut.jpg';
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : true }));
    content.hero.coverImageUrl = cosmosCover;
    content.hero.badgeText = 'MISIÓN CUMPLEAÑOS';
    content.hero.tagline = 'Juegos, pastel y nuevos planetas · Ciudad de México';
    content.quoteStory = {
      quoteText: `¡La misión de ${name} está a punto de despegar! Prepara tu traje espacial para jugar, reír y celebrar una vuelta más alrededor del sol.`,
      quoteAuthor: `La familia de ${name}`,
      storyBlocks: [
        { title: 'El despegue', description: 'Seis vueltas completas alrededor del sol llenas de curiosidad, risas y descubrimientos.' },
        { title: 'Tu misión', description: 'Trae tus ganas de jugar, saltar en gravedad cero y explorar nuevos mundos con amigos.' },
        { title: 'La recompensa', description: 'Pastel estelar, piñata intergaláctica, sorpresas y una tarde inolvidable.' },
      ],
    };
    content.vipParents = {
      blessingMessage: `La tripulación de ${name} te espera en la plataforma de lanzamiento con mucha ilusión.`,
      groups: [
        { groupTitle: 'Capitanes de misión', names: [`Mamá y Papá de ${name}`] },
        { groupTitle: 'Comandantes de honor', names: ['Abuelitos y Padrinos'] },
        { groupTitle: 'Escuadrón estelar', names: ['Amigos, primos y familia'] },
      ],
    };
    content.locations = [{ ...content.locations[1], id: 'cosmos-base', type: 'reception', title: 'Base de lanzamiento y fiesta', time: '13:30 HRS',
      venueName: 'Papalote Museo del Niño', address: 'Av. Constituyentes 268, 2da Sección de Chapultepec, Ciudad de México',
      coordinates: { lat: 19.411, lng: -99.193 }, ...directions('Papalote Museo del Niño, Av. Constituyentes 268, Ciudad de México'), imageUrl: '/images/mini-cosmos/keyart.jpg' }];
    content.timeline = [
      { id: 'cosmos-1', time: '13:30 HRS', title: 'Abordaje y credenciales', description: 'Recepción en la base, entrega de cascos e insignias de misión.', icon: 'party' },
      { id: 'cosmos-2', time: '14:30 HRS', title: 'Misión gravedad cero', description: 'Juegos, circuito de obstáculos espaciales y aventuras en equipo.', icon: 'party' },
      { id: 'cosmos-3', time: '15:30 HRS', title: 'Recarga de combustible', description: 'Comida, snacks intergalácticos y mesa de postres.', icon: 'dinner' },
      { id: 'cosmos-4', time: '16:30 HRS', title: 'Supernova del pastel', description: 'Cantamos las mañanitas, partimos el pastel cohete y abrimos sorpresas.', icon: 'cake' },
    ];
    content.gallery = {
      layout: 'bento-grid',
      images: [
        { url: '/images/mini-cosmos/astronaut.jpg', caption: 'Comandante listo para despegar' },
        { url: '/images/mini-cosmos/play.jpg', caption: 'Centro de entrenamiento espacial' },
        { url: '/images/mini-cosmos/cake.jpg', caption: 'El pastel cohete de la misión' },
        { url: '/images/mini-cosmos/planets.jpg', caption: 'Nuevos mundos por explorar' },
      ],
    };
    content.dressCode = {
      title: 'Equipo de exploración',
      womenNotes: 'Ropa cómoda, tenis listos para correr y saltar; puedes traer tu toque espacial o estrellas.',
      menNotes: 'Ropa casual y calzado cómodo para acompañar todas las misiones del día.',
      reservedColors: [
        { name: 'Azul Cosmos', hex: '#101B3D' },
        { name: 'Menta Orbital', hex: '#8AD6C5' },
        { name: 'Terracota Solar', hex: '#B44D2E' },
      ],
      reservedNote: 'Paleta oficial de la misión por si quieres combinar tu outfit.',
    };
    content.gifts = {
      introMessage: `Tu presencia y tus ganas de jugar son el mejor regalo para ${name}. Si deseas tener un detalle especial, tendremos una cápsula de regalos y lluvia de sobres en la recepción.`,
      registries: [],
      cashEnvelopeAtVenue: true,
    };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: `#Mision${name.replace(/\s+/g, '')}` };
    content.rsvp.askDietaryRestrictions = true;
    content.rsvp.allowChildrenSelection = true;
    config.theme.envelope.sealMonogram = '★';
  } else {
    const name = title.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || title;
    const atelierCover = '/images/atelier-xv/cover.jpg';
    config.sectionsOrder = config.sectionsOrder.map(section => ({ ...section, enabled: section.id === 'accommodation' ? false : true }));
    content.hero.coverImageUrl = atelierCover;
    content.hero.badgeText = 'MI EDICIÓN XV';
    content.hero.tagline = 'Una noche de alta costura, luz y pasarela · Ciudad de México';
    content.quoteStory = {
      quoteText: 'Quince años de sueños, decisiones y personas que han iluminado mi camino. Hoy abro las puertas de mi propio atelier y quiero celebrar este nuevo capítulo contigo.',
      quoteAuthor: name,
      storyBlocks: [
        { title: 'La esencia', description: 'Cada recuerdo, risa y aprendizaje ha tejido la historia de quien soy hoy.' },
        { title: 'El diseño', description: 'Una velada concebida con luz propia, elegancia contemporánea y música inolvidable.' },
        { title: 'La pasarela', description: 'Esta noche damos el primer paso hacia todo lo que está por venir, rodeada de quienes más quiero.' },
      ],
    };
    content.vipParents = {
      blessingMessage: 'Con el amor y orgullo de mi familia, te invitamos a ser parte de esta edición irrepetible.',
      groups: [
        { groupTitle: 'Mis papás', names: ['Laura y Daniel'] },
        { groupTitle: 'Mis padrinos', names: ['Elena y Mauricio'] },
        { groupTitle: 'Círculo de honor', names: ['Abuelos, familia y amigos'] },
      ],
    };
    content.locations = [{ ...content.locations[1], id: 'atelier-gala', type: 'reception', title: 'Recepción y Gala XV', time: '19:00 HRS',
      venueName: 'Museo Franz Mayer', address: 'Av. Hidalgo 45, Centro Histórico, Ciudad de México',
      coordinates: { lat: 19.437, lng: -99.144 }, ...directions('Museo Franz Mayer, Av. Hidalgo 45, Ciudad de México'), imageUrl: '/images/atelier-xv/runway.jpg' }];
    content.timeline = [
      { id: 'atelier-1', time: '19:00 HRS', title: 'Red Carpet & Recepción', description: 'Bienvenida en el claustro iluminado y coctel de apertura.', icon: 'cocktail' },
      { id: 'atelier-2', time: '20:00 HRS', title: 'Mi entrada a pasarela', description: 'Presentación oficial, vals y primer brindis de la noche.', icon: 'waltz' },
      { id: 'atelier-3', time: '21:00 HRS', title: 'Cena de gala', description: 'Banquete bajo los arcos y música en vivo.', icon: 'dinner' },
      { id: 'atelier-4', time: '22:15 HRS', title: 'After Party & Pista', description: 'Abrimos la pista de baile, pastel couture y celebración.', icon: 'party' },
    ];
    content.gallery = {
      layout: 'bento-grid',
      images: [
        { url: '/images/atelier-xv/cover.jpg', caption: 'Retrato oficial · Edición XV' },
        { url: '/images/atelier-xv/atelier.jpg', caption: 'Savoir-faire en azul cobalto' },
        { url: '/images/atelier-xv/toast.jpg', caption: 'Brindis bajo candiles de cristal' },
        { url: '/images/atelier-xv/cake.jpg', caption: 'Alta repostería en seda y plata' },
      ],
    };
    content.dressCode = {
      title: 'Gala contemporánea',
      womenNotes: 'Vestido largo o conjunto de gala en el que te sientas radiante y lista para bailar.',
      menNotes: 'Traje formal o smoking contemporáneo de noche.',
      reservedColors: [
        { name: 'Azul Cobalto', hex: '#315BA1' },
        { name: 'Plata Satén', hex: '#A9B5C7' },
      ],
      reservedNote: 'El azul cobalto está reservado exclusivamente para la quinceañera.',
    };
    content.gifts = {
      introMessage: 'Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, habrá un buzón de sobres en la recepción durante la gala.',
      registries: [],
      cashEnvelopeAtVenue: true,
    };
    content.accommodation = [];
    content.socialFeatures = { enableSongRequests: true, enableAudioGuestbook: false, enableLiveDisposableCamera: true, hashtag: `#XV${name.replace(/\s+/g, '')}` };
    config.theme.envelope.sealMonogram = 'XV';
  }
}
