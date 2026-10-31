'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
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
  Ticket,
  Users,
  Volume2,
} from 'lucide-react';
import { sectionHeading } from '@/lib/templates/section-heading';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
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
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import { HeroMedia } from '../core/HeroMedia';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';
import './eternal-elegance.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface EternalEleganceExperienceProps {
  slug: string;
  templateId?: TemplateId;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
  previewEnvelope?: boolean;
}

interface HaciendaSoireeMoment {
  id: string;
  roman: string;
  code: string;
  timeTag: string;
  venueTag: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const HACIENDA_MOMENTS: HaciendaSoireeMoment[] = [
  {
    id: 'moment-1',
    roman: 'I',
    code: 'TIEMPO I · EL ENCUENTRO SAGRADO',
    timeTag: '17:00 HRS · CEREMONIA',
    venueTag: 'PARROQUIA & NAVE DE CANTERA',
    title: 'Promesas bajo Luz de Velas',
    subtitle: 'Cuerdas clásicas, rosas de jardín e incienso suave',
    description:
      'Entre arcos de cantera histórica y el murmullo de un cuarteto de cuerdas, caminamos hacia el altar para pronunciar nuestros votos rodeados de quienes más amamos.',
    imageUrl: '/images/eternal-elegance/ceremony.jpg',
  },
  {
    id: 'moment-2',
    roman: 'II',
    code: 'TIEMPO II · JARDÍN DE LOS OLIVOS',
    timeTag: '18:30 HRS · COCTEL DE BIENVENIDA',
    venueTag: 'PATIO DE LOS ARCOS',
    title: 'Brindis de Hora Dorada',
    subtitle: 'Champaña helada, coctelería botánica y jazz acústico',
    description:
      'Mientras el sol cae sobre los muros coloniales tiñendo la piedra de oro viejo, nos reunimos en el jardín central para abrazarnos y brindar por el inicio de esta velada.',
    imageUrl: '/images/eternal-elegance/vows.jpg',
  },
  {
    id: 'moment-3',
    roman: 'III',
    code: 'TIEMPO III · EL GRAN BANQUETE',
    timeTag: '20:00 HRS · CENA DE GALA',
    venueTag: 'PATIO CENTRAL DE LA HACIENDA',
    title: 'Mesa Imperial bajo Candiles',
    subtitle: 'Lino marfil, porcelana con filo de oro y cocina de autor',
    description:
      'Las mesas vestidas con lino fino, candelabros de cristal y follaje de olivo nos reciben para compartir una cena inolvidable bajo un cielo iluminado por cientos de luces cálidas.',
    imageUrl: '/images/eternal-elegance/hacienda.jpg',
  },
  {
    id: 'moment-4',
    roman: 'IV',
    code: 'TIEMPO IV · PRIMER VALS & MEDIANOCHE',
    timeTag: '22:00 HRS · PISTA CENTRAL',
    venueTag: 'SALÓN & TERRAZA DE PIEDRA',
    title: 'Nuestro Primer Baile & Celebración',
    subtitle: 'Chispas doradas, pastel de cuatro pisos y orquesta en vivo',
    description:
      'Abrimos la pista con nuestro primer vals como esposos, partimos el pastel entre destellos dorados y bailamos sin descanso hasta la tornaboda.',
    imageUrl: '/images/eternal-elegance/toast.jpg',
  },
];

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Sábado · 17:00 HRS';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(parsed);
};

function extractCoupleNames(mainTitle: string): [string, string] {
  const raw = (mainTitle || 'Sofía & Mateo').trim();
  const parts = raw.split(/\s*(?:&|y|\+)\s*/i).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' & ')];
  }
  return [raw, 'Nuestro Para Siempre'];
}

/**
 * Enriquecimiento suave del contenido de Eternal Elegance para que tanto invitaciones
 * nuevas como existentes luzcan las 5 fotografías editoriales locales, 3 capítulos de
 * historia, 3 grupos familiares y 4 momentos de programa sin sobrescribir ediciones.
 */
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
    existingBlocks.length < 3 ||
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
      raw.vipParents.groups && raw.vipParents.groups.length >= 2
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
    raw.gallery.images.length === 0 ||
    raw.gallery.images.some((img) => img.url.includes('unsplash.com'));

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

/* ============================================================================
 * COMPONENTES VECTORIALES SIMÉTRICOS DE PAPELERÍA EDITORIAL
 * ========================================================================== */

/**
 * 1. Blasón / Medallón Botánico y de Alianzas (<HaciendaCrestMedallion />)
 * Eje de simetría estricto en x = 120 dentro de viewBox="0 0 240 240"
 */
function HaciendaCrestMedallion({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`ee-crest-svg ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="eeCrestGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.28" />
          <stop offset="65%" stopColor="#8C7355" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="eeGoldFoil"
          x1="36"
          y1="28"
          x2="204"
          y2="212"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#D4B475" />
          <stop offset="50%" stopColor="#9E7E46" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="106" fill="url(#eeCrestGlow)" />

      {/* Anillos exteriores grabados (centrados en 120,120) */}
      <circle
        cx="120"
        cy="120"
        r="96"
        stroke="url(#eeGoldFoil)"
        strokeWidth="1.2"
        strokeDasharray="4 5"
      />
      <circle
        cx="120"
        cy="120"
        r="86"
        fill="#FAF7F2"
        fillOpacity="0.9"
        stroke="url(#eeGoldFoil)"
        strokeWidth="1.6"
      />
      <circle
        cx="120"
        cy="120"
        r="76"
        stroke="#8C7355"
        strokeWidth="0.9"
        strokeOpacity="0.45"
      />

      {/* Marco octogonal simétrico */}
      <polygon
        points="120,36 179,61 204,120 179,179 120,204 61,179 36,120 61,61"
        stroke="url(#eeGoldFoil)"
        strokeWidth="1.1"
        strokeOpacity="0.6"
      />

      {/* Ramas de olivo simétricas izquierda y derecha (espejo en x = 120) */}
      <path
        d="M120 192 C82 186, 58 156, 58 120 C58 84, 82 54, 112 46"
        stroke="#8C7355"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M120 192 C158 186, 182 156, 182 120 C182 84, 158 54, 128 46"
        stroke="#8C7355"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Hojas de olivo espejo (x = 120 ± delta) */}
      <path
        d="M62 142 C50 138, 48 126, 60 124 C66 130, 66 138, 62 142 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />
      <path
        d="M178 142 C190 138, 192 126, 180 124 C174 130, 174 138, 178 142 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />
      <path
        d="M64 102 C52 96, 54 84, 66 86 C70 92, 68 98, 64 102 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />
      <path
        d="M176 102 C188 96, 186 84, 174 86 C170 92, 172 98, 176 102 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />
      <path
        d="M84 68 C76 58, 82 48, 92 54 C92 60, 88 66, 84 68 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />
      <path
        d="M156 68 C164 58, 158 48, 148 54 C148 60, 152 66, 156 68 Z"
        fill="#C5A059"
        fillOpacity="0.45"
      />

      {/* Alianzas matrimoniales entrelazadas (106 y 134 -> promedio exacto 120) */}
      <circle
        cx="106"
        cy="122"
        r="26"
        stroke="url(#eeGoldFoil)"
        strokeWidth="2.4"
      />
      <circle
        cx="134"
        cy="122"
        r="26"
        stroke="url(#eeGoldFoil)"
        strokeWidth="2.4"
      />

      {/* Diamante superior central en x = 120 */}
      <polygon
        points="120,68 128,80 120,92 112,80"
        fill="#C5A059"
        stroke="#8C7355"
        strokeWidth="1"
      />

      {/* Estrella cardinal en x = 120 */}
      <circle cx="120" cy="46" r="3.5" fill="#C5A059" />
      <circle cx="120" cy="192" r="3.5" fill="#C5A059" />

      {!compact && (
        <text
          x="120"
          y="168"
          textAnchor="middle"
          fill="#8C7355"
          fontSize="10"
          fontWeight="600"
          letterSpacing="3.5"
        >
          SIEMPRE
        </text>
      )}
    </svg>
  );
}

/**
 * 2. Arco Botánico Simétrico de Cantera (<BotanicalArchEmblem />)
 * Eje de simetría estricto en x = 110 dentro de viewBox="0 0 220 260"
 */
function BotanicalArchEmblem({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 260"
      className={`ee-arch-emblem ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Arco exterior e interior centrados en x = 110 */}
      <path
        d="M34 236 V112 A76 76 0 0 1 186 112 V236"
        stroke="#C5A059"
        strokeWidth="1.8"
      />
      <path
        d="M46 236 V112 A64 64 0 0 1 174 112 V236"
        stroke="#8C7355"
        strokeWidth="1.1"
        strokeDasharray="4 4"
      />
      {/* Línea base simétrica */}
      <line x1="22" y1="236" x2="198" y2="236" stroke="#C5A059" strokeWidth="1.6" />
      {/* Clave de cantera superior en x = 110 */}
      <polygon
        points="110,22 118,36 110,50 102,36"
        fill="#C5A059"
      />
      {/* Rayos solares finos desde (110, 112) */}
      <line x1="110" y1="54" x2="110" y2="96" stroke="#C5A059" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="68" y1="70" x2="96" y2="98" stroke="#C5A059" strokeWidth="1" strokeOpacity="0.45" />
      <line x1="152" y1="70" x2="124" y2="98" stroke="#C5A059" strokeWidth="1" strokeOpacity="0.45" />
      {/* Ramilletes botánicos simétricos */}
      <path
        d="M46 196 Q78 168 110 196 Q142 168 174 196"
        stroke="#8C7355"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="110" cy="142" r="18" stroke="#C5A059" strokeWidth="1.4" />
      <polygon points="110,132 115,142 110,152 105,142" fill="#8C7355" />
    </svg>
  );
}

/**
 * 3. Sello Giratorio de Papelería (<RotatingHeirloomSeal />)
 */
function RotatingHeirloomSeal({ text }: { text?: string }) {
  const sealText =
    text ||
    'ETERNAL ELEGANCE ✦ NUESTRO PARA SIEMPRE ✦ BODA EN HACIENDA ✦ ';
  return (
    <div className="ee-rotating-seal" aria-hidden="true">
      <svg viewBox="0 0 180 180" className="ee-rotating-seal__svg">
        <defs>
          <path
            id="eeHeirloomCirclePath"
            d="M 90, 90 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
          />
        </defs>
        <circle
          cx="90"
          cy="90"
          r="84"
          fill="#FAF7F2"
          fillOpacity="0.92"
          stroke="#C5A059"
          strokeWidth="1.3"
        />
        <circle
          cx="90"
          cy="90"
          r="52"
          fill="#F2ECE1"
          stroke="#8C7355"
          strokeWidth="1.1"
          strokeDasharray="3 4"
        />
        <text
          fill="#6E655F"
          fontSize="9.8"
          fontWeight="600"
          letterSpacing="2.8"
        >
          <textPath href="#eeHeirloomCirclePath" startOffset="0%">
            {sealText}
          </textPath>
        </text>
        <polygon
          points="90,72 95,85 108,90 95,95 90,108 85,95 72,90 85,85"
          fill="#C5A059"
        />
      </svg>
    </div>
  );
}

/**
 * 4. Rosetón Arquitectónico y Columnata de Hacienda (<ArchitecturalRoseWindow />)
 * Se dibuja con strokeDashoffset al hacer scroll en la sección de Historia.
 */
function ArchitecturalRoseWindow() {
  return (
    <svg
      viewBox="0 0 1200 720"
      className="ee-rose-window-svg"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Arco arquitectónico central simétrico (eje x = 600) */}
      <path
        className="ee-draw-path"
        d="M320 680 V340 A280 280 0 0 1 880 340 V680"
        stroke="#C5A059"
        strokeWidth="1.6"
        strokeOpacity="0.42"
      />
      <path
        className="ee-draw-path"
        d="M360 680 V340 A240 240 0 0 1 840 340 V680"
        stroke="#8C7355"
        strokeWidth="1.1"
        strokeOpacity="0.32"
      />
      {/* Rosetón central en (600, 340) */}
      <circle
        className="ee-draw-path"
        cx="600"
        cy="340"
        r="175"
        stroke="#C5A059"
        strokeWidth="1.4"
        strokeOpacity="0.38"
      />
      <circle
        className="ee-draw-path"
        cx="600"
        cy="340"
        r="115"
        stroke="#8C7355"
        strokeWidth="1.1"
        strokeOpacity="0.32"
      />
      {/* Pétalos geométricos simétricos del rosetón */}
      <polygon
        className="ee-draw-path"
        points="600,165 724,216 775,340 724,464 600,515 476,464 425,340 476,216"
        stroke="#C5A059"
        strokeWidth="1.2"
        strokeOpacity="0.34"
      />
      <line
        className="ee-draw-path"
        x1="200"
        y1="340"
        x2="1000"
        y2="340"
        stroke="#C5A059"
        strokeWidth="1"
        strokeOpacity="0.26"
      />
      <line
        className="ee-draw-path"
        x1="600"
        y1="80"
        x2="600"
        y2="640"
        stroke="#C5A059"
        strokeWidth="1"
        strokeOpacity="0.26"
      />
    </svg>
  );
}

/**
 * 5. Banda Cinética Editorial (<KineticMarquee />)
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
      className={`ee-marquee ${reverse ? 'ee-marquee--reverse' : ''}`}
      aria-hidden="true"
    >
      <div className="ee-marquee__track">
        {repeated.map((item, idx) => (
          <span className="ee-marquee__item" key={`${item}-${idx}`}>
            <span>{item}</span>
            <span className="ee-diamond" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Flourish() {
  return (
    <svg
      className="ee-flourish ee-reveal"
      viewBox="0 0 180 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="ee-draw"
        d="M1 14h53c12 0 19-4 26-13M179 14h-53c-12 0-19-4-26-13M80 27c4-5 7-10 10-13 3 3 6 8 10 13M90 8l5 6-5 6-5-6 5-6Z"
      />
    </svg>
  );
}

function Diamond() {
  return <span className="ee-diamond" aria-hidden="true" />;
}

function SectionIntro({
  code,
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  code?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div
      className={`ee-section-intro ${
        align === 'left' ? 'ee-section-intro--left' : ''
      }`}
    >
      <div className="ee-overline ee-reveal">
        <Diamond />
        <span className="ee-overline__label">
          {code ? `${code} · ${eyebrow}` : eyebrow}
        </span>
        <Diamond />
      </div>
      <h2 className="ee-heading">{title}</h2>
      {subtitle && <p className="ee-section-subtitle">{subtitle}</p>}
      <Flourish />
    </div>
  );
}

function Opening({
  config,
  content,
  eventDate,
  guestGroup,
  isOpen,
  onOpen,
}: {
  config: InvitationConfig;
  content: InvitationConfig['content'];
  eventDate: string;
  guestGroup?: GuestGroup | null;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(() => {
      onOpen();
      setOpening(false);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);

  const handleOpenClick = () => {
    setOpening(true);
    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.62 },
        colors: ['#C5A059', '#8C7355', '#FAF7F2', '#E6D5B8'],
      });
    } catch {
      // Ignore confetti errors
    }
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="ee-opening"
          data-editor-section="envelope"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ee-opening__frame" />
          <div className="ee-opening__content">
            <div className="ee-opening__crest">
              <HaciendaCrestMedallion compact />
            </div>
            <p className="ee-overline">
              <Diamond /> {content.hero.badgeText || 'UNA CELEBRACIÓN DEL AMOR'}{' '}
              <Diamond />
            </p>
            <p className="ee-opening__script">Estás invitado a celebrar</p>
            <h1 className="ee-opening__title">{content.hero.mainTitle}</h1>
            <p className="ee-opening__date">
              {formatDate(eventDate)} ·{' '}
              {content.hero.tagline.split('•').slice(1).join('•').trim() ||
                content.hero.tagline}
            </p>
            <motion.div
              className={`ee-envelope ee-envelope--${config.theme.envelope.variant}${
                opening ? ' ee-envelope--opening' : ''
              }`}
              animate={
                opening
                  ? { y: 25, scale: 1.04, opacity: 0 }
                  : { y: 0, scale: 1, opacity: 1 }
              }
              transition={{
                duration: 0.62,
                delay: opening ? 0.25 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span
                className="ee-envelope__fold ee-envelope__fold--left"
                aria-hidden="true"
              />
              <span
                className="ee-envelope__fold ee-envelope__fold--right"
                aria-hidden="true"
              />
              <span
                className="ee-envelope__fold ee-envelope__fold--bottom"
                aria-hidden="true"
              />
              <span className="ee-envelope__flap" aria-hidden="true" />
              <span className="ee-envelope__seal" aria-hidden="true">
                {config.theme.envelope.sealMonogram}
              </span>
              <span className="ee-envelope__address">
                <span className="ee-envelope__label">PASE DE HONOR PARA</span>
                <strong className="ee-envelope__name">
                  {guestGroup?.groupName || 'Nuestros seres queridos'}
                </strong>
                <span className="ee-envelope__passes">
                  {guestGroup
                    ? `${
                        guestGroup.allocatedAdults +
                        guestGroup.allocatedChildren
                      } pases reservados`
                    : 'Un lugar muy especial espera por ti'}
                </span>
              </span>
            </motion.div>
            <motion.button
              type="button"
              className="ee-opening__button"
              onClick={handleOpenClick}
              disabled={opening}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {config.theme.envelope.openButtonText} <ArrowRight size={16} />
            </motion.button>
            {config.audio.enabled && (
              <p className="ee-opening__audio">
                <Volume2 size={13} /> Una experiencia con música
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type WeddingLocation = InvitationConfig['content']['locations'][number];

function MapServiceIcon({
  service,
}: {
  service: 'uber' | 'apple' | 'google' | 'waze';
}) {
  if (service === 'uber')
    return (
      <span className="ee-map-service__uber" aria-hidden="true">
        U
      </span>
    );
  if (service === 'apple')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.5 12.8c0-2 1.6-3 1.7-3.1-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 2-1.4 2.4-.4 5.9 1 7.8.7.9 1.4 1.9 2.4 1.9s1.4-.6 2.7-.6 1.7.6 2.7.6 1.7-.9 2.3-1.9c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.5-.9-2.5-2.9ZM14.8 6.9c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.9-.4 2.5-1.1Z"
        />
      </svg>
    );
  if (service === 'google')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M12 22s7-7.7 7-13a7 7 0 0 0-14 0c0 5.3 7 13 7 13Z"
        />
        <path
          fill="#34A853"
          d="M5 9c0 5.3 7 13 7 13V2a7 7 0 0 0-7 7Z"
        />
        <path
          fill="#FBBC04"
          d="M5 9c0 2.1 1.1 4.7 2.5 7L15.6 3a7 7 0 0 0-10.6 6Z"
        />
        <circle cx="12" cy="9" r="2.8" fill="#fff" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M4 14c0-5 3.6-8.5 8.5-8.5 5 0 8 3.5 8 8v2c0 1.4-1.1 2.5-2.5 2.5H9l-2 2v-2.5C5.2 17 4 15.8 4 14Z" />
      <path
        d="M9 12.4h.1m6 0h.1M9 15c1.4 1.5 4.8 1.5 6.2 0"
        strokeLinecap="round"
      />
      <circle cx="10" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

function LocationDirections({ locations }: { locations: WeddingLocation[] }) {
  const [selectedId, setSelectedId] = useState(locations[0].id);
  const location =
    locations.find((item) => item.id === selectedId) || locations[0];
  const { lat, lng } = location.coordinates;
  const coordinate = `${lat},${lng}`;
  const destinationName = encodeURIComponent(location.venueName);
  const services = [
    {
      id: 'uber' as const,
      name: 'Uber',
      url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Blatitude%5D=${lat}&dropoff%5Blongitude%5D=${lng}&dropoff%5Bnickname%5D=${destinationName}`,
    },
    {
      id: 'apple' as const,
      name: 'Apple Maps',
      url: `https://maps.apple.com/?daddr=${encodeURIComponent(
        coordinate,
      )}&dirflg=d`,
    },
    {
      id: 'google' as const,
      name: 'Google Maps',
      url: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        coordinate,
      )}&travelmode=driving`,
    },
    {
      id: 'waze' as const,
      name: 'Waze',
      url:
        location.wazeUrl ||
        `https://waze.com/ul?ll=${encodeURIComponent(coordinate)}&navigate=yes`,
    },
  ];

  return (
    <div id="directions" className="ee-directions ee-reveal">
      <div className="ee-directions__heading">
        <div>
          <span className="ee-small-index">FOLIO DE RUTA & GPS</span>
          <h3>Encuentra el camino</h3>
        </div>
        <p>Elige el momento al que nos acompañarás y abre tu ruta favorita.</p>
      </div>
      <div
        className="ee-directions__tabs"
        role="tablist"
        aria-label="Seleccionar ubicación"
      >
        {locations.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === location.id}
            className={item.id === location.id ? 'is-active' : ''}
            onClick={() => setSelectedId(item.id)}
          >
            <span>0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className="ee-directions__body">
        <div className="ee-directions__map">
          <iframe
            key={location.id}
            title={`Mapa de ${location.venueName}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              coordinate,
            )}&z=15&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="ee-directions__map-label">
            <MapPin size={16} /> {location.venueName}
          </div>
        </div>
        <div className="ee-directions__detail">
          <span className="ee-directions__pin">
            <MapPin size={23} strokeWidth={1.3} />
          </span>
          <span className="ee-small-index">
            {location.title} · {location.time}
          </span>
          <h4>{location.venueName}</h4>
          <p>{location.address}</p>
          <div className="ee-directions__services">
            {services.map((service) => (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ruta a ${location.venueName} en ${service.name}`}
              >
                <MapServiceIcon service={service.id} />
                <span>{service.name}</span>
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EternalEleganceExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: EternalEleganceExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timelineListRef = useRef<HTMLDivElement>(null);
  const timelineTravelerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(
    forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope),
  );
  const [activeSection, setActiveSection] = useState('hero');
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const [candlelightMood, setCandlelightMood] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [rsvpName, setRsvpName] = useState(guestGroup?.groupName || '');
  const [rsvpPhone, setRsvpPhone] = useState(guestGroup?.whatsappPhone || '');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [adults, setAdults] = useState(guestGroup?.allocatedAdults ?? 2);
  const [children, setChildren] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [pass, setPass] = useState<{
    name: string;
    payload: string;
    adults: number;
    children: number;
  } | null>(null);

  const openInvitation = useCallback(() => setIsOpen(true), []);
  const content = useMemo(() => eternalContent(config), [config]);
  const { theme } = config;
  const dateText = formatDate(eventDate);
  const [coupleFirst, coupleSecond] = extractCoupleNames(content.hero.mainTitle);
  const coupleDisplay = `${coupleFirst} & ${coupleSecond}`;

  const isSectionEnabled = useCallback(
    (id: SectionId) =>
      config.sectionsOrder.find((section) => section.id === id)?.enabled ??
      true,
    [config.sectionsOrder],
  );
  const sectionSignature = config.sectionsOrder
    .map((section) => `${section.id}:${section.enabled}`)
    .join('|');

  useEffect(
    () => setIsOpen(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope)),
    [forceEnvelopeOpen, isBuilderPreview, previewEnvelope],
  );

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, new Date(eventDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor(difference / 3600000) % 24,
        minutes: Math.floor(difference / 60000) % 60,
        seconds: Math.floor(difference / 1000) % 60,
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [eventDate]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || (!isOpen && !isBuilderPreview)) return;
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const scroller = root.closest('[data-invitation-scroller]') || undefined;
      const scrollerOption = scroller ? { scroller } : {};

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('section[id]'),
      );
      const scrollTarget = scroller || window;
      let activeFrame = 0;
      const updateActiveSection = () => {
        cancelAnimationFrame(activeFrame);
        activeFrame = requestAnimationFrame(() => {
          const scrollerBounds = scroller?.getBoundingClientRect();
          const marker =
            (scrollerBounds?.top || 0) +
            (scrollerBounds?.height || window.innerHeight) * 0.34;
          const current = sections.find((section) => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= marker && bounds.bottom > marker;
          });
          if (current) setActiveSection(current.id);
        });
      };
      scrollTarget.addEventListener('scroll', updateActiveSection, {
        passive: true,
      });
      window.addEventListener('resize', updateActiveSection);
      updateActiveSection();

      if (!reduced) {
        // 1. HERO TWO-BEAT STICKY PORTAL EXPANSION (Mathematically Centered)
        const hero = root.querySelector<HTMLElement>('.ee-hero');
        const heroVisual = root.querySelector<HTMLElement>('.ee-hero__visual');
        const heroCopy = root.querySelector<HTMLElement>('.ee-hero__copy');
        const heroBadges = root.querySelector<HTMLElement>('.ee-hero__badges');
        const heroBridge = root.querySelector<HTMLElement>('.ee-hero__final');
        const heroWatermark =
          root.querySelector<HTMLElement>('.ee-hero__watermark');
        const heroScroll = root.querySelector<HTMLElement>('.ee-hero__scroll');

        gsap.fromTo(
          root.querySelectorAll('.ee-hero .ee-entrance'),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.15,
          },
        );

        if (hero && heroVisual) {
          const heroTl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.9,
              invalidateOnRefresh: true,
              ...scrollerOption,
            },
          });

          heroTl.to(
            heroVisual,
            {
              left: '0%',
              top: '0%',
              width: '100%',
              height: '100%',
              borderRadius: '0px',
              duration: 0.88,
            },
            0,
          );

          if (heroCopy) {
            heroTl.to(
              heroCopy,
              { yPercent: -26, opacity: 0, duration: 0.5 },
              0,
            );
          }

          if (heroBadges) {
            heroTl.to(
              heroBadges,
              { scale: 0.84, opacity: 0, duration: 0.5 },
              0.04,
            );
          }

          if (heroWatermark) {
            heroTl.to(
              heroWatermark,
              { scale: 1.28, opacity: 0.03, duration: 0.8 },
              0,
            );
          }

          if (heroScroll) {
            heroTl.to(heroScroll, { opacity: 0, duration: 0.25 }, 0);
          }

          if (heroBridge) {
            heroTl.fromTo(
              heroBridge,
              { y: 48, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.38 },
              0.54,
            );
          }
        }

        // 2. SECTION HEADINGS & FLOURISH DRAW
        root
          .querySelectorAll<HTMLElement>('.ee-section-intro .ee-heading')
          .forEach((heading) => {
            gsap.fromTo(
              heading,
              { scale: 0.9, opacity: 0.36 },
              {
                scale: 1,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: heading,
                  start: 'top 94%',
                  end: 'top 52%',
                  scrub: 0.75,
                  ...scrollerOption,
                },
              },
            );
          });

        // 3. STORY ROSE-WINDOW SVG DRAW + WORD-BY-WORD ILLUMINATION
        root
          .querySelectorAll<SVGGeometryElement>('.ee-draw-path, .ee-draw')
          .forEach((path) => {
            const length = path.getTotalLength ? path.getTotalLength() : 600;
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: path.closest('section') || path,
                  start: 'top 85%',
                  end: 'center 45%',
                  scrub: 0.8,
                  ...scrollerOption,
                },
              },
            );
          });

        const quoteWords =
          root.querySelectorAll<HTMLElement>('.ee-story__word');
        const quote = root.querySelector('.ee-story__quote');
        if (quote && quoteWords.length) {
          gsap.fromTo(
            quoteWords,
            { opacity: 0.18, y: 6 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: quote,
                start: 'top 80%',
                end: 'bottom 45%',
                scrub: 0.65,
                ...scrollerOption,
              },
            },
          );
        }

        // Story cards alternating entrance
        root
          .querySelectorAll<HTMLElement>('.ee-story-card')
          .forEach((card, index) => {
            gsap.fromTo(
              card,
              {
                y: 44,
                rotate: index % 2 === 0 ? -2 : 2,
                opacity: 0,
              },
              {
                y: 0,
                rotate: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 86%',
                  toggleActions: 'play none none reverse',
                  ...scrollerOption,
                },
              },
            );
          });

        // 4. HACIENDA MOMENTS STAGGER
        root
          .querySelectorAll<HTMLElement>('.ee-moment-card')
          .forEach((card, idx) => {
            gsap.fromTo(
              card,
              { y: 36, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  onEnter: () => setActiveMomentIndex(idx),
                  onEnterBack: () => setActiveMomentIndex(idx),
                  ...scrollerOption,
                },
              },
            );
          });

        // 5. FAMILY CARDS ROTATION ALIGNMENT
        root
          .querySelectorAll<HTMLElement>('.ee-family__grid article')
          .forEach((card, index) => {
            gsap.fromTo(
              card,
              {
                y: 64,
                rotate: index % 2 ? 3.5 : -3.5,
                scale: 0.92,
                opacity: 0.25,
              },
              {
                y: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 92%',
                  end: 'top 55%',
                  scrub: 0.75,
                  ...scrollerOption,
                },
              },
            );
          });

        // 6. COUNTDOWN PODS
        const clock = root.querySelector('.ee-countdown__clock');
        if (clock) {
          gsap.fromTo(
            clock.children,
            { scale: 0.78, y: 32, opacity: 0.2 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: {
                trigger: clock,
                start: 'top 88%',
                end: 'center 55%',
                scrub: 0.8,
                ...scrollerOption,
              },
            },
          );
        }

        // 7. LOCATION PHOTO ARCH CLIP-PATH REVEAL
        root
          .querySelectorAll<HTMLElement>('.ee-location__photo')
          .forEach((photo) => {
            gsap.fromTo(
              photo,
              {
                clipPath: 'inset(12% 12% 12% 12% round 46% 46% 0 0)',
                scale: 0.92,
              },
              {
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: photo,
                  start: 'top 92%',
                  end: 'center 52%',
                  scrub: 0.85,
                  ...scrollerOption,
                },
              },
            );
          });

        // 8. TIMELINE RAIL + TRAVELING HACIENDA CREST
        const timelineLine = root.querySelector('.ee-timeline__line-fill');
        if (timelineLine && timelineListRef.current) {
          gsap.fromTo(
            timelineLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineListRef.current,
                start: 'top 65%',
                end: 'bottom 65%',
                scrub: 0.5,
                ...scrollerOption,
              },
            },
          );
        }

        if (timelineListRef.current && timelineTravelerRef.current) {
          gsap.fromTo(
            timelineTravelerRef.current,
            { top: '0%' },
            {
              top: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: timelineListRef.current,
                start: 'top 65%',
                end: 'bottom 65%',
                scrub: 0.5,
                ...scrollerOption,
              },
            },
          );
        }

        root
          .querySelectorAll<HTMLElement>('.ee-timeline__item')
          .forEach((item) => {
            gsap.fromTo(
              item,
              { x: 32, opacity: 0.2, scale: 0.95 },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 90%',
                  end: 'top 56%',
                  scrub: 0.7,
                  ...scrollerOption,
                },
              },
            );
          });

        // 9. GALLERY PARALLAX
        root
          .querySelectorAll<HTMLElement>('.ee-gallery__item')
          .forEach((photo, index) => {
            gsap.fromTo(
              photo,
              {
                y: 70 + index * 10,
                rotate: index % 2 ? 4 : -4,
                opacity: 0.3,
              },
              {
                y: 0,
                rotate: [0, 0, -1, 1][index % 4],
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: photo,
                  start: 'top 95%',
                  end: 'top 55%',
                  scrub: 0.8,
                  ...scrollerOption,
                },
              },
            );
          });
      }

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

      return () => {
        cancelAnimationFrame(activeFrame);
        scrollTarget.removeEventListener('scroll', updateActiveSection);
        window.removeEventListener('resize', updateActiveSection);
      };
    },
    { scope: rootRef, dependencies: [isOpen, isBuilderPreview, sectionSignature] },
  );

  const calendarUrl = buildGoogleCalendarUrl({
    title: content.hero.mainTitle,
    description: `Invitación a ${content.hero.mainTitle}`,
    location: content.locations[0]?.address || content.hero.tagline,
    startDateIso: eventDate,
  });

  const downloadIcs = () => {
    const file = buildIcsFileContent({
      title: content.hero.mainTitle,
      description: `Invitación a ${content.hero.mainTitle}`,
      location: content.locations[0]?.address || content.hero.tagline,
      startDateIso: eventDate,
    });
    const url = URL.createObjectURL(
      new Blob([file], { type: 'text/calendar;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slug}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyClabe = async () => {
    const clabe = content.gifts.bankTransfer?.clabe;
    if (!clabe) return;
    try {
      await navigator.clipboard.writeText(clabe);
      setCopiedClabe(true);
      toast.success('CLABE copiada al portapapeles');
      window.setTimeout(() => setCopiedClabe(false), 2400);
    } catch {
      toast.error('No se pudo copiar la CLABE');
    }
  };

  const submitRsvp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rsvpName.trim()) {
      toast.error('Por favor escribe tu nombre o familia');
      return;
    }

    const totalAdults = willAttend === 'yes' ? adults : 0;
    const totalChildren =
      willAttend === 'yes' && content.rsvp.allowChildrenSelection
        ? children
        : 0;

    try {
      await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestToken: guestGroup?.guestToken,
          groupId: guestGroup?.id,
          groupName: rsvpName.trim(),
          whatsappPhone: rsvpPhone.trim(),
          willAttend: willAttend === 'yes',
          status: willAttend === 'yes' ? 'confirmed' : 'declined',
          confirmedAdults: totalAdults,
          confirmedChildren: totalChildren,
          dietaryNotes: dietaryNotes.trim(),
          guestMessage: guestMessage.trim(),
        }),
      }).catch(() => null);
    } catch {
      // Continue in demo/preview mode
    }

    if (willAttend === 'yes') {
      const payload = JSON.stringify({
        invitationSlug: slug,
        groupName: rsvpName.trim(),
        confirmedAdults: totalAdults,
        confirmedChildren: totalChildren,
      });
      setPass({
        name: rsvpName.trim(),
        adults: totalAdults,
        children: totalChildren,
        payload,
      });
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#C5A059', '#8C7355', '#FAF7F2'],
        });
      } catch {
        // Ignore confetti errors
      }
      toast.success('¡Asistencia confirmada! Tu pase QR está listo.');
    } else {
      setPass(null);
      toast.success('Gracias por avisarnos. Te llevamos en el corazón.');
    }
  };

  const style = {
    '--ee-bg': theme.colors.bgPrimary || '#FAF7F2',
    '--ee-bg-alt': theme.colors.bgSecondary || '#F2ECE1',
    '--ee-ink': theme.colors.textPrimary || '#1E1B18',
    '--ee-muted': theme.colors.textMuted || '#6E655F',
    '--ee-gold': theme.colors.accentPrimary || '#C5A059',
    '--ee-bronze': theme.colors.accentSecondary || '#8C7355',
    '--ee-seal': theme.envelope.sealColor || theme.colors.accentSecondary,
    '--ee-serif': invitationFontStack(
      theme.fonts.headingFont || 'Cormorant Garamond',
    ),
    '--ee-script': invitationFontStack(
      theme.fonts.scriptFont || 'Pinyon Script',
    ),
    '--ee-sans': invitationFontStack(theme.fonts.bodyFont || 'Montserrat'),
  } as React.CSSProperties;

  const activeMoment =
    HACIENDA_MOMENTS[activeMomentIndex] || HACIENDA_MOMENTS[0];

  return (
    <div
      ref={rootRef}
      className={`ee-root ${candlelightMood ? 'ee-root--candlelight' : ''}`}
      style={style}
    >
      {(!isBuilderPreview || previewEnvelope) && (
        <Opening
          config={config}
          content={content}
          eventDate={eventDate}
          guestGroup={guestGroup}
          isOpen={isOpen}
          onOpen={openInvitation}
        />
      )}

      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isOpen}
        accentColor={theme.colors.accentPrimary}
      />

      <div className="ee-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>

      <header className="ee-nav">
        <a
          href="#hero"
          className="ee-nav__brand"
          aria-label={`Volver al inicio de ${content.hero.mainTitle}`}
        >
          <span className="ee-nav__monogram">
            {theme.envelope.sealMonogram}
          </span>
          <span className="ee-nav__names">{content.hero.mainTitle}</span>
        </a>
        <div className="ee-nav__links">
          {isSectionEnabled('quote_story') && (
            <a
              className={activeSection === 'story' ? 'is-active' : ''}
              href="#story"
            >
              Historia
            </a>
          )}
          <a
            className={activeSection === 'ee-moments' ? 'is-active' : ''}
            href="#ee-moments"
          >
            Velada
          </a>
          {isSectionEnabled('locations') && (
            <a
              className={activeSection === 'locations' ? 'is-active' : ''}
              href="#locations"
            >
              Lugar
            </a>
          )}
          {isSectionEnabled('timeline') && (
            <a
              className={activeSection === 'timeline' ? 'is-active' : ''}
              href="#timeline"
            >
              Programa
            </a>
          )}
          {isSectionEnabled('gallery') && (
            <a
              className={activeSection === 'gallery' ? 'is-active' : ''}
              href="#gallery"
            >
              Galería
            </a>
          )}
        </div>
        {isSectionEnabled('rsvp') && (
          <a href="#rsvp" className="ee-nav__rsvp">
            Confirmar <ArrowRight size={15} />
          </a>
        )}
      </header>

      <main>
        {/* ====================================================================
            SCENE 1: TWO-BEAT STICKY HERO PORTAL (#hero)
           ==================================================================== */}
        {isSectionEnabled('hero') && (
          <section id="hero" data-editor-section="hero" className="ee-hero">
            <div className="ee-hero__stage">
              {/* Layer 1: Oversized Watermark & Architectural Rules */}
              <span className="ee-hero__watermark" aria-hidden="true">
                ∞
              </span>
              <span
                className="ee-hero__rule ee-hero__rule--top"
                aria-hidden="true"
              />
              <span
                className="ee-hero__rule ee-hero__rule--bottom"
                aria-hidden="true"
              />
              <div className="ee-hero__side-note">
                <span>EST. 2026</span>
                <span>PAPELERÍA NUPCIAL DE HACIENDA</span>
              </div>

              {/* Layer 2: Mathematically Centered Classical Arch Window */}
              <div className="ee-hero__visual">
                <span className="ee-hero__visual-frame" aria-hidden="true" />
                <div className="ee-hero__photo ee-photo">
                  <HeroMedia
                    hero={content.hero}
                    alt={`Celebración de ${content.hero.mainTitle}`}
                  />
                </div>
                <div className="ee-hero__visual-wash" aria-hidden="true" />
              </div>

              {/* Layer 3: Symmetrical Floating Medallions & Rotating Seal */}
              <div className="ee-hero__badges">
                <div className="ee-hero__badge-left">
                  <RotatingHeirloomSeal
                    text={`ETERNAL ELEGANCE ✦ ${coupleDisplay.toUpperCase()} ✦ SAN MIGUEL DE ALLENDE ✦ `}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCandlelightMood((prev) => !prev)}
                  className="ee-hero__badge-right"
                  aria-label="Alternar iluminación de luz de velas"
                  title="Toca el blasón para alternar atmósfera de luz de velas"
                >
                  <HaciendaCrestMedallion />
                </button>
                <div className="ee-hero__arch-floater" aria-hidden="true">
                  <BotanicalArchEmblem />
                </div>
              </div>

              {/* Layer 4: Centered Foreground Editorial Copy */}
              <div className="ee-hero__copy">
                <p className="ee-overline ee-entrance">
                  <Diamond /> {content.hero.badgeText} <Diamond />
                </p>
                <p className="ee-hero__script ee-entrance">
                  Nos elegimos, una y otra vez
                </p>
                <h1 className="ee-hero__title ee-entrance">
                  {content.hero.mainTitle}
                </h1>
                <div className="ee-hero__divider ee-entrance">
                  <span />
                  <Diamond />
                  <span />
                </div>
                <p className="ee-hero__date ee-entrance">{dateText}</p>
                <p className="ee-hero__place ee-entrance">
                  {content.hero.tagline.split('•').slice(1).join('•').trim() ||
                    content.hero.tagline}
                </p>
                {guestGroup && (
                  <p className="ee-hero__guest ee-entrance">
                    Con especial cariño para {guestGroup.groupName}
                  </p>
                )}
              </div>

              {/* Beat 2 Bridge Card revealed when arch expands to 100% */}
              <div className="ee-hero__final">
                <div className="ee-hero__final-card">
                  <span>CAPÍTULO UNO · EL GRAN DÍA</span>
                  <p>
                    El comienzo de
                    <br />
                    <em>nuestro para siempre.</em>
                  </p>
                  <div className="ee-hero__final-meta">
                    <span>{dateText}</span>
                    <span>✦</span>
                    <span>
                      {content.locations[0]?.venueName ||
                        'San Miguel de Allende'}
                    </span>
                  </div>
                  {isSectionEnabled('quote_story') && (
                    <a href="#story">
                      Descubrir nuestra historia <ArrowDown size={15} />
                    </a>
                  )}
                </div>
              </div>

              {isSectionEnabled('quote_story') && (
                <a
                  className="ee-hero__scroll"
                  href="#story"
                  aria-label="Descubrir nuestra historia"
                >
                  <span>DESLIZA PARA DESCUBRIR</span>
                  <ArrowDown size={15} />
                </a>
              )}
            </div>
          </section>
        )}

        {/* Kinetic Marquee 1 */}
        <KineticMarquee
          items={[
            coupleDisplay.toUpperCase(),
            dateText.toUpperCase(),
            'NUESTRO PARA SIEMPRE',
            'SAN MIGUEL DE ALLENDE',
            'CELEBRACIÓN DE GALA',
          ]}
        />

        {/* ====================================================================
            SCENE 2: MANIFIESTO / NUESTRA HISTORIA (#story)
           ==================================================================== */}
        {isSectionEnabled('quote_story') && (
          <section
            id="story"
            data-editor-section="quote_story"
            className="ee-story ee-section"
          >
            <div className="ee-story__backdrop">
              <ArchitecturalRoseWindow />
            </div>

            <div className="ee-story__inner">
              <p className="ee-overline ee-reveal">
                <Diamond />{' '}
                {sectionHeading(
                  config,
                  'quote_story',
                  'eyebrow',
                  'CAPÍTULO 01 · NUESTRA HISTORIA',
                )}{' '}
                <Diamond />
              </p>
              <div className="ee-story__crest-mini">
                <HaciendaCrestMedallion compact />
              </div>
              <blockquote
                className="ee-story__quote"
                aria-label={content.quoteStory.quoteText}
              >
                <span aria-hidden="true">
                  {content.quoteStory.quoteText
                    .replace(/^[“\"]|[”\"]$/g, '')
                    .split(/\s+/)
                    .map((word, index) => (
                      <span
                        className="ee-story__word"
                        key={`${word}-${index}`}
                      >
                        {word}{' '}
                      </span>
                    ))}
                </span>
              </blockquote>
              {content.quoteStory.quoteAuthor && (
                <p className="ee-story__author ee-reveal">
                  — {content.quoteStory.quoteAuthor}
                </p>
              )}

              {content.quoteStory.storyBlocks &&
                content.quoteStory.storyBlocks.length > 0 && (
                  <div className="ee-story__chapters">
                    {content.quoteStory.storyBlocks.map((block, index) => (
                      <article
                        key={`${block.title}-${index}`}
                        className="ee-story-card"
                      >
                        <div className="ee-story-card__media">
                          <img
                            src={
                              block.imageUrl ||
                              `/images/eternal-elegance/${
                                index === 0
                                  ? 'vows'
                                  : index === 1
                                  ? 'ceremony'
                                  : 'hacienda'
                              }.jpg`
                            }
                            alt={block.title}
                            loading="lazy"
                          />
                          <span className="ee-story-card__index">
                            CAPÍTULO 0{index + 1}
                          </span>
                        </div>
                        <div className="ee-story-card__body">
                          <h3>{block.title}</h3>
                          <p>{block.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
            </div>
          </section>
        )}

        {/* ====================================================================
            SCENE 3: LOS 4 TIEMPOS DE NUESTRA VELADA (#ee-moments)
           ==================================================================== */}
        <section id="ee-moments" className="ee-moments ee-section">
          <SectionIntro
            code="CAPÍTULO 02"
            eyebrow="LA EXPERIENCIA EN LA HACIENDA"
            title="Los 4 Tiempos de Nuestra Velada"
            subtitle="Cuatro escenarios pensados con esmero para celebrar juntos desde las primeras campanas hasta la medianoche."
          />

          <div className="ee-moments__deck">
            {/* Left / Sticky Fine-Art Folio Monitor */}
            <div className="ee-moments__monitor">
              <div className="ee-moments__folio">
                <div className="ee-moments__folio-top">
                  <span className="ee-small-index">{activeMoment.code}</span>
                  <span className="ee-moments__roman">
                    {activeMoment.roman}
                  </span>
                </div>

                <div className="ee-moments__arch-viewport">
                  <img
                    src={activeMoment.imageUrl}
                    alt={activeMoment.title}
                  />
                  <div className="ee-moments__arch-caption">
                    <span>{activeMoment.venueTag}</span>
                    <strong>{activeMoment.title}</strong>
                  </div>
                </div>

                <div className="ee-moments__tabs">
                  {HACIENDA_MOMENTS.map((moment, idx) => (
                    <button
                      key={moment.id}
                      type="button"
                      onClick={() => setActiveMomentIndex(idx)}
                      className={`ee-moments__tab ${
                        activeMomentIndex === idx
                          ? 'ee-moments__tab--active'
                          : ''
                      }`}
                    >
                      {moment.roman}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right / 4 Curated Moment Cards (Zero-overflow minmax(0, 1fr)) */}
            <div className="ee-moments__list">
              {HACIENDA_MOMENTS.map((moment, idx) => (
                <article
                  key={moment.id}
                  onClick={() => setActiveMomentIndex(idx)}
                  className={`ee-moment-card ${
                    activeMomentIndex === idx ? 'ee-moment-card--active' : ''
                  }`}
                >
                  <div className="ee-moment-card__header">
                    <span className="ee-small-index">{moment.code}</span>
                    <span className="ee-moment-card__time">
                      {moment.timeTag}
                    </span>
                  </div>

                  <div className="ee-moment-card__media">
                    <img
                      src={moment.imageUrl}
                      alt={moment.title}
                      loading="lazy"
                    />
                    <span className="ee-moment-card__venue">
                      {moment.venueTag}
                    </span>
                  </div>

                  <h3 className="ee-moment-card__title">{moment.title}</h3>
                  <p className="ee-moment-card__subtitle">{moment.subtitle}</p>
                  <p className="ee-moment-card__desc">{moment.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SCENE 4: CON AMOR Y GRATITUD / FAMILIA (#family)
           ==================================================================== */}
        {isSectionEnabled('vip_parents') &&
          content.vipParents.groups.length > 0 && (
            <section
              id="family"
              data-editor-section="vip_parents"
              className="ee-family ee-section"
            >
              <SectionIntro
                code="CAPÍTULO 03"
                eyebrow={sectionHeading(
                  config,
                  'vip_parents',
                  'eyebrow',
                  'CON AMOR Y GRATITUD',
                )}
                title={sectionHeading(
                  config,
                  'vip_parents',
                  'title',
                  'Junto a quienes nos dieron alas',
                )}
              />
              <p className="ee-family__blessing ee-reveal">
                {content.vipParents.blessingMessage}
              </p>
              <div className="ee-family__grid">
                {content.vipParents.groups.map((group, index) => (
                  <article key={`${group.groupTitle}-${index}`}>
                    <span className="ee-small-index">
                      0{index + 1} / {group.groupTitle}
                    </span>
                    <div className="ee-family__rule">
                      <Diamond />
                    </div>
                    {group.names.map((name) => (
                      <p key={name}>{name}</p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}

        {/* ====================================================================
            SCENE 5: CUENTA REGRESIVA ESCÉNICA (#countdown)
           ==================================================================== */}
        {isSectionEnabled('countdown') && (
          <section
            id="countdown"
            data-editor-section="countdown"
            className="ee-countdown ee-section"
          >
            <SectionIntro
              code="CAPÍTULO 04"
              eyebrow={sectionHeading(
                config,
                'countdown',
                'eyebrow',
                'CUENTA REGRESIVA',
              )}
              title={sectionHeading(
                config,
                'countdown',
                'title',
                'El gran día se acerca',
              )}
            />
            <div
              className="ee-countdown__clock"
              aria-label="Tiempo restante para el evento"
            >
              {[
                ['DÍAS', timeLeft.days],
                ['HORAS', timeLeft.hours],
                ['MINUTOS', timeLeft.minutes],
                ['SEGUNDOS', timeLeft.seconds],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <strong>{String(value).padStart(2, '0')}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="ee-countdown__actions ee-reveal">
              <a
                className="ee-button ee-button--dark"
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarDays size={16} /> Agendar en Google
              </a>
              <button
                className="ee-button ee-button--outline"
                type="button"
                onClick={downloadIcs}
              >
                <CalendarDays size={16} /> Apple / Outlook (.ICS)
              </button>
            </div>
          </section>
        )}

        {/* ====================================================================
            SCENE 6: EL ESCENARIO + FOLIO DE RUTA (#locations)
           ==================================================================== */}
        {isSectionEnabled('locations') && content.locations.length > 0 && (
          <section
            id="locations"
            data-editor-section="locations"
            className="ee-locations ee-section"
          >
            <SectionIntro
              code="CAPÍTULO 05"
              eyebrow={sectionHeading(
                config,
                'locations',
                'eyebrow',
                'EL ESCENARIO',
              )}
              title={sectionHeading(
                config,
                'locations',
                'title',
                'Dónde celebraremos',
              )}
            />
            <div className="ee-locations__grid">
              {content.locations.map((location, index) => (
                <article className="ee-location ee-reveal" key={location.id}>
                  {location.imageUrl && (
                    <div className="ee-location__photo ee-photo">
                      <img
                        src={location.imageUrl}
                        alt={location.venueName}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="ee-location__detail">
                    <p className="ee-small-index">
                      0{index + 1} / {location.title}
                    </p>
                    <h3>{location.venueName}</h3>
                    <div className="ee-location__time">
                      <Clock3 size={16} /> {location.time}
                    </div>
                    <p className="ee-location__address">{location.address}</p>
                    <div className="ee-location__links">
                      <a
                        href={location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en Maps <ArrowRight size={15} />
                      </a>
                      <a
                        href={location.wazeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir en Waze <Navigation size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <LocationDirections locations={content.locations} />
          </section>
        )}

        {/* ====================================================================
            SCENE 7: EL PROGRAMA CON BLASÓN VIAJERO (#timeline)
           ==================================================================== */}
        {isSectionEnabled('timeline') && content.timeline.length > 0 && (
          <section
            id="timeline"
            data-editor-section="timeline"
            className="ee-timeline ee-section"
          >
            <div className="ee-timeline__intro">
              <SectionIntro
                code="CAPÍTULO 06"
                eyebrow={sectionHeading(
                  config,
                  'timeline',
                  'eyebrow',
                  'EL PROGRAMA',
                )}
                title={sectionHeading(
                  config,
                  'timeline',
                  'title',
                  'Un día para recordar',
                )}
                align="left"
              />
              <p className="ee-reveal">
                Cada momento fue pensado para compartirlo con ustedes sin prisa.
              </p>
              <div className="ee-timeline__crest-ornament">
                <BotanicalArchEmblem />
              </div>
            </div>

            <div ref={timelineListRef} className="ee-timeline__list">
              <span className="ee-timeline__line">
                <span className="ee-timeline__line-fill" />
                <div
                  ref={timelineTravelerRef}
                  className="ee-timeline__traveler"
                  aria-hidden="true"
                >
                  <HaciendaCrestMedallion compact />
                </div>
              </span>
              {content.timeline.map((item, index) => (
                <article key={item.id} className="ee-timeline__item">
                  <span className="ee-timeline__dot">
                    <Diamond />
                  </span>
                  <time>{item.time}</time>
                  <div>
                    <span className="ee-small-index">
                      MOMENTO 0{index + 1}
                    </span>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Kinetic Marquee 2 */}
        <KineticMarquee
          reverse
          items={[
            'EL AMOR VIVE EN LOS DETALLES',
            coupleDisplay.toUpperCase(),
            'HACIENDA DE CANTERA & OLIVOS',
            'UNA NOCHE PARA RECORDAR',
          ]}
        />

        {/* ====================================================================
            SCENE 8: GALERÍA EDITORIAL (#gallery)
           ==================================================================== */}
        {isSectionEnabled('gallery') && content.gallery.images.length > 0 && (
          <section
            id="gallery"
            data-editor-section="gallery"
            className="ee-gallery ee-section"
          >
            <SectionIntro
              code="CAPÍTULO 07"
              eyebrow={sectionHeading(
                config,
                'gallery',
                'eyebrow',
                'INSTANTES QUE GUARDAMOS',
              )}
              title={sectionHeading(
                config,
                'gallery',
                'title',
                'Nuestra historia en imágenes',
              )}
            />
            <div className="ee-gallery__grid">
              {content.gallery.images.map((photo, index) => (
                <figure
                  key={`${photo.url}-${index}`}
                  className={`ee-gallery__item ee-gallery__item--${index % 4}`}
                >
                  <div className="ee-photo">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Recuerdo ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption>
                    <span>0{index + 1}</span>
                    {photo.caption || 'Un recuerdo para siempre'}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="ee-gallery__closing ee-reveal">
              El amor vive en los detalles.
            </p>
          </section>
        )}

        {isSectionEnabled('gallery') && (
          <section className="ee-album ee-section">
            <SectionIntro
              eyebrow="RECUERDOS DESDE TU MIRADA"
              title="Un álbum para todos"
            />
            <SharedAlbum
              slug={slug}
              token={guestGroup?.guestToken}
              preview={isBuilderPreview}
            />
          </section>
        )}

        {/* ====================================================================
            SCENE 9: CÓDIGO DE VESTIMENTA (#dress-code)
           ==================================================================== */}
        {isSectionEnabled('dress_code') && (
          <section
            id="dress-code"
            data-editor-section="dress_code"
            className="ee-dress ee-section"
          >
            <div className="ee-dress__inner">
              <SectionIntro
                code="CAPÍTULO 08"
                eyebrow={sectionHeading(
                  config,
                  'dress_code',
                  'eyebrow',
                  'CÓDIGO DE VESTIMENTA',
                )}
                title={sectionHeading(
                  config,
                  'dress_code',
                  'title',
                  content.dressCode.title,
                )}
              />
              <div className="ee-dress__details">
                <div>
                  <span className="ee-small-index">PARA ELLAS</span>
                  <p>{content.dressCode.womenNotes}</p>
                </div>
                <div>
                  <span className="ee-small-index">PARA ELLOS</span>
                  <p>{content.dressCode.menNotes}</p>
                </div>
              </div>
              {content.dressCode.reservedColors.length > 0 && (
                <div className="ee-dress__reserved ee-reveal">
                  <div className="ee-dress__swatches">
                    {content.dressCode.reservedColors.map((color) => (
                      <span
                        key={color.name}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <p>{content.dressCode.reservedNote}</p>
                </div>
              )}
              {content.dressCode.pinterestBoardUrl && (
                <a
                  className="ee-text-link ee-reveal"
                  href={content.dressCode.pinterestBoardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver inspiración <ArrowRight size={16} />
                </a>
              )}
            </div>
          </section>
        )}

        {/* ====================================================================
            SCENE 10: MESA DE REGALOS (#gifts)
           ==================================================================== */}
        {isSectionEnabled('gifts') && (
          <section
            id="gifts"
            data-editor-section="gifts"
            className="ee-gifts ee-section"
          >
            <SectionIntro
              code="CAPÍTULO 09"
              eyebrow={sectionHeading(
                config,
                'gifts',
                'eyebrow',
                'UN DETALLE CON CARIÑO',
              )}
              title={sectionHeading(
                config,
                'gifts',
                'title',
                'Mesa de regalos',
              )}
            />
            <p className="ee-gifts__intro ee-reveal">
              {content.gifts.introMessage}
            </p>
            <div className="ee-gifts__options">
              {content.gifts.registries.map((registry) => (
                <a
                  key={registry.storeName}
                  href={registry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ee-gift-option"
                >
                  <Gift size={21} strokeWidth={1.3} />
                  <div>
                    <span className="ee-small-index">MESA DE REGALOS</span>
                    <strong>{registry.storeName}</strong>
                    <small>{registry.eventNumber}</small>
                  </div>
                  <ChevronRight size={17} />
                </a>
              ))}
              {content.gifts.bankTransfer?.enabled && (
                <div className="ee-gift-option ee-gift-option--bank">
                  <Gift size={21} strokeWidth={1.3} />
                  <div>
                    <span className="ee-small-index">TRANSFERENCIA</span>
                    <strong>{content.gifts.bankTransfer.bankName}</strong>
                    <small>CLABE {content.gifts.bankTransfer.clabe}</small>
                  </div>
                  <button
                    type="button"
                    onClick={copyClabe}
                    aria-label="Copiar CLABE"
                    title="Copiar CLABE"
                  >
                    {copiedClabe ? <Check size={18} /> : <Copy size={17} />}
                  </button>
                </div>
              )}
            </div>
            {content.gifts.cashEnvelopeAtVenue && (
              <p className="ee-gifts__note ee-reveal">
                También habrá un espacio para lluvia de sobres el día del evento.
              </p>
            )}
          </section>
        )}

        {/* ====================================================================
            SCENE 11: HOSPEDAJE (#accommodation)
           ==================================================================== */}
        {isSectionEnabled('accommodation') &&
          content.accommodation.length > 0 && (
            <section
              id="accommodation"
              data-editor-section="accommodation"
              className="ee-stay ee-section"
            >
              <div className="ee-stay__intro">
                <SectionIntro
                  code="CAPÍTULO 10"
                  eyebrow={sectionHeading(
                    config,
                    'accommodation',
                    'eyebrow',
                    'PARA QUIENES NOS VISITAN',
                  )}
                  title={sectionHeading(
                    config,
                    'accommodation',
                    'title',
                    'Quédense un poco más',
                  )}
                  align="left"
                />
                <p className="ee-reveal">
                  Algunas opciones sugeridas para disfrutar San Miguel de
                  Allende con calma.
                </p>
              </div>
              <div className="ee-stay__list">
                {content.accommodation.map((hotel, index) => (
                  <article key={`${hotel.hotelName}-${index}`}>
                    <span className="ee-small-index">
                      ESTANCIA 0{index + 1}
                    </span>
                    <div>
                      <h3>{hotel.hotelName}</h3>
                      <p>{hotel.distanceNote}</p>
                      {hotel.discountCode && (
                        <small>Código: {hotel.discountCode}</small>
                      )}
                    </div>
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver ${hotel.hotelName}`}
                      >
                        <ArrowRight size={19} />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

        {/* ====================================================================
            SCENE 12: RECUERDOS & MÚSICA (#memories)
           ==================================================================== */}
        {isSectionEnabled('social_features') &&
          (content.socialFeatures.enableSongRequests ||
            content.socialFeatures.enableAudioGuestbook) && (
            <section
              id="memories"
              data-editor-section="socialFeatures"
              className="ee-memories ee-section"
            >
              <SectionIntro
                code="CAPÍTULO 11"
                eyebrow={sectionHeading(
                  config,
                  'social_features',
                  'eyebrow',
                  'LA CELEBRACIÓN CONTINÚA',
                )}
                title={sectionHeading(
                  config,
                  'social_features',
                  'title',
                  'Hagamos recuerdos juntos',
                )}
              />
              {content.socialFeatures.hashtag && (
                <p className="ee-memories__hashtag ee-reveal">
                  {content.socialFeatures.hashtag}
                </p>
              )}
              <SocialFeatures
                slug={slug}
                token={guestGroup?.guestToken}
                preview={isBuilderPreview}
                songsEnabled={content.socialFeatures.enableSongRequests}
                audioEnabled={content.socialFeatures.enableAudioGuestbook}
              />
            </section>
          )}

        {/* ====================================================================
            SCENE 13: CONFIRMACIÓN RSVP + PASE QR (#rsvp)
           ==================================================================== */}
        {isSectionEnabled('rsvp') && (
          <section
            id="rsvp"
            data-editor-section="rsvp"
            className="ee-rsvp ee-section"
          >
            <div className="ee-rsvp__card">
              <div className="ee-rsvp__crest">
                <HaciendaCrestMedallion compact />
              </div>
              <SectionIntro
                code="CAPÍTULO 12"
                eyebrow={sectionHeading(
                  config,
                  'rsvp',
                  'eyebrow',
                  'TE ESPERAMOS CON AMOR',
                )}
                title={sectionHeading(
                  config,
                  'rsvp',
                  'title',
                  'Confirma tu asistencia',
                )}
              />
              <p className="ee-rsvp__intro">
                {guestGroup
                  ? `Una invitación reservada especialmente para ${
                      guestGroup.groupName
                    }. Tienen ${
                      guestGroup.allocatedAdults + guestGroup.allocatedChildren
                    } pases asignados.`
                  : 'Nos encantará compartir este día contigo. Confirma tu asistencia para generar tu pase de recepción.'}
              </p>
              {!pass ? (
                <form onSubmit={submitRsvp} className="ee-rsvp__form">
                  <label>
                    Nombre o familia
                    <input
                      value={rsvpName}
                      onChange={(event) => setRsvpName(event.target.value)}
                      readOnly={Boolean(guestGroup)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </label>
                  <div className="ee-rsvp__row">
                    <label>
                      ¿Nos acompañarás?
                      <select
                        value={willAttend}
                        onChange={(event) =>
                          setWillAttend(event.target.value as 'yes' | 'no')
                        }
                      >
                        <option value="yes">Sí, con mucho gusto</option>
                        <option value="no">No podré asistir</option>
                      </select>
                    </label>
                    <label>
                      WhatsApp
                      <input
                        type="tel"
                        value={rsvpPhone}
                        onChange={(event) => setRsvpPhone(event.target.value)}
                        placeholder="Tu número"
                      />
                    </label>
                  </div>
                  {willAttend === 'yes' && (
                    <div className="ee-rsvp__row">
                      <label>
                        Adultos
                        <select
                          value={adults}
                          onChange={(event) =>
                            setAdults(Number(event.target.value))
                          }
                        >
                          {Array.from(
                            {
                              length: guestGroup
                                ? guestGroup.allocatedAdults + 1
                                : 4,
                            },
                            (_, index) => (guestGroup ? index : index + 1),
                          ).map((value) => (
                            <option key={value} value={value}>
                              {value} {value === 1 ? 'adulto' : 'adultos'}
                            </option>
                          ))}
                        </select>
                      </label>
                      {content.rsvp.allowChildrenSelection &&
                        (guestGroup?.allocatedChildren ?? 2) > 0 && (
                          <label>
                            Niños
                            <select
                              value={children}
                              onChange={(event) =>
                                setChildren(Number(event.target.value))
                              }
                            >
                              {Array.from(
                                {
                                  length:
                                    (guestGroup?.allocatedChildren ?? 2) + 1,
                                },
                                (_, index) => index,
                              ).map((value) => (
                                <option key={value} value={value}>
                                  {value} {value === 1 ? 'niño' : 'niños'}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                    </div>
                  )}
                  {willAttend === 'yes' &&
                    content.rsvp.askDietaryRestrictions && (
                      <label>
                        Restricciones alimentarias (opcional)
                        <input
                          value={dietaryNotes}
                          onChange={(event) =>
                            setDietaryNotes(event.target.value)
                          }
                          placeholder="Cuéntanos si necesitas algo especial"
                        />
                      </label>
                    )}
                  <label>
                    Déjanos un mensaje (opcional)
                    <textarea
                      rows={3}
                      value={guestMessage}
                      onChange={(event) => setGuestMessage(event.target.value)}
                      placeholder="Unas palabras para nosotros"
                    />
                  </label>
                  <button
                    className="ee-button ee-button--dark ee-rsvp__submit"
                    type="submit"
                  >
                    Confirmar & Generar Pase QR <ArrowRight size={17} />
                  </button>
                </form>
              ) : (
                <div className="ee-rsvp__pass">
                  <Check size={24} />
                  <h3>¡Nos vemos en la Hacienda!</h3>
                  <p>
                    {pass.name} · {pass.adults + pass.children}{' '}
                    {pass.adults + pass.children === 1
                      ? 'asistente'
                      : 'asistentes'}
                  </p>
                  <div className="ee-rsvp__qr">
                    <QRCodeSVG value={pass.payload} size={156} level="M" />
                  </div>
                  <p className="ee-rsvp__pass-note">
                    {content.rsvp.customConfirmationMessage}
                  </p>
                  <button type="button" onClick={() => setPass(null)}>
                    Modificar respuesta
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="ee-footer">
        <div className="ee-footer__crest">
          <HaciendaCrestMedallion compact />
        </div>
        <span className="ee-footer__symbol">∞</span>
        <p>{content.hero.mainTitle}</p>
        <small>{dateText} · Gracias por ser parte de nuestra historia</small>
        <a href="#hero" aria-label="Volver al inicio">
          Volver al inicio ↑
        </a>
      </footer>
    </div>
  );
}
