'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  Apple,
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Camera,
  CarFront,
  Check,
  Clock3,
  Compass,
  Copy,
  CreditCard,
  Disc3,
  Gift,
  Heart,
  Hotel,
  MapPin,
  MapPinned,
  Music2,
  Pause,
  Play,
  Radio,
  Route,
  SkipBack,
  SkipForward,
  Sparkles,
  Ticket,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sectionHeading } from '@/lib/templates/section-heading';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { buildGoogleCalendarUrl, buildIcsFileContent } from '@/lib/calendar/ics-generator';
import { createDefaultInvitationConfig } from '@/lib/templates/templates-catalog';
import { AmbientParticlesCanvas } from '../core/AmbientParticlesCanvas';
import { HeroMedia } from '../core/HeroMedia';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';
import { DEFAULT_VINYL_TRACKS, useVinylTurntable } from './useVinylTurntable';
import './ritmo-de-dos.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface RitmoDeDosProps {
  slug: string;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
  previewEnvelope?: boolean;
}

const formatDate = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? ''
    : new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Mexico_City',
      }).format(parsed);
};

const extractCoupleParts = (title: string): [string, string] => {
  const parts = title
    .split(/\s*(?:&|y|\+)\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' & ')];
  }
  return [title.trim() || 'Marina', 'Pablo'];
};

/**
 * Upgrades unmodified legacy SVG seed paths ("cover.svg" / "detail.svg") to the new
 * 35mm analog vinyl photography while preserving 100% of user/editor customizations.
 */
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

/**
 * Symmetrical 12-inch LP Vinyl Record SVG (`viewBox="0 0 240 240"`, center `(120, 120)`).
 */
function VinylRecordDisc({
  monogram = 'M&P',
  subtitle = 'LADO A · 33 RPM',
  className = '',
}: {
  monogram?: string;
  subtitle?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      className={`rd-vinyl-svg ${className}`}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`lp-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B1D17" />
          <stop offset="55%" stopColor="#1B100E" />
          <stop offset="100%" stopColor="#0E0807" />
        </radialGradient>
        <linearGradient id={`sheen-${uid}`} x1="25" y1="25" x2="215" y2="215" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9EBCF" stopOpacity="0.24" />
          <stop offset="48%" stopColor="#F9EBCF" stopOpacity="0" />
          <stop offset="100%" stopColor="#F2C67A" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Disco exterior simétrico con puntos estroboscópicos */}
      <circle cx="120" cy="120" r="114" fill={`url(#lp-${uid})`} stroke="#F2C67A" strokeWidth="2.2" />
      <circle
        cx="120"
        cy="120"
        r="110"
        stroke="#F2C67A"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeDasharray="2 5.5"
      />
      <circle cx="120" cy="120" r="108" fill={`url(#sheen-${uid})`} />

      {/* Surcos concéntricos de 33 RPM */}
      <circle cx="120" cy="120" r="100" stroke="#F9EBCF" strokeOpacity="0.16" strokeWidth="1" />
      <circle cx="120" cy="120" r="91" stroke="#F9EBCF" strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="120" cy="120" r="82" stroke="#F2C67A" strokeOpacity="0.2" strokeWidth="1.2" strokeDasharray="8 6" />
      <circle cx="120" cy="120" r="73" stroke="#F9EBCF" strokeOpacity="0.14" strokeWidth="1" />
      <circle cx="120" cy="120" r="64" stroke="#F9EBCF" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="120" cy="120" r="55" stroke="#F2C67A" strokeOpacity="0.16" strokeWidth="1" />

      {/* Destellos especulares simétricos */}
      <path
        d="M52 68 A86 86 0 0 1 96 37"
        stroke="#F9EBCF"
        strokeOpacity="0.3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M188 172 A86 86 0 0 1 144 203"
        stroke="#F9EBCF"
        strokeOpacity="0.3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Galleta central vermilion / ámbar */}
      <circle cx="120" cy="120" r="44" fill="#B83A29" stroke="#F9EBCF" strokeWidth="2.5" />
      <circle cx="120" cy="120" r="35" fill="#F2C67A" fillOpacity="0.2" stroke="#F2C67A" strokeWidth="1" strokeDasharray="3 3" />

      <text
        x="120"
        y="108"
        textAnchor="middle"
        fill="#F9EBCF"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="1.8"
      >
        {subtitle.slice(0, 16)}
      </text>
      <text
        x="120"
        y="134"
        textAnchor="middle"
        fill="#F2C67A"
        fontSize="9"
        fontWeight="800"
        letterSpacing="1.6"
      >
        {monogram.slice(0, 6)}
      </text>

      {/* Centro perforado del tornamesa */}
      <circle cx="120" cy="120" r="7.5" fill="#F9EBCF" stroke="#512720" strokeWidth="2.5" />
    </svg>
  );
}

/**
 * Vintage Hi-Fi Turntable Tonearm SVG (`viewBox="0 0 180 220"`).
 * Supports interactive click to drop/lift needle and glowing stylus indicator when playing.
 */
function TurntableTonearm({
  className = '',
  isPlaying = false,
  onToggle,
}: {
  className?: string;
  isPlaying?: boolean;
  onToggle?: () => void;
}) {
  return (
    <svg
      className={`rd-tonearm-svg ${isPlaying ? 'rd-tonearm-svg--playing' : ''} ${className}`}
      viewBox="0 0 180 220"
      fill="none"
      role={onToggle ? 'button' : undefined}
      tabIndex={onToggle ? 0 : undefined}
      aria-label={
        onToggle
          ? isPlaying
            ? 'Levantar aguja del tocadiscos'
            : 'Colocar aguja sobre el vinilo'
          : undefined
      }
      onClick={onToggle}
      onKeyDown={
        onToggle
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
    >
      {/* Anillo de pulso en la base del pivote */}
      <circle
        cx="132"
        cy="42"
        r="33"
        stroke="#F2C67A"
        strokeOpacity={isPlaying ? '0.55' : '0.2'}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* Base del pivote cardánico */}
      <circle cx="132" cy="42" r="28" fill="#512720" stroke="#F2C67A" strokeWidth="2.5" />
      <circle cx="132" cy="42" r="18" fill="#B83A29" stroke="#F9EBCF" strokeWidth="2" />
      <circle cx="132" cy="42" r="6.5" fill="#F9EBCF" />

      {/* Contrapeso superior calibrado */}
      <rect
        x="120"
        y="5"
        width="24"
        height="15"
        rx="4"
        fill="#3D665F"
        stroke="#512720"
        strokeWidth="2.2"
      />
      <line x1="124" y1="12" x2="140" y2="12" stroke="#F2C67A" strokeWidth="1.5" />

      {/* Palanca cueing */}
      <path d="M158 46 H172" stroke="#F2C67A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="172" cy="46" r="3.5" fill="#B83A29" />

      {/* Brazo metálico en S */}
      <path
        d="M132 42 L116 124 C112 146 92 166 56 184"
        stroke="#512720"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <path
        d="M132 42 L116 124 C112 146 92 166 56 184"
        stroke="#F2C67A"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Cápsula fonocaptora (Headshell) y aguja luminosa */}
      <g transform="translate(36 176) rotate(-25)">
        <rect
          x="0"
          y="0"
          width="29"
          height="15"
          rx="4"
          fill="#B83A29"
          stroke="#512720"
          strokeWidth="2.2"
        />
        <path d="M-5 8 L1 5" stroke="#F2C67A" strokeWidth="2.2" strokeLinecap="round" />
        <circle
          cx="7"
          cy="7.5"
          r={isPlaying ? '3.5' : '2.2'}
          fill={isPlaying ? '#FFE08A' : '#F9EBCF'}
        />
      </g>
    </svg>
  );
}

/**
 * Circular rotating Vinyl Record Label Seal with `<textPath>` inspired by ywstudio.com.mx.
 */
function RotatingVinylSeal({ text, className = '' }: { text: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`rd-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="rd-seal__spinner">
        <defs>
          <path
            id={`rd-seal-path-${uid}`}
            d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0"
          />
        </defs>
        <text className="rd-seal__text" letterSpacing="4.1">
          <textPath href={`#rd-seal-path-${uid}`}>{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Acoustic Soundwave & Vinyl Groove Mandala Backdrop (`strokeDashoffset` on scroll).
 */
function AcousticWaveBackdrop() {
  return (
    <svg
      className="rd-wave-backdrop"
      viewBox="-320 -320 640 640"
      fill="none"
      aria-hidden="true"
    >
      <circle
        r="275"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1"
        strokeDasharray="6 8"
      />
      <circle
        r="210"
        className="rd-draw-path"
        stroke="currentColor"
        strokeOpacity="0.24"
        strokeWidth="1.5"
      />
      <circle
        r="145"
        className="rd-draw-path"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.3"
      />
      {/* Ondas acústicas simétricas */}
      <path
        className="rd-draw-path"
        d="M-260 0 C-210 -95 -150 95 -100 0 C-50 -95 50 95 100 0 C150 -95 210 95 260 0"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.8"
      />
      <path
        className="rd-draw-path"
        d="M-260 0 C-210 70 -150 -70 -100 0 C-50 70 50 -70 100 0 C150 70 210 -70 260 0"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.3"
      />
      {/* Ejes de calibración estroboscópica */}
      <path
        className="rd-draw-path"
        d="M-280 0 H280 M0 -280 V280"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
      />
    </svg>
  );
}

function VinylStarburst({ className = '' }: { className?: string }) {
  return (
    <svg className={`rd-starburst ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 0L18.8 11.8L32 16L18.8 20.2L16 32L13.2 20.2L0 16L13.2 11.8L16 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionHeader({
  code,
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  code?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <header className={`rd-section-header${light ? ' rd-section-header--light' : ''}`}>
      <div className="rd-section-header__pill">
        {code && <span className="rd-section-header__code">{code}</span>}
        <VinylStarburst className="rd-section-header__star" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="rd-section-header__title">{title}</h2>
      {subtitle && <p className="rd-section-header__subtitle">{subtitle}</p>}
      <div className="rd-section-header__rule" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
    </header>
  );
}

function KineticMarquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className={`rd-marquee${reverse ? ' rd-marquee--reverse' : ''}`} aria-hidden="true">
      <div className="rd-marquee__track">
        {repeated.map((item, idx) => (
          <span className="rd-marquee__item" key={`${item}-${idx}`}>
            <span>{item}</span>
            <VinylStarburst className="rd-marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Opening({
  config,
  guestGroup,
  coupleFirst,
  coupleSecond,
  dateLabel,
  isOpen,
  onOpen,
}: {
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  coupleFirst: string;
  coupleSecond: string;
  dateLabel: string;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    try {
      confetti({
        particleCount: 60,
        spread: 72,
        origin: { y: 0.6 },
        colors: [
          config.theme.colors.accentPrimary,
          config.theme.colors.accentSecondary,
          '#F2C67A',
          '#512720',
        ],
      });
    } catch {
      // Safe fallback in headless environments
    }
    window.setTimeout(() => {
      onOpen();
      setOpening(false);
    }, 860);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="rd-opening"
          data-editor-section="envelope"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rd-opening__grid" aria-hidden="true" />
          <div className="rd-opening__glow" aria-hidden="true" />

          {/* Disco LP que emerge de la funda al abrir */}
          <motion.div
            className="rd-opening__vinyl"
            animate={
              opening
                ? { y: -135, rotate: 240, scale: 1.15, opacity: 0 }
                : { rotate: 360 }
            }
            transition={
              opening
                ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
                : { duration: 18, repeat: Infinity, ease: 'linear' }
            }
          >
            <VinylRecordDisc monogram={config.theme.envelope.sealMonogram || 'M&P'} />
          </motion.div>

          {/* Funda de vinilo / Boleto de primera fila */}
          <motion.div
            className="rd-opening__sleeve"
            animate={
              opening
                ? { y: 36, scale: 0.95, opacity: 0 }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rd-opening__top">
              <span className="rd-opening__issue">
                <i aria-hidden="true" /> EDICIÓN LP · TOCADISCOS INTERACTIVO
              </span>
              <span className="rd-opening__monogram">
                {config.theme.envelope.sealMonogram || 'M&P'}
              </span>
            </div>

            <p className="rd-opening__kicker">
              {config.content.hero.badgeText || 'SESIÓN EN VIVO · LADO A'}
            </p>
            <h1 className="rd-opening__title">
              <span>{coupleFirst}</span>
              <em>&amp; {coupleSecond}</em>
            </h1>
            <p className="rd-opening__subtitle">
              Coloca la aguja sobre el vinilo: dos historias, una misma pista y una noche en vivo para celebrarlo juntos.
            </p>

            <div className="rd-opening__perforation" aria-hidden="true">
              <span />
              <VinylStarburst />
              <span />
            </div>

            <div className="rd-opening__ticket">
              <span>BOLETO DE ACCESO · PRIMERA FILA</span>
              <strong>
                {guestGroup?.groupName || 'Invitado Especial VIP'}
              </strong>
              <small>
                {guestGroup
                  ? `${guestGroup.allocatedAdults + guestGroup.allocatedChildren} accesos reservados en taquilla`
                  : dateLabel || 'Sesión en Vivo · Ciudad de México'}
              </small>
            </div>

            <motion.button
              type="button"
              className="rd-button rd-button--primary rd-button--full"
              disabled={opening}
              onClick={handleOpen}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Disc3 size={17} />
              <span>
                {config.theme.envelope.openButtonText || 'Colocar aguja y escuchar invitación'}
              </span>
              <ArrowRight size={16} />
            </motion.button>

            <p className="rd-opening__audio">
              <Volume2 size={14} /> Tocadiscos funcional con sonido analógico en vivo
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RitmoDeDosExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: RitmoDeDosProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(
    forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope)
  );
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [scratchPulse, setScratchPulse] = useState(false);
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

  const content = useMemo(() => ritmoContent(config), [config]);
  const { colors, fonts, envelope } = config.theme;
  const [coupleFirst, coupleSecond] = extractCoupleParts(content.hero.mainTitle);
  const coupleDisplay = `${coupleFirst} & ${coupleSecond}`;
  const dateLabel = formatDate(eventDate);

  // Use custom audio URL only if the user changed it from the generic stock URL
  const hasCustomAudioUrl = Boolean(
    config.audio.enabled &&
      config.audio.trackUrl &&
      !config.audio.trackUrl.includes('audio_1808fbf07a.mp3')
  );

  const deck = useVinylTurntable({
    tracks: DEFAULT_VINYL_TRACKS,
    externalTrackUrl: config.audio.trackUrl,
    preferExternalAudio: hasCustomAudioUrl,
  });

  const spinDurationSec = useMemo(
    () => (8.4 / deck.speedMultiplier).toFixed(2),
    [deck.speedMultiplier]
  );

  const handleScratchHeroDisc = useCallback(() => {
    deck.scratchDisc();
    if (!deck.isPlaying) {
      deck.startPlayback();
    }
    setScratchPulse(true);
    window.setTimeout(() => setScratchPulse(false), 380);
  }, [deck]);

  const enabled = useCallback(
    (id: string) => config.sectionsOrder.find((s) => s.id === id)?.enabled ?? true,
    [config.sectionsOrder]
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

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || (!isOpen && !isBuilderPreview)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scroller = root.closest('[data-invitation-scroller]') || undefined;
      const scrollerOption = scroller ? { scroller } : {};

      // Barra superior de progreso
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

      // 1. HERO STICKY EN DOS TIEMPOS: Tornamesa circular 1:1 -> Expansión fija
      const hero = root.querySelector<HTMLElement>('.rd-hero');
      const heroStage = root.querySelector<HTMLElement>('.rd-hero__stage');
      const heroCopy = root.querySelector<HTMLElement>('.rd-hero__copy');
      const heroVisual = root.querySelector<HTMLElement>('.rd-hero__visual');
      const heroPlatter = root.querySelector<HTMLElement>('.rd-hero__platter');
      const heroTonearmWrap = root.querySelector<HTMLElement>('.rd-hero__tonearm-scroll');
      const heroWatermark = root.querySelector<HTMLElement>('.rd-hero__watermark');
      const heroReveal = root.querySelector<HTMLElement>('.rd-hero__reveal');
      const heroScrollHint = root.querySelector<HTMLElement>('.rd-hero__scroll-hint');
      const heroGrooveOverlay = root.querySelector<HTMLElement>('.rd-hero__vinyl-rim');
      const heroSpindle = root.querySelector<HTMLElement>('.rd-hero__spindle');

      if (hero && heroStage && heroCopy && heroVisual) {
        const getDiscLayout = () => {
          const stageW = heroStage.clientWidth || window.innerWidth;
          const stageH = heroStage.clientHeight || window.innerHeight;
          const isDesktop = window.matchMedia('(min-width: 960px)').matches;
          const discSize = Math.round(
            isDesktop
              ? Math.min(stageW * 0.32, stageH * 0.54)
              : Math.min(stageW * 0.58, stageH * 0.31)
          );
          const platterSize = discSize + (isDesktop ? 56 : 40);
          const centerX = isDesktop ? stageW * 0.72 : stageW * 0.5;
          const centerY = isDesktop ? stageH * 0.46 : stageH * 0.24;

          return {
            stageW,
            stageH,
            discSize,
            platterSize,
            discLeft: Math.round(centerX - discSize / 2),
            discTop: Math.round(centerY - discSize / 2),
            platterLeft: Math.round(centerX - platterSize / 2),
            platterTop: Math.round(centerY - platterSize / 2),
          };
        };

        const applyInitialDiscLayout = () => {
          const layout = getDiscLayout();
          gsap.set(heroVisual, {
            left: layout.discLeft,
            top: layout.discTop,
            width: layout.discSize,
            height: layout.discSize,
            borderRadius: `${Math.round(layout.discSize / 2)}px`,
          });
          if (heroPlatter) {
            gsap.set(heroPlatter, {
              left: layout.platterLeft,
              top: layout.platterTop,
              width: layout.platterSize,
              height: layout.platterSize,
            });
          }
        };

        applyInitialDiscLayout();
        ScrollTrigger.addEventListener('refreshInit', applyInitialDiscLayout);

        gsap.fromTo(
          root.querySelectorAll('.rd-hero__animate-in'),
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.15,
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
          .fromTo(
            heroVisual,
            {
              left: () => getDiscLayout().discLeft,
              top: () => getDiscLayout().discTop,
              width: () => getDiscLayout().discSize,
              height: () => getDiscLayout().discSize,
              borderRadius: () => `${Math.round(getDiscLayout().discSize / 2)}px`,
            },
            {
              left: 0,
              top: 0,
              width: () => getDiscLayout().stageW,
              height: () => getDiscLayout().stageH,
              borderRadius: '0px',
              duration: 0.88,
            },
            0.06
          )
          .to(
            heroVisual,
            {
              borderRadius: '24px',
              duration: 0.24,
            },
            0.06
          )
          .to(
            heroVisual,
            {
              borderRadius: '0px',
              duration: 0.64,
            },
            0.3
          );

        if (heroGrooveOverlay) {
          heroTl.to(heroGrooveOverlay, { opacity: 0, duration: 0.35 }, 0.04);
        }
        if (heroSpindle) {
          heroTl.to(heroSpindle, { scale: 0, opacity: 0, duration: 0.3 }, 0.04);
        }
        if (heroPlatter) {
          heroTl.to(
            heroPlatter,
            { scale: 1.38, rotate: 95, opacity: 0, duration: 0.62 },
            0.04
          );
        }
        if (heroWatermark) {
          heroTl.to(
            heroWatermark,
            { scale: 1.35, yPercent: -12, opacity: 0, duration: 0.72 },
            0
          );
        }
        if (heroTonearmWrap) {
          heroTl.to(
            heroTonearmWrap,
            { xPercent: 32, yPercent: -35, opacity: 0, duration: 0.62 },
            0.04
          );
        }
        if (heroScrollHint) {
          heroTl.to(heroScrollHint, { opacity: 0, duration: 0.25 }, 0);
        }
        if (heroReveal) {
          heroTl.fromTo(
            heroReveal,
            { y: 44, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.36 },
            0.62
          );
        }
      }

      // Títulos de sección con escala ligada al scroll
      root.querySelectorAll<HTMLElement>('.rd-section-header__title').forEach((title) => {
        gsap.fromTo(
          title,
          { scale: 0.88, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: title,
              start: 'top 94%',
              end: 'top 52%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      });

      // 2. LADO A: Ondas acústicas SVG dibujadas + palabras iluminadas
      const waveBackdrop = root.querySelector<SVGElement>('.rd-wave-backdrop');
      if (waveBackdrop) {
        gsap.fromTo(
          waveBackdrop,
          { scale: 0.82, rotate: -10, opacity: 0.25 },
          {
            scale: 1.06,
            rotate: 10,
            opacity: 0.88,
            ease: 'none',
            scrollTrigger: {
              trigger: '.rd-story',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
              ...scrollerOption,
            },
          }
        );
        waveBackdrop.querySelectorAll<SVGGeometryElement>('.rd-draw-path').forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 900;
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.rd-story',
                start: 'top 82%',
                end: 'center 42%',
                scrub: 0.8,
                ...scrollerOption,
              },
            }
          );
        });
      }

      const storyWords = root.querySelectorAll<HTMLElement>('.rd-story__word');
      const storyQuote = root.querySelector<HTMLElement>('.rd-story__quote');
      if (storyQuote && storyWords.length) {
        gsap.fromTo(
          storyWords,
          { opacity: 0.2, y: 8 },
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

      root.querySelectorAll<HTMLElement>('.rd-story__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 66, rotate: idx % 2 === 0 ? -3.5 : 3.5, scale: 0.92, opacity: 0.35 },
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

      // 3. EL ÁLBUM / TORNAMESA HI-FI + 4 TRACKS DE LA NOCHE
      const deckConsole = root.querySelector<HTMLElement>('.rd-deck');
      if (deckConsole) {
        gsap.fromTo(
          deckConsole,
          { y: 56, scale: 0.94, opacity: 0.4 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: deckConsole,
              start: 'top 92%',
              end: 'top 58%',
              scrub: 0.7,
              ...scrollerOption,
            },
          }
        );
      }

      root.querySelectorAll<HTMLElement>('.rd-track-card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 70, scale: 0.92, rotateX: 9, opacity: 0.35 },
          {
            y: 0,
            scale: 1,
            rotateX: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 0.7,
              ...scrollerOption,
            },
            delay: idx * 0.03,
          }
        );
      });

      // 4. LA BANDA / NUESTRA GENTE (FAMILIA)
      root.querySelectorAll<HTMLElement>('.rd-family__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 72, rotate: idx % 2 === 0 ? -4 : 4, scale: 0.9, opacity: 0.3 },
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

      // 5. CONSOLA DE SOUNDCHECK (CUENTA REGRESIVA)
      const countdownPods = root.querySelectorAll<HTMLElement>('.rd-countdown__pod');
      const countdownGrid = root.querySelector<HTMLElement>('.rd-countdown__grid');
      if (countdownGrid && countdownPods.length) {
        gsap.fromTo(
          countdownPods,
          { y: 54, scale: 0.8, opacity: 0.2 },
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

      // 6. EL FORO Y MAPA: Apertura de póster de concierto
      root.querySelectorAll<HTMLElement>('.rd-location-card__media').forEach((media) => {
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

      // 7. SETLIST DE LA NOCHE (TIMELINE CON VINILO VIAJERO)
      const timelineTrack = root.querySelector<HTMLElement>('.rd-timeline__track');
      const timelineProgress = root.querySelector<HTMLElement>('.rd-timeline__progress');
      const timelineRunner = root.querySelector<HTMLElement>('.rd-timeline__runner');
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
              end: 'bottom 52%',
              scrub: 0.6,
              ...scrollerOption,
            },
          }
        );
      }
      if (timelineTrack && timelineRunner) {
        gsap.fromTo(
          timelineRunner,
          { top: '0%', rotate: 0 },
          {
            top: '94%',
            rotate: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineTrack,
              start: 'top 76%',
              end: 'bottom 52%',
              scrub: 0.6,
              ...scrollerOption,
            },
          }
        );
      }
      root.querySelectorAll<HTMLElement>('.rd-timeline__item').forEach((item, idx) => {
        gsap.fromTo(
          item,
          { x: idx % 2 === 0 ? -34 : 34, y: 26, opacity: 0.3 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 93%',
              end: 'top 60%',
              scrub: 0.65,
              ...scrollerOption,
            },
          }
        );
      });

      // 8. GALERÍA DE SESIÓN EN VINILO
      root.querySelectorAll<HTMLElement>('.rd-gallery__card').forEach((photo, idx) => {
        gsap.fromTo(
          photo,
          {
            y: 80 + idx * 12,
            x: idx % 2 === 0 ? -24 : 24,
            rotate: idx % 2 === 0 ? -5 : 5,
            scale: 0.9,
            opacity: 0.3,
          },
          {
            y: 0,
            x: 0,
            rotate: idx % 2 === 0 ? -1.2 : 1.2,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: photo,
              start: 'top 96%',
              end: 'top 56%',
              scrub: 0.75,
              ...scrollerOption,
            },
          }
        );
      });

      // 9. DRESS CODE
      root.querySelectorAll<HTMLElement>('.rd-dress__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 60, rotateY: idx === 0 ? -14 : 14, opacity: 0.3 },
          {
            y: 0,
            rotateY: 0,
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

      // 10. RSVP
      const rsvpPass = root.querySelector<HTMLElement>('.rd-rsvp__pass');
      if (rsvpPass) {
        gsap.fromTo(
          rsvpPass,
          { y: 56, scale: 0.93, opacity: 0.45 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rsvpPass,
              start: 'top 95%',
              end: 'top 68%',
              scrub: 0.65,
              ...scrollerOption,
            },
          }
        );
      }
    },
    { scope: rootRef, dependencies: [isOpen, isBuilderPreview, sectionSignature] }
  );

  const openInvitation = useCallback(() => {
    setIsOpen(true);
    deck.startPlayback();
  }, [deck]);

  const mainLocation = content.locations[0];
  const calendarUrl = buildGoogleCalendarUrl({
    title: content.hero.mainTitle,
    description: `Boda de ${coupleDisplay}`,
    location: mainLocation?.address || content.hero.tagline,
    startDateIso: eventDate,
  });

  const handleDownloadIcs = () => {
    const ics = buildIcsFileContent({
      title: content.hero.mainTitle,
      description: `Boda de ${coupleDisplay}`,
      location: mainLocation?.address || content.hero.tagline,
      startDateIso: eventDate,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo de calendario descargado');
  };

  const handleCopyClabe = async (clabe: string) => {
    try {
      await navigator.clipboard.writeText(clabe);
      setCopiedClabe(true);
      toast.success('¡CLABE copiada al portapapeles!');
      window.setTimeout(() => setCopiedClabe(false), 2400);
    } catch {
      toast.error('No se pudo copiar automáticamente');
    }
  };

  const handleSubmitRsvp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBuilderPreview || !guestGroup) {
      toast.error('Abre tu enlace personal para confirmar');
      return;
    }
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(slug)}/rsvp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestToken: guestGroup.guestToken,
            groupName: rsvpName,
            willAttend: willAttend === 'yes',
            confirmedAdults: adults,
            confirmedChildren: children,
            dietaryNotes,
            guestMessage,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (!result.pass) {
        setGeneratedPass(null);
        toast.success('Gracias por avisarnos');
        return;
      }
      setGeneratedPass({
        qrPayload: result.pass.qrPayload,
        groupName: result.pass.groupName,
        adults,
        children,
        tableName: result.pass.tableName || 'Primera Fila · Mesa asignada',
      });
      toast.success('¡Boleto confirmado!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo guardar tu confirmación'
      );
    }
  };

  const primaryActionHref = '#rd-tracks';

  return (
    <div
      ref={rootRef}
      className="rd-root"
      style={
        {
          '--rd-bg': colors.bgPrimary,
          '--rd-bg-2': colors.bgSecondary,
          '--rd-text': colors.textPrimary,
          '--rd-muted': colors.textMuted,
          '--rd-accent': colors.accentPrimary,
          '--rd-sage': colors.accentSecondary,
          '--rd-seal': envelope.sealColor || colors.accentPrimary,
          '--rd-heading-font': invitationFontStack(fonts.headingFont),
          '--rd-script-font': invitationFontStack(fonts.scriptFont),
          '--rd-body-font': invitationFontStack(fonts.bodyFont),
          '--rd-spin-duration': `${spinDurationSec}s`,
        } as React.CSSProperties
      }
    >
      {/* 1. FUNDA DE VINILO / BOLETO DE APERTURA */}
      {(!isBuilderPreview || previewEnvelope) && (
        <Opening
          config={config}
          guestGroup={guestGroup}
          coupleFirst={coupleFirst}
          coupleSecond={coupleSecond}
          dateLabel={dateLabel}
          isOpen={isOpen}
          onOpen={openInvitation}
        />
      )}

      {/* 2. PARTÍCULAS AMBIENTALES */}
      <AmbientParticlesCanvas
        effect={config.theme.ambientEffect}
        accentColor={colors.accentPrimary}
      />

      {/* 3. DISCO FLOTANTE DE AUDIO (SIN CONTROLES EXTRA) */}
      <div className={`rd-floating-deck ${deck.isPlaying ? 'rd-floating-deck--playing' : ''}`}>
        <button
          type="button"
          className="rd-floating-deck__disc"
          onClick={deck.togglePlay}
          aria-label={deck.isPlaying ? 'Pausar música del tocadiscos' : 'Reproducir música del tocadiscos'}
          title={deck.isPlaying ? 'Pausar tocadiscos' : 'Reproducir tocadiscos'}
        >
          <VinylRecordDisc monogram={envelope.sealMonogram || 'M&P'} />
        </button>
      </div>

      {/* 4. BARRA DE PROGRESO + CONSOLA DE NAVEGACIÓN */}
      <div className="rd-progress" aria-hidden="true">
        <div ref={progressRef} className="rd-progress__fill" />
      </div>

      <header className="rd-nav">
        <a href="#rd-hero" className="rd-nav__brand">
          <span className="rd-nav__monogram">{envelope.sealMonogram || 'M&P'}</span>
          <span className="rd-nav__title">{coupleDisplay}</span>
        </a>
        <nav className="rd-nav__links" aria-label="Navegación de la invitación">
          {enabled('quote_story') && <a href="#rd-story">Lado A</a>}
          <a href="#rd-tracks">Tocadiscos</a>
          {enabled('locations') && <a href="#rd-locations">Foro</a>}
          {enabled('timeline') && <a href="#rd-timeline">Setlist</a>}
          {enabled('rsvp') && (
            <a href="#rd-rsvp" className="rd-nav__cta">
              <span>Taquilla</span>
              <ArrowRight size={13} />
            </a>
          )}
        </nav>
      </header>

      <main>
        {/* SECCIÓN 1: HERO STICKY EN DOS TIEMPOS CON TOCADISCOS FUNCIONAL */}
        {enabled('hero') && (
          <section
            id="rd-hero"
            data-editor-section="hero"
            className={`rd-hero ${deck.isPlaying ? 'rd-hero--playing' : ''}`}
            aria-label="Portada de la invitación"
          >
            <div className="rd-hero__stage">
              <div className="rd-hero__field" aria-hidden="true" />
              <div className="rd-hero__watermark" aria-hidden="true">
                LP
              </div>

              {/* Surcos orbitales, ondas reactivas y sello giratorio alrededor del vinilo */}
              <div className="rd-hero__platter" aria-hidden="true">
                <span className="rd-hero__groove-ring" />
                <span className="rd-hero__groove-ring rd-hero__groove-ring--inner" />
                <span className="rd-hero__soundwave rd-hero__soundwave--1" />
                <span className="rd-hero__soundwave rd-hero__soundwave--2" />
                <RotatingVinylSeal
                  text={`RITMO DE DOS ★ ${coupleDisplay.toUpperCase()} ★ SESIÓN EN VIVO ${deck.rpm} RPM ★ `}
                  className="rd-hero__seal"
                />
              </div>

              {/* Brazo de tornamesa interactivo que pivota al poner/quitar la aguja y al hacer scroll */}
              <div className="rd-hero__tonearm-scroll">
                <div
                  className="rd-hero__tonearm"
                  style={
                    {
                      '--rd-arm-angle': `${deck.tonearmAngle}deg`,
                    } as React.CSSProperties
                  }
                >
                  <TurntableTonearm
                    isPlaying={deck.isPlaying}
                    onToggle={deck.togglePlay}
                  />
                </div>
              </div>

              {/* Ventana circular de vinilo que gira cuando está activo y se expande con el scroll */}
              <div
                className={`rd-hero__visual ${
                  deck.isPlaying ? 'rd-hero__visual--spinning' : ''
                } ${scratchPulse ? 'rd-hero__visual--scratch' : ''}`}
                onClick={handleScratchHeroDisc}
                role="button"
                tabIndex={0}
                aria-label="Tocar o girar el disco de vinilo"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleScratchHeroDisc();
                  }
                }}
              >
                <div className="rd-hero__disc-rotor">
                  <HeroMedia
                    hero={content.hero}
                    alt={`Sesión en vinilo de ${coupleDisplay}`}
                    className="rd-hero__media-img"
                  />
                </div>
                <span className="rd-hero__vinyl-rim" aria-hidden="true" />
                <span className="rd-hero__media-shade" aria-hidden="true" />
                <span className="rd-hero__spindle" aria-hidden="true" />
              </div>

              {/* Copy centrado en móvil */}
              <div className="rd-hero__copy">
                <div className="rd-hero__pill rd-hero__animate-in">
                  <span className="rd-hero__dot" aria-hidden="true" />
                  <span>{content.hero.badgeText}</span>
                </div>

                <h1 className="rd-hero__title rd-hero__animate-in">
                  <span className="rd-hero__title-kicker">SESIÓN EN VIVO · LADO A</span>
                  <strong>{coupleFirst}</strong>
                  <em>&amp; {coupleSecond}</em>
                </h1>

                <p className="rd-hero__tagline rd-hero__animate-in">
                  {content.hero.tagline}
                </p>

                <div className="rd-hero__meta rd-hero__animate-in">
                  {dateLabel && (
                    <span className="rd-hero__chip">
                      <CalendarDays size={14} />
                      <span>{dateLabel}</span>
                    </span>
                  )}
                  {mainLocation?.time && (
                    <span className="rd-hero__chip">
                      <Clock3 size={14} />
                      <span>{mainLocation.time}</span>
                    </span>
                  )}
                  {mainLocation?.venueName && (
                    <span className="rd-hero__chip">
                      <MapPin size={14} />
                      <span>{mainLocation.venueName}</span>
                    </span>
                  )}
                </div>

                {guestGroup && (
                  <p className="rd-hero__guest rd-hero__animate-in">
                    <Ticket size={14} />
                    <span>Acceso reservado para {guestGroup.groupName}</span>
                  </p>
                )}

                <div className="rd-hero__actions rd-hero__animate-in">
                  {enabled('rsvp') && (
                    <a href="#rd-rsvp" className="rd-button rd-button--primary">
                      <Ticket size={16} />
                      <span>Confirmar boleto</span>
                    </a>
                  )}
                  <a href={primaryActionHref} className="rd-button rd-button--ghost">
                    <span>Abrir consola Hi-Fi</span>
                    <ArrowDown size={15} />
                  </a>
                </div>
              </div>

              {/* Tarjeta puente de cartel de concierto al expandir el vinilo */}
              <div className="rd-hero__reveal">
                <div className="rd-hero__reveal-card">
                  <img
                    src={deck.activeTrack.coverUrl}
                    alt=""
                    aria-hidden="true"
                    className="rd-hero__reveal-thumb"
                  />
                  <div className="rd-hero__reveal-body">
                    <span className="rd-hero__reveal-kicker">
                      SONANDO AHORA · TRACK {deck.activeTrack.number} ({deck.rpm} RPM)
                    </span>
                    <p className="rd-hero__reveal-title">
                      {deck.activeTrack.title}
                    </p>
                    <a href="#rd-tracks" className="rd-hero__reveal-link">
                      <span>Ir al tocadiscos interactivo</span>
                      <ArrowDown size={15} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="rd-hero__scroll-hint" aria-hidden="true">
                <span>TOCA EL VINILO O DESLIZA</span>
                <ArrowDown size={14} />
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA 1 */}
        <KineticMarquee
          items={[
            content.hero.badgeText || 'NUESTRA BODA',
            coupleDisplay.toUpperCase(),
            dateLabel || 'SESIÓN EN VIVO',
            mainLocation?.venueName || 'COLONIA ROMA · CDMX',
            'TOCADISCOS INTERACTIVO · 33⅓ & 45 RPM',
          ]}
        />

        {/* SECCIÓN 2: LADO A — CÓMO COMENZÓ TODO (HISTORIA + ONDAS ACÚSTICAS SVG) */}
        {enabled('quote_story') && (
          <section
            id="rd-story"
            data-editor-section="quoteStory"
            className="rd-story rd-section rd-sheet rd-sheet--sage"
          >
            <AcousticWaveBackdrop />
            <div className="rd-container">
              <SectionHeader
                code="LADO A · 33 RPM"
                eyebrow={sectionHeading(
                  config,
                  'quote_story',
                  'eyebrow',
                  'Lado A'
                )}
                title={sectionHeading(
                  config,
                  'quote_story',
                  'title',
                  'Cómo comenzó todo'
                )}
                light
              />

              <blockquote
                className="rd-story__quote"
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
                        <span className="rd-story__word" key={`${part}-${idx}`}>
                          {part}
                        </span>
                      )
                    )}
                  ”
                </span>
              </blockquote>

              {content.quoteStory.quoteAuthor && (
                <p className="rd-story__author">
                  <VinylStarburst className="rd-story__author-star" />
                  <span>{content.quoteStory.quoteAuthor}</span>
                </p>
              )}

              {content.quoteStory.storyBlocks &&
                content.quoteStory.storyBlocks.length > 0 && (
                  <div className="rd-story__grid">
                    {content.quoteStory.storyBlocks.map((block, idx) => (
                      <article
                        className="rd-story__card"
                        key={`${block.title}-${idx}`}
                      >
                        <div className="rd-story__card-top">
                          <span className="rd-story__phase">
                            COMPÁS 0{idx + 1}
                          </span>
                          <Radio size={16} />
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

        {/* SECCIÓN 3 (INTERACTIVA): TORNAMESA HI-FI FUNCIONAL & LOS 4 TRACKS DE NUESTRA NOCHE */}
        <section
          id="rd-tracks"
          className="rd-tracks rd-section"
          aria-labelledby="rd-tracks-title"
        >
          <div className="rd-container">
            <header className="rd-section-header">
              <div className="rd-section-header__pill">
                <span className="rd-section-header__code">CONSOLA HI-FI EN VIVO</span>
                <VinylStarburst className="rd-section-header__star" />
                <span>TOCADISCOS FUNCIONAL</span>
              </div>
              <h2 id="rd-tracks-title" className="rd-section-header__title">
                Los 4 tracks de nuestra noche
              </h2>
              <p className="rd-section-header__subtitle">
                Toca el vinilo, el brazo del tocadiscos o cualquiera de los 4 surcos del álbum para escuchar nuestra sesión.
              </p>
              <div className="rd-section-header__rule" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>
            </header>

            {/* TOCADISCOS INTERACTIVO DE NOGAL & BRONCE (SIN CONTROLES DE BOTONERA) */}
            <div className={`rd-deck ${deck.isPlaying ? 'rd-deck--playing' : ''}`}>
              {/* Plinto izquierdo: Plato estroboscópico + Vinilo + Brazo fonocaptor */}
              <div className="rd-deck__plinth">
                <div className="rd-deck__plinth-top">
                  <span className="rd-deck__badge">
                    HI-FI DIRECT DRIVE · {coupleDisplay.toUpperCase()}
                  </span>
                  <span className="rd-deck__strobe">
                    <i aria-hidden="true" />
                    <span>33⅓ RPM · EN VIVO</span>
                  </span>
                </div>

                <div className="rd-deck__stage">
                  {/* Plato giratorio con puntos estroboscópicos y carátula del track activo */}
                  <div
                    className="rd-deck__platter"
                    onClick={deck.togglePlay}
                    role="button"
                    tabIndex={0}
                    aria-label="Tocar el disco para reproducir o pausar"
                    title="Toca el vinilo para reproducir o pausar"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        deck.togglePlay();
                      }
                    }}
                  >
                    <div
                      className={`rd-deck__vinyl-rotor ${
                        deck.isPlaying ? 'rd-deck__vinyl-rotor--spinning' : ''
                      }`}
                    >
                      <VinylRecordDisc
                        monogram={envelope.sealMonogram || 'M&P'}
                        subtitle={`${deck.activeTrack.side} · TRACK ${deck.activeTrack.number}`}
                      />
                      <div className="rd-deck__label-art">
                        <img
                          src={deck.activeTrack.coverUrl}
                          alt={deck.activeTrack.title}
                        />
                        <span className="rd-deck__spindle-pin" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Reflejo especular fijo sobre los surcos */}
                    <div className="rd-deck__platter-sheen" aria-hidden="true" />
                  </div>

                  {/* Brazo fonocaptor motorizado sincronizado con el surco del track */}
                  <div
                    className="rd-deck__tonearm-mount"
                    style={
                      {
                        '--rd-deck-arm-angle': `${deck.tonearmAngle}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <TurntableTonearm
                      isPlaying={deck.isPlaying}
                      onToggle={deck.togglePlay}
                    />
                  </div>

                  {/* Lámpara estroboscópica lateral */}
                  <div className="rd-deck__lamp" aria-hidden="true">
                    <span className="rd-deck__lamp-glow" />
                    <small>PILOT</small>
                  </div>
                </div>
              </div>

              {/* Panel derecho: Vúmetros analógicos L/R + Surcos del álbum */}
              <div className="rd-deck__monitor">
                {/* Vúmetros analógicos dobles (L / R) */}
                <div className="rd-deck__vu-row">
                  {(['LEFT CH', 'RIGHT CH'] as const).map((channel, idx) => {
                    const level = deck.vuLevels[idx];
                    const needleDeg = -42 + (level / 100) * 84;
                    return (
                      <div className="rd-vu-meter" key={channel}>
                        <div className="rd-vu-meter__top">
                          <span>{channel}</span>
                          <strong>{deck.isPlaying ? `-${Math.max(0, 12 - Math.round(level / 9))} dB` : '-∞ dB'}</strong>
                        </div>
                        <div className="rd-vu-meter__dial" aria-hidden="true">
                          <span className="rd-vu-meter__arc" />
                          <span
                            className="rd-vu-meter__needle"
                            style={{ transform: `translateX(-50%) rotate(${needleDeg}deg)` }}
                          />
                          <span className="rd-vu-meter__pivot" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pantalla del Track Activo */}
                <div className="rd-deck__now-playing">
                  <div className="rd-deck__now-meta">
                    <span className="rd-deck__now-side">{deck.activeTrack.side}</span>
                    <span className="rd-deck__now-bpm">
                      {deck.activeTrack.duration}
                    </span>
                  </div>
                  <h3>
                    {deck.activeTrack.number}. {deck.activeTrack.title}
                  </h3>
                  <p>{deck.activeTrack.subtitle}</p>

                  {/* Ecualizador de barras analógicas */}
                  <div
                    className={`rd-deck__eq ${deck.isPlaying ? 'rd-deck__eq--active' : ''}`}
                    aria-hidden="true"
                  >
                    {Array.from({ length: 16 }).map((_, barIdx) => (
                      <span
                        key={barIdx}
                        style={
                          {
                            '--rd-eq-delay': `${(barIdx % 5) * 0.12}s`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Lista rápida de surcos clickeables */}
                <div className="rd-deck__groove-list" role="tablist" aria-label="Surcos del vinilo">
                  {deck.tracks.map((track, idx) => {
                    const isCurrent = idx === deck.activeTrackIndex;
                    return (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        key={track.id}
                        onClick={() => deck.selectTrack(idx)}
                        className={`rd-deck__groove-item ${
                          isCurrent ? 'rd-deck__groove-item--active' : ''
                        }`}
                      >
                        <span className="rd-deck__groove-num">
                          {isCurrent && deck.isPlaying ? '●' : track.number}
                        </span>
                        <span className="rd-deck__groove-name">
                          <strong>{track.title}</strong>
                          <small>
                            {track.side} · {track.subtitle}
                          </small>
                        </span>
                        <span className="rd-deck__groove-time">{track.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tarjetas de colección de los 4 Tracks (también clickeables para poner el disco) */}
            <div className="rd-tracks__grid">
              {deck.tracks.map((track, idx) => {
                const isCurrent = idx === deck.activeTrackIndex;
                return (
                  <article
                    key={track.id}
                    className={`rd-track-card ${
                      isCurrent ? 'rd-track-card--active' : ''
                    }`}
                    style={{ '--rd-stack-index': idx } as React.CSSProperties}
                  >
                    <div className="rd-track-card__media">
                      <img src={track.coverUrl} alt={track.title} loading="lazy" />
                      <span className="rd-track-card__tag">{track.tag}</span>
                    </div>
                    <div className="rd-track-card__body">
                      <span className="rd-track-card__code">
                        TRACK {track.number} · {track.side}
                      </span>
                      <h3>{track.title}</h3>
                      <p>{track.description}</p>
                      <button
                        type="button"
                        onClick={() =>
                          isCurrent ? deck.togglePlay() : deck.selectTrack(idx)
                        }
                        className="rd-track-card__play-btn"
                      >
                        {isCurrent && deck.isPlaying ? (
                          <>
                            <Pause size={14} />
                            <span>Sonando en el tocadiscos</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            <span>Poner este track en el vinilo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: LA BANDA / NUESTRA GENTE (PADRES Y TESTIGOS) */}
        {enabled('vip_parents') && content.vipParents.groups.length > 0 && (
          <section
            id="rd-family"
            data-editor-section="vipParents"
            className="rd-family rd-section rd-sheet"
          >
            <div className="rd-container">
              <SectionHeader
                code="CRÉDITOS DEL ÁLBUM"
                eyebrow={sectionHeading(
                  config,
                  'vip_parents',
                  'eyebrow',
                  'Nuestra gente'
                )}
                title={sectionHeading(
                  config,
                  'vip_parents',
                  'title',
                  'Con el cariño de'
                )}
                subtitle={content.vipParents.blessingMessage}
              />

              <div className="rd-family__grid">
                {content.vipParents.groups.map((group, idx) => (
                  <article
                    className="rd-family__card"
                    key={`${group.groupTitle}-${idx}`}
                  >
                    <div className="rd-family__badge">
                      <Heart size={14} />
                      <span>CRÉDITO 0{idx + 1}</span>
                    </div>
                    <h3>{group.groupTitle}</h3>
                    <div className="rd-family__names">
                      {group.names.map((person, pIdx) => (
                        <strong key={`${person}-${pIdx}`}>{person}</strong>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 5: SOUNDCHECK CONSOLE (CUENTA REGRESIVA) */}
        {enabled('countdown') && (
          <section
            id="rd-countdown"
            data-editor-section="countdown"
            className="rd-countdown rd-section"
          >
            <div className="rd-container">
              <SectionHeader
                code="SOUNDCHECK OFICIAL"
                eyebrow={sectionHeading(
                  config,
                  'countdown',
                  'eyebrow',
                  'Sube el volumen'
                )}
                title={sectionHeading(
                  config,
                  'countdown',
                  'title',
                  'Falta muy poco'
                )}
              />

              <div className="rd-countdown__console">
                <div className="rd-countdown__status">
                  <span className="rd-countdown__dot" aria-hidden="true" />
                  <span>AGUJA LISTA SOBRE EL SURCO · {dateLabel}</span>
                </div>

                <div
                  className="rd-countdown__grid"
                  aria-label="Cuenta regresiva para la boda"
                >
                  {[
                    { code: 'CH 01', label: 'Días', value: timeLeft.days },
                    { code: 'CH 02', label: 'Horas', value: timeLeft.hours },
                    { code: 'CH 03', label: 'Minutos', value: timeLeft.minutes },
                    { code: 'CH 04', label: 'Segundos', value: timeLeft.seconds },
                  ].map((unit) => (
                    <div className="rd-countdown__pod" key={unit.label}>
                      <small>{unit.code}</small>
                      <strong>{String(unit.value).padStart(2, '0')}</strong>
                      <span>{unit.label}</span>
                    </div>
                  ))}
                </div>

                <div className="rd-countdown__actions">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rd-button rd-button--primary"
                  >
                    <CalendarDays size={16} />
                    <span>Agendar en Google Calendar</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="rd-button rd-button--ghost"
                  >
                    <CalendarDays size={16} />
                    <span>Apple Calendar / Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 6: EL FORO (UBICACIONES Y MAPA) */}
        {enabled('locations') && content.locations.length > 0 && (
          <section
            id="rd-locations"
            data-editor-section="locations"
            className="rd-locations rd-section rd-sheet"
          >
            <div className="rd-container">
              <SectionHeader
                code="EL FORO EN VIVO"
                eyebrow={sectionHeading(
                  config,
                  'locations',
                  'eyebrow',
                  'La sede'
                )}
                title={sectionHeading(
                  config,
                  'locations',
                  'title',
                  'Dónde sonará la fiesta'
                )}
                subtitle="Consulta la ubicación exacta del foro y elige tu ruta favorita para llegar a tiempo al soundcheck."
              />

              <div className="rd-locations__list">
                {content.locations.map((loc, idx) => {
                  const mapQuery = encodeURIComponent(
                    `${loc.venueName}, ${loc.address}`
                  );
                  return (
                    <article className="rd-location-card" key={loc.id || idx}>
                      <div className="rd-location-card__visual-col">
                        <div className="rd-location-card__media">
                          <img
                            src={loc.imageUrl || '/images/ritmo-de-dos/venue.jpg'}
                            alt={`Escenario en ${loc.venueName}`}
                            loading="lazy"
                          />
                          <span className="rd-location-card__coord">
                            <Compass size={14} />
                            <span>
                              STAGE 0{idx + 1} · {loc.time}
                            </span>
                          </span>
                        </div>

                        <div className="rd-location-card__map">
                          <iframe
                            title={`Mapa de ${loc.venueName}`}
                            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>

                      <div className="rd-location-card__info">
                        <span className="rd-location-card__kicker">
                          <Clock3 size={14} />
                          <span>
                            {loc.time} · {loc.title}
                          </span>
                        </span>

                        <h3>{loc.venueName}</h3>

                        <p className="rd-location-card__address">
                          <MapPin size={17} />
                          <span>{loc.address}</span>
                        </p>

                        <div className="rd-location-card__routes">
                          <a
                            href={loc.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rd-route-btn rd-route-btn--primary"
                          >
                            <MapPinned size={16} />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href={loc.wazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rd-route-btn"
                          >
                            <Route size={16} />
                            <span>Waze</span>
                          </a>
                          <a
                            href={`https://maps.apple.com/?daddr=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rd-route-btn"
                          >
                            <Apple size={16} />
                            <span>Apple Maps</span>
                          </a>
                          <a
                            href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rd-route-btn"
                          >
                            <CarFront size={16} />
                            <span>Uber</span>
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

        {/* SECCIÓN 7: SETLIST DE LA NOCHE (TIMELINE CON VINILO VIAJERO) */}
        {enabled('timeline') && content.timeline.length > 0 && (
          <section
            id="rd-timeline"
            data-editor-section="timeline"
            className="rd-timeline rd-section"
          >
            <div className="rd-container">
              <SectionHeader
                code="SETLIST OFICIAL"
                eyebrow={sectionHeading(
                  config,
                  'timeline',
                  'eyebrow',
                  'Setlist de la noche'
                )}
                title={sectionHeading(
                  config,
                  'timeline',
                  'title',
                  'Cada momento'
                )}
              />

              <div className="rd-timeline__track">
                <div className="rd-timeline__rail" aria-hidden="true">
                  <div className="rd-timeline__progress" />
                  <div className="rd-timeline__runner">
                    <VinylRecordDisc monogram={envelope.sealMonogram || 'M&P'} />
                  </div>
                </div>

                <div className="rd-timeline__items">
                  {content.timeline.map((item, idx) => (
                    <article className="rd-timeline__item" key={item.id || idx}>
                      <div className="rd-timeline__node" aria-hidden="true">
                        <span>0{idx + 1}</span>
                      </div>
                      <div className="rd-timeline__card">
                        <div className="rd-timeline__meta">
                          <span className="rd-timeline__time">{item.time}</span>
                          <span className="rd-timeline__step">
                            SET 0{idx + 1}
                          </span>
                        </div>
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 8: RECUERDOS EN VINILO (GALERÍA) */}
        {enabled('gallery') && content.gallery.images.length > 0 && (
          <section
            id="rd-gallery"
            data-editor-section="gallery"
            className="rd-gallery rd-section rd-sheet"
          >
            <div className="rd-container">
              <SectionHeader
                code="ARTE DEL ÁLBUM"
                eyebrow={sectionHeading(
                  config,
                  'gallery',
                  'eyebrow',
                  'Recuerdos en vinilo'
                )}
                title={sectionHeading(
                  config,
                  'gallery',
                  'title',
                  'Nosotros'
                )}
              />

              <div className="rd-gallery__grid">
                {content.gallery.images.map((img, idx) => (
                  <figure
                    className="rd-gallery__card"
                    key={`${img.url}-${idx}`}
                  >
                    <div className="rd-gallery__img-wrap">
                      <img
                        src={img.url}
                        alt={img.caption || `Fotografía analógica ${idx + 1}`}
                        loading="lazy"
                      />
                      <span className="rd-gallery__badge">
                        SLEEVE 0{idx + 1}
                      </span>
                    </div>
                    {img.caption && (
                      <figcaption className="rd-gallery__caption">
                        <VinylStarburst className="rd-gallery__star" />
                        <span>{img.caption}</span>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA 2 */}
        <KineticMarquee
          reverse
          items={[
            'DRESS CODE · RETRO COCKTAIL',
            `SESIÓN EN VIVO · ${coupleDisplay.toUpperCase()}`,
            'PRIMERA FILA VIP',
            'CONFIRMA TU BOLETO DIGITAL',
          ]}
        />

        {/* SECCIÓN 9: DRESS CODE (ESTILO DE LA NOCHE) */}
        {enabled('dress_code') && (
          <section
            id="rd-dress"
            data-editor-section="dressCode"
            className="rd-dress rd-section"
          >
            <div className="rd-container">
              <SectionHeader
                code="ESTILO & PISTA"
                eyebrow={sectionHeading(
                  config,
                  'dress_code',
                  'eyebrow',
                  'Estilo de la noche'
                )}
                title={sectionHeading(
                  config,
                  'dress_code',
                  'title',
                  content.dressCode.title || 'Cómo vestir'
                )}
                subtitle="Una noche cálida con espíritu retro para lucir increíble y bailar sin parar hasta el último vinilo."
              />

              <div className="rd-dress__grid">
                <article className="rd-dress__card">
                  <div className="rd-dress__icon-wrap">
                    <Sparkles size={20} />
                  </div>
                  <span className="rd-dress__role">LOOK DE NOCHE</span>
                  <h3>Para Ellas</h3>
                  <p>{content.dressCode.womenNotes}</p>
                </article>

                <article className="rd-dress__card">
                  <div className="rd-dress__icon-wrap">
                    <Disc3 size={20} />
                  </div>
                  <span className="rd-dress__role">SASTRERÍA RELAJADA</span>
                  <h3>Para Ellos</h3>
                  <p>{content.dressCode.menNotes}</p>
                </article>
              </div>

              <div className="rd-dress__checklist">
                <span>
                  <Check size={14} /> Cóctel con guiño retro
                </span>
                <span>
                  <Check size={14} /> Calzado cómodo para la pista
                </span>
                <span>
                  <Check size={14} /> Tonos cálidos bienvenidos
                </span>
              </div>

              {content.dressCode.reservedColors.length > 0 && (
                <div className="rd-dress__palette">
                  <span className="rd-dress__palette-label">
                    TONO RESERVADO PARA LA NOVIA
                  </span>
                  <div className="rd-dress__swatches">
                    {content.dressCode.reservedColors.map((swatch, idx) => (
                      <div
                        className="rd-dress__swatch"
                        key={`${swatch.name}-${idx}`}
                      >
                        <i style={{ backgroundColor: swatch.hex }} />
                        <span>{swatch.name}</span>
                      </div>
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

        {/* SECCIÓN 10: MESA DE REGALOS */}
        {enabled('gifts') &&
          (Boolean(content.gifts.introMessage) ||
            content.gifts.registries.length > 0 ||
            Boolean(content.gifts.bankTransfer?.enabled) ||
            content.gifts.cashEnvelopeAtVenue) && (
            <section
              id="rd-gifts"
              data-editor-section="gifts"
              className="rd-gifts rd-section rd-sheet"
            >
              <div className="rd-container">
                <SectionHeader
                  code="FONDO DE VINILOS & VIAJE"
                  eyebrow={sectionHeading(
                    config,
                    'gifts',
                    'eyebrow',
                    'Si deseas acompañarnos con un detalle'
                  )}
                  title={sectionHeading(config, 'gifts', 'title', 'Regalos')}
                  subtitle={content.gifts.introMessage}
                />

                <div className="rd-gifts__grid">
                  {content.gifts.registries.map((reg, idx) => (
                    <article
                      className="rd-gifts__card"
                      key={`${reg.storeName}-${idx}`}
                    >
                      <Gift size={22} className="rd-gifts__icon" />
                      <span>MESA DE REGALOS</span>
                      <h3>{reg.storeName}</h3>
                      {reg.eventNumber && <p>Evento: {reg.eventNumber}</p>}
                      <a
                        href={reg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rd-button rd-button--primary"
                      >
                        <span>Ver mesa de regalos</span>
                        <ArrowRight size={15} />
                      </a>
                    </article>
                  ))}

                  {content.gifts.bankTransfer?.enabled && (
                    <article className="rd-gifts__card rd-gifts__card--wide">
                      <CreditCard size={22} className="rd-gifts__icon" />
                      <span>TRANSFERENCIA BANCARIA</span>
                      <h3>
                        {content.gifts.bankTransfer.bankName} ·{' '}
                        {content.gifts.bankTransfer.accountHolder}
                      </h3>
                      <p className="rd-gifts__clabe">
                        CLABE: {content.gifts.bankTransfer.clabe}
                      </p>
                      {content.gifts.bankTransfer.conceptNote && (
                        <small>
                          Concepto: {content.gifts.bankTransfer.conceptNote}
                        </small>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyClabe(content.gifts.bankTransfer!.clabe)
                        }
                        className="rd-button rd-button--primary"
                      >
                        {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
                        <span>
                          {copiedClabe ? '¡CLABE copiada!' : 'Copiar CLABE'}
                        </span>
                      </button>
                    </article>
                  )}

                  {content.gifts.cashEnvelopeAtVenue && (
                    <article className="rd-gifts__card">
                      <Gift size={22} className="rd-gifts__icon" />
                      <span>EN EL FORO</span>
                      <h3>Buzón de sobres en taquilla</h3>
                      <p>
                        En la entrada del foro tendremos un buzón especial por si deseas dejarnos una postal o detalle para nuestro próximo viaje.
                      </p>
                    </article>
                  )}
                </div>
              </div>
            </section>
          )}

        {/* SECCIÓN 11: HOSPEDAJE */}
        {enabled('accommodation') && content.accommodation.length > 0 && (
          <section
            id="rd-stay"
            data-editor-section="accommodation"
            className="rd-stay rd-section"
          >
            <div className="rd-container">
              <SectionHeader
                code="ESTANCIA EN LA ROMA"
                eyebrow={sectionHeading(
                  config,
                  'accommodation',
                  'eyebrow',
                  'Para quienes viajan'
                )}
                title={sectionHeading(
                  config,
                  'accommodation',
                  'title',
                  'Hospedaje'
                )}
              />

              <div className="rd-stay__grid">
                {content.accommodation.map((hotel, idx) => (
                  <article
                    className="rd-stay__card"
                    key={`${hotel.hotelName}-${idx}`}
                  >
                    <Hotel size={22} className="rd-stay__icon" />
                    <h3>{hotel.hotelName}</h3>
                    <p>{hotel.distanceNote}</p>
                    {hotel.discountCode && (
                      <span className="rd-stay__code">
                        Código: {hotel.discountCode}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 12: LADO B SOCIAL (ÁLBUM Y PEDIDOS MUSICALES) */}
        {enabled('social_features') && (
          <section
            id="rd-social"
            data-editor-section="socialFeatures"
            className="rd-social rd-section"
          >
            <div className="rd-container">
              <SectionHeader
                code="LADO B · EN VIVO"
                eyebrow={sectionHeading(
                  config,
                  'social_features',
                  'eyebrow',
                  'Lado B'
                )}
                title={sectionHeading(
                  config,
                  'social_features',
                  'title',
                  'Comparte y pide tu canción'
                )}
                subtitle="Sube las fotos que captures durante la noche y agrega a la cola las canciones que te harán salir a la pista."
              />

              <div className="rd-social__grid">
                <div className="rd-social__panel">
                  <div className="rd-social__panel-head">
                    <Camera size={20} />
                    <span>BOOTLEG OFICIAL DE FOTOS</span>
                  </div>
                  <h3>La fiesta desde tu lente</h3>
                  <SharedAlbum
                    slug={slug}
                    token={guestGroup?.guestToken}
                    preview={isBuilderPreview}
                  />
                </div>

                {(content.socialFeatures.enableSongRequests ||
                  content.socialFeatures.enableAudioGuestbook) && (
                  <div className="rd-social__panel">
                    <div className="rd-social__panel-head">
                      <Music2 size={20} />
                      <span>JUKEBOX & TORNAMESA</span>
                    </div>
                    <h3>Pide tu track para la pista</h3>
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
                <div className="rd-social__hashtag">
                  <Disc3 size={15} />
                  <span>{content.socialFeatures.hashtag}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECCIÓN 13: TAQUILLA VIP (RSVP + BOLETO QR) */}
        {enabled('rsvp') && (
          <section
            id="rd-rsvp"
            data-editor-section="rsvp"
            className="rd-rsvp rd-section rd-sheet rd-sheet--sage"
          >
            <div className="rd-container">
              <SectionHeader
                code="TAQUILLA DE ACCESO"
                eyebrow={sectionHeading(
                  config,
                  'rsvp',
                  'eyebrow',
                  'Tu lugar en la pista'
                )}
                title={sectionHeading(
                  config,
                  'rsvp',
                  'title',
                  'Confirma tu asistencia'
                )}
                subtitle={
                  guestGroup
                    ? `Boleto reservado para ${guestGroup.groupName} (${guestGroup.allocatedAdults} adultos${
                        guestGroup.allocatedChildren > 0
                          ? ` y ${guestGroup.allocatedChildren} niños`
                          : ''
                      }).`
                    : 'Usa tu enlace personal para confirmar tu asistencia y descargar tu boleto QR.'
                }
                light
              />

              <div className="rd-rsvp__pass">
                <div className="rd-rsvp__pass-bar">
                  <span>
                    <Ticket size={15} /> BOLETO DE CONCIERTO · RITMO DE DOS
                  </span>
                  <span>{coupleDisplay.toUpperCase()}</span>
                </div>

                {!generatedPass ? (
                  <form onSubmit={handleSubmitRsvp} className="rd-rsvp__form">
                    <div className="rd-rsvp__field">
                      <label htmlFor="rd-rsvp-name">
                        Nombre de familia o invitado
                      </label>
                      <input
                        id="rd-rsvp-name"
                        type="text"
                        required
                        value={rsvpName}
                        readOnly={Boolean(guestGroup)}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Ej. Familia Morales Ortega"
                      />
                    </div>

                    <div className="rd-rsvp__row">
                      <div className="rd-rsvp__field">
                        <label htmlFor="rd-rsvp-attend">
                          ¿Nos acompañas en la sesión en vivo?
                        </label>
                        <select
                          id="rd-rsvp-attend"
                          value={willAttend}
                          onChange={(e) =>
                            setWillAttend(e.target.value as 'yes' | 'no')
                          }
                        >
                          <option value="yes">
                            ¡Sí, ahí estaremos bailando!
                          </option>
                          <option value="no">
                            No podremos asistir
                          </option>
                        </select>
                      </div>

                      <div className="rd-rsvp__field">
                        <label htmlFor="rd-rsvp-phone">Teléfono WhatsApp</label>
                        <input
                          id="rd-rsvp-phone"
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                    </div>

                    {willAttend === 'yes' && (
                      <>
                        <div className="rd-rsvp__row">
                          <div className="rd-rsvp__field">
                            <label htmlFor="rd-rsvp-adults">
                              Adultos confirmados (Máx. {maxAdults})
                            </label>
                            <select
                              id="rd-rsvp-adults"
                              value={adults}
                              onChange={(e) =>
                                setAdults(Number(e.target.value))
                              }
                            >
                              {Array.from(
                                { length: maxAdults },
                                (_, idx) => idx + 1
                              ).map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'Adulto' : 'Adultos'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {content.rsvp.allowChildrenSelection &&
                            maxChildren > 0 && (
                              <div className="rd-rsvp__field">
                                <label htmlFor="rd-rsvp-children">
                                  Niños confirmados (Máx. {maxChildren})
                                </label>
                                <select
                                  id="rd-rsvp-children"
                                  value={children}
                                  onChange={(e) =>
                                    setChildren(Number(e.target.value))
                                  }
                                >
                                  {Array.from(
                                    { length: maxChildren + 1 },
                                    (_, idx) => idx
                                  ).map((n) => (
                                    <option key={n} value={n}>
                                      {n} {n === 1 ? 'Niño' : 'Niños'}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                        </div>

                        {content.rsvp.askDietaryRestrictions && (
                          <div className="rd-rsvp__field">
                            <label htmlFor="rd-rsvp-diet">
                              Restricciones alimentarias (opcional)
                            </label>
                            <input
                              id="rd-rsvp-diet"
                              type="text"
                              value={dietaryNotes}
                              onChange={(e) => setDietaryNotes(e.target.value)}
                              placeholder="Ej. Menú vegetariano, alergia..."
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="rd-rsvp__field">
                      <label htmlFor="rd-rsvp-message">
                        Nota o canción sugerida para {coupleDisplay} (opcional)
                      </label>
                      <textarea
                        id="rd-rsvp-message"
                        rows={3}
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Escribe tus buenos deseos o la canción que no puede faltar..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="rd-button rd-button--primary rd-button--full"
                    >
                      <Ticket size={16} />
                      <span>
                        {willAttend === 'yes'
                          ? 'Confirmar asistencia y generar boleto QR'
                          : 'Enviar respuesta'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="rd-rsvp__confirmed">
                    <div className="rd-rsvp__confirmed-badge">
                      <Check size={16} />
                      <span>BOLETO CONFIRMADO</span>
                    </div>
                    <h3>{generatedPass.groupName}</h3>
                    <p className="rd-rsvp__confirmed-meta">
                      <Users size={15} />
                      <span>
                        {generatedPass.adults} Adultos
                        {generatedPass.children > 0
                          ? ` · ${generatedPass.children} Niños`
                          : ''}{' '}
                        · {generatedPass.tableName}
                      </span>
                    </p>

                    <div className="rd-rsvp__qr-box">
                      <QRCodeSVG
                        value={generatedPass.qrPayload}
                        size={176}
                        level="M"
                      />
                    </div>

                    <p className="rd-rsvp__confirmed-note">
                      {content.rsvp.customConfirmationMessage}
                    </p>

                    <button
                      type="button"
                      onClick={() => setGeneratedPass(null)}
                      className="rd-button rd-button--ghost"
                    >
                      Modificar mi confirmación
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER CENTRADO ESTILO SELLO DISCOGRÁFICO */}
      <footer className="rd-footer">
        <div
          className="rd-footer__vinyl"
          onClick={deck.togglePlay}
          role="button"
          tabIndex={0}
          aria-label="Alternar reproducción del vinilo"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              deck.togglePlay();
            }
          }}
        >
          <VinylRecordDisc monogram={envelope.sealMonogram || 'M&P'} />
        </div>
        <span className="rd-footer__kicker">
          RITMO DE DOS · SESIÓN EN VIVO {deck.rpm} RPM
        </span>
        <strong>{coupleDisplay}</strong>
        <p>
          {dateLabel} · {mainLocation?.venueName || content.hero.tagline}
        </p>
        <a href="#rd-hero" className="rd-footer__top">
          Volver al Lado A ↑
        </a>
      </footer>
    </div>
  );
}
