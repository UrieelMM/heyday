'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  Anchor,
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Copy,
  CreditCard,
  ExternalLink,
  Gift,
  Heart,
  Hotel,
  MapPin,
  Music,
  Navigation,
  Shirt,
  Sparkles,
  Sun,
  Ticket,
  Users,
  Waves,
  Wind,
} from 'lucide-react';
import type {
  GuestGroup,
  InvitationConfig,
  SectionId,
  TemplateId,
} from '@/types/invitation.types';
import {
  buildGoogleCalendarUrl,
  buildIcsFileContent,
} from '@/lib/calendar/ics-generator';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
import { HeroMedia } from '../core/HeroMedia';
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';
import './marea-azul.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface MareaAzulExperienceProps {
  slug: string;
  templateId: TemplateId;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
  previewEnvelope?: boolean;
}

interface CoastalCove {
  id: string;
  code: string;
  tag: string;
  coords: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const COASTAL_COVES: CoastalCove[] = [
  {
    id: 'cove-1',
    code: 'CALA 01 · ARRIBO',
    tag: '16:30 HRS · BRISA DE MEDIODÍA',
    coords: '15°45′11″ N · 96°07′52″ W',
    title: 'Bienvenida entre Lino y Sal',
    subtitle: 'Aguas frescas, abanicos de palma y mar abierto',
    description:
      'Te recibimos frente a la bahía con infusiones heladas de jamaica, romero y cítricos oaxaqueños mientras la brisa del Pacífico marca el inicio.',
    imageUrl: '/images/marea-azul/cover.jpg',
  },
  {
    id: 'cove-2',
    code: 'CALA 02 · HORIZONTE',
    tag: '17:00 HRS · CEREMONIA EN LA COSTA',
    coords: 'PLAYA SANTA CRUZ · HUATULCO',
    title: 'Sí, frente al Mismo Horizonte',
    subtitle: 'Votos al compás de la marea y cuerdas acústicas',
    description:
      'Bajo un arco de cal blanca y flores costeras, unimos nuestras rutas mirando hacia el mar infinito en el momento más luminoso de la tarde.',
    imageUrl: '/images/marea-azul/sail.jpg',
  },
  {
    id: 'cove-3',
    code: 'CALA 03 · SOL DE COBRE',
    tag: '18:30 HRS · COCTEL DE ATARDECER',
    coords: 'TERRAZA DEL MIRADOR',
    title: 'Brindis de Sol Terracota',
    subtitle: 'Mezcal artesanal, ostiones frescos y cielo dorado',
    description:
      'Mientras el sol desciende sobre el agua tiñendo la costa de terracota y oro, levantamos las copas entre música acústica y risas compartidas.',
    imageUrl: '/images/marea-azul/toast.jpg',
  },
  {
    id: 'cove-4',
    code: 'CALA 04 · PLEAMAR',
    tag: '20:00 HRS · BANQUETE & NOCHE EN LA BAHÍA',
    coords: 'PATIO DE AZULEJOS',
    title: 'Mesa Mediterránea bajo las Estrellas',
    subtitle: 'Cocina del mar, cerámica de cobalto y baile descalzo',
    description:
      'Una larga mesa vestida con lino, ramas de olivo, vajilla de talavera azul cobalto y linternas cálidas para cenar y bailar junto a las olas.',
    imageUrl: '/images/marea-azul/table.jpg',
  },
];

/* ============================================================================
 * COMPONENTES VECTORIALES SIMÉTRICOS A MEDIDA (CERO GRÁFICOS DEFORMES)
 * ========================================================================== */

/**
 * Velero Mediterráneo Simétrico (`viewBox="0 0 240 280"`, eje de simetría exacto en `x = 120`)
 */
function CoastalSailboat({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 280"
      fill="none"
      className={`ma-sailboat-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="maBoatSun" cx="50%" cy="44%" r="46%">
          <stop offset="0%" stop-color="#F6C89F" stop-opacity="0.92" />
          <stop offset="68%" stop-color="#D3865A" stop-opacity="0.78" />
          <stop offset="100%" stop-color="#D3865A" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="maBoatSailPort" x1="56" y1="54" x2="116" y2="196" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFDF8" />
          <stop offset="100%" stop-color="#EDE2CC" />
        </linearGradient>
        <linearGradient id="maBoatSailStarboard" x1="124" y1="68" x2="184" y2="196" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FAF1E2" />
          <stop offset="100%" stop-color="#DFC8AA" />
        </linearGradient>
        <linearGradient id="maBoatHull" x1="60" y1="202" x2="180" y2="232" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#155B8A" />
          <stop offset="50%" stop-color="#102F45" />
          <stop offset="100%" stop-color="#155B8A" />
        </linearGradient>
      </defs>

      {/* Halo solar y anillo de brújula simétrico en x = 120 */}
      <circle cx="120" cy="126" r="88" fill="url(#maBoatSun)" />
      <circle
        cx="120"
        cy="126"
        r="96"
        stroke="#155B8A"
        strokeOpacity="0.26"
        strokeWidth="1.5"
        strokeDasharray="5 7"
      />
      <circle
        cx="120"
        cy="126"
        r="58"
        fill="#D3865A"
        fillOpacity="0.82"
      />

      {/* Mástil central en x = 120 */}
      <line
        x1="120"
        y1="32"
        x2="120"
        y2="204"
        stroke="#102F45"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Gallardete superior */}
      <path d="M120 32 L144 40 L120 48 Z" fill="#D3865A" />
      <circle cx="120" cy="30" r="3.5" fill="#155B8A" />

      {/* Vela izquierda y vela derecha simétricas respecto a x = 120 */}
      <path
        d="M115 48 C88 96 68 144 54 194 H115 Z"
        fill="url(#maBoatSailPort)"
        stroke="#102F45"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M125 60 C152 104 172 148 186 194 H125 Z"
        fill="url(#maBoatSailStarboard)"
        stroke="#102F45"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Costuras náuticas de las velas */}
      <line x1="76" y1="132" x2="115" y2="132" stroke="#155B8A" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 4" />
      <line x1="64" y1="166" x2="115" y2="166" stroke="#155B8A" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 4" />
      <line x1="125" y1="138" x2="164" y2="138" stroke="#155B8A" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 4" />
      <line x1="125" y1="168" x2="176" y2="168" stroke="#155B8A" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 4" />

      {/* Casco simétrico (x = 58 a x = 182, centro en 120) */}
      <path
        d="M56 202 H184 L168 225 C144 231 96 231 72 225 Z"
        fill="url(#maBoatHull)"
        stroke="#102F45"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="64"
        y1="209"
        x2="176"
        y2="209"
        stroke="#F7F4E9"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Olas simétricas bajo la quilla */}
      <path
        className="ma-sailboat-svg__wave-1"
        d="M34 234 C62 226 91 242 120 234 C149 226 178 242 206 234"
        stroke="#155B8A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="ma-sailboat-svg__wave-2"
        d="M52 248 C75 242 97 254 120 248 C143 242 165 254 188 248"
        stroke="#D3865A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M76 260 C92 256 106 264 120 260 C134 256 148 264 164 260"
        stroke="#155B8A"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Medallón de Rosa de los Vientos y Azulejo de Cobalto (`viewBox="0 0 200 200"`, simétrico en `100,100`)
 */
function CompassRoseMedallion({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={`ma-compass-svg ${className}`}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="82" stroke="currentColor" strokeOpacity="0.38" strokeWidth="1.2" strokeDasharray="3 5" />
      <circle cx="100" cy="100" r="64" stroke="#D3865A" strokeOpacity="0.45" strokeWidth="1.4" />

      {/* Pétalos de azulejo mediterráneo en diagonal */}
      <path
        d="M100 36 L112 88 L164 100 L112 112 L100 164 L88 112 L36 100 L88 88 Z"
        fill="#155B8A"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M54 54 L92 84 L146 54 L116 92 L146 146 L108 116 L54 146 L84 108 Z"
        fill="#D3865A"
        fillOpacity="0.18"
        stroke="#D3865A"
        strokeWidth="1.3"
      />

      {/* Aguja cardinal Norte-Sur y Este-Oeste */}
      <polygon points="100,18 109,91 100,82 91,91" fill="#D3865A" />
      <polygon points="100,182 109,109 100,118 91,109" fill="currentColor" />
      <polygon points="182,100 109,109 118,100 109,91" fill="currentColor" />
      <polygon points="18,100 91,109 82,100 91,91" fill="currentColor" />

      <circle cx="100" cy="100" r="12" fill="#F7F4E9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="4.5" fill="#D3865A" />
    </svg>
  );
}

/**
 * Estrella de Rumbo / Rosa Náutica de 8 puntas
 */
function CompassStar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 1.5L14.3 9.7L22.5 12L14.3 14.3L12 22.5L9.7 14.3L1.5 12L9.7 9.7L12 1.5Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="2.2" fill="#F7F4E9" />
    </svg>
  );
}

/**
 * Sello Circular Giratorio con `<textPath>`
 */
function RotatingHorizonSeal({
  text = 'MAREA AZUL ✦ TRAVESÍA JUNTO AL MAR ✦ 15°45′N 96°08′W ✦ ',
  className = '',
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`ma-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 220 220" className="ma-seal__spinner">
        <defs>
          <path
            id="maHorizonSealPath"
            d="M 110, 110 m -84, 0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0"
          />
        </defs>
        <circle
          cx="110"
          cy="110"
          r="98"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeDasharray="4 6"
        />
        <circle
          cx="110"
          cy="110"
          r="68"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <text className="ma-seal__text" textLength="520">
          <textPath href="#maHorizonSealPath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Carta Náutica y Azulejo Mediterráneo con trazado progresivo (`strokeDashoffset`) en `#ma-story`
 */
function NauticalChartBackdrop() {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      className="ma-chart-backdrop"
      aria-hidden="true"
    >
      {/* Anillos de carta de navegación */}
      <circle
        cx="400"
        cy="400"
        r="340"
        className="ma-draw-path"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      <circle
        cx="400"
        cy="400"
        r="260"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        strokeDasharray="6 10"
      />
      <circle
        cx="400"
        cy="400"
        r="175"
        className="ma-draw-path"
        stroke="#D3865A"
        strokeOpacity="0.32"
        strokeWidth="1.5"
      />

      {/* Líneas de rumbo y meridianos */}
      <line
        x1="60"
        y1="400"
        x2="740"
        y2="400"
        className="ma-draw-path"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.2"
      />
      <line
        x1="400"
        y1="60"
        x2="400"
        y2="740"
        className="ma-draw-path"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.2"
      />
      <line
        x1="160"
        y1="160"
        x2="640"
        y2="640"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="5 8"
      />
      <line
        x1="640"
        y1="160"
        x2="160"
        y2="640"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="5 8"
      />

      {/* Curvas batimétricas de marea */}
      <path
        d="M 90 500 C 210 450, 310 550, 400 500 C 490 450, 590 550, 710 500"
        className="ma-draw-path"
        stroke="#D3865A"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 120 560 C 230 515, 315 605, 400 560 C 485 515, 570 605, 680 560"
        className="ma-draw-path"
        stroke="currentColor"
        strokeOpacity="0.26"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Estrella de los vientos central */}
      <path
        d="M400 180 L424 376 L620 400 L424 424 L400 620 L376 424 L180 400 L376 376 Z"
        className="ma-draw-path"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Banda Cinética de Marea (Marquee horizontal infinito)
 */
function KineticMarquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className={`ma-marquee ${reverse ? 'ma-marquee--reverse' : ''}`}
      aria-hidden="true"
    >
      <div className="ma-marquee__track">
        {repeated.map((item, idx) => (
          <span className="ma-marquee__item" key={`${item}-${idx}`}>
            <span>{item}</span>
            <CompassStar className="ma-marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Encabezado Editorial Centrado con Coordenada Náutica
 */
function SectionHeader({
  code,
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  code: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <header className={`ma-section-header ${light ? 'ma-section-header--light' : ''}`}>
      <div className="ma-section-header__pill">
        <span className="ma-section-header__code">{code}</span>
        <CompassStar className="ma-section-header__star" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="ma-section-header__title">{title}</h2>
      {subtitle && <p className="ma-section-header__subtitle">{subtitle}</p>}
      <div className="ma-section-header__rule" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
    </header>
  );
}

/* ============================================================================
 * HELPERS DE CONTENIDO Y MIGRACIÓN SUAVE
 * ========================================================================== */

function extractCoupleParts(mainTitle: string): [string, string] {
  const raw = (mainTitle || 'Sofía & Mateo').trim();
  const parts = raw.split(/\s*(?:&|y|\+)\s*/i).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' & ')];
  }
  return [raw, 'Nuestro Horizonte'];
}

function formatDate(eventDate: string) {
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(date);
}

function sectionHeading(
  config: InvitationConfig,
  id: SectionId,
  field: 'eyebrow' | 'title',
  fallback: string
) {
  return config.content.sectionHeadings?.[id]?.[field] || fallback;
}

/**
 * Enriquecimiento suave del contenido de Marea Azul para que tanto invitaciones nuevas
 * como existentes tengan imágenes editoriales, 3 capítulos de bitácora, familia, 4 momentos
 * de ruta y galería completa sin sobrescribir personalizaciones del usuario.
 */
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
      raw.vipParents.groups && raw.vipParents.groups.length >= 2
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
    raw.gallery.images.length <= 2 ||
    raw.gallery.images.some((img) => img.url.endsWith('.svg'));

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

/* ============================================================================
 * COMPONENTE PRINCIPAL: MareaAzulExperience
 * ========================================================================== */

export function MareaAzulExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: MareaAzulExperienceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(
    forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope)
  );
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [activeCoveIndex, setActiveCoveIndex] = useState(0);
  const [breezePulse, setBreezePulse] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const maxAdults = guestGroup ? guestGroup.allocatedAdults : 4;
  const maxChildren = guestGroup ? guestGroup.allocatedChildren : 2;
  const [rsvpName, setRsvpName] = useState(guestGroup?.groupName || '');
  const [rsvpPhone, setRsvpPhone] = useState(guestGroup?.whatsappPhone || '');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [adults, setAdults] = useState(guestGroup ? guestGroup.allocatedAdults : 2);
  const [children, setChildren] = useState(guestGroup ? guestGroup.allocatedChildren : 0);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [generatedPass, setGeneratedPass] = useState<{
    qrPayload: string;
    groupName: string;
    adults: number;
    children: number;
    tableName: string;
  } | null>(null);

  const content = useMemo(() => mareaContent(config), [config]);
  const { colors, fonts, envelope } = config.theme;
  const [coupleFirst, coupleSecond] = extractCoupleParts(content.hero.mainTitle);
  const coupleDisplay = `${coupleFirst} & ${coupleSecond}`;
  const dateLabel = formatDate(eventDate);

  const enabled = useCallback(
    (id: SectionId) =>
      config.sectionsOrder.find((s) => s.id === id)?.enabled ?? true,
    [config.sectionsOrder]
  );

  // En Marea Azul mostramos Familia y Regalos salvo que el usuario los haya apagado explícitamente en una edición posterior
  const hasVipParents = enabled('vip_parents') || content.vipParents.groups.length > 0;
  const hasGifts =
    enabled('gifts') ||
    Boolean(
      content.gifts.introMessage ||
        content.gifts.cashEnvelopeAtVenue ||
        content.gifts.registries.length > 0
    );

  const sectionSignature = config.sectionsOrder
    .map((s) => `${s.id}:${s.enabled}`)
    .join('|');

  useEffect(() => {
    setIsOpen(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope));
  }, [forceEnvelopeOpen, isBuilderPreview, previewEnvelope]);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, new Date(eventDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      });
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [eventDate]);

  const handleTriggerBreeze = useCallback(() => {
    setBreezePulse(true);
    setActiveCoveIndex((prev) => (prev + 1) % COASTAL_COVES.length);
    window.setTimeout(() => setBreezePulse(false), 650);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || (!isOpen && !isBuilderPreview)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scroller = root.closest('[data-invitation-scroller]') || undefined;
      const scrollerOption = scroller ? { scroller } : {};

      // Barra superior de progreso de marea
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        ...scrollerOption,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });

      // 1. HERO STICKY EN DOS TIEMPOS: Arco mediterráneo (19% + 62% + 19% = 100%) -> Expansión costera
      const hero = root.querySelector<HTMLElement>('.ma-hero');
      const heroCopy = root.querySelector<HTMLElement>('.ma-hero__copy');
      const heroVisual = root.querySelector<HTMLElement>('.ma-hero__visual');
      const heroArchFrame = root.querySelector<HTMLElement>('.ma-hero__arch-halo');
      const heroSailboat = root.querySelector<HTMLElement>('.ma-hero__sailboat-float');
      const heroCompass = root.querySelector<HTMLElement>('.ma-hero__compass-float');
      const heroWatermark = root.querySelector<HTMLElement>('.ma-hero__watermark');
      const heroReveal = root.querySelector<HTMLElement>('.ma-hero__reveal');
      const heroScrollHint = root.querySelector<HTMLElement>('.ma-hero__scroll-hint');

      if (hero && heroCopy && heroVisual) {
        gsap.fromTo(
          root.querySelectorAll('.ma-hero__animate-in'),
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.12,
          }
        );

        const heroTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.9,
            invalidateOnRefresh: true,
            ...scrollerOption,
            onUpdate: (self) => {
              heroVisual.dataset.scrolling = self.progress > 0.02 ? 'true' : 'false';
            },
          },
        });

        heroTl
          .to(heroCopy, { yPercent: -24, opacity: 0, duration: 0.48 }, 0)
          .to(
            heroVisual,
            {
              left: '0%',
              top: '0%',
              width: '100%',
              height: '100%',
              borderRadius: '0px',
              duration: 0.88,
            },
            0.05
          );

        if (heroArchFrame) {
          heroTl.to(
            heroArchFrame,
            { scale: 1.32, rotate: 45, opacity: 0, duration: 0.6 },
            0.04
          );
        }
        if (heroSailboat) {
          heroTl.to(
            heroSailboat,
            { xPercent: 48, yPercent: -34, rotate: 6, opacity: 0, duration: 0.68 },
            0.03
          );
        }
        if (heroCompass) {
          heroTl.to(
            heroCompass,
            { xPercent: -40, yPercent: -28, rotate: -90, opacity: 0, duration: 0.62 },
            0.03
          );
        }
        if (heroWatermark) {
          heroTl.to(
            heroWatermark,
            { scale: 1.3, yPercent: -12, opacity: 0, duration: 0.72 },
            0
          );
        }
        if (heroScrollHint) {
          heroTl.to(heroScrollHint, { opacity: 0, duration: 0.25 }, 0);
        }
        if (heroReveal) {
          heroTl.fromTo(
            heroReveal,
            { y: 42, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.36 },
            0.62
          );
        }
      }

      // Títulos de sección con escala ligada al scroll
      root.querySelectorAll<HTMLElement>('.ma-section-header__title').forEach((title) => {
        gsap.fromTo(
          title,
          { scale: 0.9, opacity: 0.38 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: title,
              start: 'top 94%',
              end: 'top 54%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 2. TRAVESÍA / MANIFIESTO: Carta náutica SVG dibujada + palabras iluminadas
      const chartBackdrop = root.querySelector<SVGElement>('.ma-chart-backdrop');
      if (chartBackdrop) {
        gsap.fromTo(
          chartBackdrop,
          { scale: 0.82, rotate: -12, opacity: 0.25 },
          {
            scale: 1.06,
            rotate: 10,
            opacity: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ma-story',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
              ...scrollerOption,
            },
          }
        );

        chartBackdrop.querySelectorAll<SVGGeometryElement>('.ma-draw-path').forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 900;
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.ma-story',
                start: 'top 82%',
                end: 'center 42%',
                scrub: 0.8,
                ...scrollerOption,
              },
            }
          );
        });
      }

      const storyWords = root.querySelectorAll<HTMLElement>('.ma-story__word');
      const storyQuote = root.querySelector<HTMLElement>('.ma-story__quote');
      if (storyQuote && storyWords.length) {
        gsap.fromTo(
          storyWords,
          { opacity: 0.22, y: 8 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: storyQuote,
              start: 'top 84%',
              end: 'bottom 48%',
              scrub: 0.65,
              ...scrollerOption,
            },
          }
        );
      }

      root.querySelectorAll<HTMLElement>('.ma-story__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 64, rotate: idx % 2 === 0 ? -3 : 3, scale: 0.92, opacity: 0.35 },
          {
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 3. LAS 4 CALAS DE NUESTRA CELEBRACIÓN
      root.querySelectorAll<HTMLElement>('.ma-cove-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 62, scale: 0.93, opacity: 0.38 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 4. NUESTRA GENTE / FAMILIA
      root.querySelectorAll<HTMLElement>('.ma-family__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 66, rotate: idx % 2 === 0 ? -3.5 : 3.5, scale: 0.91, opacity: 0.32 },
          {
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              end: 'top 56%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 5. RELOJ DE MAREA (CUENTA REGRESIVA)
      const countdownPods = root.querySelectorAll<HTMLElement>('.ma-countdown__pod');
      const countdownGrid = root.querySelector<HTMLElement>('.ma-countdown__grid');
      if (countdownGrid && countdownPods.length) {
        gsap.fromTo(
          countdownPods,
          { y: 52, scale: 0.82, opacity: 0.22 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: countdownGrid,
              start: 'top 90%',
              end: 'center 54%',
              scrub: 0.75,
              ...scrollerOption,
            },
          }
        );
      }

      // 6. COORDENADAS DEL ENCUENTRO: Apertura de ventana costera
      root.querySelectorAll<HTMLElement>('.ma-location-card__media').forEach((media) => {
        gsap.fromTo(
          media,
          { clipPath: 'inset(12% 10% 12% 10% round 40px)', scale: 0.92 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 22px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: media,
              start: 'top 92%',
              end: 'center 54%',
              scrub: 0.8,
              ...scrollerOption,
            },
          }
        );
      });

      // 7. RUTA DEL DÍA (TIMELINE CON VELERO VIAJERO)
      const timelineTrack = root.querySelector<HTMLElement>('.ma-timeline__track');
      const timelineProgress = root.querySelector<HTMLElement>('.ma-timeline__progress');
      const timelineRunner = root.querySelector<HTMLElement>('.ma-timeline__runner');
      if (timelineTrack && timelineProgress) {
        gsap.fromTo(
          timelineProgress,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineTrack,
              start: 'top 76%',
              end: 'bottom 34%',
              scrub: 0.65,
              ...scrollerOption,
            },
          }
        );

        if (timelineRunner) {
          gsap.fromTo(
            timelineRunner,
            { top: '0%' },
            {
              top: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: timelineTrack,
                start: 'top 76%',
                end: 'bottom 34%',
                scrub: 0.65,
                ...scrollerOption,
              },
            }
          );
        }
      }

      root.querySelectorAll<HTMLElement>('.ma-timeline__item').forEach((item, idx) => {
        gsap.fromTo(
          item,
          { x: idx % 2 === 0 ? -32 : 32, y: 36, opacity: 0.25 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              end: 'top 58%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 8. POSTALES JUNTO AL MAR (GALERÍA)
      root.querySelectorAll<HTMLElement>('.ma-gallery__card').forEach((card, idx) => {
        const startRotate = idx % 2 === 0 ? -5.5 : 5.5;
        const endRotate = idx % 2 === 0 ? -1.1 : 1.1;
        gsap.fromTo(
          card,
          { y: 68, rotate: startRotate, scale: 0.89, opacity: 0.32 },
          {
            y: 0,
            rotate: endRotate,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 56%',
              scrub: 0.75,
              ...scrollerOption,
            },
          }
        );
      });

      // 9. DRESS CODE COSTERO
      root.querySelectorAll<HTMLElement>('.ma-dress__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 54, rotateY: idx === 0 ? -12 : 12, scale: 0.92, opacity: 0.32 },
          {
            y: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 56%',
              scrub: 0.75,
              ...scrollerOption,
            },
          }
        );
      });

      // 10. REGALOS, HOSPEDAJE, SOCIAL Y PASE DE EMBARQUE QR
      root
        .querySelectorAll<HTMLElement>(
          '.ma-gifts__card, .ma-stay__card, .ma-social__panel, .ma-rsvp__pass'
        )
        .forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 48, scale: 0.95, opacity: 0.38 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top 94%',
                end: 'top 64%',
                scrub: 0.65,
                ...scrollerOption,
              },
            }
          );
        });
    },
    { scope: rootRef, dependencies: [isOpen, isBuilderPreview, sectionSignature] }
  );

  const handleOpenInvitation = () => {
    confetti({
      particleCount: 65,
      spread: 76,
      origin: { y: 0.58 },
      colors: ['#155B8A', '#D3865A', '#F7F4E9', '#102F45'],
    });
    setIsOpen(true);
  };

  const handleCopyClabe = async (clabe: string) => {
    try {
      await navigator.clipboard.writeText(clabe);
      setCopiedClabe(true);
      toast.success('CLABE copiada al portapapeles');
      window.setTimeout(() => setCopiedClabe(false), 2400);
    } catch {
      toast.error('No se pudo copiar automáticamente');
    }
  };

  const handleAddToCalendar = () => {
    const start = new Date(eventDate);
    if (Number.isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + 6 * 3600000);
    const mainLoc = content.locations[0];
    const url = buildGoogleCalendarUrl({
      title: `Boda junto al mar de ${coupleDisplay}`,
      description: content.hero.tagline,
      location: mainLoc ? `${mainLoc.venueName}, ${mainLoc.address}` : 'Bahías de Huatulco, Oaxaca',
      startDateIso: start.toISOString(),
      endDateIso: end.toISOString(),
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    const start = new Date(eventDate);
    if (Number.isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + 6 * 3600000);
    const mainLoc = content.locations[0];
    const ics = buildIcsFileContent({
      title: `Boda junto al mar de ${coupleDisplay}`,
      description: content.hero.tagline,
      location: mainLoc ? `${mainLoc.venueName}, ${mainLoc.address}` : 'Bahías de Huatulco, Oaxaca',
      startDateIso: start.toISOString(),
      endDateIso: end.toISOString(),
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${slug}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      toast.error('Por favor escribe tu nombre completo');
      return;
    }

    const totalAdults = willAttend === 'yes' ? adults : 0;
    const totalChildren =
      willAttend === 'yes' && content.rsvp.allowChildrenSelection ? children : 0;

    try {
      await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: guestGroup?.id,
          groupName: rsvpName.trim(),
          whatsappPhone: rsvpPhone.trim(),
          status: willAttend === 'yes' ? 'confirmed' : 'declined',
          confirmedAdults: totalAdults,
          confirmedChildren: totalChildren,
          dietaryRestrictions: dietaryNotes.trim(),
          message: guestMessage.trim(),
        }),
      });
    } catch {
      // Continúa en modo demo/preview
    }

    if (willAttend === 'yes') {
      const qrPayload = JSON.stringify({
        invitationSlug: slug,
        groupId: guestGroup?.id || `ma-${Date.now()}`,
        groupName: rsvpName.trim(),
        confirmedAdults: totalAdults,
        confirmedChildren: totalChildren,
      });
      setGeneratedPass({
        qrPayload,
        groupName: rsvpName.trim(),
        adults: totalAdults,
        children: totalChildren,
        tableName: guestGroup?.tableName || 'TERRAZA DEL MAR',
      });
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#155B8A', '#D3865A', '#F7F4E9', '#102F45'],
      });
      toast.success('¡Pase de embarque confirmado!');
    } else {
      toast.success('Gracias por avisarnos. Te llevamos en el corazón.');
    }
  };

  const rootStyle = {
    '--ma-bg': colors.bgPrimary || '#F7F4E9',
    '--ma-bg-2': colors.bgSecondary || '#E2ECEB',
    '--ma-text': colors.textPrimary || '#102F45',
    '--ma-muted': colors.textMuted || '#486A78',
    '--ma-cobalt': colors.accentPrimary || '#155B8A',
    '--ma-terracotta': colors.accentSecondary || '#D3865A',
    '--ma-heading-font': invitationFontStack(fonts.headingFont || 'Georgia'),
    '--ma-script-font': invitationFontStack(fonts.scriptFont || 'Cormorant Garamond'),
    '--ma-body-font': invitationFontStack(fonts.bodyFont || 'Plus Jakarta Sans'),
  } as React.CSSProperties;

  const mainLocation = content.locations[0];
  const activeCove = COASTAL_COVES[activeCoveIndex] || COASTAL_COVES[0];
  const primaryActionHref = enabled('quote_story')
    ? '#ma-story'
    : '#ma-coves';

  const getRouteUrls = (placeQuery: string, lat?: number, lng?: number) => {
    const encoded = encodeURIComponent(placeQuery);
    return {
      google: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      waze: `https://waze.com/ul?q=${encoded}&navigate=yes`,
      apple:
        lat && lng
          ? `https://maps.apple.com/?ll=${lat},${lng}&q=${encoded}`
          : `https://maps.apple.com/?q=${encoded}`,
      uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encoded}`,
    };
  };

  return (
    <div ref={rootRef} className="ma-root" style={rootStyle}>
      {/* 1. CARTA DE NAVEGACIÓN / SOBRE COSTERO INTERACTIVO */}
      {(!isOpen || (isBuilderPreview && previewEnvelope)) && (
        <div
          className="ma-opening"
          data-editor-section="envelope"
          role="dialog"
          aria-modal="true"
          aria-label={`Invitación de boda junto al mar de ${coupleDisplay}`}
        >
          <div className="ma-opening__grid" aria-hidden="true" />
          <div className="ma-opening__horizon-ring" aria-hidden="true" />

          <div className="ma-opening__emblem">
            <CompassRoseMedallion />
          </div>

          <div className="ma-opening__card">
            <div className="ma-opening__top">
              <span className="ma-opening__coords">
                <i aria-hidden="true" />
                <span>15°45′N · 96°08′W · COSTA DEL PACÍFICO</span>
              </span>
              <span className="ma-opening__monogram">
                {envelope.sealMonogram || 'S&M'}
              </span>
            </div>

            <p className="ma-opening__kicker">{content.hero.badgeText}</p>
            <h1 className="ma-opening__title">
              <span>{coupleFirst}</span>
              <em>&amp; {coupleSecond}</em>
            </h1>
            <p className="ma-opening__subtitle">{content.hero.tagline}</p>

            <div className="ma-opening__divider" aria-hidden="true">
              <span />
              <CompassStar />
              <span />
            </div>

            <div className="ma-opening__pass">
              <span>CARTA DE NAVEGACIÓN RESERVADA PARA</span>
              <strong>{guestGroup?.groupName || 'Invitado Especial'}</strong>
              <small>
                {dateLabel || 'Próximamente'} ·{' '}
                {mainLocation?.venueName || 'Bahías de Huatulco, Oaxaca'}
              </small>
            </div>

            <button
              type="button"
              onClick={handleOpenInvitation}
              className="ma-button ma-button--primary ma-button--full"
            >
              <Compass size={17} />
              <span>{envelope.openButtonText || 'Abre tu invitación'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. AUDIO FLOTANTE (SI ESTÁ ACTIVO) */}
      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isOpen}
        accentColor={colors.accentPrimary}
      />

      {/* 3. BARRA DE PROGRESO + NAVEGACIÓN FLOTANTE DE LINO Y COBALTO */}
      <div className="ma-progress" aria-hidden="true">
        <div ref={progressRef} className="ma-progress__fill" />
      </div>

      <header className="ma-nav">
        <a href="#ma-hero" className="ma-nav__brand">
          <span className="ma-nav__monogram">{envelope.sealMonogram || 'S&M'}</span>
          <span className="ma-nav__title">{coupleDisplay}</span>
        </a>
        <nav className="ma-nav__links" aria-label="Navegación de la invitación">
          {enabled('quote_story') && <a href="#ma-story">Travesía</a>}
          <a href="#ma-coves">Las 4 Calas</a>
          {enabled('locations') && <a href="#ma-locations">El Destino</a>}
          {enabled('timeline') && <a href="#ma-timeline">Ruta</a>}
          {enabled('rsvp') && (
            <a href="#ma-rsvp" className="ma-nav__cta">
              <span>Confirmar</span>
              <ArrowRight size={13} />
            </a>
          )}
        </nav>
      </header>

      <main>
        {/* SECCIÓN 1: HERO STICKY EN DOS TIEMPOS (ARCO MEDITERRÁNEO -> MAR ABIERTO) */}
        {enabled('hero') && (
          <section
            id="ma-hero"
            data-editor-section="hero"
            className={`ma-hero ${breezePulse ? 'ma-hero--breeze' : ''}`}
            aria-label="Portada de la invitación"
          >
            <div className="ma-hero__stage">
              <div className="ma-hero__field" aria-hidden="true" />
              <div className="ma-hero__watermark" aria-hidden="true">
                MAR
              </div>

              {/* Halo de brújula y sello giratorio alrededor del arco */}
              <div className="ma-hero__arch-halo" aria-hidden="true">
                <span className="ma-hero__orbit-ring" />
                <span className="ma-hero__orbit-ring ma-hero__orbit-ring--inner" />
                <RotatingHorizonSeal
                  text={`MAREA AZUL ✦ ${coupleDisplay.toUpperCase()} ✦ BAHÍAS DE HUATULCO ✦ `}
                  className="ma-hero__seal"
                />
              </div>

              {/* Medallón de Rosa de los Vientos interactivo */}
              <button
                type="button"
                onClick={handleTriggerBreeze}
                className="ma-hero__compass-float"
                aria-label="Cambiar cala destacada en la brújula"
                title="Toca la rosa de los vientos para explorar las 4 calas"
              >
                <CompassRoseMedallion />
              </button>

              {/* Velero simétrico flotante que navega con el scroll */}
              <div className="ma-hero__sailboat-float" aria-hidden="true">
                <CoastalSailboat />
              </div>

              {/* Ventana en arco mediterráneo matemáticamente centrada (19% + 62% + 19% = 100%) */}
              <div className="ma-hero__visual">
                <HeroMedia
                  hero={content.hero}
                  alt={`Retrato junto al mar de ${coupleDisplay}`}
                  className="ma-hero__media-img"
                />
                <span className="ma-hero__tile-rim" aria-hidden="true" />
                <span className="ma-hero__media-shade" aria-hidden="true" />
              </div>

              {/* Copy editorial centrado en móvil */}
              <div className="ma-hero__copy">
                <div className="ma-hero__pill ma-hero__animate-in">
                  <span className="ma-hero__dot" aria-hidden="true" />
                  <span>{content.hero.badgeText}</span>
                </div>

                <h1 className="ma-hero__title ma-hero__animate-in">
                  <span className="ma-hero__title-kicker">
                    15°45′11″ N · 96°07′52″ W · COSTA DEL PACÍFICO
                  </span>
                  <strong>{coupleFirst}</strong>
                  <em>&amp; {coupleSecond}</em>
                </h1>

                <p className="ma-hero__tagline ma-hero__animate-in">
                  {content.hero.tagline}
                </p>

                <div className="ma-hero__meta ma-hero__animate-in">
                  {dateLabel && (
                    <span className="ma-hero__chip">
                      <CalendarDays size={14} />
                      <span>{dateLabel}</span>
                    </span>
                  )}
                  {mainLocation?.time && (
                    <span className="ma-hero__chip">
                      <Clock3 size={14} />
                      <span>{mainLocation.time}</span>
                    </span>
                  )}
                  {mainLocation?.venueName && (
                    <span className="ma-hero__chip">
                      <MapPin size={14} />
                      <span>{mainLocation.venueName}</span>
                    </span>
                  )}
                </div>

                {guestGroup && (
                  <p className="ma-hero__guest ma-hero__animate-in">
                    <Anchor size={14} />
                    <span>Lugar reservado para {guestGroup.groupName}</span>
                  </p>
                )}

                <div className="ma-hero__actions ma-hero__animate-in">
                  {enabled('rsvp') && (
                    <a href="#ma-rsvp" className="ma-button ma-button--primary">
                      <Ticket size={16} />
                      <span>Confirmar asistencia</span>
                    </a>
                  )}
                  <a href={primaryActionHref} className="ma-button ma-button--ghost">
                    <span>Explorar travesía</span>
                    <ArrowDown size={15} />
                  </a>
                </div>
              </div>

              {/* Tarjeta puente de postal costera al expandir el arco */}
              <div className="ma-hero__reveal">
                <div className="ma-hero__reveal-card">
                  <img
                    src={activeCove.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="ma-hero__reveal-thumb"
                  />
                  <div className="ma-hero__reveal-body">
                    <span className="ma-hero__reveal-kicker">
                      {activeCove.code} · {activeCove.coords}
                    </span>
                    <p className="ma-hero__reveal-title">{activeCove.title}</p>
                    <a href="#ma-coves" className="ma-hero__reveal-link">
                      <span>Descubrir las 4 calas del día</span>
                      <ArrowDown size={15} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="ma-hero__scroll-hint" aria-hidden="true">
                <span>DESLIZA HACIA EL MAR</span>
                <ArrowDown size={14} />
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA 1 */}
        <KineticMarquee
          items={[
            content.hero.badgeText || 'UNA BODA JUNTO AL MAR',
            coupleDisplay.toUpperCase(),
            dateLabel || 'BAHÍAS DE HUATULCO',
            mainLocation?.venueName || 'PLAYA SANTA CRUZ · OAXACA',
            '15°45′11″ N · 96°07′52″ W',
          ]}
        />

        {/* SECCIÓN 2: NUESTRA TRAVESÍA (MANIFIESTO + CARTA NÁUTICA SVG) */}
        {enabled('quote_story') && (
          <section
            id="ma-story"
            data-editor-section="quoteStory"
            className="ma-story ma-section ma-sheet ma-sheet--ocean"
          >
            <NauticalChartBackdrop />
            <div className="ma-container">
              <SectionHeader
                code="BITÁCORA DE HORIZONTE"
                eyebrow={sectionHeading(
                  config,
                  'quote_story',
                  'eyebrow',
                  'Nuestra travesía'
                )}
                title={sectionHeading(
                  config,
                  'quote_story',
                  'title',
                  'Cómo llegamos aquí'
                )}
                light
              />

              <blockquote
                className="ma-story__quote"
                aria-label={content.quoteStory.quoteText}
              >
                <span aria-hidden="true">
                  “
                  {content.quoteStory.quoteText
                    .replace(/^[“"]|[”"]$/g, '')
                    .split(/(\s+)/)
                    .map((part, idx) =>
                      /^\s+$/.test(part) ? (
                        part
                      ) : (
                        <span className="ma-story__word" key={`${part}-${idx}`}>
                          {part}
                        </span>
                      )
                    )}
                  ”
                </span>
              </blockquote>

              {content.quoteStory.quoteAuthor && (
                <p className="ma-story__author">
                  <CompassStar className="ma-story__author-star" />
                  <span>{content.quoteStory.quoteAuthor}</span>
                </p>
              )}

              {content.quoteStory.storyBlocks &&
                content.quoteStory.storyBlocks.length > 0 && (
                  <div className="ma-story__grid">
                    {content.quoteStory.storyBlocks.map((block, idx) => (
                      <article
                        className="ma-story__card"
                        key={`${block.title}-${idx}`}
                      >
                        <div className="ma-story__card-top">
                          <span className="ma-story__phase">
                            CAPÍTULO 0{idx + 1}
                          </span>
                          <Waves size={16} />
                        </div>
                        <h3>{block.title}</h3>
                        <p>{block.description}</p>
                      </article>
                    ))}
                  </div>
                )}
            </div>
          </section>
        )}

        {/* SECCIÓN 3 (INMERSIÓN TEMÁTICA): LAS 4 CALAS DE NUESTRA CELEBRACIÓN */}
        <section
          id="ma-coves"
          className="ma-coves ma-section"
          aria-labelledby="ma-coves-title"
        >
          <div className="ma-container">
            <header className="ma-section-header">
              <div className="ma-section-header__pill">
                <span className="ma-section-header__code">EXPERIENCIA FRENTE AL MAR</span>
                <CompassStar className="ma-section-header__star" />
                <span>DE MEDIODÍA A LAS ESTRELLAS</span>
              </div>
              <h2 id="ma-coves-title" className="ma-section-header__title">
                Las 4 calas de nuestra celebración
              </h2>
              <p className="ma-section-header__subtitle">
                Cuatro atmósferas diseñadas para disfrutar la brisa, la luz de la costa oaxaqueña y la alegría de encontrarnos junto al mar.
              </p>
              <div className="ma-section-header__rule" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>
            </header>

            <div className="ma-coves__grid">
              {COASTAL_COVES.map((cove, idx) => (
                <article
                  key={cove.id}
                  className={`ma-cove-card ${
                    idx === activeCoveIndex ? 'ma-cove-card--active' : ''
                  }`}
                  onClick={() => setActiveCoveIndex(idx)}
                >
                  <div className="ma-cove-card__media">
                    <img src={cove.imageUrl} alt={cove.title} loading="lazy" />
                    <span className="ma-cove-card__tag">{cove.tag}</span>
                    <span className="ma-cove-card__coords">{cove.coords}</span>
                  </div>
                  <div className="ma-cove-card__body">
                    <span className="ma-cove-card__code">{cove.code}</span>
                    <h3>{cove.title}</h3>
                    <strong className="ma-cove-card__sub">{cove.subtitle}</strong>
                    <p>{cove.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: NUESTRA GENTE / TRIPULACIÓN DE HONOR (PADRES Y PADRINOS) */}
        {hasVipParents && content.vipParents.groups.length > 0 && (
          <section
            id="ma-family"
            data-editor-section="vipParents"
            className="ma-family ma-section ma-sheet"
          >
            <div className="ma-container">
              <SectionHeader
                code="TRIPULACIÓN DE HONOR"
                eyebrow={sectionHeading(
                  config,
                  'vip_parents',
                  'eyebrow',
                  'Quienes nos acompañan'
                )}
                title={sectionHeading(
                  config,
                  'vip_parents',
                  'title',
                  'Nuestra gente'
                )}
                subtitle={content.vipParents.blessingMessage}
              />

              <div className="ma-family__grid">
                {content.vipParents.groups.map((group, idx) => (
                  <article
                    className="ma-family__card"
                    key={`${group.groupTitle}-${idx}`}
                  >
                    <span className="ma-family__badge">
                      <Users size={13} />
                      <span>PUERTO 0{idx + 1}</span>
                    </span>
                    <h3>{group.groupTitle}</h3>
                    <div className="ma-family__names">
                      {group.names.map((name, nIdx) => (
                        <strong key={`${name}-${nIdx}`}>{name}</strong>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 5: RELOJ DE MAREA (CUENTA REGRESIVA) */}
        {enabled('countdown') && (
          <section
            id="ma-countdown"
            data-editor-section="countdown"
            className="ma-countdown ma-section"
          >
            <div className="ma-container">
              <SectionHeader
                code="PLEAMAR EN CUENTA REGRESIVA"
                eyebrow={sectionHeading(
                  config,
                  'countdown',
                  'eyebrow',
                  'La marea se acerca'
                )}
                title={sectionHeading(
                  config,
                  'countdown',
                  'title',
                  'Nos vemos pronto'
                )}
                subtitle={`${dateLabel} · ${mainLocation?.venueName || 'Bahías de Huatulco, Oaxaca'}`}
              />

              <div className="ma-countdown__console">
                <div className="ma-countdown__status">
                  <span className="ma-countdown__dot" aria-hidden="true" />
                  <span>BITÁCORA EN VIVO · RUMBO A LA BAHÍA</span>
                </div>

                <div className="ma-countdown__grid">
                  {[
                    { code: 'N · DÍAS', value: timeLeft.days, label: 'Días' },
                    { code: 'E · HRS', value: timeLeft.hours, label: 'Horas' },
                    { code: 'S · MIN', value: timeLeft.minutes, label: 'Minutos' },
                    { code: 'O · SEG', value: timeLeft.seconds, label: 'Segundos' },
                  ].map((item) => (
                    <div className="ma-countdown__pod" key={item.code}>
                      <small>{item.code}</small>
                      <strong>{String(item.value).padStart(2, '0')}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="ma-countdown__actions">
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="ma-button ma-button--primary"
                  >
                    <CalendarDays size={16} />
                    <span>Agendar en Google Calendar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="ma-button ma-button--ghost-light"
                  >
                    <Clock3 size={16} />
                    <span>Descargar .ICS (Apple / Outlook)</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA 2 */}
        <KineticMarquee
          reverse
          items={[
            'CEREMONIA FRENTE AL MAR',
            'AZULEJOS DE COBALTO & LINO',
            'BRINDIS DE SOL TERRACOTA',
            'BAHÍA SANTA CRUZ · HUATULCO',
            coupleDisplay.toUpperCase(),
          ]}
        />

        {/* SECCIÓN 6: COORDENADAS DEL ENCUENTRO + MAPA INTERACTIVO */}
        {enabled('locations') && content.locations.length > 0 && (
          <section
            id="ma-locations"
            data-editor-section="locations"
            className="ma-locations ma-section ma-sheet"
          >
            <div className="ma-container">
              <SectionHeader
                code="CARTA GEOGRÁFICA · GPS"
                eyebrow={sectionHeading(
                  config,
                  'locations',
                  'eyebrow',
                  'Coordenadas del encuentro'
                )}
                title={sectionHeading(
                  config,
                  'locations',
                  'title',
                  'El destino'
                )}
                subtitle="Abre tu aplicación de navegación favorita en un toque para llegar directo a la bahía."
              />

              <div className="ma-locations__list">
                {content.locations.map((loc) => {
                  const query = `${loc.venueName}, ${loc.address}`;
                  const routes = getRouteUrls(
                    query,
                    loc.coordinates?.lat,
                    loc.coordinates?.lng
                  );
                  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
                    query
                  )}&output=embed`;

                  return (
                    <article className="ma-location-card" key={loc.id}>
                      <div className="ma-location-card__visual-col">
                        <div className="ma-location-card__media">
                          <img
                            src={loc.imageUrl || '/images/marea-azul/venue.jpg'}
                            alt={loc.venueName}
                            loading="lazy"
                          />
                          <span className="ma-location-card__coord">
                            <Compass size={13} />
                            <span>
                              {loc.coordinates
                                ? `${loc.coordinates.lat.toFixed(3)}° N, ${Math.abs(
                                    loc.coordinates.lng
                                  ).toFixed(3)}° W`
                                : 'BAHÍA SANTA CRUZ · OAXACA'}
                            </span>
                          </span>
                        </div>

                        <div className="ma-location-card__map">
                          <iframe
                            title={`Mapa de ${loc.venueName}`}
                            src={mapSrc}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>

                      <div className="ma-location-card__info">
                        <span className="ma-location-card__kicker">
                          <Clock3 size={14} />
                          <span>{loc.time} · {loc.title}</span>
                        </span>
                        <h3>{loc.venueName}</h3>
                        <p className="ma-location-card__address">
                          <MapPin size={16} />
                          <span>{loc.address}</span>
                        </p>

                        <div className="ma-location-card__routes">
                          <a
                            href={loc.googleMapsUrl || routes.google}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ma-route-btn ma-route-btn--primary"
                          >
                            <Navigation size={15} />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href={loc.wazeUrl || routes.waze}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ma-route-btn"
                          >
                            <ExternalLink size={15} />
                            <span>Waze</span>
                          </a>
                          <a
                            href={routes.apple}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ma-route-btn"
                          >
                            <MapPin size={15} />
                            <span>Apple Maps</span>
                          </a>
                          <a
                            href={routes.uber}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ma-route-btn"
                          >
                            <Anchor size={15} />
                            <span>Pedir Uber</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 7: EL RUMBO DEL DÍA (TIMELINE CON VELERO VIAJERO) */}
        {enabled('timeline') && content.timeline.length > 0 && (
          <section
            id="ma-timeline"
            data-editor-section="timeline"
            className="ma-timeline ma-section"
          >
            <div className="ma-container">
              <SectionHeader
                code="CARTA DE NAVEGACIÓN"
                eyebrow={sectionHeading(
                  config,
                  'timeline',
                  'eyebrow',
                  'El rumbo del día'
                )}
                title={sectionHeading(
                  config,
                  'timeline',
                  'title',
                  'Nuestra ruta'
                )}
                subtitle="Cada momento sigue el ritmo del sol y de la marea junto a ti."
              />

              <div className="ma-timeline__track">
                <div className="ma-timeline__rail" aria-hidden="true">
                  <div className="ma-timeline__progress" />
                  <div className="ma-timeline__runner">
                    <CoastalSailboat />
                  </div>
                </div>

                <div className="ma-timeline__items">
                  {content.timeline.map((item, idx) => (
                    <article className="ma-timeline__item" key={item.id}>
                      <div className="ma-timeline__node" aria-hidden="true">
                        <span>0{idx + 1}</span>
                      </div>
                      <div className="ma-timeline__card">
                        <div className="ma-timeline__meta">
                          <span className="ma-timeline__time">{item.time}</span>
                          <span className="ma-timeline__step">
                            COORDENADA 0{idx + 1}
                          </span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 8: POSTALES JUNTO AL MAR (GALERÍA) */}
        {enabled('gallery') && content.gallery.images.length > 0 && (
          <section
            id="ma-gallery"
            data-editor-section="gallery"
            className="ma-gallery ma-section ma-sheet"
          >
            <div className="ma-container">
              <SectionHeader
                code="ÁLBUM DE LA COSTA"
                eyebrow={sectionHeading(
                  config,
                  'gallery',
                  'eyebrow',
                  'Postales'
                )}
                title={sectionHeading(
                  config,
                  'gallery',
                  'title',
                  'Instantes junto al mar'
                )}
              />

              <div className="ma-gallery__grid">
                {content.gallery.images.map((img, idx) => (
                  <figure className="ma-gallery__card" key={`${img.url}-${idx}`}>
                    <div className="ma-gallery__img-wrap">
                      <img
                        src={img.url}
                        alt={img.caption || `Postal ${idx + 1} de ${coupleDisplay}`}
                        loading="lazy"
                      />
                      <span className="ma-gallery__badge">POSTAL 0{idx + 1}</span>
                    </div>
                    <figcaption className="ma-gallery__caption">
                      <CompassStar className="ma-gallery__star" />
                      <span>{img.caption || `Horizonte 0${idx + 1}`}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 9: CÓDIGO DE ESTILO COSTERO (DRESS CODE) */}
        {enabled('dress_code') && (
          <section
            id="ma-dress"
            data-editor-section="dressCode"
            className="ma-dress ma-section"
          >
            <div className="ma-container">
              <SectionHeader
                code="ETIQUETA DE LA COSTA"
                eyebrow={sectionHeading(
                  config,
                  'dress_code',
                  'eyebrow',
                  'Para disfrutar la costa'
                )}
                title={
                  content.dressCode.title ||
                  sectionHeading(config, 'dress_code', 'title', 'Cómo venir')
                }
                subtitle="Queremos que te sientas fresco, cómodo y elegante bajo el sol y la brisa del mar."
              />

              <div className="ma-dress__grid">
                <article className="ma-dress__card">
                  <div className="ma-dress__icon-wrap">
                    <Sparkles size={20} />
                  </div>
                  <span className="ma-dress__role">ELLAS</span>
                  <h3>Texturas Fluidas &amp; Brisa</h3>
                  <p>{content.dressCode.womenNotes}</p>
                </article>

                <article className="ma-dress__card">
                  <div className="ma-dress__icon-wrap">
                    <Shirt size={20} />
                  </div>
                  <span className="ma-dress__role">ELLOS</span>
                  <h3>Lino &amp; Elegancia Relajada</h3>
                  <p>{content.dressCode.menNotes}</p>
                </article>
              </div>

              <div className="ma-dress__checklist">
                <span>
                  <Sun size={14} /> Lino y fibras naturales
                </span>
                <span>
                  <Wind size={14} /> Calzado apto para terraza y arena
                </span>
                <span>
                  <Waves size={14} /> Colores luminosos y costeros
                </span>
              </div>

              {content.dressCode.reservedColors &&
                content.dressCode.reservedColors.length > 0 && (
                  <div className="ma-dress__palette">
                    <span className="ma-dress__palette-label">
                      TONOS RESERVADOS PARA LA PAREJA
                    </span>
                    <div className="ma-dress__swatches">
                      {content.dressCode.reservedColors.map((c) => (
                        <span className="ma-dress__swatch" key={c.name}>
                          <i style={{ backgroundColor: c.hex }} />
                          <strong>{c.name}</strong>
                        </span>
                      ))}
                    </div>
                    {content.dressCode.reservedNote && (
                      <p>{content.dressCode.reservedNote}</p>
                    )}
                  </div>
                )}
            </div>
          </section>
        )}

        {/* SECCIÓN 10: DETALLES / REGALOS */}
        {hasGifts && (
          <section
            id="ma-gifts"
            data-editor-section="gifts"
            className="ma-gifts ma-section ma-sheet"
          >
            <div className="ma-container">
              <SectionHeader
                code="COFRE DE TRAVESÍA"
                eyebrow={sectionHeading(config, 'gifts', 'eyebrow', 'Con cariño')}
                title={sectionHeading(config, 'gifts', 'title', 'Detalles')}
                subtitle={content.gifts.introMessage}
              />

              <div className="ma-gifts__grid">
                {content.gifts.cashEnvelopeAtVenue && (
                  <article className="ma-gifts__card">
                    <Gift size={22} className="ma-gifts__icon" />
                    <span>BUZÓN EN RECEPCIÓN</span>
                    <h3>Lluvia de sobres junto al mar</h3>
                    <p>
                      En la entrada de la terraza contaremos con un cofre especial para quienes deseen dejarnos un sobre y una postal de buenos deseos.
                    </p>
                  </article>
                )}

                {content.gifts.bankTransfer?.enabled && (
                  <article className="ma-gifts__card ma-gifts__card--wide">
                    <CreditCard size={22} className="ma-gifts__icon" />
                    <span>TRANSFERENCIA BANCARIA</span>
                    <h3>
                      {content.gifts.bankTransfer.bankName} ·{' '}
                      {content.gifts.bankTransfer.accountHolder}
                    </h3>
                    <p className="ma-gifts__clabe">
                      CLABE: {content.gifts.bankTransfer.clabe}
                    </p>
                    {content.gifts.bankTransfer.conceptNote && (
                      <small>{content.gifts.bankTransfer.conceptNote}</small>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyClabe(content.gifts.bankTransfer!.clabe)
                      }
                      className="ma-button ma-button--primary"
                    >
                      {copiedClabe ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedClabe ? 'CLABE copiada' : 'Copiar CLABE'}</span>
                    </button>
                  </article>
                )}

                {content.gifts.registries.map((reg, idx) => (
                  <article className="ma-gifts__card" key={`${reg.storeName}-${idx}`}>
                    <Heart size={22} className="ma-gifts__icon" />
                    <span>MESA DE REGALOS</span>
                    <h3>{reg.storeName}</h3>
                    {reg.eventNumber && <p>Evento: {reg.eventNumber}</p>}
                    <a
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ma-button ma-button--ghost"
                    >
                      <span>Abrir mesa</span>
                      <ExternalLink size={14} />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 11: HOSPEDAJE (SI ESTÁ HABILITADO) */}
        {enabled('accommodation') && content.accommodation.length > 0 && (
          <section
            id="ma-stay"
            data-editor-section="accommodation"
            className="ma-stay ma-section"
          >
            <div className="ma-container">
              <SectionHeader
                code="ESTANCIA EN LA BAHÍA"
                eyebrow={sectionHeading(
                  config,
                  'accommodation',
                  'eyebrow',
                  'Tu estancia'
                )}
                title={sectionHeading(
                  config,
                  'accommodation',
                  'title',
                  'Dónde descansar'
                )}
              />

              <div className="ma-stay__grid">
                {content.accommodation.map((hotel, idx) => (
                  <article className="ma-stay__card" key={`${hotel.hotelName}-${idx}`}>
                    <Hotel size={22} className="ma-stay__icon" />
                    <h3>{hotel.hotelName}</h3>
                    <p>{hotel.distanceNote}</p>
                    {hotel.discountCode && (
                      <span className="ma-stay__code">
                        Código: <strong>{hotel.discountCode}</strong>
                      </span>
                    )}
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ma-button ma-button--ghost"
                      >
                        <span>Reservar habitación</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 12: RECUERDOS COMPARTIDOS (ÁLBUM Y CANCIONES) */}
        {enabled('social_features') && (
          <section
            id="ma-social"
            data-editor-section="socialFeatures"
            className="ma-social ma-section"
          >
            <div className="ma-container">
              <SectionHeader
                code="MEMORIA DEL MAR"
                eyebrow={sectionHeading(
                  config,
                  'social_features',
                  'eyebrow',
                  'Recuerdos compartidos'
                )}
                title={sectionHeading(
                  config,
                  'social_features',
                  'title',
                  'Nuestra colección'
                )}
                subtitle="Sube las fotos que captures en la bahía y sugiere las canciones que no pueden faltar al caer la noche."
              />

              <div className="ma-social__grid">
                <div className="ma-social__panel">
                  <div className="ma-social__panel-head">
                    <Sparkles size={16} />
                    <span>ÁLBUM EN VIVO JUNTO AL MAR</span>
                  </div>
                  <h3>Comparte tus postales del día</h3>
                  <SharedAlbum
                    slug={slug}
                    token={guestGroup?.guestToken}
                    preview={isBuilderPreview}
                  />
                </div>

                {(content.socialFeatures.enableSongRequests ||
                  content.socialFeatures.enableAudioGuestbook) && (
                  <div className="ma-social__panel">
                    <div className="ma-social__panel-head">
                      <Music size={16} />
                      <span>SONIDOS DE LA BAHÍA</span>
                    </div>
                    <h3>Canciones y buenos deseos</h3>
                    <SocialFeatures
                      slug={slug}
                      token={guestGroup?.guestToken}
                      preview={isBuilderPreview}
                      songsEnabled={content.socialFeatures.enableSongRequests}
                      audioEnabled={content.socialFeatures.enableAudioGuestbook}
                    />
                  </div>
                )}
              </div>

              {content.socialFeatures.hashtag && (
                <div className="ma-social__hashtag">
                  <CompassStar className="ma-gallery__star" />
                  <span>{content.socialFeatures.hashtag}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECCIÓN 13: PASE DE EMBARQUE / RSVP CON QR */}
        {enabled('rsvp') && (
          <section
            id="ma-rsvp"
            data-editor-section="rsvp"
            className="ma-rsvp ma-section ma-sheet ma-sheet--ocean"
          >
            <div className="ma-container">
              <SectionHeader
                code="PASE DE EMBARQUE"
                eyebrow={sectionHeading(
                  config,
                  'rsvp',
                  'eyebrow',
                  'Reserva tu lugar'
                )}
                title={sectionHeading(
                  config,
                  'rsvp',
                  'title',
                  'Nos encantará verte'
                )}
                subtitle={
                  guestGroup
                    ? `Pase de embarque reservado para ${guestGroup.groupName} (${guestGroup.allocatedAdults} adultos${
                        guestGroup.allocatedChildren > 0
                          ? ` y ${guestGroup.allocatedChildren} niños`
                          : ''
                      }).`
                    : 'Confirma tu asistencia para preparar tu lugar frente al mar y generar tu pase QR.'
                }
                light
              />

              <div className="ma-rsvp__pass">
                <div className="ma-rsvp__pass-bar">
                  <span>
                    <Compass size={15} />
                    <strong>EMBARQUE RESERVADO · {coupleDisplay.toUpperCase()}</strong>
                  </span>
                  <span>BAHÍA 01 · HUATULCO</span>
                </div>

                {!generatedPass ? (
                  <form className="ma-rsvp__form" onSubmit={handleRsvpSubmit}>
                    <div className="ma-rsvp__row">
                      <label className="ma-rsvp__field">
                        <span>Nombre o familia</span>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="Ej. Familia Morales"
                        />
                      </label>

                      <label className="ma-rsvp__field">
                        <span>WhatsApp de contacto</span>
                        <input
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="Ej. 55 1234 5678"
                        />
                      </label>
                    </div>

                    <div className="ma-rsvp__row">
                      <label className="ma-rsvp__field">
                        <span>¿Nos acompañas junto al mar?</span>
                        <select
                          value={willAttend}
                          onChange={(e) =>
                            setWillAttend(e.target.value as 'yes' | 'no')
                          }
                        >
                          <option value="yes">
                            ¡Sí, ahí estaremos para celebrar!
                          </option>
                          <option value="no">
                            No podremos asistir esta vez
                          </option>
                        </select>
                      </label>

                      {willAttend === 'yes' && (
                        <label className="ma-rsvp__field">
                          <span>Adultos confirmados</span>
                          <select
                            value={adults}
                            onChange={(e) => setAdults(Number(e.target.value))}
                          >
                            {Array.from({ length: maxAdults }, (_, i) => i + 1).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num} {num === 1 ? 'adulto' : 'adultos'}
                                </option>
                              )
                            )}
                          </select>
                        </label>
                      )}
                    </div>

                    {willAttend === 'yes' &&
                      content.rsvp.allowChildrenSelection && (
                        <label className="ma-rsvp__field">
                          <span>Niños acompañantes</span>
                          <select
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                          >
                            {Array.from(
                              { length: maxChildren + 1 },
                              (_, i) => i
                            ).map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'niño' : 'niños'}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}

                    {willAttend === 'yes' &&
                      content.rsvp.askDietaryRestrictions && (
                        <label className="ma-rsvp__field">
                          <span>Restricciones alimentarias o alergias</span>
                          <input
                            type="text"
                            value={dietaryNotes}
                            onChange={(e) => setDietaryNotes(e.target.value)}
                            placeholder="Vegetariano, alergia a mariscos, sin gluten..."
                          />
                        </label>
                      )}

                    <label className="ma-rsvp__field">
                      <span>Mensaje para los novios</span>
                      <textarea
                        rows={3}
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Déjanos un deseo para este nuevo horizonte..."
                      />
                    </label>

                    <button
                      type="submit"
                      className="ma-button ma-button--primary ma-button--full"
                    >
                      <Ticket size={17} />
                      <span>
                        {willAttend === 'yes'
                          ? 'Confirmar y generar pase QR'
                          : 'Enviar respuesta'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="ma-rsvp__confirmed">
                    <div className="ma-rsvp__confirmed-badge">
                      <Check size={16} />
                      <span>EMBARQUE CONFIRMADO</span>
                    </div>
                    <h3>{generatedPass.groupName}</h3>
                    <p className="ma-rsvp__confirmed-meta">
                      {generatedPass.adults}{' '}
                      {generatedPass.adults === 1 ? 'adulto' : 'adultos'}
                      {generatedPass.children > 0
                        ? ` + ${generatedPass.children} ${
                            generatedPass.children === 1 ? 'niño' : 'niños'
                          }`
                        : ''}{' '}
                      · {generatedPass.tableName}
                    </p>
                    <div className="ma-rsvp__qr-box">
                      <QRCodeSVG
                        value={generatedPass.qrPayload}
                        size={168}
                        bgColor="#FFFFFF"
                        fgColor="#102F45"
                        level="M"
                      />
                    </div>
                    <p className="ma-rsvp__confirmed-note">
                      {content.rsvp.customConfirmationMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => setGeneratedPass(null)}
                      className="ma-button ma-button--ghost"
                    >
                      <span>Actualizar datos</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="ma-footer">
        <div className="ma-container ma-footer__inner">
          <div className="ma-footer__boat" aria-hidden="true">
            <CoastalSailboat />
          </div>
          <p className="ma-footer__kicker">UN NUEVO HORIZONTE JUNTO AL MAR</p>
          <h2 className="ma-footer__title">{coupleDisplay}</h2>
          <p className="ma-footer__meta">
            {dateLabel} · {mainLocation?.venueName || 'Bahías de Huatulco, Oaxaca'}
          </p>
        </div>
      </footer>
    </div>
  );
}
