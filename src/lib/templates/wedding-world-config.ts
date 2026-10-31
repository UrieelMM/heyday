import type { InvitationConfig, TemplateId } from '@/types/invitation.types';

export type WeddingWorldTemplateId = Extract<TemplateId, 'glass-garden-vows' | 'midnight-constellation' | 'golden-harvest-vineyard'>;

export function isWeddingWorldTemplateId(id: TemplateId): id is WeddingWorldTemplateId {
  return id === 'glass-garden-vows' || id === 'midnight-constellation' || id === 'golden-harvest-vineyard';
}

export function weddingHeroDesktopSrc(mobileSrc: string): string | undefined {
  return /^\/images\/(glass-garden-vows|midnight-constellation|golden-harvest-vineyard)\/hero-mobile\.webp$/.test(mobileSrc)
    ? mobileSrc.replace('hero-mobile.webp', 'hero-desktop.webp') : undefined;
}

const image = (id: WeddingWorldTemplateId, file: string) => `/images/${id}/${file}.webp`;

export function applyWeddingWorldDefaults(config: InvitationConfig, id: WeddingWorldTemplateId, title: string) {
  const garden = id === 'glass-garden-vows';
  const stars = id === 'midnight-constellation';
  const lead = garden ? 'JARDÍN DE CRISTAL' : stars ? 'BAJO LAS ESTRELLAS' : 'VENDIMIA DE AMOR';
  const line = garden ? 'Nuestro amor florece contigo' : stars ? 'Estaba escrito en las estrellas' : 'Una cosecha de amor para compartir';
  const moments = garden
    ? ['Entre hojas de luz', 'La promesa que florece', 'Nuestra mesa en el jardín', 'Un recuerdo para siempre']
    : stars ? ['La primera estrella', 'Una promesa bajo la luna', 'Cena a cielo abierto', 'La noche es nuestra']
      : ['Una historia que madura', 'La promesa entre vides', 'Brindemos por nosotros', 'El comienzo de siempre'];
  config.content.hero = { ...config.content.hero, badgeText: lead, tagline: line, coverImageUrl: image(id, 'hero-mobile'), focalPoint: { x: 50, y: 50 } };
  config.theme.envelope.sealMonogram = garden ? '✿' : stars ? '✧' : '✦';
  config.theme.envelope.openButtonText = garden ? 'Abre nuestro jardín' : stars ? 'Abre nuestro cielo' : 'Abre nuestra historia';
  config.audio.enabled = false;
  config.content.quoteStory = {
    quoteText: garden
      ? 'Hay historias que crecen en silencio y un día se llenan de luz. Nuestra favorita es la que hemos escrito juntos, y queremos celebrarla contigo.'
      : stars ? 'De todas las coincidencias del universo, encontrarnos fue la más hermosa. Ahora queremos compartir contigo la noche en que comienza nuestro para siempre.'
        : 'Como las mejores cosechas, nuestro amor necesitó tiempo, cuidado y buenos momentos. Hoy levantamos la copa para empezar una nueva vida juntos.',
    quoteAuthor: title,
    storyBlocks: [
      { title: moments[0], description: garden ? 'Un encuentro sencillo que nos cambió la vida.' : stars ? 'Una coincidencia que iluminó nuestra historia.' : 'Una primera conversación que quisimos repetir siempre.', imageUrl: image(id, 'details') },
      { title: moments[1], description: garden ? 'Cada estación nos hizo crecer uno junto al otro.' : stars ? 'Aprendimos a mirar hacia el mismo horizonte.' : 'Compartimos los días buenos y cuidamos los difíciles.', imageUrl: image(id, 'ceremony') },
      { title: moments[2], description: 'Hoy celebramos el siguiente capítulo rodeados de quienes más queremos.', imageUrl: image(id, 'reception') },
    ],
  };
  config.content.vipParents.blessingMessage = garden ? 'Con el cariño de nuestras familias, hacemos florecer esta nueva etapa' : stars ? 'Con el amor de nuestras familias, compartimos la luz de esta noche' : 'Con el amor de nuestras familias, brindamos por este nuevo comienzo';
  config.content.locations = config.content.locations.map((location, index) => ({ ...location, imageUrl: image(id, index ? 'reception' : 'ceremony') }));
  config.content.timeline = config.content.timeline.map((event, index) => ({ ...event,
    title: garden ? ['La promesa', 'Cóctel entre flores', 'Cena en el invernadero', 'Baile bajo las luces'][index]
      : stars ? ['Ceremonia al anochecer', 'Primera copa', 'Cena bajo las estrellas', 'Baile hasta el alba'][index]
        : ['Votos entre viñas', 'Cóctel de vendimia', 'Banquete de cosecha', 'Brindis y baile'][index],
    description: garden ? ['Nos reunimos para ver florecer una nueva historia.', 'Una pausa para conversar en el jardín.', 'Compartimos la mesa y nuestras mejores memorias.', 'La noche termina bailando juntos.'][index]
      : stars ? ['La tarde se convierte en nuestra noche especial.', 'Encendemos las primeras luces de la velada.', 'Una mesa para celebrar bajo el cielo abierto.', 'Dejamos que la música nos lleve.'][index]
        : ['Una promesa entre vides y luz dorada.', 'Nos encontramos entre copas y conversaciones.', 'Sabores de la tierra para compartir.', 'Un brindis por todo lo que vendrá.'][index],
  }));
  config.content.gallery = { layout: 'bento-grid', images: [
    { url: image(id, 'hero-mobile'), caption: moments[0] },
    { url: image(id, 'ceremony'), caption: moments[1] },
    { url: image(id, 'reception'), caption: moments[2] },
    { url: image(id, 'details'), caption: moments[3] },
  ] };
  config.content.dressCode = {
    title: garden ? 'Elegancia de jardín' : stars ? 'Noche de gala' : 'Elegancia en el viñedo',
    womenNotes: garden ? 'Vestido de cóctel o largo en tonos suaves. Evita blanco y marfil.' : stars ? 'Vestido largo de noche. Evita blanco, marfil y plateado.' : 'Vestido de cóctel o largo. Evita blanco y marfil.',
    menNotes: garden ? 'Traje formal ligero. El jardín invita a zapatos cómodos.' : stars ? 'Traje oscuro o smoking.' : 'Traje formal en tonos cálidos u oscuros.',
    reservedColors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Marfil', hex: '#FAF0E6' }], reservedNote: 'Estos colores están reservados para la pareja.',
  };
  config.content.socialFeatures = { ...config.content.socialFeatures, hashtag: `#${title.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '')}` };
  config.content.sectionHeadings = {
    quote_story: { eyebrow: garden ? 'CAPÍTULO 01 · EL HERBARIO' : stars ? 'CAPÍTULO 01 · LA CONSTELACIÓN' : 'CAPÍTULO 01 · LA COSECHA' },
    vip_parents: { eyebrow: 'NUESTRAS FAMILIAS', title: 'Con todo su amor' },
    countdown: { eyebrow: 'LA CUENTA REGRESIVA', title: 'Cada día nos acerca' },
    locations: { eyebrow: garden ? 'COORDENADAS DEL JARDÍN' : stars ? 'COORDENADAS DE LA NOCHE' : 'COORDENADAS DEL VIÑEDO', title: 'Nos vemos aquí' },
    timeline: { eyebrow: 'CUATRO MOMENTOS', title: garden ? 'El día florece así' : stars ? 'Una noche para recordar' : 'Nuestra celebración, paso a paso' },
    gallery: { eyebrow: 'NUESTRA ATMÓSFERA', title: 'Instantes para guardar' },
    dress_code: { eyebrow: 'CÓDIGO DE VESTIMENTA' },
    gifts: { eyebrow: 'DETALLES CON AMOR' },
    rsvp: { eyebrow: 'TE ESPERAMOS', title: 'Confirma tu asistencia' },
  };
}
