'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Clock3,
  Copy,
  CreditCard,
  Disc3,
  ExternalLink,
  Gift,
  Hotel,
  MapPin,
  Music,
  Navigation,
  Radio,
  Shirt,
  Sparkles,
  Star,
  Ticket,
  Users,
  Zap,
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
import './neon-xv-euphoria.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface NeonXVEuphoriaExperienceProps {
  slug: string;
  templateId: TemplateId;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
  previewEnvelope?: boolean;
}

interface ClubBeatStage {
  id: string;
  code: string;
  timeTag: string;
  bpm: string;
  zone: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  accent: 'magenta' | 'cyan' | 'violet' | 'amber';
}

const CLUB_BEATS: ClubBeatStage[] = [
  {
    id: 'beat-1',
    code: 'BEAT 01 · RED CARPET & GLOW',
    timeTag: '20:00 HRS · NEON TUNNEL',
    bpm: '118 BPM · SYNTH WARMUP',
    zone: 'ACCESO VIP & MIRROR ROOM',
    title: 'Llegada entre Neón y Cámaras',
    subtitle: 'Pulseras holográficas, glitter bar y mocktails eléctricos',
    description:
      'Cruza el túnel de espejos y láseres magenta-cyan, pasa por la estación de maquillaje UV y tómate las primeras fotos del backstage antes de que se apaguen las luces.',
    imageUrl: '/images/neon-xv-euphoria/glow.jpg',
    accent: 'magenta',
  },
  {
    id: 'beat-2',
    code: 'BEAT 02 · MAIN STAGE XV',
    timeTag: '21:00 HRS · CONTEO LÁSER',
    bpm: '126 BPM · EUPHORIA DROP',
    zone: 'ESCENARIO CENTRAL',
    title: 'Mi Entrada & Coreografía Principal',
    subtitle: 'Humo bajo, destellos estroboscópicos y el momento más esperado',
    description:
      'Cuando el reloj llegue a cero y los haces de luz dibujen el cielo del club, se abre el escenario principal para mi entrada de XV y el performance que preparamos.',
    imageUrl: '/images/neon-xv-euphoria/stage.jpg',
    accent: 'cyan',
  },
  {
    id: 'beat-3',
    code: 'BEAT 03 · MIRRORBALL CLUB SET',
    timeTag: '22:15 HRS · PISTA LED INFINITA',
    bpm: '130 BPM · CLUB ANTHEMS',
    zone: 'DANCEFLOOR CENTRAL',
    title: 'Noche de DJ Live, Esferas y Robots LED',
    subtitle: 'Lluvia metálica, esferas disco y tus tracks favoritos a todo volumen',
    description:
      'La pista de cristal iluminado cobra vida con sets mezclados en vivo, esferas disco gigantes, bastones luminosos y energía imparable con todos mis amigos.',
    imageUrl: '/images/neon-xv-euphoria/dancefloor.jpg',
    accent: 'violet',
  },
  {
    id: 'beat-4',
    code: 'BEAT 04 · AFTERGLOW & MIDNIGHT',
    timeTag: '00:00 HRS · LOUNGE & CAKE',
    bpm: '122 BPM · MIDNIGHT POP',
    zone: 'TERRAZAS & NEON BAR',
    title: 'Pastel Metálico, Chispas Frías y Afterparty',
    subtitle: 'Brindis de medianoche, late-night snacks y cierre épico',
    description:
      'A la medianoche encendemos las chispas frías alrededor del pastel espejo con neón, recargamos energía con sliders y papas trufadas, y seguimos bailando.',
    imageUrl: '/images/neon-xv-euphoria/toast.jpg',
    accent: 'amber',
  },
];

const DEFAULT_NEON_SWATCHES = [
  { name: 'Obsidiana Club', hex: '#090614' },
  { name: 'Magenta Euphoria', hex: '#FF2E93' },
  { name: 'Cyber Cyan', hex: '#00F0FF' },
  { name: 'Violeta Ultravioleta', hex: '#A855F7' },
  { name: 'Plata Espejo', hex: '#E2E8F0' },
];

function formatDate(eventDate: string) {
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return 'Sábado · 20:00 HRS';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(date);
}

/**
 * Enriquecimiento suave del contenido de Neon XV Euphoria para que tanto invitaciones
 * nuevas como existentes tengan imágenes editoriales nocturnas de XV, 3 capítulos de
 * historia, familia, 4 momentos de lineup y galería completa sin sobrescribir ediciones.
 */
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
    existingBlocks.length < 3 ||
    existingBlocks[0]?.title === 'El encuentro';

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
      raw.vipParents.groups && raw.vipParents.groups.length >= 2
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
    raw.timeline.length < 4 ||
    raw.timeline[0]?.title === 'Ceremonia Religiosa';

  const timeline = isLegacyTimeline ? defaultTimeline : raw.timeline;

  const isLegacyGallery =
    !raw.gallery?.images ||
    raw.gallery.images.length === 0 ||
    raw.gallery.images.some((img) => img.url.includes('unsplash.com'));

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

/**
 * Symmetrical Neon Crown & Crystal Star Prism SVG
 * Strictly centered at x = 120 in a 240x240 viewBox.
 */
function NeonCrownPrism({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`nx-crown-svg ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nxPrismHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF2E93" stopOpacity="0.46" />
          <stop offset="55%" stopColor="#00F0FF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#090614" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="nxLaserMagentaCyan"
          x1="24"
          y1="24"
          x2="216"
          y2="216"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF2E93" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
        <linearGradient
          id="nxFacetFill"
          x1="120"
          y1="30"
          x2="120"
          y2="206"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF2E93" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#1E103A" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="106" fill="url(#nxPrismHalo)" />
      <circle
        cx="120"
        cy="120"
        r="96"
        stroke="url(#nxLaserMagentaCyan)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.7"
      />
      <circle
        cx="120"
        cy="120"
        r="82"
        stroke="#00F0FF"
        strokeWidth="1.1"
        strokeOpacity="0.4"
      />

      {/* Symmetrical Octagonal Diamond Frame */}
      <polygon
        points="120,22 190,50 218,120 190,190 120,218 50,190 22,120 50,50"
        fill="url(#nxFacetFill)"
        stroke="url(#nxLaserMagentaCyan)"
        strokeWidth="2.2"
      />

      {/* Inner Symmetrical Facet Lines */}
      <line
        x1="120"
        y1="22"
        x2="120"
        y2="218"
        stroke="#00F0FF"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <line
        x1="22"
        y1="120"
        x2="218"
        y2="120"
        stroke="#FF2E93"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <polygon
        points="120,42 176,120 120,198 64,120"
        fill="#0D0820"
        fillOpacity="0.72"
        stroke="#00F0FF"
        strokeWidth="1.5"
        strokeOpacity="0.65"
      />

      {/* Symmetrical Futuristic Neon Crown (axis x = 120) */}
      <path
        d="M66 138 L56 88 L92 112 L120 64 L148 112 L184 88 L174 138 Z"
        fill="url(#nxFacetFill)"
        stroke="url(#nxLaserMagentaCyan)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M92 112 L120 138 L148 112 M120 64 L120 138"
        stroke="#F8F7FF"
        strokeWidth="1.5"
        strokeOpacity="0.75"
      />
      <rect
        x="66"
        y="143"
        width="108"
        height="10"
        rx="5"
        fill="#140E29"
        stroke="#00F0FF"
        strokeWidth="2"
      />

      {/* Crown Peak Nodes (strictly mirrored: 56 & 184, 92 & 148, 120) */}
      <circle cx="120" cy="58" r="5" fill="#F8F7FF" stroke="#FF2E93" strokeWidth="2" />
      <circle cx="56" cy="84" r="4" fill="#00F0FF" />
      <circle cx="184" cy="84" r="4" fill="#00F0FF" />
      <circle cx="92" cy="108" r="3.2" fill="#FF2E93" />
      <circle cx="148" cy="108" r="3.2" fill="#FF2E93" />

      {!compact && (
        <text
          x="120"
          y="178"
          textAnchor="middle"
          fill="#F8F7FF"
          fontSize="20"
          fontWeight="800"
          letterSpacing="5"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          XV
        </text>
      )}
    </svg>
  );
}

/**
 * Symmetrical 24-Bar Radial Club Equalizer & Holographic Orb
 * Strictly centered at (100, 100) in a 200x200 viewBox.
 */
function LaserEqualizerOrb({
  activeMood = 0,
  onToggleMood,
}: {
  activeMood?: number;
  onToggleMood?: () => void;
}) {
  const moodLabels = ['EUPHORIA', 'CYBER GLOW', 'HYPER DROP'];
  const bars = Array.from({ length: 24 }, (_, idx) => {
    const angle = idx * 15;
    const isMajor = idx % 2 === 0;
    const innerR = 54;
    const outerR = isMajor ? 82 : 70;
    const rad = (angle * Math.PI) / 180;
    const x1 = 100 + Math.sin(rad) * innerR;
    const y1 = 100 - Math.cos(rad) * innerR;
    const x2 = 100 + Math.sin(rad) * outerR;
    const y2 = 100 - Math.cos(rad) * outerR;
    const stroke = idx % 3 === 0 ? '#FF2E93' : idx % 3 === 1 ? '#00F0FF' : '#C084FC';
    return { idx, x1, y1, x2, y2, stroke, isMajor };
  });

  return (
    <button
      type="button"
      onClick={onToggleMood}
      className={`nx-eq-orb nx-eq-orb--mood-${activeMood}`}
      aria-label="Cambiar modo de luces del club"
      title="Toca para cambiar la frecuencia luminosa"
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="#0B0719"
          fillOpacity="0.88"
          stroke="#FF2E93"
          strokeWidth="1.5"
          strokeOpacity="0.55"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="#00F0FF"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.5"
        />
        {bars.map((bar) => (
          <line
            key={bar.idx}
            x1={bar.x1.toFixed(2)}
            y1={bar.y1.toFixed(2)}
            x2={bar.x2.toFixed(2)}
            y2={bar.y2.toFixed(2)}
            stroke={bar.stroke}
            strokeWidth={bar.isMajor ? '3.2' : '2.2'}
            strokeLinecap="round"
            className="nx-eq-orb__bar"
            style={{ animationDelay: `${(bar.idx % 6) * 0.12}s` }}
          />
        ))}
        <circle
          cx="100"
          cy="100"
          r="46"
          fill="#140E29"
          stroke="#00F0FF"
          strokeWidth="1.8"
        />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fill="#FF2E93"
          fontSize="11"
          fontWeight="800"
          letterSpacing="2.5"
        >
          128 BPM
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill="#F8F7FF"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="1.8"
        >
          {moodLabels[activeMood % moodLabels.length]}
        </text>
      </svg>
    </button>
  );
}

/**
 * Circular Rotating Holographic VIP Seal
 */
function RotatingVipSeal() {
  return (
    <div className="nx-rotating-seal" aria-hidden="true">
      <svg viewBox="0 0 180 180" className="nx-rotating-seal__svg">
        <defs>
          <path
            id="nxVipCirclePath"
            d="M 90, 90 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
          />
        </defs>
        <circle
          cx="90"
          cy="90"
          r="84"
          fill="#090614"
          fillOpacity="0.82"
          stroke="#00F0FF"
          strokeWidth="1.4"
          strokeOpacity="0.55"
        />
        <circle
          cx="90"
          cy="90"
          r="52"
          fill="#140E29"
          stroke="#FF2E93"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <text fill="#F8F7FF" fontSize="10.2" fontWeight="700" letterSpacing="3.1">
          <textPath href="#nxVipCirclePath" startOffset="0%">
            NEON XV EUPHORIA ★ ONE NIGHT ONLY ★ ALL ACCESS VIP ★
          </textPath>
        </text>
        <polygon
          points="90,66 96,82 114,82 99,92 105,108 90,98 75,108 81,92 66,82 84,82"
          fill="#FF2E93"
          stroke="#00F0FF"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

/**
 * Synthwave Laser Grid & Soundwave Backdrop behind Story section
 */
function SynthwaveLaserGrid() {
  return (
    <svg
      viewBox="0 0 1200 720"
      className="nx-laser-grid-svg"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="nxGridStroke"
          x1="0"
          y1="0"
          x2="1200"
          y2="720"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF2E93" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        className="nx-draw-path"
        d="M600 90 L80 700 M600 90 L260 700 M600 90 L430 700 M600 90 L600 700 M600 90 L770 700 M600 90 L940 700 M600 90 L1120 700"
        stroke="url(#nxGridStroke)"
        strokeWidth="1.6"
      />
      <polygon
        className="nx-draw-path"
        points="600,70 960,360 600,650 240,360"
        stroke="#00F0FF"
        strokeWidth="1.8"
        strokeOpacity="0.45"
      />
      <path
        className="nx-draw-path"
        d="M 60 360 Q 210 210, 360 360 T 660 360 T 960 360 T 1140 360"
        stroke="#FF2E93"
        strokeWidth="2.2"
        strokeOpacity="0.55"
      />
      <circle
        className="nx-draw-path"
        cx="600"
        cy="360"
        r="190"
        stroke="#00F0FF"
        strokeWidth="1.4"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export function NeonXVEuphoriaExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: NeonXVEuphoriaExperienceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);
  const timelinePrismRef = useRef<HTMLDivElement | null>(null);

  const content = useMemo(() => neonContent(config), [config]);
  const { colors, fonts, envelope } = config.theme;
  const dateLabel = formatDate(eventDate);

  const [isPassUnlocked, setIsPassUnlocked] = useState<boolean>(
    forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope),
  );
  const [clubMood, setClubMood] = useState<number>(0);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [activeLocationIdx, setActiveLocationIdx] = useState<number>(0);

  // Countdown state
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  // RSVP state
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestName, setGuestName] = useState<string>(
    guestGroup?.groupName ?? '',
  );
  const [guestsCount, setGuestsCount] = useState<number>(
    guestGroup?.allocatedAdults ? Math.min(2, guestGroup.allocatedAdults) : 2,
  );
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState<boolean>(false);
  const [copiedClabe, setCopiedClabe] = useState<boolean>(false);

  useEffect(() => {
    setIsPassUnlocked(
      forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope),
    );
  }, [forceEnvelopeOpen, isBuilderPreview, previewEnvelope]);

  // Countdown timer
  useEffect(() => {
    const updateClock = () => {
      const targetMs = new Date(eventDate).getTime();
      const nowMs = Date.now();
      const diff = Math.max(0, targetMs - nowMs);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, [eventDate]);

  const isSectionVisible = useCallback(
    (sectionId: SectionId) =>
      config.sectionsOrder.find((s) => s.id === sectionId)?.enabled ?? true,
    [config.sectionsOrder],
  );

  // Unlock VIP Pass handler
  const handleUnlockVipPass = () => {
    setIsPassUnlocked(true);
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF2E93', '#00F0FF', '#A855F7', '#F8F7FF'],
      });
    } catch {
      // Ignore confetti errors on restricted devices
    }
    window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
  };

  // Copy CLABE
  const handleCopyClabe = async (clabe: string) => {
    try {
      await navigator.clipboard.writeText(clabe);
      setCopiedClabe(true);
      toast.success('CLABE copiada al portapapeles');
      window.setTimeout(() => setCopiedClabe(false), 2500);
    } catch {
      toast.error('No se pudo copiar automáticamente');
    }
  };

  // Calendar actions
  const primaryLocation = content.locations[0];
  const handleGoogleCalendar = () => {
    const start = new Date(eventDate);
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
    const url = buildGoogleCalendarUrl({
      title: `${content.hero.badgeText || 'XV Años'} · ${content.hero.mainTitle}`,
      description: content.hero.tagline,
      location: primaryLocation
        ? `${primaryLocation.venueName}, ${primaryLocation.address}`
        : 'Main Stage VIP',
      startDateIso: start.toISOString(),
      endDateIso: end.toISOString(),
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    const start = new Date(eventDate);
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
    const ics = buildIcsFileContent({
      title: `${content.hero.badgeText || 'XV Años'} · ${content.hero.mainTitle}`,
      description: content.hero.tagline,
      location: primaryLocation
        ? `${primaryLocation.venueName}, ${primaryLocation.address}`
        : 'Main Stage VIP',
      startDateIso: start.toISOString(),
      endDateIso: end.toISOString(),
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${slug || 'neon-xv-euphoria'}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Submit RSVP
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Escribe tu nombre para generar tu VIP Pass');
      return;
    }
    setIsSubmittingRsvp(true);
    try {
      await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: guestGroup?.id,
          groupName: guestName.trim(),
          status: attending === 'yes' ? 'confirmed' : 'declined',
          confirmedAdults: attending === 'yes' ? guestsCount : 0,
          confirmedChildren: 0,
          dietaryRestrictions: dietaryNotes.trim(),
          message: guestMessage.trim(),
        }),
      }).catch(() => null);

      setRsvpSubmitted(true);
      toast.success(
        attending === 'yes'
          ? '¡Acceso VIP confirmado! Nos vemos en la pista.'
          : 'Gracias por avisarnos. ¡Te mandamos un abrazo!',
      );
      if (attending === 'yes') {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FF2E93', '#00F0FF', '#A855F7'],
        });
      }
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Story quote words for word-by-word neon illumination
  const quoteWords = useMemo(() => {
    const raw =
      content.quoteStory.quoteText ||
      'Hoy las luces se encienden para celebrar quién soy, rodeada de la gente que hace brillar mi mundo.';
    return raw.split(/\s+/).filter(Boolean);
  }, [content.quoteStory.quoteText]);

  const storyChapters = content.quoteStory.storyBlocks || [];
  const galleryPhotos = content.gallery.images || [];
  const dressSwatches =
    content.dressCode.reservedColors &&
    content.dressCode.reservedColors.length > 0
      ? content.dressCode.reservedColors
      : DEFAULT_NEON_SWATCHES;

  // GSAP Scroll Scenes Architecture (SCROLL_SCENES_V2.md)
  useGSAP(
    () => {
      if (!rootRef.current) return;
      const root = rootRef.current;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          // 1. HERO TWO-BEAT STICKY PORTAL EXPANSION
          const heroSection = root.querySelector('#nx-hero');
          const heroVisual = root.querySelector('.nx-hero__visual');
          const heroCopy = root.querySelector('.nx-hero__copy');
          const heroBadges = root.querySelector('.nx-hero__badges');
          const heroBridge = root.querySelector('.nx-hero__bridge');
          const heroGhost = root.querySelector('.nx-hero__ghost');

          if (heroSection && heroVisual) {
            const heroTl = gsap.timeline({
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.9,
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
                ease: 'power2.inOut',
              },
              0,
            );

            if (heroCopy) {
              heroTl.to(
                heroCopy,
                {
                  yPercent: -26,
                  opacity: 0,
                  ease: 'power2.in',
                },
                0,
              );
            }

            if (heroBadges) {
              heroTl.to(
                heroBadges,
                {
                  scale: 0.84,
                  opacity: 0,
                  ease: 'power2.in',
                },
                0.04,
              );
            }

            if (heroGhost) {
              heroTl.to(
                heroGhost,
                {
                  xPercent: -14,
                  opacity: 0.05,
                  ease: 'none',
                },
                0,
              );
            }

            if (heroBridge) {
              heroTl.fromTo(
                heroBridge,
                { y: 56, opacity: 0, scale: 0.94 },
                { y: 0, opacity: 1, scale: 1, ease: 'power3.out' },
                0.42,
              );
            }
          }

          // 2. STORY WORD-BY-WORD NEON ILLUMINATION + SVG STROKE DRAW
          const storySection = root.querySelector('#nx-story');
          const words = root.querySelectorAll('.nx-word');
          const drawPaths = root.querySelectorAll('.nx-draw-path');

          drawPaths.forEach((path) => {
            if (path instanceof SVGGeometryElement) {
              const len = path.getTotalLength();
              gsap.set(path, {
                strokeDasharray: len,
                strokeDashoffset: len,
              });
              gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: storySection,
                  start: 'top 80%',
                  end: 'bottom 30%',
                  scrub: 1,
                },
              });
            }
          });

          if (storySection && words.length > 0) {
            gsap.fromTo(
              words,
              {
                opacity: 0.16,
                color: '#7A7099',
                textShadow: '0 0 0px rgba(255,46,147,0)',
              },
              {
                opacity: 1,
                color: '#F8F7FF',
                textShadow: '0 0 18px rgba(255,46,147,0.45)',
                stagger: 0.06,
                ease: 'none',
                scrollTrigger: {
                  trigger: storySection,
                  start: 'top 72%',
                  end: 'center center',
                  scrub: 0.7,
                },
              },
            );
          }

          // Story cards alternating entrance
          const storyCards = root.querySelectorAll('.nx-story-card');
          storyCards.forEach((card, index) => {
            const fromX = index % 2 === 0 ? -42 : 42;
            gsap.fromTo(
              card,
              {
                x: isDesktop ? fromX : fromX * 0.45,
                y: 36,
                opacity: 0,
                rotate: index % 2 === 0 ? -2 : 2,
              },
              {
                x: 0,
                y: 0,
                opacity: 1,
                rotate: 0,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 86%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          });

          // 3. CLUB BEATS CARDS STAGGER
          const beatCards = root.querySelectorAll('.nx-beat-card');
          beatCards.forEach((card, idx) => {
            gsap.fromTo(
              card,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  onEnter: () => setActiveBeatIndex(idx),
                  onEnterBack: () => setActiveBeatIndex(idx),
                },
              },
            );
          });

          // 4. TIMELINE TRAVELING PRISM
          if (timelineTrackRef.current && timelinePrismRef.current) {
            gsap.fromTo(
              timelinePrismRef.current,
              { top: '0%' },
              {
                top: '100%',
                ease: 'none',
                scrollTrigger: {
                  trigger: timelineTrackRef.current,
                  start: 'top 55%',
                  end: 'bottom 55%',
                  scrub: 0.6,
                },
              },
            );
          }

          const timelineNodes = root.querySelectorAll('.nx-timeline-card');
          timelineNodes.forEach((node, idx) => {
            const dir = idx % 2 === 0 ? -30 : 30;
            gsap.fromTo(
              node,
              { x: isDesktop ? dir : 0, y: 28, opacity: 0 },
              {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: node,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          });

          // 5. GALLERY INTERNAL IMAGE PARALLAX
          const galleryPics = root.querySelectorAll('.nx-gallery-card__img');
          galleryPics.forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -8, scale: 1.12 },
              {
                yPercent: 8,
                scale: 1.12,
                ease: 'none',
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [isPassUnlocked] },
  );

  const selectedLocation =
    content.locations[activeLocationIdx] || content.locations[0];

  const qrPayload = useMemo(() => {
    return JSON.stringify({
      event: content.hero.mainTitle,
      slug,
      guest: guestName || guestGroup?.groupName || 'Invitado VIP',
      passes: attending === 'yes' ? guestsCount : 0,
      status: attending === 'yes' ? 'VIP_CONFIRMED' : 'DECLINED',
    });
  }, [attending, content.hero.mainTitle, guestGroup?.groupName, guestName, guestsCount, slug]);

  return (
    <div
      ref={rootRef}
      className={`nx-root nx-mood-${clubMood} ${
        !isPassUnlocked ? 'nx-root--locked' : ''
      }`}
      style={
        {
          '--nx-font-heading': invitationFontStack(fonts.headingFont || 'Syne'),
          '--nx-font-script': invitationFontStack(fonts.scriptFont || 'Syne'),
          '--nx-font-body': invitationFontStack(fonts.bodyFont || 'Space Grotesk'),
        } as React.CSSProperties
      }
    >
      {/* Ambient Laser & Grid Backdrop */}
      <div className="nx-ambient" aria-hidden="true">
        <div className="nx-ambient__orb nx-ambient__orb--magenta" />
        <div className="nx-ambient__orb nx-ambient__orb--cyan" />
        <div className="nx-ambient__orb nx-ambient__orb--violet" />
        <div className="nx-ambient__grid" />
      </div>

      {/* ====================================================================
          SCENE 0: HOLOGRAPHIC ALL-ACCESS VIP PASS OPENING
         ==================================================================== */}
      {(!isPassUnlocked || (isBuilderPreview && previewEnvelope)) && (
        <div
          className="nx-opening"
          data-editor-section="envelope"
          role="dialog"
          aria-modal="true"
          aria-label="Pase VIP de acceso a la invitación"
        >
          <div className="nx-opening__card">
            <div className="nx-opening__lanyard-slot" aria-hidden="true" />

            <div className="nx-opening__topline">
              <span className="nx-pill nx-pill--cyan">
                <Sparkles className="w-3.5 h-3.5" />
                ALL ACCESS VIP PASS
              </span>
              <span className="nx-opening__serial">
                {envelope.sealMonogram || 'NXV-2026'}
              </span>
            </div>

            <div className="nx-opening__prism-wrap">
              <NeonCrownPrism />
            </div>

            <p className="nx-opening__eyebrow">
              {content.hero.badgeText || 'XV EUPHORIA · ONE NIGHT ONLY'}
            </p>
            <h1 className="nx-opening__title">{content.hero.mainTitle}</h1>

            <p className="nx-opening__guest">
              {guestGroup?.groupName
                ? `PASE RESERVADO PARA ${guestGroup.groupName.toUpperCase()}`
                : 'TU PASE VIP ESTÁ LISTO PARA ACTIVARSE'}
            </p>

            <div className="nx-opening__barcode" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <button
              type="button"
              onClick={handleUnlockVipPass}
              className="nx-btn nx-btn--neon nx-opening__cta"
            >
              <Zap className="w-4 h-4" />
              <span>
                {envelope.openButtonText || 'Activar Pase & Entrar al Club'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCENE 1: TWO-BEAT STICKY HERO PORTAL (#nx-hero)
         ==================================================================== */}
      {isSectionVisible('hero') && (
        <section
          id="nx-hero"
          data-editor-section="hero"
          className="nx-hero-scroll"
        >
          <div className="nx-hero__sticky">
            {/* Layer 1: Oversized Ghost Typography */}
            <div className="nx-hero__ghost" aria-hidden="true">
              NEON XV EUPHORIA · MAIN STAGE · ALL NIGHT
            </div>

            {/* Layer 2: Mathematically Centered Neon Portal Window */}
            <div className="nx-hero__visual">
              <HeroMedia
                hero={content.hero}
                alt={content.hero.mainTitle}
                className="nx-hero__media"
              />
              <div className="nx-hero__visual-overlay" />
              <div className="nx-hero__laser-frame" aria-hidden="true" />
            </div>

            {/* Layer 3: Floating Interactive Badges & Symmetrical Prism */}
            <div className="nx-hero__badges">
              <div className="nx-hero__badge-left">
                <RotatingVipSeal />
              </div>
              <div className="nx-hero__badge-right">
                <LaserEqualizerOrb
                  activeMood={clubMood}
                  onToggleMood={() => setClubMood((prev) => (prev + 1) % 3)}
                />
              </div>
              <div className="nx-hero__prism-floater" aria-hidden="true">
                <NeonCrownPrism compact />
              </div>
            </div>

            {/* Layer 4: Foreground Copy */}
            <div className="nx-hero__copy">
              <div className="nx-hero__pill-row">
                <span className="nx-pill nx-pill--magenta">
                  <Sparkles className="w-3.5 h-3.5" />
                  {content.hero.badgeText || 'Mis XV Años · Neon Club Edition'}
                </span>
                <span className="nx-pill nx-pill--glass">
                  <Radio className="w-3.5 h-3.5" />
                  {dateLabel}
                </span>
              </div>

              <h1 className="nx-hero__title">{content.hero.mainTitle}</h1>
              <p className="nx-hero__subtitle">{content.hero.tagline}</p>

              <div className="nx-hero__scroll-cue">
                <span>DESLIZA PARA ENTRAR AL MAIN STAGE</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>

            {/* Beat 2 Bridge Card revealed when portal reaches 100% */}
            <div className="nx-hero__bridge">
              <div className="nx-hero__bridge-inner">
                <div className="nx-hero__bridge-tag">
                  <Zap className="w-4 h-4 text-[#00F0FF]" />
                  <span>ACCESO VIP CONFIRMADO · PUERTAS 20:00 HRS</span>
                </div>
                <p className="nx-hero__bridge-title">
                  {primaryLocation?.venueName || 'Foro & Terraza Euphoria'} ·{' '}
                  {dateLabel}
                </p>
                <div className="nx-hero__bridge-meta">
                  <span>DRESS CODE: {content.dressCode.title}</span>
                  <span>•</span>
                  <span>DJ LIVE SET + LASER SHOW</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 2: MANIFIESTO / MI ENERGÍA (#nx-story)
         ==================================================================== */}
      {isSectionVisible('quote_story') && (
        <section
          id="nx-story"
          data-editor-section="quote_story"
          className="nx-section nx-story"
        >
          <div className="nx-story__backdrop">
            <SynthwaveLaserGrid />
          </div>

          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Sparkles className="w-3.5 h-3.5" />
                MANIFIESTO DE LA NOCHE · MI FRECUENCIA
              </span>
              <h2 className="nx-section-title">Mi Energía, Mi Escenario</h2>
            </div>

            {/* Word-by-word Neon Quote */}
            <div className="nx-quote-box">
              <div className="nx-quote-box__prism">
                <NeonCrownPrism compact />
              </div>
              <blockquote className="nx-quote-text">
                {quoteWords.map((word, idx) => (
                  <span key={`${word}-${idx}`} className="nx-word">
                    {word}{' '}
                  </span>
                ))}
              </blockquote>
              {content.quoteStory.quoteAuthor && (
                <p className="nx-quote-author">
                  — {content.quoteStory.quoteAuthor}
                </p>
              )}
            </div>

            {/* 3 Story Chapters */}
            <div className="nx-story-grid">
              {storyChapters.map((item, idx) => (
                <article key={idx} className="nx-story-card">
                  <div className="nx-story-card__media">
                    <img
                      src={
                        item.imageUrl ||
                        `/images/neon-xv-euphoria/${
                          idx === 0 ? 'glow' : idx === 1 ? 'stage' : 'dancefloor'
                        }.jpg`
                      }
                      alt={item.title}
                      loading="lazy"
                    />
                    <span className="nx-story-card__badge">SET 0{idx + 1}</span>
                  </div>
                  <div className="nx-story-card__body">
                    <h3 className="nx-story-card__title">{item.title}</h3>
                    <p className="nx-story-card__desc">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 3: LOS 4 BEATS DE LA NOCHE (#nx-beats)
         ==================================================================== */}
      <section id="nx-beats" className="nx-section nx-beats">
        <div className="nx-container">
          <div className="nx-section-header">
            <span className="nx-eyebrow">
              <Disc3 className="w-3.5 h-3.5" />
              INMERSIÓN DE TEMA · CLUB LINEUP
            </span>
            <h2 className="nx-section-title">Los 4 Beats de Nuestra Noche</h2>
            <p className="nx-section-subtitle">
              Cuatro momentos diseñados como un festival nocturno para que vivas
              cada cambio de luces y música desde primera fila.
            </p>
          </div>

          <div className="nx-beats-deck">
            {/* Left / Sticky Club Stage Monitor */}
            <div className="nx-beats-monitor">
              <div className="nx-beats-monitor__card">
                <div className="nx-beats-monitor__top">
                  <span className="nx-pill nx-pill--cyan">
                    {CLUB_BEATS[activeBeatIndex]?.code}
                  </span>
                  <span className="nx-beats-monitor__bpm">
                    {CLUB_BEATS[activeBeatIndex]?.bpm}
                  </span>
                </div>

                <div className="nx-beats-monitor__visual">
                  <img
                    src={CLUB_BEATS[activeBeatIndex]?.imageUrl}
                    alt={CLUB_BEATS[activeBeatIndex]?.title}
                  />
                  <div className="nx-beats-monitor__overlay" />
                  <div className="nx-beats-monitor__caption">
                    <span>{CLUB_BEATS[activeBeatIndex]?.zone}</span>
                    <strong>{CLUB_BEATS[activeBeatIndex]?.title}</strong>
                  </div>
                </div>

                <div className="nx-beats-monitor__controls">
                  {CLUB_BEATS.map((beat, idx) => (
                    <button
                      key={beat.id}
                      type="button"
                      onClick={() => setActiveBeatIndex(idx)}
                      className={`nx-beats-tab ${
                        activeBeatIndex === idx ? 'nx-beats-tab--active' : ''
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right / 4 Beat Cards (zero overflow minmax(0, 1fr)) */}
            <div className="nx-beats-list">
              {CLUB_BEATS.map((beat, idx) => (
                <article
                  key={beat.id}
                  onClick={() => setActiveBeatIndex(idx)}
                  className={`nx-beat-card nx-beat-card--${beat.accent} ${
                    activeBeatIndex === idx ? 'nx-beat-card--active' : ''
                  }`}
                >
                  <div className="nx-beat-card__header">
                    <span className="nx-beat-card__code">{beat.code}</span>
                    <span className="nx-beat-card__time">{beat.timeTag}</span>
                  </div>

                  <div className="nx-beat-card__media">
                    <img src={beat.imageUrl} alt={beat.title} loading="lazy" />
                    <span className="nx-beat-card__zone">{beat.zone}</span>
                  </div>

                  <h3 className="nx-beat-card__title">{beat.title}</h3>
                  <p className="nx-beat-card__subtitle">{beat.subtitle}</p>
                  <p className="nx-beat-card__desc">{beat.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SCENE 4: BACKSTAGE CREW / FAMILIA (#nx-family)
         ==================================================================== */}
      {isSectionVisible('vip_parents') && (
        <section
          id="nx-family"
          data-editor-section="vip_parents"
          className="nx-section nx-family"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Users className="w-3.5 h-3.5" />
                ALL ACCESS BACKSTAGE CREW
              </span>
              <h2 className="nx-section-title">
                Quienes hacen posible este sueño
              </h2>
              <p className="nx-section-subtitle">
                {content.vipParents.blessingMessage}
              </p>
            </div>

            <div className="nx-lanyard-grid">
              {content.vipParents.groups.map((group, idx) => (
                <article key={idx} className="nx-lanyard-card">
                  <div className="nx-lanyard-card__slot" aria-hidden="true" />
                  <div className="nx-lanyard-card__top">
                    <span className="nx-pill nx-pill--magenta">
                      VIP CREW 0{idx + 1}
                    </span>
                    <Star className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  <h3 className="nx-lanyard-card__role">{group.groupTitle}</h3>
                  <ul className="nx-lanyard-card__names">
                    {group.names.map((person, pIdx) => (
                      <li key={pIdx}>{person}</li>
                    ))}
                  </ul>
                  <div className="nx-lanyard-card__footer">
                    <span>ALL ACCESS · MAIN STAGE</span>
                    <span>★ XV</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 5: COUNTDOWN DROP (#nx-countdown)
         ==================================================================== */}
      {isSectionVisible('countdown') && (
        <section
          id="nx-countdown"
          data-editor-section="countdown"
          className="nx-section nx-countdown"
        >
          <div className="nx-container">
            <div className="nx-countdown-panel">
              <div className="nx-section-header">
                <span className="nx-eyebrow">
                  <Clock3 className="w-3.5 h-3.5" />
                  CONTEO REGRESIVO · STAGE DROP
                </span>
                <h2 className="nx-section-title">
                  La cuenta regresiva para el drop
                </h2>
                <p className="nx-section-subtitle">
                  Guarda la fecha en tu calendario y prepárate para cuando se
                  enciendan los láseres.
                </p>
              </div>

              <div className="nx-countdown-grid">
                <div className="nx-time-pod">
                  <span className="nx-time-pod__value">{countdown.days}</span>
                  <span className="nx-time-pod__label">DÍAS</span>
                </div>
                <div className="nx-time-pod">
                  <span className="nx-time-pod__value">{countdown.hours}</span>
                  <span className="nx-time-pod__label">HORAS</span>
                </div>
                <div className="nx-time-pod">
                  <span className="nx-time-pod__value">{countdown.minutes}</span>
                  <span className="nx-time-pod__label">MINUTOS</span>
                </div>
                <div className="nx-time-pod">
                  <span className="nx-time-pod__value">{countdown.seconds}</span>
                  <span className="nx-time-pod__label">SEGUNDOS</span>
                </div>
              </div>

              <div className="nx-countdown-actions">
                <button
                  type="button"
                  onClick={handleGoogleCalendar}
                  className="nx-btn nx-btn--neon"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Agendar en Google Calendar</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="nx-btn nx-btn--outline"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Descargar Pase .ICS (Apple / Outlook)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 6: EL CLUB + MAPA INTERACTIVO (#nx-locations)
         ==================================================================== */}
      {isSectionVisible('locations') && content.locations.length > 0 && (
        <section
          id="nx-locations"
          data-editor-section="locations"
          className="nx-section nx-locations"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <MapPin className="w-3.5 h-3.5" />
                COORDENADAS DEL EVENTO · VENUE
              </span>
              <h2 className="nx-section-title">El Club & Coordenadas VIP</h2>
            </div>

            <div className="nx-venue-layout">
              <div className="nx-venue-cards">
                {content.locations.map((loc, idx) => (
                  <article
                    key={loc.id || idx}
                    onClick={() => setActiveLocationIdx(idx)}
                    className={`nx-venue-card ${
                      activeLocationIdx === idx ? 'nx-venue-card--active' : ''
                    }`}
                  >
                    <div className="nx-venue-card__top">
                      <span className="nx-pill nx-pill--cyan">
                        {loc.type === 'religious_ceremony'
                          ? 'PRE-SHOW'
                          : 'MAIN STAGE'}
                      </span>
                      <span className="nx-venue-card__time">{loc.time}</span>
                    </div>
                    <h3 className="nx-venue-card__title">{loc.title}</h3>
                    <p className="nx-venue-card__name">{loc.venueName}</p>
                    <p className="nx-venue-card__address">{loc.address}</p>

                    <div className="nx-venue-card__actions">
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nx-btn nx-btn--neon nx-btn--sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </a>
                      {loc.wazeUrl && (
                        <a
                          href={loc.wazeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nx-btn nx-btn--outline nx-btn--sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Waze</span>
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {selectedLocation && (
                <div className="nx-venue-map">
                  <div className="nx-venue-map__header">
                    <span>RADAR EN VIVO · {selectedLocation.venueName}</span>
                    <span>
                      {selectedLocation.coordinates.lat.toFixed(4)},{' '}
                      {selectedLocation.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="nx-venue-map__frame">
                    <iframe
                      title={`Mapa de ${selectedLocation.venueName}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        selectedLocation.coordinates.lng - 0.008
                      }%2C${selectedLocation.coordinates.lat - 0.006}%2C${
                        selectedLocation.coordinates.lng + 0.008
                      }%2C${
                        selectedLocation.coordinates.lat + 0.006
                      }&layer=mapnik&marker=${
                        selectedLocation.coordinates.lat
                      }%2C${selectedLocation.coordinates.lng}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 7: LINEUP DE LA NOCHE CON PRISMA VIAJERO (#nx-timeline)
         ==================================================================== */}
      {isSectionVisible('timeline') && (
        <section
          id="nx-timeline"
          data-editor-section="timeline"
          className="nx-section nx-timeline"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Music className="w-3.5 h-3.5" />
                SETLIST OFICIAL · MINUTO A MINUTO
              </span>
              <h2 className="nx-section-title">Lineup de la Noche</h2>
            </div>

            <div ref={timelineTrackRef} className="nx-timeline-track">
              <div className="nx-timeline-rail" aria-hidden="true">
                <div ref={timelinePrismRef} className="nx-timeline-traveler">
                  <NeonCrownPrism compact />
                </div>
              </div>

              <div className="nx-timeline-items">
                {content.timeline.map((item, idx) => (
                  <article
                    key={item.id || idx}
                    className={`nx-timeline-card ${
                      idx % 2 === 0
                        ? 'nx-timeline-card--left'
                        : 'nx-timeline-card--right'
                    }`}
                  >
                    <span className="nx-timeline-card__time">{item.time}</span>
                    <h3 className="nx-timeline-card__title">{item.title}</h3>
                    {item.description && (
                      <p className="nx-timeline-card__desc">{item.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 8: FLASHBACK / GALERÍA EDITORIAL (#nx-gallery)
         ==================================================================== */}
      {isSectionVisible('gallery') && (
        <section
          id="nx-gallery"
          data-editor-section="gallery"
          className="nx-section nx-gallery"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Sparkles className="w-3.5 h-3.5" />
                VISUAL ARCHIVE · NEON EDITORIAL
              </span>
              <h2 className="nx-section-title">Destellos de esta Etapa</h2>
            </div>

            <div className="nx-gallery-grid">
              {galleryPhotos.map((photo, idx) => (
                <figure
                  key={idx}
                  className={`nx-gallery-card nx-gallery-card--slot-${(idx % 4) + 1}`}
                >
                  <div className="nx-gallery-card__viewport">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Foto ${idx + 1}`}
                      className="nx-gallery-card__img"
                      loading="lazy"
                    />
                  </div>
                  {photo.caption && (
                    <figcaption className="nx-gallery-card__caption">
                      <span>0{idx + 1}</span>
                      <p>{photo.caption}</p>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 9: DRESS CODE GLOW PARTY (#nx-dress)
         ==================================================================== */}
      {isSectionVisible('dress_code') && (
        <section
          id="nx-dress"
          data-editor-section="dress_code"
          className="nx-section nx-dress"
        >
          <div className="nx-container">
            <div className="nx-dress-panel">
              <div className="nx-dress-panel__info">
                <span className="nx-eyebrow">
                  <Shirt className="w-3.5 h-3.5" />
                  ESTILO DE LA NOCHE · DRESS CODE
                </span>
                <h2 className="nx-section-title">
                  {content.dressCode.title || 'Neon Noir & Metallic Glam'}
                </h2>
                <p className="nx-dress-panel__code">
                  {content.dressCode.womenNotes}
                </p>
                <p className="nx-dress-panel__desc">
                  {content.dressCode.menNotes}
                </p>

                <div className="nx-swatches">
                  {dressSwatches.map((swatch) => (
                    <div key={swatch.hex} className="nx-swatch">
                      <span
                        className="nx-swatch__dot"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="nx-swatch__name">{swatch.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nx-dress-panel__visual">
                <NeonCrownPrism />
                <span className="nx-dress-panel__tag">
                  {content.dressCode.reservedNote ||
                    'BRILLA EN LA PISTA · EVITA EL COLOR EXCLUSIVO DE LA QUINCEAÑERA'}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 10: REGALOS / NEON VAULT (#nx-gifts)
         ==================================================================== */}
      {isSectionVisible('gifts') && (
        <section
          id="nx-gifts"
          data-editor-section="gifts"
          className="nx-section nx-gifts"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Gift className="w-3.5 h-3.5" />
                DETALLES & MESA DE REGALOS
              </span>
              <h2 className="nx-section-title">Mi Baúl de Deseos</h2>
              <p className="nx-section-subtitle">
                {content.gifts.introMessage}
              </p>
            </div>

            <div className="nx-gifts-grid">
              {content.gifts.bankTransfer?.enabled && (
                <article className="nx-gift-card">
                  <div className="nx-gift-card__top">
                    <span className="nx-pill nx-pill--magenta">
                      <CreditCard className="w-3.5 h-3.5" />
                      LLUVIA DE SOBRES / TRANSFERENCIA
                    </span>
                  </div>
                  <h3 className="nx-gift-card__bank">
                    {content.gifts.bankTransfer.bankName}
                  </h3>
                  <p className="nx-gift-card__holder">
                    Titular: {content.gifts.bankTransfer.accountHolder}
                  </p>
                  <div className="nx-gift-card__clabe">
                    <code>{content.gifts.bankTransfer.clabe}</code>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyClabe(
                          content.gifts.bankTransfer?.clabe || '',
                        )
                      }
                      className="nx-btn nx-btn--neon nx-btn--sm"
                    >
                      {copiedClabe ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiada</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar CLABE</span>
                        </>
                      )}
                    </button>
                  </div>
                  {content.gifts.bankTransfer.conceptNote && (
                    <p className="nx-gift-card__notes">
                      {content.gifts.bankTransfer.conceptNote}
                    </p>
                  )}
                </article>
              )}

              {content.gifts.registries.map((reg, idx) => (
                <article key={idx} className="nx-gift-card">
                  <div className="nx-gift-card__top">
                    <span className="nx-pill nx-pill--cyan">
                      <Gift className="w-3.5 h-3.5" />
                      MESA DE REGALOS
                    </span>
                  </div>
                  <h3 className="nx-gift-card__bank">{reg.storeName}</h3>
                  {reg.eventNumber && (
                    <p className="nx-gift-card__holder">
                      Evento: <strong>{reg.eventNumber}</strong>
                    </p>
                  )}
                  <a
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nx-btn nx-btn--outline"
                  >
                    <span>Abrir Mesa de Regalos</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 11: HOSPEDAJE (#nx-stay)
         ==================================================================== */}
      {isSectionVisible('accommodation') &&
        content.accommodation.length > 0 && (
          <section
            id="nx-stay"
            data-editor-section="accommodation"
            className="nx-section nx-stay"
          >
            <div className="nx-container">
              <div className="nx-section-header">
                <span className="nx-eyebrow">
                  <Hotel className="w-3.5 h-3.5" />
                  PARA INVITADOS FORÁNEOS
                </span>
                <h2 className="nx-section-title">Hospedaje Sugerido</h2>
              </div>

              <div className="nx-stay-grid">
                {content.accommodation.map((hotel, idx) => (
                  <article key={idx} className="nx-stay-card">
                    <span className="nx-pill nx-pill--glass">
                      {hotel.distanceNote}
                    </span>
                    <h3 className="nx-stay-card__name">{hotel.hotelName}</h3>
                    {hotel.discountCode && (
                      <p className="nx-stay-card__code">
                        Código preferencial:{' '}
                        <strong>{hotel.discountCode}</strong>
                      </p>
                    )}
                    {hotel.bookingUrl && (
                      <div className="nx-stay-card__actions">
                        <a
                          href={hotel.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nx-btn nx-btn--neon nx-btn--sm"
                        >
                          <span>Reservar</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* ====================================================================
          SCENE 12: BACKSTAGE SOCIAL (#nx-social)
         ==================================================================== */}
      {isSectionVisible('social_features') && (
        <section
          id="nx-social"
          data-editor-section="social_features"
          className="nx-section nx-social"
        >
          <div className="nx-container">
            <div className="nx-section-header">
              <span className="nx-eyebrow">
                <Radio className="w-3.5 h-3.5" />
                BACKSTAGE INTERACTIVO · LIVE FEED
              </span>
              <h2 className="nx-section-title">
                Sube tus Fotos & Pide tu Canción
              </h2>
            </div>

            <div className="nx-social-stack">
              {content.socialFeatures.enableLiveDisposableCamera && (
                <div className="nx-social-panel">
                  <SharedAlbum
                    slug={slug}
                    token={guestGroup?.guestToken}
                    preview={isBuilderPreview}
                  />
                </div>
              )}

              <div className="nx-social-panel">
                <SocialFeatures
                  slug={slug}
                  token={guestGroup?.guestToken}
                  preview={isBuilderPreview}
                  songsEnabled={content.socialFeatures.enableSongRequests}
                  audioEnabled={content.socialFeatures.enableAudioGuestbook}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 13: VIP PASS RSVP + QR (#nx-rsvp)
         ==================================================================== */}
      {isSectionVisible('rsvp') && (
        <section
          id="nx-rsvp"
          data-editor-section="rsvp"
          className="nx-section nx-rsvp"
        >
          <div className="nx-container">
            <div className="nx-rsvp-ticket">
              <div className="nx-rsvp-ticket__header">
                <span className="nx-pill nx-pill--magenta">
                  <Ticket className="w-3.5 h-3.5" />
                  BOLETERA OFICIAL · ALL ACCESS VIP
                </span>
                <h2 className="nx-section-title">Confirma tu Pase VIP</h2>
                <p className="nx-section-subtitle">
                  {content.rsvp.customConfirmationMessage}
                </p>
              </div>

              {!rsvpSubmitted ? (
                <form onSubmit={handleRsvpSubmit} className="nx-rsvp-form">
                  <div className="nx-rsvp-field">
                    <label htmlFor="nx-guest-name">Nombre o Familia</label>
                    <input
                      id="nx-guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ej. Valeria & Amigos"
                      required
                    />
                  </div>

                  <div className="nx-rsvp-toggle">
                    <button
                      type="button"
                      onClick={() => setAttending('yes')}
                      className={`nx-toggle-btn ${
                        attending === 'yes' ? 'nx-toggle-btn--active' : ''
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>¡Ahí estaré en la pista!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending('no')}
                      className={`nx-toggle-btn ${
                        attending === 'no' ? 'nx-toggle-btn--active-no' : ''
                      }`}
                    >
                      <span>No podré asistir</span>
                    </button>
                  </div>

                  {attending === 'yes' && (
                    <div className="nx-rsvp-row">
                      <div className="nx-rsvp-field">
                        <label htmlFor="nx-passes-count">Número de pases</label>
                        <select
                          id="nx-passes-count"
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'pase VIP' : 'pases VIP'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {content.rsvp.askDietaryRestrictions && (
                        <div className="nx-rsvp-field">
                          <label htmlFor="nx-dietary">
                            Restricción alimentaria (opcional)
                          </label>
                          <input
                            id="nx-dietary"
                            type="text"
                            value={dietaryNotes}
                            onChange={(e) => setDietaryNotes(e.target.value)}
                            placeholder="Ej. Vegetariano, sin gluten..."
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="nx-rsvp-field">
                    <label htmlFor="nx-notes">
                      Mensaje para la quinceañera o canción que no puede faltar
                    </label>
                    <textarea
                      id="nx-notes"
                      rows={3}
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="Escribe tus buenos deseos o el track que quieres bailar..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="nx-btn nx-btn--neon nx-rsvp-submit"
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isSubmittingRsvp
                        ? 'Generando Pase VIP...'
                        : 'Confirmar & Generar Boleto QR'}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="nx-qr-pass">
                  <div className="nx-qr-pass__info">
                    <span className="nx-pill nx-pill--cyan">
                      PASE ACTIVO ·{' '}
                      {attending === 'yes' ? 'CONFIRMADO' : 'REGISTRADO'}
                    </span>
                    <h3>{guestName}</h3>
                    <p>
                      {attending === 'yes'
                        ? `${guestsCount} ${
                            guestsCount === 1 ? 'Acceso VIP' : 'Accesos VIP'
                          } · ${dateLabel}`
                        : 'Gracias por notificarnos'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setRsvpSubmitted(false)}
                      className="nx-btn nx-btn--outline nx-btn--sm"
                    >
                      Editar confirmación
                    </button>
                  </div>

                  {attending === 'yes' && (
                    <div className="nx-qr-pass__code">
                      <QRCodeSVG
                        value={qrPayload}
                        size={148}
                        bgColor="#090614"
                        fgColor="#00F0FF"
                        level="M"
                      />
                      <span>PRESENTA EN ACCESO VIP</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="nx-footer">
        <div className="nx-footer__prism">
          <NeonCrownPrism compact />
        </div>
        <p className="nx-footer__title">{content.hero.mainTitle}</p>
        <p className="nx-footer__meta">NEON XV EUPHORIA · {dateLabel}</p>
      </footer>

      {/* Floating Audio Player */}
      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isPassUnlocked}
        accentColor={colors.accentPrimary}
      />
    </div>
  );
}
