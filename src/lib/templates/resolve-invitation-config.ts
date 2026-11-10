import type { InvitationConfig, TemplateId } from '@/types/invitation.types';
import { createDefaultInvitationConfig } from './templates-catalog';

function eternalContent(config: InvitationConfig): InvitationConfig['content'] {
  const raw = config.content;

  const isLegacyCover =
    !raw.hero.coverImageUrl ||
    raw.hero.coverImageUrl.includes('unsplash.com/photo-1519741497674') ||
    raw.hero.coverImageUrl.includes('unsplash.com');

  const hero = {
    ...raw.hero,
    badgeText: raw.hero.badgeText || 'NOS CASAMOS',
    mainTitle: raw.hero.mainTitle || 'Sofía & Mateo',
    tagline:
      raw.hero.tagline || 'Un amor para toda la vida • San Miguel de Allende',
    coverImageUrl: isLegacyCover
      ? '/images/eternal-elegance/cover.jpg'
      : raw.hero.coverImageUrl,
  };

  const defaultBlocks = [
    {
      title: 'El primer encuentro',
      description:
        'Una coincidencia bastó para descubrir que compartíamos la misma forma de mirar la vida, reír sin prisa y soñar en grande.',
      imageUrl: '/images/eternal-elegance/vows.jpg',
    },
    {
      title: 'La promesa en calma',
      description:
        'Entre viajes, cafés largos y complicidad cotidiana, supimos que nuestro hogar no era un lugar, sino estar juntos.',
      imageUrl: '/images/eternal-elegance/ceremony.jpg',
    },
    {
      title: 'Nuestro gran capítulo',
      description:
        'Hoy reunimos a nuestras familias y amigos más queridos en el corazón de San Miguel de Allende para celebrar nuestro sí para siempre.',
      imageUrl: '/images/eternal-elegance/hacienda.jpg',
    },
  ];

  const existingBlocks = raw.quoteStory.storyBlocks || [];
  const isDefaultSeedBlocks =
    (existingBlocks[0]?.title === 'El encuentro' &&
      !existingBlocks[0]?.imageUrl);

  const quoteStory = {
    ...raw.quoteStory,
    quoteText:
      raw.quoteStory.quoteText ||
      'En medio de todo el ruido del mundo, encontramos en el otro nuestro lugar favorito para volver siempre.',
    quoteAuthor: raw.quoteStory.quoteAuthor || hero.mainTitle,
    storyBlocks: isDefaultSeedBlocks
      ? defaultBlocks
      : existingBlocks.map((b, idx) => ({
          ...b,
          imageUrl:
            b.imageUrl && !b.imageUrl.includes('unsplash.com')
              ? b.imageUrl
              : defaultBlocks[idx % defaultBlocks.length].imageUrl,
        })),
  };

  const defaultGroups = [
    {
      groupTitle: 'Padres de la Novia',
      names: ['Sra. Elena Morales de Garza', 'Sr. Fernando Garza Treviño'],
    },
    {
      groupTitle: 'Padres del Novio',
      names: ['Sra. María del Carmen Villarreal', 'Sr. Jorge Alberto Elizondo'],
    },
    {
      groupTitle: 'Padrinos de Velación',
      names: ['Lic. Roberto Garza & Sra. Lucía Méndez'],
    },
  ];

  const vipParents = {
    blessingMessage:
      raw.vipParents.blessingMessage ||
      'Con la bendición de Dios y el amor incondicional de nuestros padres',
    groups:
      Array.isArray(raw.vipParents.groups)
        ? raw.vipParents.groups
        : defaultGroups,
  };

  const locations = (raw.locations || []).map((loc, idx) => ({
    ...loc,
    imageUrl:
      !loc.imageUrl || loc.imageUrl.includes('unsplash.com')
        ? idx === 0
          ? '/images/eternal-elegance/ceremony.jpg'
          : '/images/eternal-elegance/hacienda.jpg'
        : loc.imageUrl,
  }));

  const isLegacyGallery =
    !raw.gallery?.images ||
    (raw.gallery.images.length > 0 && raw.gallery.images.every((img) => img.url.includes('unsplash.com')));

  const gallery = {
    ...raw.gallery,
    images: isLegacyGallery
      ? [
          {
            url: '/images/eternal-elegance/cover.jpg',
            caption: 'El comienzo de nuestro para siempre',
          },
          {
            url: '/images/eternal-elegance/vows.jpg',
            caption: 'La promesa que nos une',
          },
          {
            url: '/images/eternal-elegance/hacienda.jpg',
            caption: 'Nuestra mesa bajo las estrellas',
          },
          {
            url: '/images/eternal-elegance/toast.jpg',
            caption: 'Brindis por toda una vida juntos',
          },
        ]
      : raw.gallery.images,
  };

  return {
    ...raw,
    hero,
    quoteStory,
    vipParents,
    locations,
    gallery,
  };
}

function neonContent(config: InvitationConfig): InvitationConfig['content'] {
  const raw = config.content;

  const isLegacyCover =
    !raw.hero.coverImageUrl ||
    raw.hero.coverImageUrl.includes('unsplash.com/photo-1519741497674') ||
    raw.hero.coverImageUrl.includes('unsplash.com');

  const hero = {
    ...raw.hero,
    badgeText:
      !raw.hero.badgeText || raw.hero.badgeText === 'MIS XV AÑOS'
        ? 'NEON XV EUPHORIA · VIP NIGHT'
        : raw.hero.badgeText,
    mainTitle:
      !raw.hero.mainTitle || raw.hero.mainTitle.includes('Sofía & Mateo')
        ? 'Renata · XV'
        : raw.hero.mainTitle,
    tagline:
      !raw.hero.tagline || raw.hero.tagline.includes('Huatulco')
        ? 'Una noche de luces, beats y energía inolvidable'
        : raw.hero.tagline,
    coverImageUrl: isLegacyCover
      ? '/images/neon-xv-euphoria/cover.jpg'
      : raw.hero.coverImageUrl,
  };

  const defaultBlocks = [
    {
      title: 'De sueños a luces de neón',
      description:
        'Cada etapa de mi vida ha tenido su propio soundtrack, y hoy quiero subirle el volumen junto a las personas que siempre han estado conmigo.',
      imageUrl: '/images/neon-xv-euphoria/glow.jpg',
    },
    {
      title: 'Una noche diseñada a mi estilo',
      description:
        'Nada de protocolos aburridos: preparamos un club nocturno lleno de láseres, espejos, música increíble y sorpresas en cada rincón.',
      imageUrl: '/images/neon-xv-euphoria/stage.jpg',
    },
    {
      title: 'Contigo en primera fila',
      description:
        'Esta noche no está completa sin ti. Trae tu mejor actitud, tus ganas de bailar y prepárate para brillar hasta la medianoche.',
      imageUrl: '/images/neon-xv-euphoria/dancefloor.jpg',
    },
  ];

  const existingBlocks = raw.quoteStory.storyBlocks || [];
  const isDefaultSeedBlocks =
    existingBlocks[0]?.title === 'El encuentro' && !existingBlocks[0]?.imageUrl;

  const quoteStory = {
    ...raw.quoteStory,
    quoteText:
      raw.quoteStory.quoteText ||
      'Quince años de sueños se encienden hoy en una sola frecuencia: brillar sin límites con quienes hacen única mi historia.',
    quoteAuthor: raw.quoteStory.quoteAuthor || hero.mainTitle,
    storyBlocks: isDefaultSeedBlocks ? defaultBlocks : existingBlocks,
  };

  const defaultGroups = [
    { groupTitle: 'Mis Padres', names: ['Claudia Morales & Alejandro Vega'] },
    { groupTitle: 'Mis Padrinos', names: ['Mariana Solís & Rodrigo Méndez'] },
    { groupTitle: 'Crew & Familia', names: ['Mis hermanos, primos y mejores amigos'] },
  ];

  const vipParents = {
    blessingMessage:
      raw.vipParents.blessingMessage ||
      'Gracias por acompañarme en cada paso y encender conmigo el escenario más especial de mis XV años.',
    groups:
      Array.isArray(raw.vipParents.groups)
        ? raw.vipParents.groups
        : defaultGroups,
  };

  const defaultTimeline = [
    {
      id: 'nx-1',
      time: '20:00 HRS',
      title: 'Red Carpet & Glow Check-In',
      description: 'Pulseras holográficas, túnel de neón, glitter bar y mocktails.',
      icon: 'cocktail' as const,
    },
    {
      id: 'nx-2',
      time: '21:00 HRS',
      title: 'Main Stage · Mi Entrada XV',
      description: 'Show de láseres, coreografía principal y brindis con chispas frías.',
      icon: 'waltz' as const,
    },
    {
      id: 'nx-3',
      time: '22:15 HRS',
      title: 'Mirrorball & DJ Live Set',
      description: 'Se abre la pista LED con DJ en vivo, robots de luz y accesorios UV.',
      icon: 'party' as const,
    },
    {
      id: 'nx-4',
      time: '00:00 HRS',
      title: 'Afterglow, Pastel & Late-Night Bites',
      description: 'Pastel metálico de medianoche, snacks y cierre épico.',
      icon: 'cake' as const,
    },
  ];

  const isLegacyTimeline =
    !raw.timeline ||
    (raw.timeline.length === 4 && raw.timeline[0]?.id === 'tl-1' && raw.timeline[0]?.title === 'Ceremonia Religiosa');

  const timeline = isLegacyTimeline ? defaultTimeline : raw.timeline;

  const isLegacyGallery =
    !raw.gallery?.images ||
    (raw.gallery.images.length > 0 && raw.gallery.images.every((img) => img.url.includes('unsplash.com')));

  const gallery = {
    ...raw.gallery,
    images: isLegacyGallery
      ? [
          {
            url: '/images/neon-xv-euphoria/cover.jpg',
            caption: 'Backstage Editorial · Neon XV',
          },
          {
            url: '/images/neon-xv-euphoria/stage.jpg',
            caption: 'Main Stage · Laser Show',
          },
          {
            url: '/images/neon-xv-euphoria/dancefloor.jpg',
            caption: 'Mirrorball & Pista LED',
          },
          {
            url: '/images/neon-xv-euphoria/toast.jpg',
            caption: 'Midnight Sparklers & Afterglow',
          },
        ]
      : raw.gallery.images,
  };

  return {
    ...raw,
    hero,
    quoteStory,
    vipParents,
    timeline,
    gallery,
  };
}

function cosmosContent(config: InvitationConfig) {
  const source = config.content;
  const defaults = createDefaultInvitationConfig('mini-cosmos', source.hero.mainTitle || 'Leo cumple 6').content;

  const isLegacyCover =
    !source.hero.coverImageUrl ||
    source.hero.coverImageUrl === '/images/mini-cosmos/cover.svg';

  const isLegacyGallery =
    source.gallery.images.length > 0 &&
    source.gallery.images.length <= 2 &&
    source.gallery.images.every(
      (img) =>
        img.url === '/images/mini-cosmos/cover.svg' ||
        img.url === '/images/mini-cosmos/detail.svg'
    );

  const isLegacySingleGroup =
    source.vipParents.groups.length === 1 &&
    source.vipParents.groups[0]?.groupTitle === 'Tripulación anfitriona';

  const isLegacyBlocks =
    (source.quoteStory.storyBlocks?.length ?? 0) === 2 &&
    source.quoteStory.storyBlocks?.[0]?.title === 'Tu misión';

  const isLegacyTimeline =
    source.timeline.length === 3 &&
    source.timeline[0]?.id === 'cosmos-1' &&
    source.timeline[0]?.title === 'Abordaje';

  return {
    ...source,
    hero: {
      ...source.hero,
      coverImageUrl: isLegacyCover ? defaults.hero.coverImageUrl : source.hero.coverImageUrl,
    },
    quoteStory: {
      ...source.quoteStory,
      storyBlocks: isLegacyBlocks ? defaults.quoteStory.storyBlocks : source.quoteStory.storyBlocks,
    },
    vipParents: {
      ...source.vipParents,
      groups: isLegacySingleGroup ? defaults.vipParents.groups : source.vipParents.groups,
    },
    locations: source.locations.map((loc) => ({
      ...loc,
      imageUrl:
        !loc.imageUrl || loc.imageUrl === '/images/mini-cosmos/cover.svg'
          ? '/images/mini-cosmos/keyart.jpg'
          : loc.imageUrl,
    })),
    timeline: isLegacyTimeline ? defaults.timeline : source.timeline,
    gallery: isLegacyGallery ? defaults.gallery : source.gallery,
  };
}

function atelierContent(config: InvitationConfig) {
  const source = config.content;
  const defaults = createDefaultInvitationConfig(
    'atelier-xv',
    source.hero.mainTitle || 'Valentina'
  ).content;

  const isLegacyCover =
    !source.hero.coverImageUrl ||
    source.hero.coverImageUrl === '/images/atelier-xv/cover.svg';

  const isLegacyGallery =
    source.gallery.images.length > 0 &&
    source.gallery.images.length <= 2 &&
    source.gallery.images.every(
      (img) =>
        img.url === '/images/atelier-xv/cover.svg' ||
        img.url === '/images/atelier-xv/detail.svg'
    );

  const isLegacyBlocks =
    (source.quoteStory.storyBlocks?.length ?? 0) === 2 &&
    source.quoteStory.storyBlocks?.[0]?.title === 'Lo que soy';

  const isLegacyTimeline =
    source.timeline.length === 3 &&
    source.timeline[0]?.id === 'atelier-1' &&
    source.timeline[0]?.title === 'Bienvenida';

  return {
    ...source,
    hero: {
      ...source.hero,
      coverImageUrl: isLegacyCover ? defaults.hero.coverImageUrl : source.hero.coverImageUrl,
    },
    quoteStory: {
      ...source.quoteStory,
      storyBlocks: isLegacyBlocks ? defaults.quoteStory.storyBlocks : source.quoteStory.storyBlocks,
    },
    locations: source.locations.map((loc) => ({
      ...loc,
      imageUrl:
        !loc.imageUrl || loc.imageUrl === '/images/atelier-xv/cover.svg'
          ? '/images/atelier-xv/runway.jpg'
          : loc.imageUrl,
    })),
    timeline: isLegacyTimeline ? defaults.timeline : source.timeline,
    gallery: isLegacyGallery ? defaults.gallery : source.gallery,
  };
}

function ritmoContent(config: InvitationConfig) {
  const source = config.content;
  const defaults = createDefaultInvitationConfig(
    'ritmo-de-dos',
    source.hero.mainTitle || 'Marina & Pablo'
  ).content;

  const isLegacyCover =
    !source.hero.coverImageUrl ||
    source.hero.coverImageUrl === '/images/ritmo-de-dos/cover.svg';

  const isLegacyGallery =
    source.gallery.images.length > 0 &&
    source.gallery.images.length <= 2 &&
    source.gallery.images.every(
      (img) =>
        img.url === '/images/ritmo-de-dos/cover.svg' ||
        img.url === '/images/ritmo-de-dos/detail.svg'
    );

  const isLegacyBlocks =
    (source.quoteStory.storyBlocks?.length ?? 0) === 2 &&
    source.quoteStory.storyBlocks?.[0]?.title === 'Primer compás';

  const isLegacyTimeline =
    source.timeline.length === 3 &&
    source.timeline[0]?.id === 'ritmo-1' &&
    source.timeline[0]?.title === 'Coctel de bienvenida';

  return {
    ...source,
    hero: {
      ...source.hero,
      coverImageUrl: isLegacyCover ? defaults.hero.coverImageUrl : source.hero.coverImageUrl,
    },
    quoteStory: {
      ...source.quoteStory,
      storyBlocks: isLegacyBlocks ? defaults.quoteStory.storyBlocks : source.quoteStory.storyBlocks,
    },
    locations: source.locations.map((loc) => ({
      ...loc,
      imageUrl:
        !loc.imageUrl || loc.imageUrl === '/images/ritmo-de-dos/cover.svg'
          ? '/images/ritmo-de-dos/venue.jpg'
          : loc.imageUrl,
    })),
    timeline: isLegacyTimeline ? defaults.timeline : source.timeline,
    gallery: isLegacyGallery ? defaults.gallery : source.gallery,
  };
}

export function extractCoupleParts(mainTitle: string): [string, string] {
  const raw = (mainTitle || 'Sofía & Mateo').trim();
  const parts = raw.split(/\s*(?:&|\+)\s*|\s+y\s+/i).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' & ')];
  }
  return [raw, 'Nuestro Horizonte'];
}

function mareaContent(config: InvitationConfig): InvitationConfig['content'] {
  const raw = config.content;
  const [first, second] = extractCoupleParts(raw.hero.mainTitle);
  const coupleLabel = `${first} & ${second}`;

  const isLegacyCover =
    !raw.hero.coverImageUrl ||
    raw.hero.coverImageUrl.includes('/images/marea-azul/cover.svg') ||
    raw.hero.coverImageUrl.includes('unsplash.com/photo-1519741497674');

  const hero = {
    ...raw.hero,
    badgeText:
      !raw.hero.badgeText || raw.hero.badgeText === 'NOS CASAMOS'
        ? 'UNA BODA JUNTO AL MAR'
        : raw.hero.badgeText,
    tagline:
      !raw.hero.tagline || raw.hero.tagline.includes('Huatulco')
        ? 'Un nuevo horizonte · Bahías de Huatulco, Oaxaca'
        : raw.hero.tagline,
    coverImageUrl: isLegacyCover ? '/images/marea-azul/cover.jpg' : raw.hero.coverImageUrl,
  };

  const defaultBlocks = [
    {
      title: 'La primera marea',
      description:
        'Entre viajes, sobremesas largas y atardeceres frente al mar descubrimos que nuestros caminos siempre buscaban la misma orilla.',
    },
    {
      title: 'El mismo horizonte',
      description:
        'Aprendimos a navegar cada estación en equipo, celebrando la calma de los días simples y la emoción de cada nueva travesía.',
    },
    {
      title: 'Puerto de encuentro',
      description:
        'Hoy reunimos a las personas que más queremos frente a las aguas de Huatulco para zarpar hacia nuestra siguiente etapa juntos.',
    },
  ];

  const existingBlocks = raw.quoteStory.storyBlocks || [];
  const isDefaultSeedBlocks =
    existingBlocks.length <= 2 &&
    (existingBlocks.length === 0 || existingBlocks[0]?.title === 'El encuentro');

  const quoteStory = {
    ...raw.quoteStory,
    quoteText:
      raw.quoteStory.quoteText ||
      'Nuestra historia nos llevó por muchos caminos. Ahora elegimos el mismo horizonte y queremos celebrarlo contigo frente al mar.',
    quoteAuthor: raw.quoteStory.quoteAuthor || coupleLabel,
    storyBlocks: isDefaultSeedBlocks ? defaultBlocks : existingBlocks,
  };

  const defaultGroups = [
    { groupTitle: 'Padres de la novia', names: ['Elena y Fernando'] },
    { groupTitle: 'Padres del novio', names: ['María del Carmen y Jorge'] },
    { groupTitle: 'Padrinos de horizonte', names: ['Camila, Santiago y nuestra familia'] },
  ];

  const vipParents = {
    blessingMessage:
      raw.vipParents.blessingMessage ||
      'Con la bendición de nuestras familias y el cariño de quienes han acompañado nuestra travesía.',
    groups:
      Array.isArray(raw.vipParents.groups)
        ? raw.vipParents.groups
        : defaultGroups,
  };

  const locations = (raw.locations || []).map((loc) => ({
    ...loc,
    imageUrl:
      !loc.imageUrl || loc.imageUrl.endsWith('.svg')
        ? '/images/marea-azul/venue.jpg'
        : loc.imageUrl,
  }));

  const defaultTimeline = [
    {
      id: 'marea-1',
      time: '16:30 HRS',
      title: 'Arribo y brisa de bienvenida',
      description: 'Recepción frente a la bahía con aguas frescas, cocos fríos y abanicos de palma.',
      icon: 'cocktail' as const,
    },
    {
      id: 'marea-2',
      time: '17:00 HRS',
      title: 'Ceremonia frente al mar',
      description: 'Nos damos el sí con el sonido de las olas y la luz dorada de la costa.',
      icon: 'rings' as const,
    },
    {
      id: 'marea-3',
      time: '18:30 HRS',
      title: 'Brindis de sol terracota',
      description: 'Mezcal artesanal, coctelería costera y música acústica al caer el sol.',
      icon: 'cocktail' as const,
    },
    {
      id: 'marea-4',
      time: '20:00 HRS',
      title: 'Cena mediterránea y fiesta bajo las estrellas',
      description: 'Mesa compartida entre azulejos de cobalto, linternas cálidas y baile junto al mar.',
      icon: 'party' as const,
    },
  ];

  const isLegacyTimeline =
    !raw.timeline ||
    raw.timeline.length <= 3 && raw.timeline[0]?.title === 'El encuentro';

  const timeline = isLegacyTimeline ? defaultTimeline : raw.timeline;

  const isLegacyGallery =
    !raw.gallery?.images ||
    (raw.gallery.images.length > 0 && raw.gallery.images.every((img) => img.url.startsWith('/images/marea-azul/') && img.url.endsWith('.svg')));

  const gallery = {
    ...raw.gallery,
    images: isLegacyGallery
      ? [
          {
            url: '/images/marea-azul/cover.jpg',
            caption: 'Postal 01 · Nuestro horizonte en la bahía',
          },
          {
            url: '/images/marea-azul/sail.jpg',
            caption: 'Postal 02 · Travesía bajo el sol de la tarde',
          },
          {
            url: '/images/marea-azul/table.jpg',
            caption: 'Postal 03 · Lino, sal y cerámica de cobalto',
          },
          {
            url: '/images/marea-azul/toast.jpg',
            caption: 'Postal 04 · Brindis frente al Pacífico',
          },
        ]
      : raw.gallery.images,
  };

  const dressCode = {
    ...raw.dressCode,
    title: raw.dressCode.title || 'Elegancia Costera / Lino Mediterráneo',
    womenNotes:
      raw.dressCode.womenNotes ||
      'Vestido largo o midi fluido en telas frescas y ligeras; sandalias de tacón ancho o cuñas aptas para terraza y arena.',
    menNotes:
      raw.dressCode.menNotes ||
      'Traje de lino o algodón ligero en tonos arena, hueso, azul pizarra o salvia; sin corbata.',
    reservedColors:
      raw.dressCode.reservedColors && raw.dressCode.reservedColors.length > 0
        ? raw.dressCode.reservedColors
        : [
            { name: 'Blanco Cal', hex: '#FFFFFF' },
            { name: 'Marfil Lino', hex: '#F7F4E9' },
          ],
    reservedNote:
      raw.dressCode.reservedNote ||
      'El blanco y marfil están reservados exclusivamente para la pareja.',
  };

  const gifts = {
    introMessage:
      raw.gifts.introMessage ||
      'El mejor regalo es que viajes a compartir este horizonte con nosotros. Si deseas hacernos un obsequio para nuestra nueva vida juntos, tendremos buzón de sobres en recepción.',
    registries: raw.gifts.registries || [],
    bankTransfer: raw.gifts.bankTransfer,
    cashEnvelopeAtVenue:
      raw.gifts.registries?.length || raw.gifts.bankTransfer?.enabled
        ? raw.gifts.cashEnvelopeAtVenue
        : true,
  };

  return {
    ...raw,
    hero,
    quoteStory,
    vipParents,
    locations,
    timeline,
    gallery,
    dressCode,
    gifts,
  };
}

function royalContent(config: InvitationConfig) {
  const source = config.content;
  const title = source.hero.mainTitle === 'Sofía & Mateo' ? 'Mis XV: Valentina' : source.hero.mainTitle;
  const xv = createDefaultInvitationConfig('royal-xv-enchanted', title).content;
  const weddingStory = /nuestros caminos|nuestro para siempre|nuestro comienzo|gran día/i.test(`${source.quoteStory.quoteText} ${source.quoteStory.storyBlocks?.map((part) => part.title).join(' ') || ''}`);
  const weddingParents = source.vipParents.groups.some((group) => /padres de la novia|padres del novio/i.test(group.groupTitle));
  const weddingLocations = source.locations.some((location) => /^loc-ceremony$|^loc-reception$/.test(location.id));
  const weddingTimeline = source.timeline.some((item) => /ceremonia religiosa|primer baile y fiesta|cena de gala/i.test(item.title));
  const weddingGallery = source.gallery.images.some((image) => /compromiso|por siempre juntos/i.test(image.caption || ''));
  const weddingDress = /festejados|marfil|blanco, marfil/i.test(`${source.dressCode.reservedNote} ${source.dressCode.womenNotes}`);
  const weddingGifts = source.gifts.registries.some((registry) => /wedding|SOFIA-MATEO/i.test(`${registry.url} ${registry.eventNumber || ''}`)) || /nuestro mejor regalo/i.test(source.gifts.introMessage);
  return {
    ...source,
    hero: { ...source.hero, mainTitle: title, badgeText: source.hero.badgeText === '¡NOS CASAMOS!' ? xv.hero.badgeText : source.hero.badgeText, coverImageUrl: source.hero.coverImageUrl === '/images/royal-xv/enchanted-garden.jpg' ? xv.hero.coverImageUrl : source.hero.coverImageUrl },
    quoteStory: weddingStory ? xv.quoteStory : source.quoteStory,
    vipParents: weddingParents ? xv.vipParents : source.vipParents,
    locations: weddingLocations ? xv.locations : source.locations,
    timeline: weddingTimeline ? xv.timeline : source.timeline,
    gallery: weddingGallery ? xv.gallery : source.gallery,
    dressCode: weddingDress ? xv.dressCode : source.dressCode,
    gifts: weddingGifts ? xv.gifts : source.gifts,
  };
}

const legacyContent: Partial<Record<TemplateId, (config: InvitationConfig) => InvitationConfig['content']>> = {
  'eternal-elegance': eternalContent,
  'neon-xv-euphoria': neonContent,
  'mini-cosmos': cosmosContent,
  'atelier-xv': atelierContent,
  'ritmo-de-dos': ritmoContent,
  'marea-azul': mareaContent,
  'royal-xv-enchanted': royalContent,
};

// Apply compatibility defaults before editing. Saved content is already resolved,
// so intentional empty fields or shorter lists stay exactly as the editor left them.
export function resolveInvitationConfig(templateId: TemplateId, config: InvitationConfig): InvitationConfig {
  if (config.contentVersion === 1) return config;
  const resolve = legacyContent[templateId];
  const content = resolve?.(config) ?? config.content;
  // Rodeo Rosa displayed its album even when the original seed stored false.
  if (templateId === 'rodeo-rosa') {
    return { ...config, contentVersion: 1, content: {
      ...content,
      socialFeatures: { ...content.socialFeatures, enableLiveDisposableCamera: true },
    } };
  }
  return resolve ? { ...config, content, contentVersion: 1 } : config;
}
