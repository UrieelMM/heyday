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
  Gift,
  Hotel,
  MapPin,
  MapPinned,
  Music2,
  Orbit,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  Volume2,
} from 'lucide-react';
import { sectionHeading } from '@/lib/templates/section-heading';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { buildGoogleCalendarUrl, buildIcsFileContent } from '@/lib/calendar/ics-generator';
import { createDefaultInvitationConfig } from '@/lib/templates/templates-catalog';
import { AmbientParticlesCanvas } from '../core/AmbientParticlesCanvas';
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import { HeroMedia } from '../core/HeroMedia';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';
import './mini-cosmos.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface MiniCosmosProps {
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

const extractExplorerName = (title: string) =>
  title.replace(/^¡?(.+?)\s+cumple\s+#?\d+!?$/i, '$1').trim() || title;

const extractAgeNumber = (title: string) => {
  const match = title.match(/cumple\s+#?(\d+)/i) || title.match(/\b(\d{1,2})\b/);
  return match ? match[1] : '06';
};

/**
 * Upgrades unmodified legacy SVG seed paths or single-item defaults to the rich
 * Mini Cosmos illustrations while preserving 100% of user/editor customizations.
 */
function cosmosContent(config: InvitationConfig) {
  const source = config.content;
  const defaults = createDefaultInvitationConfig('mini-cosmos', source.hero.mainTitle || 'Leo cumple 6').content;

  const isLegacyCover =
    !source.hero.coverImageUrl ||
    source.hero.coverImageUrl === '/images/mini-cosmos/cover.svg';

  const isLegacyGallery =
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

/**
 * Symmetrical, mathematically balanced vector Mission Rocket (`viewBox="0 0 240 340"`, center x = 120).
 * Replaces the old deformed path rocket with a clean 3D-inspired cartoon spacecraft.
 */
function MissionRocket({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      className={`mc-rocket-svg ${className}`}
      viewBox="0 0 240 340"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`hull-${uid}`} x1="60" y1="30" x2="185" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="58%" stopColor="#F6EFE0" />
          <stop offset="100%" stopColor="#DECFAF" />
        </linearGradient>
        <linearGradient id={`nose-${uid}`} x1="80" y1="24" x2="165" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9E75" />
          <stop offset="55%" stopColor="#E0633E" />
          <stop offset="100%" stopColor="#B44D2E" />
        </linearGradient>
        <linearGradient id={`ring-${uid}`} x1="76" y1="120" x2="164" y2="205" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8F2E6" />
          <stop offset="100%" stopColor="#65B8A7" />
        </linearGradient>
        <linearGradient id={`flame-${uid}`} x1="120" y1="276" x2="120" y2="338" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF6B3" />
          <stop offset="48%" stopColor="#FF964F" />
          <stop offset="100%" stopColor="#E0533C" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Pluma de propulsión simétrica */}
      <g className="mc-rocket-svg__flame">
        <path
          d="M120 272C96 292 92 320 120 338C148 320 144 292 120 272Z"
          fill={`url(#flame-${uid})`}
        />
        <path
          d="M120 275C105 290 103 310 120 324C137 310 135 290 120 275Z"
          fill="#FFF9CC"
        />
      </g>

      {/* Aletas laterales simétricas (izquierda y derecha espejo respecto a x=120) */}
      <path
        d="M62 186L20 242C12 252 21 267 34 263L76 250Z"
        fill={`url(#nose-${uid})`}
        stroke="#0E1836"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M178 186L220 242C228 252 219 267 206 263L164 250Z"
        fill={`url(#nose-${uid})`}
        stroke="#0E1836"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Tobera de escape */}
      <rect
        x="88"
        y="258"
        width="64"
        height="20"
        rx="7"
        fill="#53688E"
        stroke="#0E1836"
        strokeWidth="5"
      />

      {/* Fuselaje principal simétrico */}
      <path
        d="M120 22C72 72 52 142 52 210C52 234 59 252 68 262H172C181 252 188 234 188 210C188 142 168 72 120 22Z"
        fill={`url(#hull-${uid})`}
        stroke="#0E1836"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />

      {/* Cono superior */}
      <path
        d="M120 22C91 52 72 90 62 124H178C168 90 149 52 120 22Z"
        fill={`url(#nose-${uid})`}
        stroke="#0E1836"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />

      {/* Franja orbital menta */}
      <path d="M64 124H176" stroke="#8AD6C5" strokeWidth="8" strokeLinecap="round" />
      <path d="M62 238H178" stroke="#8AD6C5" strokeWidth="9" strokeLinecap="round" />

      {/* Brillo especular lateral izquierdo */}
      <path
        d="M84 140C76 168 74 196 77 222"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Escotilla circular con remaches simétricos */}
      <circle
        cx="120"
        cy="172"
        r="36"
        fill={`url(#ring-${uid})`}
        stroke="#0E1836"
        strokeWidth="5"
      />
      <circle
        cx="120"
        cy="172"
        r="24"
        fill="#162955"
        stroke="#0E1836"
        strokeWidth="4"
      />
      <path
        d="M106 158C111 153 119 151 127 153"
        stroke="#F9F5E9"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="131" cy="181" r="3" fill="#8AD6C5" opacity="0.65" />

      {/* Aleta central dorsal */}
      <rect
        x="112"
        y="216"
        width="16"
        height="50"
        rx="8"
        fill={`url(#nose-${uid})`}
        stroke="#0E1836"
        strokeWidth="4.5"
      />
    </svg>
  );
}

/**
 * 3D-styled Ringed Planet SVG with back/front ring layering.
 */
function RingedPlanet({
  className = '',
  variant = 'mint',
}: {
  className?: string;
  variant?: 'mint' | 'terracotta';
}) {
  const uid = useId().replace(/:/g, '');
  const isMint = variant === 'mint';
  return (
    <svg className={`mc-planet-svg ${className}`} viewBox="0 0 220 160" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`planet-${uid}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={isMint ? '#C8F7EC' : '#FFC09F'} />
          <stop offset="55%" stopColor={isMint ? '#8AD6C5' : '#E56B45'} />
          <stop offset="100%" stopColor={isMint ? '#3E8779' : '#8F3519'} />
        </radialGradient>
      </defs>
      <g transform="rotate(-16 110 80)">
        {/* Arco trasero del anillo */}
        <path
          d="M16 80A94 26 0 0 1 204 80"
          stroke={isMint ? '#FF9B73' : '#8AD6C5'}
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Esfera del planeta */}
        <circle cx="110" cy="80" r="48" fill={`url(#planet-${uid})`} stroke="#0E1836" strokeWidth="4" />
        {/* Bandas atmosféricas */}
        <path
          d="M70 66C92 56 128 56 150 66"
          stroke="#F9F5E9"
          strokeOpacity="0.4"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M68 94C94 86 126 86 152 94"
          stroke="#0E1836"
          strokeOpacity="0.2"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Arco delantero del anillo */}
        <path
          d="M204 80A94 26 0 0 1 16 80"
          stroke={isMint ? '#FF9B73' : '#8AD6C5'}
          strokeWidth="12"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * Circular rotating text seal inspired by ywstudio.com.mx.
 */
function RotatingMissionSeal({ text, className = '' }: { text: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`mc-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="mc-seal__spinner">
        <defs>
          <path
            id={`seal-circle-${uid}`}
            d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0"
          />
        </defs>
        <text className="mc-seal__text" letterSpacing="4.2">
          <textPath href={`#seal-circle-${uid}`}>{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Geometric Constellation SVG backdrop inspired by urieel.dev Manifesto section.
 */
function ConstellationBackdrop() {
  return (
    <svg
      className="mc-constellation"
      viewBox="-320 -320 640 640"
      fill="none"
      aria-hidden="true"
    >
      <circle r="280" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.2" strokeDasharray="6 10" />
      <circle
        r="210"
        className="mc-draw-path"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <circle r="135" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
      <path
        className="mc-draw-path"
        d="M-190 -80 L-70 -165 L65 -120 L185 -40 L110 130 L-45 170 L-160 75 Z"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path
        className="mc-draw-path"
        d="M-240 0 H240 M0 -240 V240"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
      {[
        [-190, -80],
        [-70, -165],
        [65, -120],
        [185, -40],
        [110, 130],
        [-45, 170],
        [-160, 75],
      ].map(([cx, cy], idx) => (
        <g key={idx} transform={`translate(${cx} ${cy})`}>
          <circle r="5" fill="var(--mc-mint)" />
          <circle r="11" stroke="var(--mc-mint)" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

function StarSparkle({ className = '' }: { className?: string }) {
  return (
    <svg className={`mc-sparkle ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 0C17.8 9.2 22.8 14.2 32 16C22.8 17.8 17.8 22.8 16 32C14.2 22.8 9.2 17.8 0 16C9.2 14.2 14.2 9.2 16 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  code,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  code?: string;
}) {
  return (
    <header className="mc-section-header mc-reveal">
      <div className="mc-section-header__pill">
        {code && <span className="mc-section-header__code">{code}</span>}
        <StarSparkle className="mc-section-header__star" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="mc-section-header__title">{title}</h2>
      {subtitle && <p className="mc-section-header__subtitle">{subtitle}</p>}
      <div className="mc-section-header__Rule" aria-hidden="true">
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
    <div className={`mc-marquee${reverse ? ' mc-marquee--reverse' : ''}`} aria-hidden="true">
      <div className="mc-marquee__track">
        {repeated.map((item, idx) => (
          <span className="mc-marquee__item" key={`${item}-${idx}`}>
            <span>{item}</span>
            <StarSparkle className="mc-marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Opening({
  config,
  guestGroup,
  explorerName,
  ageNumber,
  dateLabel,
  isOpen,
  onOpen,
}: {
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  explorerName: string;
  ageNumber: string;
  dateLabel: string;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [launching, setLaunching] = useState(false);

  const handleLaunch = () => {
    if (launching) return;
    setLaunching(true);
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.62 },
        colors: [
          config.theme.colors.accentPrimary,
          config.theme.colors.accentSecondary,
          '#FFD479',
          '#FFFFFF',
        ],
      });
    } catch {
      // Safe fallback in headless environments
    }
    window.setTimeout(() => {
      onOpen();
      setLaunching(false);
    }, 920);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="mc-opening"
          data-editor-section="envelope"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mc-opening__stars" aria-hidden="true" />
          <div className="mc-opening__orbit mc-opening__orbit--one" aria-hidden="true" />
          <div className="mc-opening__orbit mc-opening__orbit--two" aria-hidden="true" />

          <RingedPlanet className="mc-opening__planet" variant="mint" />
          <motion.div
            className="mc-opening__floating-rocket"
            animate={
              launching
                ? { y: -420, x: 120, scale: 1.25, rotate: 18, opacity: 0 }
                : { y: [0, -10, 0], rotate: [-4, 4, -4] }
            }
            transition={
              launching
                ? { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <MissionRocket />
          </motion.div>

          <motion.div
            className="mc-opening__pass"
            animate={
              launching
                ? { y: 36, scale: 0.94, opacity: 0 }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-opening__pass-top">
              <span className="mc-opening__telemetry">
                <i aria-hidden="true" /> PASE DE ABORDAJE · VUELO #{ageNumber}
              </span>
              <span className="mc-opening__seal-badge">
                {config.theme.envelope.sealMonogram || '★'}
              </span>
            </div>

            <p className="mc-opening__kicker">{config.content.hero.badgeText || 'MISIÓN CUMPLEAÑOS'}</p>
            <h1 className="mc-opening__title">{config.content.hero.mainTitle}</h1>
            <p className="mc-opening__subtitle">
              La nave de <strong>{explorerName}</strong> está lista para despegar hacia una nueva vuelta al sol.
            </p>

            <div className="mc-opening__perforation" aria-hidden="true">
              <span className="mc-opening__notch mc-opening__notch--left" />
              <span className="mc-opening__dashes" />
              <span className="mc-opening__notch mc-opening__notch--right" />
            </div>

            <div className="mc-opening__ticket-Stub">
              <div className="mc-opening__recipient">
                <span>TRIPULACIÓN INVITADA</span>
                <strong>
                  {guestGroup?.groupName || 'Astronauta de Honor y Familia'}
                </strong>
                <small>
                  {guestGroup
                    ? `${guestGroup.allocatedAdults + guestGroup.allocatedChildren} lugares reservados en cabina`
                    : dateLabel || 'Coordenadas confirmadas'}
                </small>
              </div>

              <motion.button
                type="button"
                className="mc-button mc-button--launch"
                disabled={launching}
                onClick={handleLaunch}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket className="mc-button__icon" />
                <span>{config.theme.envelope.openButtonText || 'Abre tu pase de misión'}</span>
                <ArrowRight className="mc-button__arrow" />
              </motion.button>

              {config.audio.enabled && (
                <p className="mc-opening__audio">
                  <Volume2 size={14} /> Incluye transmisión musical
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MiniCosmosExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: MiniCosmosProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(
    forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope)
  );
  const [copiedClabe, setCopiedClabe] = useState(false);
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
  const [children, setChildren] = useState(guestGroup ? guestGroup.allocatedChildren : 1);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [generatedPass, setGeneratedPass] = useState<{
    qrPayload: string;
    groupName: string;
    adults: number;
    children: number;
    tableName: string;
  } | null>(null);

  const content = useMemo(() => cosmosContent(config), [config]);
  const { colors, fonts, envelope } = config.theme;
  const explorerName = extractExplorerName(content.hero.mainTitle);
  const ageNumber = extractAgeNumber(content.hero.mainTitle);
  const dateLabel = formatDate(eventDate);

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

      // Barra superior de progreso de misión
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

      // 1. HERO EN DOS TIEMPOS: Escotilla orbital -> Expansión cosmos + Despegue del cohete
      const hero = root.querySelector<HTMLElement>('.mc-hero');
      const heroCopy = root.querySelector<HTMLElement>('.mc-hero__copy');
      const heroVisual = root.querySelector<HTMLElement>('.mc-hero__visual');
      const heroRocket = root.querySelector<HTMLElement>('.mc-hero__rocket');
      const heroWatermark = root.querySelector<HTMLElement>('.mc-hero__watermark');
      const heroReveal = root.querySelector<HTMLElement>('.mc-hero__reveal');
      const heroRings = root.querySelector<HTMLElement>('.mc-hero__rings');
      const heroScrollHint = root.querySelector<HTMLElement>('.mc-hero__scroll-hint');

      if (hero && heroCopy && heroVisual) {
        gsap.fromTo(
          root.querySelectorAll('.mc-hero__animate-in'),
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
            0.06
          )
          .to(
            heroVisual.querySelectorAll('img, video'),
            { scale: 1.1, duration: 0.95 },
            0.06
          );

        if (heroRings) {
          heroTl.to(heroRings, { scale: 1.45, opacity: 0, duration: 0.65 }, 0.04);
        }
        if (heroWatermark) {
          heroTl.to(
            heroWatermark,
            { scale: 1.38, rotate: -14, opacity: 0, duration: 0.75 },
            0
          );
        }
        if (heroRocket) {
          heroTl.to(
            heroRocket,
            {
              xPercent: 135,
              yPercent: -175,
              rotate: 24,
              scale: 1.3,
              opacity: 0,
              duration: 0.78,
            },
            0.02
          );
        }
        if (heroScrollHint) {
          heroTl.to(heroScrollHint, { opacity: 0, duration: 0.25 }, 0);
        }
        if (heroReveal) {
          heroTl.fromTo(
            heroReveal,
            { y: 44, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.36 },
            0.62
          );
        }
      }

      // Encabezados de sección con escala editorial ligada al scroll
      root.querySelectorAll<HTMLElement>('.mc-section-header__title').forEach((title) => {
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

      // 2. BITÁCORA DE MISIÓN: Constelación dibujada + palabras iluminadas por scroll
      const constellation = root.querySelector<SVGElement>('.mc-constellation');
      if (constellation) {
        gsap.fromTo(
          constellation,
          { scale: 0.76, rotate: -18, opacity: 0.25 },
          {
            scale: 1.06,
            rotate: 12,
            opacity: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: '.mc-story',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
              ...scrollerOption,
            },
          }
        );
        constellation.querySelectorAll<SVGGeometryElement>('.mc-draw-path').forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 900;
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.mc-story',
                start: 'top 82%',
                end: 'center 42%',
                scrub: 0.8,
                ...scrollerOption,
              },
            }
          );
        });
      }

      const storyWords = root.querySelectorAll<HTMLElement>('.mc-story__word');
      const storyQuote = root.querySelector<HTMLElement>('.mc-story__quote');
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

      // Tarjetas de historia con perspectiva 3D
      root.querySelectorAll<HTMLElement>('.mc-story__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            y: 68,
            rotate: idx % 2 === 0 ? -4 : 4,
            scale: 0.91,
            opacity: 0.35,
          },
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

      // 3. ESTACIONES DE EXPLORACIÓN: Tarjetas apiladas / Bento con profundidad
      root.querySelectorAll<HTMLElement>('.mc-mission-card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            y: 72,
            scale: 0.92,
            rotateX: 10,
            opacity: 0.35,
          },
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

      // 4. TRIPULACIÓN ANFITRIONA
      root.querySelectorAll<HTMLElement>('.mc-family__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            y: 74,
            rotate: idx % 2 === 0 ? -5 : 5,
            scale: 0.9,
            opacity: 0.3,
          },
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

      // 5. CONSOLA DE CUENTA REGRESIVA
      const countdownPods = root.querySelectorAll<HTMLElement>('.mc-countdown__pod');
      const countdownGrid = root.querySelector<HTMLElement>('.mc-countdown__grid');
      if (countdownGrid && countdownPods.length) {
        gsap.fromTo(
          countdownPods,
          { y: 56, scale: 0.76, rotate: -10, opacity: 0.2 },
          {
            y: 0,
            scale: 1,
            rotate: 0,
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

      // 6. BASE ESPACIAL: Apertura de máscara en arco/ventana
      root.querySelectorAll<HTMLElement>('.mc-location-card__media').forEach((media) => {
        gsap.fromTo(
          media,
          {
            clipPath: 'inset(14% 12% 14% 12% round 42px)',
            scale: 0.92,
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
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

      // 7. PLAN DE VUELO: Línea de trayectoria + cohete viajero
      const timelineTrack = root.querySelector<HTMLElement>('.mc-timeline__track');
      const timelineProgress = root.querySelector<HTMLElement>('.mc-timeline__progress');
      const timelineRocket = root.querySelector<HTMLElement>('.mc-timeline__rocket-runner');
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
      if (timelineTrack && timelineRocket) {
        gsap.fromTo(
          timelineRocket,
          { top: '0%' },
          {
            top: '94%',
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
      root.querySelectorAll<HTMLElement>('.mc-timeline__item').forEach((item, idx) => {
        gsap.fromTo(
          item,
          {
            x: idx % 2 === 0 ? -36 : 36,
            y: 28,
            opacity: 0.3,
          },
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

      // 8. GALERÍA DE EXPLORACIONES
      root.querySelectorAll<HTMLElement>('.mc-gallery__card').forEach((photo, idx) => {
        gsap.fromTo(
          photo,
          {
            y: 84 + idx * 12,
            x: idx % 2 === 0 ? -28 : 28,
            rotate: idx % 2 === 0 ? -7 : 7,
            scale: 0.9,
            opacity: 0.3,
          },
          {
            y: 0,
            x: 0,
            rotate: idx % 2 === 0 ? -1.5 : 1.5,
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

      // 9. EQUIPO DE EXPLORACIÓN (DRESS CODE)
      root.querySelectorAll<HTMLElement>('.mc-dress__card').forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            y: 64,
            rotateY: idx === 0 ? -16 : 16,
            opacity: 0.3,
          },
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

      // 10. PASE DE ABORDAJE (RSVP): Completa su entrada antes de que el usuario escriba
      const rsvpPass = root.querySelector<HTMLElement>('.mc-rsvp__pass');
      if (rsvpPass) {
        gsap.fromTo(
          rsvpPass,
          { y: 60, scale: 0.92, opacity: 0.45 },
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

      // Parallax suave en planetas y ornamentos flotantes
      root.querySelectorAll<HTMLElement>('.mc-parallax').forEach((ornament, idx) => {
        gsap.fromTo(
          ornament,
          { y: -26, rotate: idx % 2 === 0 ? -8 : 8 },
          {
            y: 26,
            rotate: idx % 2 === 0 ? 8 : -8,
            ease: 'none',
            scrollTrigger: {
              trigger: ornament.parentElement || ornament,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.85,
              ...scrollerOption,
            },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [isOpen, isBuilderPreview, sectionSignature] }
  );

  const openInvitation = useCallback(() => setIsOpen(true), []);

  const mainLocation = content.locations[0];
  const calendarUrl = buildGoogleCalendarUrl({
    title: content.hero.mainTitle,
    description: `Misión Cumpleaños: ${content.hero.mainTitle}`,
    location: mainLocation?.address || content.hero.tagline,
    startDateIso: eventDate,
  });

  const handleDownloadIcs = () => {
    const ics = buildIcsFileContent({
      title: content.hero.mainTitle,
      description: `Misión Cumpleaños: ${content.hero.mainTitle}`,
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
        tableName: result.pass.tableName || 'Base Espacial · Mesa asignada',
      });
      toast.success('¡Pase de misión confirmado!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo guardar tu confirmación'
      );
    }
  };

  const missionStations = [
    {
      code: 'ESTACIÓN 01',
      title: 'Acreditación de Astronautas',
      description:
        'Al cruzar la escotilla recibirás tu insignia oficial y coordenadas para iniciar la aventura.',
      image: '/images/mini-cosmos/astronaut.jpg',
      tag: 'BIENVENIDA',
    },
    {
      code: 'ESTACIÓN 02',
      title: 'Zona de Gravedad Cero',
      description:
        'Juegos interactivos, misiones en equipo y circuitos espaciales para explorar sin parar.',
      image: '/images/mini-cosmos/play.jpg',
      tag: 'JUEGOS Y AVENTURA',
    },
    {
      code: 'ESTACIÓN 03',
      title: 'Órbita de Nuevos Mundos',
      description:
        'Recarga de energía con comida deliciosa, mesa de snacks galácticos y sorpresas para todos.',
      image: '/images/mini-cosmos/planets.jpg',
      tag: 'ENERGÍA AL 100%',
    },
    {
      code: 'ESTACIÓN 04',
      title: 'Supernova del Pastel',
      description:
        'Nos reunimos frente al pastel cohete para cantar las mañanitas y pedir deseos alrededor del sol.',
      image: '/images/mini-cosmos/cake.jpg',
      tag: 'GRAN MOMENTO',
    },
  ];

  const primaryActionHref = enabled('quote_story')
    ? '#mc-story'
    : enabled('locations')
      ? '#mc-locations'
      : enabled('rsvp')
        ? '#mc-rsvp'
        : '#mc-hero';

  return (
    <div
      ref={rootRef}
      className="mc-root"
      style={
        {
          '--mc-bg': colors.bgPrimary,
          '--mc-bg-2': colors.bgSecondary,
          '--mc-text': colors.textPrimary,
          '--mc-muted': colors.textMuted,
          '--mc-accent': colors.accentPrimary,
          '--mc-mint': colors.accentSecondary,
          '--mc-seal': envelope.sealColor || colors.accentPrimary,
          '--mc-heading-font': invitationFontStack(fonts.headingFont),
          '--mc-script-font': invitationFontStack(fonts.scriptFont),
          '--mc-body-font': invitationFontStack(fonts.bodyFont),
        } as React.CSSProperties
      }
    >
      {/* 1. SOBRE / PASE DE ABORDAJE INTERACTIVO */}
      {(!isBuilderPreview || previewEnvelope) && (
        <Opening
          config={config}
          guestGroup={guestGroup}
          explorerName={explorerName}
          ageNumber={ageNumber}
          dateLabel={dateLabel}
          isOpen={isOpen}
          onOpen={openInvitation}
        />
      )}

      {/* 2. PARTÍCULAS AMBIENTALES + AUDIO */}
      <AmbientParticlesCanvas
        effect={config.theme.ambientEffect}
        accentColor={colors.accentSecondary}
      />
      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isOpen}
        accentColor={colors.accentPrimary}
      />

      {/* 3. BARRA DE TELEMETRÍA + NAVEGACIÓN FLOTANTE */}
      <div className="mc-progress" aria-hidden="true">
        <div ref={progressRef} className="mc-progress__fill" />
      </div>

      <header className="mc-nav">
        <a href="#mc-hero" className="mc-nav__brand">
          <span className="mc-nav__badge">{envelope.sealMonogram || '★'}</span>
          <span className="mc-nav__title">{content.hero.mainTitle}</span>
        </a>
        <nav className="mc-nav__links" aria-label="Secciones de la misión">
          {enabled('quote_story') && <a href="#mc-story">Bitácora</a>}
          <a href="#mc-missions">Misiones</a>
          {enabled('locations') && <a href="#mc-locations">Base</a>}
          {enabled('timeline') && <a href="#mc-timeline">Vuelo</a>}
          {enabled('rsvp') && (
            <a href="#mc-rsvp" className="mc-nav__cta">
              <span>Abordar</span>
              <Rocket size={13} />
            </a>
          )}
        </nav>
      </header>

      <main>
        {/* SECCIÓN 1: HERO STICKY EN DOS TIEMPOS */}
        {enabled('hero') && (
          <section
            id="mc-hero"
            data-editor-section="hero"
            className="mc-hero"
            aria-label="Portada de la invitación"
          >
            <div className="mc-hero__stage">
              <div className="mc-hero__field" aria-hidden="true" />
              <div className="mc-hero__watermark" aria-hidden="true">
                {ageNumber}
              </div>

              <RingedPlanet className="mc-hero__planet mc-hero__planet--top" variant="mint" />
              <RingedPlanet
                className="mc-hero__planet mc-hero__planet--bottom"
                variant="terracotta"
              />

              {/* Anillos orbitales concéntricos detrás de la escotilla */}
              <div className="mc-hero__rings" aria-hidden="true">
                <span className="mc-hero__ring mc-hero__ring--outer" />
                <span className="mc-hero__ring mc-hero__ring--inner" />
                <RotatingMissionSeal
                  text={`MISIÓN CUMPLEAÑOS ★ ${explorerName.toUpperCase()} ★ VUELTA AL SOL #${ageNumber} ★ `}
                  className="mc-hero__seal"
                />
              </div>

              {/* Cohete simétrico que despega con el scroll */}
              <div className="mc-hero__rocket" aria-hidden="true">
                <MissionRocket />
                <span className="mc-hero__rocket-trail" />
              </div>

              {/* Escotilla circular que se expande a pantalla completa */}
              <div className="mc-hero__visual">
                <HeroMedia
                  hero={content.hero}
                  alt={`Retrato espacial de ${content.hero.mainTitle}`}
                  className="mc-hero__media-img"
                />
                <span className="mc-hero__media-shade" aria-hidden="true" />
              </div>

              {/* Copy centrado en móvil y alineado con precisión en escritorio */}
              <div className="mc-hero__copy">
                <div className="mc-hero__pill mc-hero__animate-in">
                  <span className="mc-hero__pulse" aria-hidden="true" />
                  <span>{content.hero.badgeText}</span>
                </div>

                <h1 className="mc-hero__title mc-hero__animate-in">
                  {content.hero.mainTitle}
                </h1>

                <p className="mc-hero__tagline mc-hero__animate-in">
                  {content.hero.tagline}
                </p>

                <div className="mc-hero__telemetry mc-hero__animate-in">
                  {dateLabel && (
                    <span className="mc-hero__chip">
                      <CalendarDays size={14} />
                      <span>{dateLabel}</span>
                    </span>
                  )}
                  {mainLocation?.time && (
                    <span className="mc-hero__chip">
                      <Clock3 size={14} />
                      <span>{mainLocation.time}</span>
                    </span>
                  )}
                  {mainLocation?.venueName && (
                    <span className="mc-hero__chip">
                      <MapPin size={14} />
                      <span>{mainLocation.venueName}</span>
                    </span>
                  )}
                </div>

                {guestGroup && (
                  <p className="mc-hero__guest mc-hero__animate-in">
                    <Sparkles size={14} />
                    <span>Pase especial para {guestGroup.groupName}</span>
                  </p>
                )}

                <div className="mc-hero__actions mc-hero__animate-in">
                  {enabled('rsvp') && (
                    <a href="#mc-rsvp" className="mc-button mc-button--primary">
                      <Ticket size={16} />
                      <span>Confirmar pase de misión</span>
                    </a>
                  )}
                  {primaryActionHref !== '#mc-hero' && (
                    <a href={primaryActionHref} className="mc-button mc-button--ghost">
                      <span>Explorar bitácora</span>
                      <ArrowDown size={15} />
                    </a>
                  )}
                </div>
              </div>

              {/* Segundo estado que emerge al completar la expansión */}
              <div className="mc-hero__reveal">
                <div className="mc-hero__reveal-card">
                  <img
                    src="/images/mini-cosmos/keyart.jpg"
                    alt=""
                    aria-hidden="true"
                    className="mc-hero__reveal-thumb"
                  />
                  <div className="mc-hero__reveal-body">
                    <span className="mc-hero__reveal-kicker">
                      3, 2, 1… ¡DESPEGAMOS!
                    </span>
                    <p className="mc-hero__reveal-title">
                      {sectionHeading(
                        config,
                        'quote_story',
                        'title',
                        'Una aventura espacial para recordar'
                      )}
                    </p>
                    <a href={primaryActionHref} className="mc-hero__reveal-link">
                      <span>Iniciar recorrido</span>
                      <ArrowDown size={15} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mc-hero__scroll-hint" aria-hidden="true">
                <span>DESLIZA PARA DESPEGAR</span>
                <ArrowDown size={14} />
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA DE TELEMETRÍA 1 */}
        <KineticMarquee
          items={[
            content.hero.badgeText || 'MISIÓN CUMPLEAÑOS',
            content.hero.mainTitle,
            dateLabel || 'PRÓXIMO DESPEGUE',
            mainLocation?.venueName || 'BASE ESPACIAL',
            'JUEGOS · PASTEL ESTELAR · AMIGOS',
          ]}
        />

        {/* SECCIÓN 2: BITÁCORA DE MISIÓN (HISTORIA + CONSTELACIÓN + TARJETAS) */}
        {enabled('quote_story') && (
          <section
            id="mc-story"
            data-editor-section="quoteStory"
            className="mc-story mc-section mc-sheet"
          >
            <ConstellationBackdrop />
            <div className="mc-container">
              <SectionHeader
                code="CAPÍTULO 01"
                eyebrow={sectionHeading(
                  config,
                  'quote_story',
                  'eyebrow',
                  'Bitácora de misión'
                )}
                title={sectionHeading(
                  config,
                  'quote_story',
                  'title',
                  'Una aventura especial'
                )}
              />

              <blockquote
                className="mc-story__quote"
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
                        <span className="mc-story__word" key={`${part}-${idx}`}>
                          {part}
                        </span>
                      )
                    )}
                  ”
                </span>
              </blockquote>

              {content.quoteStory.quoteAuthor && (
                <p className="mc-story__author">
                  <StarSparkle className="mc-story__author-star" />
                  <span>{content.quoteStory.quoteAuthor}</span>
                </p>
              )}

              {content.quoteStory.storyBlocks &&
                content.quoteStory.storyBlocks.length > 0 && (
                  <div className="mc-story__grid">
                    {content.quoteStory.storyBlocks.map((block, idx) => (
                      <article
                        className="mc-story__card"
                        key={`${block.title}-${idx}`}
                      >
                        <div className="mc-story__card-top">
                          <span className="mc-story__phase">
                            FASE 0{idx + 1}
                          </span>
                          <Orbit size={18} className="mc-story__card-icon" />
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

        {/* SECCIÓN 3 (NUEVA): CENTRO DE ENTRENAMIENTO / LAS 4 ESTACIONES DE LA MISIÓN */}
        <section
          id="mc-missions"
          className="mc-missions mc-section"
          aria-labelledby="mc-missions-title"
        >
          <RingedPlanet className="mc-missions__planet mc-parallax" variant="mint" />
          <div className="mc-container">
            <header className="mc-section-header mc-reveal">
              <div className="mc-section-header__pill">
                <span className="mc-section-header__code">CAPÍTULO 02</span>
                <StarSparkle className="mc-section-header__star" />
                <span>CENTRO DE ENTRENAMIENTO</span>
              </div>
              <h2 id="mc-missions-title" className="mc-section-header__title">
                Las 4 estaciones de nuestra misión
              </h2>
              <p className="mc-section-header__subtitle">
                Diseñamos una tarde llena de juegos, exploración y sorpresas para pequeños astronautas y toda la familia.
              </p>
              <div className="mc-section-header__Rule" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>
            </header>

            <div className="mc-missions__grid">
              {missionStations.map((station, idx) => (
                <article
                  key={station.code}
                  className="mc-mission-card"
                  style={{ '--mc-stack-index': idx } as React.CSSProperties}
                >
                  <div className="mc-mission-card__media">
                    <img
                      src={station.image}
                      alt={station.title}
                      loading="lazy"
                    />
                    <span className="mc-mission-card__tag">{station.tag}</span>
                  </div>
                  <div className="mc-mission-card__body">
                    <span className="mc-mission-card__code">{station.code}</span>
                    <h3>{station.title}</h3>
                    <p>{station.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: TRIPULACIÓN ANFITRIONA (PADRES / FAMILIA) */}
        {enabled('vip_parents') && content.vipParents.groups.length > 0 && (
          <section
            id="mc-family"
            data-editor-section="vipParents"
            className="mc-family mc-section mc-sheet"
          >
            <div className="mc-container">
              <SectionHeader
                code="CAPÍTULO 03"
                eyebrow={sectionHeading(
                  config,
                  'vip_parents',
                  'eyebrow',
                  'Tripulación'
                )}
                title={sectionHeading(
                  config,
                  'vip_parents',
                  'title',
                  'Quienes celebramos'
                )}
                subtitle={content.vipParents.blessingMessage}
              />

              <div className="mc-family__grid">
                {content.vipParents.groups.map((group, idx) => (
                  <article
                    className="mc-family__card"
                    key={`${group.groupTitle}-${idx}`}
                  >
                    <div className="mc-family__badge">
                      <Star size={15} />
                      <span>RANGO 0{idx + 1}</span>
                    </div>
                    <h3>{group.groupTitle}</h3>
                    <div className="mc-family__names">
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

        {/* SECCIÓN 5: CONSOLA DE CUENTA REGRESIVA */}
        {enabled('countdown') && (
          <section
            id="mc-countdown"
            data-editor-section="countdown"
            className="mc-countdown mc-section"
          >
            <div className="mc-container">
              <SectionHeader
                code="TELEMETRÍA T-MINUS"
                eyebrow={sectionHeading(
                  config,
                  'countdown',
                  'eyebrow',
                  'Cuenta de despegue'
                )}
                title={sectionHeading(
                  config,
                  'countdown',
                  'title',
                  'La misión empieza en'
                )}
              />

              <div className="mc-countdown__console">
                <div className="mc-countdown__status">
                  <span className="mc-countdown__dot" aria-hidden="true" />
                  <span>SISTEMAS DE PROPULSIÓN LISTOS · {dateLabel}</span>
                </div>

                <div
                  className="mc-countdown__grid"
                  aria-label="Cuenta regresiva para el evento"
                >
                  {[
                    { code: 'T-D', label: 'Días', value: timeLeft.days },
                    { code: 'T-H', label: 'Horas', value: timeLeft.hours },
                    { code: 'T-M', label: 'Minutos', value: timeLeft.minutes },
                    { code: 'T-S', label: 'Segundos', value: timeLeft.seconds },
                  ].map((unit) => (
                    <div className="mc-countdown__pod" key={unit.label}>
                      <small>{unit.code}</small>
                      <strong>{String(unit.value).padStart(2, '0')}</strong>
                      <span>{unit.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mc-countdown__actions">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mc-button mc-button--primary"
                  >
                    <CalendarDays size={16} />
                    <span>Agendar en Google Calendar</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="mc-button mc-button--ghost"
                  >
                    <CalendarDays size={16} />
                    <span>Apple Calendar / Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 6: BASE ESPACIAL Y COORDENADAS */}
        {enabled('locations') && content.locations.length > 0 && (
          <section
            id="mc-locations"
            data-editor-section="locations"
            className="mc-locations mc-section mc-sheet"
          >
            <div className="mc-container">
              <SectionHeader
                code="COORDENADAS GPS"
                eyebrow={sectionHeading(
                  config,
                  'locations',
                  'eyebrow',
                  'Base espacial'
                )}
                title={sectionHeading(
                  config,
                  'locations',
                  'title',
                  'Punto de encuentro'
                )}
                subtitle="Revisa el mapa y elige tu app de navegación favorita para aterrizar directo en la fiesta."
              />

              <div className="mc-locations__list">
                {content.locations.map((loc, idx) => {
                  const mapQuery = encodeURIComponent(
                    `${loc.venueName}, ${loc.address}`
                  );
                  return (
                    <article className="mc-location-card" key={loc.id || idx}>
                      <div className="mc-location-card__visual-col">
                        <div className="mc-location-card__media">
                          <img
                            src={loc.imageUrl || '/images/mini-cosmos/keyart.jpg'}
                            alt={`Ilustración de ${loc.venueName}`}
                            loading="lazy"
                          />
                          <span className="mc-location-card__coord">
                            <Compass size={14} />
                            <span>
                              BASE 0{idx + 1} · {loc.time}
                            </span>
                          </span>
                        </div>

                        <div className="mc-location-card__map">
                          <iframe
                            title={`Mapa de ${loc.venueName}`}
                            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>

                      <div className="mc-location-card__info">
                        <span className="mc-location-card__kicker">
                          <Clock3 size={14} />
                          <span>
                            {loc.time} · {loc.title}
                          </span>
                        </span>

                        <h3>{loc.venueName}</h3>

                        <p className="mc-location-card__address">
                          <MapPin size={17} />
                          <span>{loc.address}</span>
                        </p>

                        <div className="mc-location-card__routes">
                          <a
                            href={loc.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-route-btn mc-route-btn--primary"
                          >
                            <MapPinned size={16} />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href={loc.wazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-route-btn"
                          >
                            <Route size={16} />
                            <span>Waze</span>
                          </a>
                          <a
                            href={`https://maps.apple.com/?daddr=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-route-btn"
                          >
                            <Apple size={16} />
                            <span>Apple Maps</span>
                          </a>
                          <a
                            href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-route-btn"
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

        {/* SECCIÓN 7: PLAN DE VUELO (TIMELINE CON COHETE EN TRAYECTORIA) */}
        {enabled('timeline') && content.timeline.length > 0 && (
          <section
            id="mc-timeline"
            data-editor-section="timeline"
            className="mc-timeline mc-section"
          >
            <div className="mc-container">
              <SectionHeader
                code="BITÁCORA DE VUELO"
                eyebrow={sectionHeading(
                  config,
                  'timeline',
                  'eyebrow',
                  'Plan de vuelo'
                )}
                title={sectionHeading(
                  config,
                  'timeline',
                  'title',
                  'La aventura del día'
                )}
              />

              <div className="mc-timeline__track">
                <div className="mc-timeline__rail" aria-hidden="true">
                  <div className="mc-timeline__progress" />
                  <div className="mc-timeline__rocket-runner">
                    <MissionRocket />
                  </div>
                </div>

                <div className="mc-timeline__items">
                  {content.timeline.map((item, idx) => (
                    <article className="mc-timeline__item" key={item.id || idx}>
                      <div className="mc-timeline__node" aria-hidden="true">
                        <span>0{idx + 1}</span>
                      </div>
                      <div className="mc-timeline__card">
                        <div className="mc-timeline__meta">
                          <span className="mc-timeline__time">{item.time}</span>
                          <span className="mc-timeline__step">
                            FASE 0{idx + 1}
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

        {/* SECCIÓN 8: GALERÍA DE EXPLORACIONES */}
        {enabled('gallery') && content.gallery.images.length > 0 && (
          <section
            id="mc-gallery"
            data-editor-section="gallery"
            className="mc-gallery mc-section mc-sheet"
          >
            <RingedPlanet
              className="mc-gallery__planet mc-parallax"
              variant="terracotta"
            />
            <div className="mc-container">
              <SectionHeader
                code="ARCHIVO VISUAL"
                eyebrow={sectionHeading(
                  config,
                  'gallery',
                  'eyebrow',
                  'Exploraciones'
                )}
                title={sectionHeading(
                  config,
                  'gallery',
                  'title',
                  'Momentos de otro planeta'
                )}
              />

              <div className="mc-gallery__grid">
                {content.gallery.images.map((img, idx) => (
                  <figure
                    className="mc-gallery__card"
                    key={`${img.url}-${idx}`}
                  >
                    <div className="mc-gallery__img-wrap">
                      <img
                        src={img.url}
                        alt={img.caption || `Exploración espacial ${idx + 1}`}
                        loading="lazy"
                      />
                      <span className="mc-gallery__badge">
                        REGISTRO 0{idx + 1}
                      </span>
                    </div>
                    {img.caption && (
                      <figcaption className="mc-gallery__caption">
                        <StarSparkle className="mc-gallery__star" />
                        <span>{img.caption}</span>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA DE TELEMETRÍA 2 */}
        <KineticMarquee
          reverse
          items={[
            'TRAJE DE EXPLORACIÓN LISTO',
            `VUELO #${ageNumber} · ${explorerName.toUpperCase()}`,
            'GRAVEDAD CERO',
            'CONFIRMA TU PASE QR',
          ]}
        />

        {/* SECCIÓN 9: EQUIPO DE EXPLORACIÓN (DRESS CODE) */}
        {enabled('dress_code') && (
          <section
            id="mc-dress"
            data-editor-section="dressCode"
            className="mc-dress mc-section"
          >
            <div className="mc-container">
              <SectionHeader
                code="EQUIPAMIENTO"
                eyebrow={sectionHeading(
                  config,
                  'dress_code',
                  'eyebrow',
                  'Equipo de exploración'
                )}
                title={sectionHeading(
                  config,
                  'dress_code',
                  'title',
                  content.dressCode.title || 'Ven listo para jugar'
                )}
                subtitle="Lo más importante es estar cómodos para correr, saltar y disfrutar cada misión."
              />

              <div className="mc-dress__grid">
                <article className="mc-dress__card">
                  <div className="mc-dress__icon-wrap">
                    <Rocket size={22} />
                  </div>
                  <span className="mc-dress__role">PEQUEÑOS ASTRONAUTAS</span>
                  <h3>Niñas y Niños</h3>
                  <p>{content.dressCode.womenNotes}</p>
                </article>

                <article className="mc-dress__card">
                  <div className="mc-dress__icon-wrap">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="mc-dress__role">TRIPULACIÓN ADULTA</span>
                  <h3>Mamás, Papás y Familia</h3>
                  <p>{content.dressCode.menNotes}</p>
                </article>
              </div>

              <div className="mc-dress__checklist mc-reveal">
                <span>
                  <Check size={14} /> Tenis cómodos
                </span>
                <span>
                  <Check size={14} /> Ropa ligera para jugar
                </span>
                <span>
                  <Check size={14} /> Energía al 100%
                </span>
              </div>

              {content.dressCode.reservedColors.length > 0 && (
                <div className="mc-dress__palette mc-reveal">
                  <span className="mc-dress__palette-label">
                    COLORES INSPIRACIÓN DE LA MISIÓN
                  </span>
                  <div className="mc-dress__swatches">
                    {content.dressCode.reservedColors.map((swatch, idx) => (
                      <div
                        className="mc-dress__swatch"
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

        {/* SECCIÓN 10: CÁPSULA DE REGALOS Y SORPRESAS */}
        {enabled('gifts') &&
          (Boolean(content.gifts.introMessage) ||
            content.gifts.registries.length > 0 ||
            Boolean(content.gifts.bankTransfer?.enabled) ||
            content.gifts.cashEnvelopeAtVenue) && (
            <section
              id="mc-gifts"
              data-editor-section="gifts"
              className="mc-gifts mc-section mc-sheet"
            >
              <div className="mc-container">
                <SectionHeader
                  code="CÁPSULA DE DETALLES"
                  eyebrow={sectionHeading(config, 'gifts', 'eyebrow', 'Sorpresas')}
                  title={sectionHeading(config, 'gifts', 'title', 'Regalos')}
                  subtitle={content.gifts.introMessage}
                />

                <div className="mc-gifts__grid">
                  {content.gifts.registries.map((reg, idx) => (
                    <article className="mc-gifts__card" key={`${reg.storeName}-${idx}`}>
                      <Gift size={24} className="mc-gifts__icon" />
                      <span>MESA DE REGALOS</span>
                      <h3>{reg.storeName}</h3>
                      {reg.eventNumber && <p>Evento: {reg.eventNumber}</p>}
                      <a
                        href={reg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mc-button mc-button--primary"
                      >
                        <span>Ver mesa de regalos</span>
                        <ArrowRight size={15} />
                      </a>
                    </article>
                  ))}

                  {content.gifts.bankTransfer?.enabled && (
                    <article className="mc-gifts__card mc-gifts__card--wide">
                      <CreditCard size={24} className="mc-gifts__icon" />
                      <span>TRANSFERENCIA INTERGALÁCTICA</span>
                      <h3>
                        {content.gifts.bankTransfer.bankName} ·{' '}
                        {content.gifts.bankTransfer.accountHolder}
                      </h3>
                      <p className="mc-gifts__clabe">
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
                        className="mc-button mc-button--primary"
                      >
                        {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
                        <span>
                          {copiedClabe ? '¡CLABE copiada!' : 'Copiar CLABE'}
                        </span>
                      </button>
                    </article>
                  )}

                  {content.gifts.cashEnvelopeAtVenue && (
                    <article className="mc-gifts__card">
                      <Gift size={24} className="mc-gifts__icon" />
                      <span>EN LA BASE ESPACIAL</span>
                      <h3>Cápsula de regalos y sobres</h3>
                      <p>
                        En la recepción habrá un buzón especial por si deseas dejar una tarjeta o detalle para {explorerName}.
                      </p>
                    </article>
                  )}
                </div>
              </div>
            </section>
          )}

        {/* SECCIÓN 11: ESTACIÓN DE DESCANSO (HOSPEDAJE) */}
        {enabled('accommodation') && content.accommodation.length > 0 && (
          <section
            id="mc-stay"
            data-editor-section="accommodation"
            className="mc-stay mc-section"
          >
            <div className="mc-container">
              <SectionHeader
                code="HOSPEDAJE"
                eyebrow={sectionHeading(
                  config,
                  'accommodation',
                  'eyebrow',
                  'Estación de descanso'
                )}
                title={sectionHeading(
                  config,
                  'accommodation',
                  'title',
                  'Dónde quedarte'
                )}
              />

              <div className="mc-stay__grid">
                {content.accommodation.map((hotel, idx) => (
                  <article className="mc-stay__card" key={`${hotel.hotelName}-${idx}`}>
                    <Hotel size={22} className="mc-stay__icon" />
                    <h3>{hotel.hotelName}</h3>
                    <p>{hotel.distanceNote}</p>
                    {hotel.discountCode && (
                      <span className="mc-stay__code">
                        Código: {hotel.discountCode}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 12: TRANSMISIÓN GALÁCTICA (ÁLBUM Y MÚSICA) */}
        {enabled('social_features') && (
          <section
            id="mc-social"
            data-editor-section="socialFeatures"
            className="mc-social mc-section"
          >
            <div className="mc-container">
              <SectionHeader
                code="MEMORIA DE MISIÓN"
                eyebrow={sectionHeading(
                  config,
                  'social_features',
                  'eyebrow',
                  'Recuerdos de misión'
                )}
                title={sectionHeading(
                  config,
                  'social_features',
                  'title',
                  'Nuestro álbum espacial'
                )}
                subtitle="Comparte tus fotos favoritas del despegue y ayúdanos a armar la playlist de la fiesta."
              />

              <div className="mc-social__grid">
                <div className="mc-social__panel">
                  <div className="mc-social__panel-head">
                    <Camera size={22} />
                    <span>ÁLBUM DE LA TRIPULACIÓN</span>
                  </div>
                  <h3>Sube tus fotos de la misión</h3>
                  <SharedAlbum
                    slug={slug}
                    token={guestGroup?.guestToken}
                    preview={isBuilderPreview}
                  />
                </div>

                {(content.socialFeatures.enableSongRequests ||
                  content.socialFeatures.enableAudioGuestbook) && (
                  <div className="mc-social__panel">
                    <div className="mc-social__panel-head">
                      <Music2 size={22} />
                      <span>FRECUENCIA MUSICAL</span>
                    </div>
                    <h3>Canciones y mensajes</h3>
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
                <div className="mc-social__hashtag">
                  <Sparkles size={16} />
                  <span>{content.socialFeatures.hashtag}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECCIÓN 13: PASE DE ABORDAJE (RSVP + QR) */}
        {enabled('rsvp') && (
          <section
            id="mc-rsvp"
            data-editor-section="rsvp"
            className="mc-rsvp mc-section mc-sheet"
          >
            <div className="mc-container">
              <SectionHeader
                code="CHECK-IN DE VUELO"
                eyebrow={sectionHeading(
                  config,
                  'rsvp',
                  'eyebrow',
                  'Pase de abordaje'
                )}
                title={sectionHeading(
                  config,
                  'rsvp',
                  'title',
                  'Confirma tu lugar'
                )}
                subtitle={
                  guestGroup
                    ? `Pase personalizado para ${guestGroup.groupName} (${guestGroup.allocatedAdults} adultos${
                        guestGroup.allocatedChildren > 0
                          ? ` y ${guestGroup.allocatedChildren} niños`
                          : ''
                      }).`
                    : 'Usa tu enlace personal para confirmar tu asistencia y generar tu pase QR.'
                }
              />

              <div className="mc-rsvp__pass">
                <div className="mc-rsvp__pass-bar">
                  <span>
                    <Ticket size={15} /> CONTROL DE ABORDAJE · VUELO #{ageNumber}
                  </span>
                  <span>{explorerName.toUpperCase()}</span>
                </div>

                {!generatedPass ? (
                  <form onSubmit={handleSubmitRsvp} className="mc-rsvp__form">
                    <div className="mc-rsvp__field">
                      <label htmlFor="mc-rsvp-name">
                        Nombre de familia o invitado
                      </label>
                      <input
                        id="mc-rsvp-name"
                        type="text"
                        required
                        value={rsvpName}
                        readOnly={Boolean(guestGroup)}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Ej. Familia López García"
                      />
                    </div>

                    <div className="mc-rsvp__row">
                      <div className="mc-rsvp__field">
                        <label htmlFor="mc-rsvp-attend">
                          ¿Se unen a la misión?
                        </label>
                        <select
                          id="mc-rsvp-attend"
                          value={willAttend}
                          onChange={(e) =>
                            setWillAttend(e.target.value as 'yes' | 'no')
                          }
                        >
                          <option value="yes">
                            ¡Sí, listos para despegar!
                          </option>
                          <option value="no">
                            No podremos asistir esta vez
                          </option>
                        </select>
                      </div>

                      <div className="mc-rsvp__field">
                        <label htmlFor="mc-rsvp-phone">Teléfono WhatsApp</label>
                        <input
                          id="mc-rsvp-phone"
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                    </div>

                    {willAttend === 'yes' && (
                      <>
                        <div className="mc-rsvp__row">
                          <div className="mc-rsvp__field">
                            <label htmlFor="mc-rsvp-adults">
                              Adultos confirmados (Máx. {maxAdults})
                            </label>
                            <select
                              id="mc-rsvp-adults"
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
                              <div className="mc-rsvp__field">
                                <label htmlFor="mc-rsvp-children">
                                  Pequeños astronautas (Máx. {maxChildren})
                                </label>
                                <select
                                  id="mc-rsvp-children"
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
                          <div className="mc-rsvp__field">
                            <label htmlFor="mc-rsvp-diet">
                              Alergias o restricciones alimentarias (opcional)
                            </label>
                            <input
                              id="mc-rsvp-diet"
                              type="text"
                              value={dietaryNotes}
                              onChange={(e) => setDietaryNotes(e.target.value)}
                              placeholder="Ej. Alergia a nueces, sin lactosa..."
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="mc-rsvp__field">
                      <label htmlFor="mc-rsvp-message">
                        Mensaje para {explorerName} (opcional)
                      </label>
                      <textarea
                        id="mc-rsvp-message"
                        rows={3}
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Escribe tus mejores deseos para este cumpleaños..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="mc-button mc-button--primary mc-button--full"
                    >
                      <Rocket size={17} />
                      <span>
                        {willAttend === 'yes'
                          ? 'Confirmar asistencia y generar pase QR'
                          : 'Enviar respuesta'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="mc-rsvp__confirmed">
                    <div className="mc-rsvp__confirmed-badge">
                      <Check size={16} />
                      <span>PASE DE ABORDAJE CONFIRMADO</span>
                    </div>
                    <h3>{generatedPass.groupName}</h3>
                    <p className="mc-rsvp__confirmed-meta">
                      <Users size={15} />
                      <span>
                        {generatedPass.adults} Adultos
                        {generatedPass.children > 0
                          ? ` · ${generatedPass.children} Niños`
                          : ''}{' '}
                        · {generatedPass.tableName}
                      </span>
                    </p>

                    <div className="mc-rsvp__qr-box">
                      <QRCodeSVG
                        value={generatedPass.qrPayload}
                        size={176}
                        level="M"
                      />
                    </div>

                    <p className="mc-rsvp__confirmed-note">
                      {content.rsvp.customConfirmationMessage}
                    </p>

                    <button
                      type="button"
                      onClick={() => setGeneratedPass(null)}
                      className="mc-button mc-button--ghost"
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

      {/* FOOTER ESPACIAL CENTRADO */}
      <footer className="mc-footer">
        <div className="mc-footer__rocket" aria-hidden="true">
          <MissionRocket />
        </div>
        <span className="mc-footer__kicker">MISIÓN OFICIAL · VUELO #{ageNumber}</span>
        <strong>{content.hero.mainTitle}</strong>
        <p>
          {dateLabel} · {mainLocation?.venueName || content.hero.tagline}
        </p>
        <a href="#mc-hero" className="mc-footer__top">
          Volver a la plataforma de despegue ↑
        </a>
      </footer>
    </div>
  );
}
