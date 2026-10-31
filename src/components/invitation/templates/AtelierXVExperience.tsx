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
  Crown,
  Gem,
  Gift,
  Hotel,
  MapPin,
  MapPinned,
  Music2,
  Route,
  Scissors,
  Sparkles,
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
import './atelier-xv.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface AtelierXVProps {
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

const extractQuinceName = (title: string) =>
  title.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || title;

/**
 * Upgrades unmodified legacy SVG seed paths ("cover.svg" / "detail.svg") to the new
 * luminous editorial photography while preserving 100% of user/editor customizations.
 */
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

/**
 * Symmetrical Haute-Couture Satin Bow & Diamond Clasp SVG (`viewBox="0 0 260 190"`, center x = 130).
 */
function CoutureBow({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      className={`ax-bow-svg ${className}`}
      viewBox="0 0 260 190"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`silk-${uid}`} x1="30" y1="20" x2="230" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="48%" stopColor="#E6ECF5" />
          <stop offset="100%" stopColor="#9FB1CC" />
        </linearGradient>
        <linearGradient id={`cobalt-${uid}`} x1="65" y1="25" x2="195" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4676C4" />
          <stop offset="100%" stopColor="#1D3B70" />
        </linearGradient>
      </defs>

      {/* Cintas inferiores simétricas */}
      <path
        d="M118 84C92 122 64 154 38 178L76 182C98 154 114 122 126 92Z"
        fill={`url(#silk-${uid})`}
        stroke="#14294C"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M142 84C168 122 196 154 222 178L184 182C162 154 146 122 134 92Z"
        fill={`url(#silk-${uid})`}
        stroke="#14294C"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Lazos superiores simétricos en espejo respecto a x=130 */}
      <path
        d="M130 78C92 22 24 18 18 64C12 104 78 114 130 82Z"
        fill={`url(#silk-${uid})`}
        stroke="#14294C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M130 78C168 22 236 18 242 64C248 104 182 114 130 82Z"
        fill={`url(#silk-${uid})`}
        stroke="#14294C"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Pliegues internos de alta costura */}
      <path
        d="M118 76C86 52 46 52 38 68C48 82 84 86 118 78Z"
        fill={`url(#cobalt-${uid})`}
        opacity="0.24"
      />
      <path
        d="M142 76C174 52 214 52 222 68C212 82 176 86 142 78Z"
        fill={`url(#cobalt-${uid})`}
        opacity="0.24"
      />

      {/* Broche central facetado (Diamante Couture) */}
      <rect
        x="114"
        y="62"
        width="32"
        height="32"
        rx="9"
        fill={`url(#cobalt-${uid})`}
        stroke="#14294C"
        strokeWidth="3"
      />
      <path
        d="M130 67L135 75L143 78L135 81L130 89L125 81L117 78L125 75L130 67Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Circular rotating Haute-Couture Seal with `<textPath>` inspired by ywstudio.com.mx.
 */
function RotatingCoutureSeal({ text, className = '' }: { text: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`ax-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="ax-seal__spinner">
        <defs>
          <path
            id={`ax-seal-path-${uid}`}
            d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0"
          />
        </defs>
        <text className="ax-seal__text" letterSpacing="4.4">
          <textPath href={`#ax-seal-path-${uid}`}>{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Haute-Couture Pattern-Making & Architectural Arch Backdrop (`strokeDashoffset` on scroll).
 */
function AtelierPatternBackdrop() {
  return (
    <svg
      className="ax-pattern-backdrop"
      viewBox="-320 -320 640 640"
      fill="none"
      aria-hidden="true"
    >
      <circle
        r="275"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      <circle
        r="205"
        className="ax-draw-path"
        stroke="currentColor"
        strokeOpacity="0.24"
        strokeWidth="1.4"
      />
      {/* Arco arquitectónico de pasarela */}
      <path
        className="ax-draw-path"
        d="M-150 240 V-30 C-150 -112.843 -82.843 -180 0 -180 C82.843 -180 150 -112.843 150 -30 V240"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.6"
      />
      {/* Diamante de patronaje */}
      <path
        className="ax-draw-path"
        d="M0 -250 L250 0 L0 250 L-250 0 Z"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.2"
      />
      {/* Ejes de corte de atelier */}
      <path
        className="ax-draw-path"
        d="M-280 0 H280 M0 -280 V280"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
    </svg>
  );
}

function CoutureStarburst({ className = '' }: { className?: string }) {
  return (
    <svg className={`ax-starburst ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 0L18.4 12.2L32 16L18.4 19.8L16 32L13.6 19.8L0 16L13.6 12.2L16 0Z"
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
    <header className={`ax-section-header${light ? ' ax-section-header--light' : ''}`}>
      <div className="ax-section-header__pill">
        {code && <span className="ax-section-header__code">{code}</span>}
        <CoutureStarburst className="ax-section-header__star" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="ax-section-header__title">{title}</h2>
      {subtitle && <p className="ax-section-header__subtitle">{subtitle}</p>}
      <div className="ax-section-header__rule" aria-hidden="true">
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
    <div className={`ax-marquee${reverse ? ' ax-marquee--reverse' : ''}`} aria-hidden="true">
      <div className="ax-marquee__track">
        {repeated.map((item, idx) => (
          <span className="ax-marquee__item" key={`${item}-${idx}`}>
            <span>{item}</span>
            <CoutureStarburst className="ax-marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Opening({
  config,
  guestGroup,
  quinceName,
  dateLabel,
  isOpen,
  onOpen,
}: {
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  quinceName: string;
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
        particleCount: 55,
        spread: 68,
        origin: { y: 0.6 },
        colors: [
          config.theme.colors.accentPrimary,
          config.theme.colors.accentSecondary,
          '#FFFFFF',
          '#14294C',
        ],
      });
    } catch {
      // Safe fallback in headless environments
    }
    window.setTimeout(() => {
      onOpen();
      setOpening(false);
    }, 880);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="ax-opening"
          data-editor-section="envelope"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ax-opening__grid" aria-hidden="true" />
          <div className="ax-opening__arch" aria-hidden="true" />

          <motion.div
            className="ax-opening__bow"
            animate={
              opening
                ? { y: -120, scale: 1.15, opacity: 0 }
                : { y: [0, -6, 0] }
            }
            transition={
              opening
                ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <CoutureBow />
          </motion.div>

          <motion.div
            className="ax-opening__portfolio"
            animate={
              opening
                ? { y: 32, scale: 0.95, opacity: 0 }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ax-opening__top">
              <span className="ax-opening__issue">
                <i aria-hidden="true" /> EDICIÓN DE GALA · VOL. XV
              </span>
              <span className="ax-opening__monogram">
                {config.theme.envelope.sealMonogram || 'XV'}
              </span>
            </div>

            <p className="ax-opening__kicker">
              {config.content.hero.badgeText || 'MI EDICIÓN XV'}
            </p>
            <h1 className="ax-opening__title">
              <span>Mis XV</span>
              <em>{quinceName}</em>
            </h1>
            <p className="ax-opening__subtitle">
              Una noche concebida como manifiesto de estilo, luz y celebración contemporánea.
            </p>

            <div className="ax-opening__divider" aria-hidden="true">
              <span />
              <CoutureStarburst />
              <span />
            </div>

            <div className="ax-opening__credential">
              <span>ACREDITACIÓN FRONT ROW</span>
              <strong>
                {guestGroup?.groupName || 'Invitado Especial de Honor'}
              </strong>
              <small>
                {guestGroup
                  ? `${guestGroup.allocatedAdults + guestGroup.allocatedChildren} lugares reservados en lista`
                  : dateLabel || 'Gala Privada · Ciudad de México'}
              </small>
            </div>

            <motion.button
              type="button"
              className="ax-button ax-button--primary ax-button--full"
              disabled={opening}
              onClick={handleOpen}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={16} />
              <span>
                {config.theme.envelope.openButtonText || 'Abrir edición de gala'}
              </span>
              <ArrowRight size={16} />
            </motion.button>

            {config.audio.enabled && (
              <p className="ax-opening__audio">
                <Volume2 size={14} /> Experiencia sonora de pasarela
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AtelierXVExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: AtelierXVProps) {
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

  const content = useMemo(() => atelierContent(config), [config]);
  const { colors, fonts, envelope } = config.theme;
  const quinceName = extractQuinceName(content.hero.mainTitle);
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

      // 1. HERO STICKY EN DOS TIEMPOS: Arco de Atelier -> Expansión de Pasarela
      const hero = root.querySelector<HTMLElement>('.ax-hero');
      const heroCopy = root.querySelector<HTMLElement>('.ax-hero__copy');
      const heroVisual = root.querySelector<HTMLElement>('.ax-hero__visual');
      const heroFrame = root.querySelector<HTMLElement>('.ax-hero__frame');
      const heroBow = root.querySelector<HTMLElement>('.ax-hero__bow');
      const heroWatermark = root.querySelector<HTMLElement>('.ax-hero__watermark');
      const heroReveal = root.querySelector<HTMLElement>('.ax-hero__reveal');
      const heroScrollHint = root.querySelector<HTMLElement>('.ax-hero__scroll-hint');

      if (hero && heroCopy && heroVisual) {
        gsap.fromTo(
          root.querySelectorAll('.ax-hero__animate-in'),
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
            { scale: 1.08, duration: 0.95 },
            0.06
          );

        if (heroFrame) {
          heroTl.to(heroFrame, { scale: 1.35, opacity: 0, duration: 0.6 }, 0.04);
        }
        if (heroWatermark) {
          heroTl.to(
            heroWatermark,
            { scale: 1.36, yPercent: -12, opacity: 0, duration: 0.72 },
            0
          );
        }
        if (heroBow) {
          heroTl.to(
            heroBow,
            { yPercent: -140, scale: 1.22, opacity: 0, duration: 0.68 },
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

      // Títulos de sección con escala editorial ligada al scroll
      root.querySelectorAll<HTMLElement>('.ax-section-header__title').forEach((title) => {
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

      // 2. MANIFIESTO DE ESTILO: Patronaje SVG dibujado + palabras iluminadas
      const pattern = root.querySelector<SVGElement>('.ax-pattern-backdrop');
      if (pattern) {
        gsap.fromTo(
          pattern,
          { scale: 0.82, rotate: -10, opacity: 0.25 },
          {
            scale: 1.05,
            rotate: 8,
            opacity: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ax-story',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
              ...scrollerOption,
            },
          }
        );
        pattern.querySelectorAll<SVGGeometryElement>('.ax-draw-path').forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 900;
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.ax-story',
                start: 'top 82%',
                end: 'center 42%',
                scrub: 0.8,
                ...scrollerOption,
              },
            }
          );
        });
      }

      const storyWords = root.querySelectorAll<HTMLElement>('.ax-story__word');
      const storyQuote = root.querySelector<HTMLElement>('.ax-story__quote');
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

      root.querySelectorAll<HTMLElement>('.ax-story__card').forEach((card, idx) => {
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

      // 3. LOOKBOOK / 4 PIEZAS DE LA NOCHE
      root.querySelectorAll<HTMLElement>('.ax-lookbook-card').forEach((card, idx) => {
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

      // 4. CÍRCULO DE HONOR (FAMILIA)
      root.querySelectorAll<HTMLElement>('.ax-family__card').forEach((card, idx) => {
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

      // 5. RELOJ DE BACKSTAGE (CUENTA REGRESIVA)
      const countdownPods = root.querySelectorAll<HTMLElement>('.ax-countdown__pod');
      const countdownGrid = root.querySelector<HTMLElement>('.ax-countdown__grid');
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

      // 6. ESCENARIO Y MAPA: Apertura en arco de pasarela
      root.querySelectorAll<HTMLElement>('.ax-location-card__media').forEach((media) => {
        gsap.fromTo(
          media,
          { clipPath: 'inset(14% 12% 14% 12% round 140px 140px 16px 16px)', scale: 0.92 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px 24px 16px 16px)',
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

      // 7. PROGRAMA DE LA COLECCIÓN (TIMELINE CON LAZO VIAJERO)
      const timelineTrack = root.querySelector<HTMLElement>('.ax-timeline__track');
      const timelineProgress = root.querySelector<HTMLElement>('.ax-timeline__progress');
      const timelineRunner = root.querySelector<HTMLElement>('.ax-timeline__runner');
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
      root.querySelectorAll<HTMLElement>('.ax-timeline__item').forEach((item, idx) => {
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

      // 8. GALERÍA LOOKBOOK
      root.querySelectorAll<HTMLElement>('.ax-gallery__card').forEach((photo, idx) => {
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
            rotate: idx % 2 === 0 ? -1 : 1,
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
      root.querySelectorAll<HTMLElement>('.ax-dress__card').forEach((card, idx) => {
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
      const rsvpPass = root.querySelector<HTMLElement>('.ax-rsvp__pass');
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

  const openInvitation = useCallback(() => setIsOpen(true), []);

  const mainLocation = content.locations[0];
  const calendarUrl = buildGoogleCalendarUrl({
    title: content.hero.mainTitle,
    description: `Mis XV: ${quinceName}`,
    location: mainLocation?.address || content.hero.tagline,
    startDateIso: eventDate,
  });

  const handleDownloadIcs = () => {
    const ics = buildIcsFileContent({
      title: content.hero.mainTitle,
      description: `Mis XV: ${quinceName}`,
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
        tableName: result.pass.tableName || 'Front Row · Mesa asignada',
      });
      toast.success('¡Acreditación confirmada!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo guardar tu confirmación'
      );
    }
  };

  const lookbookPieces = [
    {
      code: 'PIEZA 01 · ATELIER',
      title: 'El Corte de Alta Costura',
      description:
        'Seda azul cobalto, organza luminosa y detalles en plata labrados para reflejar quién soy en esta nueva etapa.',
      image: '/images/atelier-xv/atelier.jpg',
      tag: 'SAVOIR-FAIRE',
    },
    {
      code: 'PIEZA 02 · ESCENARIO',
      title: 'La Pasarela Arquitectónica',
      description:
        'Un patio histórico transformado con arcos de luz cálida, espejos y flores blancas para recibirte.',
      image: '/images/atelier-xv/runway.jpg',
      tag: 'LA SEDE',
    },
    {
      code: 'PIEZA 03 · VELADA',
      title: 'El Brindis de Cristal',
      description:
        'Música, destellos de plata y una atmósfera diseñada para celebrar y bailar con mis personas favoritas.',
      image: '/images/atelier-xv/toast.jpg',
      tag: 'CELEBRACIÓN',
    },
    {
      code: 'PIEZA 04 · ESCULTURA',
      title: 'Alta Repostería en Seda',
      description:
        'El momento de pedir deseos frente a una creación inspirada en los lazos y pliegues del atelier.',
      image: '/images/atelier-xv/cake.jpg',
      tag: 'MOMENTO CENTRAL',
    },
  ];

  const primaryActionHref = enabled('quote_story')
    ? '#ax-story'
    : enabled('locations')
      ? '#ax-locations'
      : enabled('rsvp')
        ? '#ax-rsvp'
        : '#ax-hero';

  return (
    <div
      ref={rootRef}
      className="ax-root"
      style={
        {
          '--ax-bg': colors.bgPrimary,
          '--ax-bg-2': colors.bgSecondary,
          '--ax-text': colors.textPrimary,
          '--ax-muted': colors.textMuted,
          '--ax-accent': colors.accentPrimary,
          '--ax-silver': colors.accentSecondary,
          '--ax-seal': envelope.sealColor || colors.accentPrimary,
          '--ax-heading-font': invitationFontStack(fonts.headingFont),
          '--ax-script-font': invitationFontStack(fonts.scriptFont),
          '--ax-body-font': invitationFontStack(fonts.bodyFont),
        } as React.CSSProperties
      }
    >
      {/* 1. CARPETA DE INVITACIÓN FRONT ROW */}
      {(!isBuilderPreview || previewEnvelope) && (
        <Opening
          config={config}
          guestGroup={guestGroup}
          quinceName={quinceName}
          dateLabel={dateLabel}
          isOpen={isOpen}
          onOpen={openInvitation}
        />
      )}

      {/* 2. PARTÍCULAS + AUDIO */}
      <AmbientParticlesCanvas
        effect={config.theme.ambientEffect}
        accentColor={colors.accentPrimary}
      />
      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isOpen}
        accentColor={colors.accentPrimary}
      />

      {/* 3. BARRA DE PROGRESO + NAVBAR EDITORIAL */}
      <div className="ax-progress" aria-hidden="true">
        <div ref={progressRef} className="ax-progress__fill" />
      </div>

      <header className="ax-nav">
        <a href="#ax-hero" className="ax-nav__brand">
          <span className="ax-nav__monogram">{envelope.sealMonogram || 'XV'}</span>
          <span className="ax-nav__title">{quinceName}</span>
        </a>
        <nav className="ax-nav__links" aria-label="Navegación de la invitación">
          {enabled('quote_story') && <a href="#ax-story">Manifiesto</a>}
          <a href="#ax-lookbook">Atelier</a>
          {enabled('locations') && <a href="#ax-locations">Escenario</a>}
          {enabled('timeline') && <a href="#ax-timeline">Programa</a>}
          {enabled('rsvp') && (
            <a href="#ax-rsvp" className="ax-nav__cta">
              <span>Confirmar</span>
              <ArrowRight size={13} />
            </a>
          )}
        </nav>
      </header>

      <main>
        {/* SECCIÓN 1: HERO STICKY EN DOS TIEMPOS */}
        {enabled('hero') && (
          <section
            id="ax-hero"
            data-editor-section="hero"
            className="ax-hero"
            aria-label="Portada de la invitación"
          >
            <div className="ax-hero__stage">
              <div className="ax-hero__field" aria-hidden="true" />
              <div className="ax-hero__watermark" aria-hidden="true">
                XV
              </div>

              {/* Marco orbital y sello giratorio alrededor del retrato en arco */}
              <div className="ax-hero__frame" aria-hidden="true">
                <span className="ax-hero__arch-outline" />
                <RotatingCoutureSeal
                  text={`ATELIER XV ★ ${quinceName.toUpperCase()} ★ EDICIÓN DE ALTA COSTURA ★ `}
                  className="ax-hero__seal"
                />
              </div>

              {/* Lazo simétrico de alta costura */}
              <div className="ax-hero__bow" aria-hidden="true">
                <CoutureBow />
              </div>

              {/* Retrato en arco que se expande a pantalla completa */}
              <div className="ax-hero__visual">
                <HeroMedia
                  hero={content.hero}
                  alt={`Retrato editorial de XV años de ${quinceName}`}
                  className="ax-hero__media-img"
                />
                <span className="ax-hero__media-shade" aria-hidden="true" />
              </div>

              {/* Copy centrado en móvil y alineado con precisión en escritorio */}
              <div className="ax-hero__copy">
                <div className="ax-hero__pill ax-hero__animate-in">
                  <span className="ax-hero__dot" aria-hidden="true" />
                  <span>{content.hero.badgeText}</span>
                </div>

                <h1 className="ax-hero__title ax-hero__animate-in">
                  <span className="ax-hero__title-kicker">MIS QUINCE AÑOS</span>
                  <em>{quinceName}</em>
                </h1>

                <p className="ax-hero__tagline ax-hero__animate-in">
                  {content.hero.tagline}
                </p>

                <div className="ax-hero__meta ax-hero__animate-in">
                  {dateLabel && (
                    <span className="ax-hero__chip">
                      <CalendarDays size={14} />
                      <span>{dateLabel}</span>
                    </span>
                  )}
                  {mainLocation?.time && (
                    <span className="ax-hero__chip">
                      <Clock3 size={14} />
                      <span>{mainLocation.time}</span>
                    </span>
                  )}
                  {mainLocation?.venueName && (
                    <span className="ax-hero__chip">
                      <MapPin size={14} />
                      <span>{mainLocation.venueName}</span>
                    </span>
                  )}
                </div>

                {guestGroup && (
                  <p className="ax-hero__guest ax-hero__animate-in">
                    <Crown size={14} />
                    <span>Acreditación reservada para {guestGroup.groupName}</span>
                  </p>
                )}

                <div className="ax-hero__actions ax-hero__animate-in">
                  {enabled('rsvp') && (
                    <a href="#ax-rsvp" className="ax-button ax-button--primary">
                      <Ticket size={16} />
                      <span>Confirmar asistencia</span>
                    </a>
                  )}
                  {primaryActionHref !== '#ax-hero' && (
                    <a href={primaryActionHref} className="ax-button ax-button--ghost">
                      <span>Descubrir edición</span>
                      <ArrowDown size={15} />
                    </a>
                  )}
                </div>
              </div>

              {/* Estado final que emerge al expandir la fotografía */}
              <div className="ax-hero__reveal">
                <div className="ax-hero__reveal-card">
                  <img
                    src="/images/atelier-xv/runway.jpg"
                    alt=""
                    aria-hidden="true"
                    className="ax-hero__reveal-thumb"
                  />
                  <div className="ax-hero__reveal-body">
                    <span className="ax-hero__reveal-kicker">
                      COLECCIÓN XV · {quinceName.toUpperCase()}
                    </span>
                    <p className="ax-hero__reveal-title">
                      {sectionHeading(
                        config,
                        'quote_story',
                        'title',
                        'Mi propia historia comienza aquí'
                      )}
                    </p>
                    <a href={primaryActionHref} className="ax-hero__reveal-link">
                      <span>Entrar a la gala</span>
                      <ArrowDown size={15} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="ax-hero__scroll-hint" aria-hidden="true">
                <span>DESLIZA PARA ABRIR PASARELA</span>
                <ArrowDown size={14} />
              </div>
            </div>
          </section>
        )}

        {/* BANDA CINÉTICA 1 */}
        <KineticMarquee
          items={[
            content.hero.badgeText || 'MI EDICIÓN XV',
            quinceName.toUpperCase(),
            dateLabel || 'NOCHE DE GALA',
            mainLocation?.venueName || 'CIUDAD DE MÉXICO',
            'ALTA COSTURA · PASARELA · CELEBRACIÓN',
          ]}
        />

        {/* SECCIÓN 2: MANIFIESTO DE ESTILO (HISTORIA + PATRONAJE SVG) */}
        {enabled('quote_story') && (
          <section
            id="ax-story"
            data-editor-section="quoteStory"
            className="ax-story ax-section ax-sheet ax-sheet--dark"
          >
            <AtelierPatternBackdrop />
            <div className="ax-container">
              <SectionHeader
                code="EDICIÓN 01"
                eyebrow={sectionHeading(
                  config,
                  'quote_story',
                  'eyebrow',
                  'Capítulo 01'
                )}
                title={sectionHeading(
                  config,
                  'quote_story',
                  'title',
                  'Mi propia historia'
                )}
                light
              />

              <blockquote
                className="ax-story__quote"
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
                        <span className="ax-story__word" key={`${part}-${idx}`}>
                          {part}
                        </span>
                      )
                    )}
                  ”
                </span>
              </blockquote>

              {content.quoteStory.quoteAuthor && (
                <p className="ax-story__author">
                  <CoutureStarburst className="ax-story__author-star" />
                  <span>{content.quoteStory.quoteAuthor}</span>
                </p>
              )}

              {content.quoteStory.storyBlocks &&
                content.quoteStory.storyBlocks.length > 0 && (
                  <div className="ax-story__grid">
                    {content.quoteStory.storyBlocks.map((block, idx) => (
                      <article
                        className="ax-story__card"
                        key={`${block.title}-${idx}`}
                      >
                        <div className="ax-story__card-top">
                          <span className="ax-story__phase">
                            ACTO 0{idx + 1}
                          </span>
                          <Scissors size={16} />
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

        {/* SECCIÓN 3 (NUEVA): EL ATELIER & LAS 4 PIEZAS DE LA NOCHE */}
        <section
          id="ax-lookbook"
          className="ax-lookbook ax-section"
          aria-labelledby="ax-lookbook-title"
        >
          <div className="ax-container">
            <header className="ax-section-header">
              <div className="ax-section-header__pill">
                <span className="ax-section-header__code">EDICIÓN 02</span>
                <CoutureStarburst className="ax-section-header__star" />
                <span>SAVOIR-FAIRE & ESTILO</span>
              </div>
              <h2 id="ax-lookbook-title" className="ax-section-header__title">
                Las 4 piezas de mi gran noche
              </h2>
              <p className="ax-section-header__subtitle">
                Cada rincón, textura y momento fue curado como una colección irrepetible para compartirla contigo.
              </p>
              <div className="ax-section-header__rule" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>
            </header>

            <div className="ax-lookbook__grid">
              {lookbookPieces.map((piece, idx) => (
                <article
                  key={piece.code}
                  className="ax-lookbook-card"
                  style={{ '--ax-stack-index': idx } as React.CSSProperties}
                >
                  <div className="ax-lookbook-card__media">
                    <img src={piece.image} alt={piece.title} loading="lazy" />
                    <span className="ax-lookbook-card__tag">{piece.tag}</span>
                  </div>
                  <div className="ax-lookbook-card__body">
                    <span className="ax-lookbook-card__code">{piece.code}</span>
                    <h3>{piece.title}</h3>
                    <p>{piece.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: MI CÍRCULO DE HONOR (PADRES Y PADRINOS) */}
        {enabled('vip_parents') && content.vipParents.groups.length > 0 && (
          <section
            id="ax-family"
            data-editor-section="vipParents"
            className="ax-family ax-section ax-sheet"
          >
            <div className="ax-container">
              <SectionHeader
                code="EDICIÓN 03"
                eyebrow={sectionHeading(
                  config,
                  'vip_parents',
                  'eyebrow',
                  'Mi círculo'
                )}
                title={sectionHeading(
                  config,
                  'vip_parents',
                  'title',
                  'Quienes me acompañan'
                )}
                subtitle={content.vipParents.blessingMessage}
              />

              <div className="ax-family__grid">
                {content.vipParents.groups.map((group, idx) => (
                  <article
                    className="ax-family__card"
                    key={`${group.groupTitle}-${idx}`}
                  >
                    <div className="ax-family__badge">
                      <Gem size={14} />
                      <span>HONOR 0{idx + 1}</span>
                    </div>
                    <h3>{group.groupTitle}</h3>
                    <div className="ax-family__names">
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

        {/* SECCIÓN 5: RELOJ DE BACKSTAGE (CUENTA REGRESIVA) */}
        {enabled('countdown') && (
          <section
            id="ax-countdown"
            data-editor-section="countdown"
            className="ax-countdown ax-section"
          >
            <div className="ax-container">
              <SectionHeader
                code="CALL TIME OFICIAL"
                eyebrow={sectionHeading(
                  config,
                  'countdown',
                  'eyebrow',
                  'La espera termina'
                )}
                title={sectionHeading(
                  config,
                  'countdown',
                  'title',
                  'Cuenta regresiva'
                )}
              />

              <div className="ax-countdown__console">
                <div className="ax-countdown__status">
                  <span className="ax-countdown__dot" aria-hidden="true" />
                  <span>LUCES DE PASARELA EN · {dateLabel}</span>
                </div>

                <div
                  className="ax-countdown__grid"
                  aria-label="Cuenta regresiva para mis XV años"
                >
                  {[
                    { code: '01', label: 'Días', value: timeLeft.days },
                    { code: '02', label: 'Horas', value: timeLeft.hours },
                    { code: '03', label: 'Minutos', value: timeLeft.minutes },
                    { code: '04', label: 'Segundos', value: timeLeft.seconds },
                  ].map((unit) => (
                    <div className="ax-countdown__pod" key={unit.label}>
                      <small>{unit.code}</small>
                      <strong>{String(unit.value).padStart(2, '0')}</strong>
                      <span>{unit.label}</span>
                    </div>
                  ))}
                </div>

                <div className="ax-countdown__actions">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ax-button ax-button--primary"
                  >
                    <CalendarDays size={16} />
                    <span>Agendar en Google Calendar</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="ax-button ax-button--ghost"
                  >
                    <CalendarDays size={16} />
                    <span>Apple Calendar / Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 6: EL ESCENARIO (UBICACIONES Y MAPA) */}
        {enabled('locations') && content.locations.length > 0 && (
          <section
            id="ax-locations"
            data-editor-section="locations"
            className="ax-locations ax-section ax-sheet"
          >
            <div className="ax-container">
              <SectionHeader
                code="LA SEDE"
                eyebrow={sectionHeading(
                  config,
                  'locations',
                  'eyebrow',
                  'El escenario'
                )}
                title={sectionHeading(
                  config,
                  'locations',
                  'title',
                  'Dónde nos vemos'
                )}
                subtitle="Consulta la ubicación exacta y elige tu ruta preferida para llegar a la gala."
              />

              <div className="ax-locations__list">
                {content.locations.map((loc, idx) => {
                  const mapQuery = encodeURIComponent(
                    `${loc.venueName}, ${loc.address}`
                  );
                  return (
                    <article className="ax-location-card" key={loc.id || idx}>
                      <div className="ax-location-card__visual-col">
                        <div className="ax-location-card__media">
                          <img
                            src={loc.imageUrl || '/images/atelier-xv/runway.jpg'}
                            alt={`Escenario en ${loc.venueName}`}
                            loading="lazy"
                          />
                          <span className="ax-location-card__coord">
                            <Compass size={14} />
                            <span>
                              SEDE 0{idx + 1} · {loc.time}
                            </span>
                          </span>
                        </div>

                        <div className="ax-location-card__map">
                          <iframe
                            title={`Mapa de ${loc.venueName}`}
                            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>

                      <div className="ax-location-card__info">
                        <span className="ax-location-card__kicker">
                          <Clock3 size={14} />
                          <span>
                            {loc.time} · {loc.title}
                          </span>
                        </span>

                        <h3>{loc.venueName}</h3>

                        <p className="ax-location-card__address">
                          <MapPin size={17} />
                          <span>{loc.address}</span>
                        </p>

                        <div className="ax-location-card__routes">
                          <a
                            href={loc.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ax-route-btn ax-route-btn--primary"
                          >
                            <MapPinned size={16} />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href={loc.wazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ax-route-btn"
                          >
                            <Route size={16} />
                            <span>Waze</span>
                          </a>
                          <a
                            href={`https://maps.apple.com/?daddr=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ax-route-btn"
                          >
                            <Apple size={16} />
                            <span>Apple Maps</span>
                          </a>
                          <a
                            href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ax-route-btn"
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

        {/* SECCIÓN 7: LA COLECCIÓN DE LA NOCHE (TIMELINE) */}
        {enabled('timeline') && content.timeline.length > 0 && (
          <section
            id="ax-timeline"
            data-editor-section="timeline"
            className="ax-timeline ax-section"
          >
            <div className="ax-container">
              <SectionHeader
                code="RUNWAY SCHEDULE"
                eyebrow={sectionHeading(
                  config,
                  'timeline',
                  'eyebrow',
                  'La colección de la noche'
                )}
                title={sectionHeading(
                  config,
                  'timeline',
                  'title',
                  'Momentos clave'
                )}
              />

              <div className="ax-timeline__track">
                <div className="ax-timeline__rail" aria-hidden="true">
                  <div className="ax-timeline__progress" />
                  <div className="ax-timeline__runner">
                    <CoutureBow />
                  </div>
                </div>

                <div className="ax-timeline__items">
                  {content.timeline.map((item, idx) => (
                    <article className="ax-timeline__item" key={item.id || idx}>
                      <div className="ax-timeline__node" aria-hidden="true">
                        <span>0{idx + 1}</span>
                      </div>
                      <div className="ax-timeline__card">
                        <div className="ax-timeline__meta">
                          <span className="ax-timeline__time">{item.time}</span>
                          <span className="ax-timeline__step">
                            ACTO 0{idx + 1}
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

        {/* SECCIÓN 8: LOOKBOOK EDITORIAL (GALERÍA) */}
        {enabled('gallery') && content.gallery.images.length > 0 && (
          <section
            id="ax-gallery"
            data-editor-section="gallery"
            className="ax-gallery ax-section ax-sheet"
          >
            <div className="ax-container">
              <SectionHeader
                code="LOOKBOOK XV"
                eyebrow={sectionHeading(
                  config,
                  'gallery',
                  'eyebrow',
                  'Mi mundo'
                )}
                title={sectionHeading(
                  config,
                  'gallery',
                  'title',
                  'Retratos y recuerdos'
                )}
              />

              <div className="ax-gallery__grid">
                {content.gallery.images.map((img, idx) => (
                  <figure
                    className="ax-gallery__card"
                    key={`${img.url}-${idx}`}
                  >
                    <div className="ax-gallery__img-wrap">
                      <img
                        src={img.url}
                        alt={img.caption || `Retrato editorial ${idx + 1}`}
                        loading="lazy"
                      />
                      <span className="ax-gallery__badge">
                        LOOK 0{idx + 1}
                      </span>
                    </div>
                    {img.caption && (
                      <figcaption className="ax-gallery__caption">
                        <CoutureStarburst className="ax-gallery__star" />
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
            'DRESS NOTES · GALA CONTEMPORÁNEA',
            `COLECCIÓN XV · ${quinceName.toUpperCase()}`,
            'FRONT ROW VIP',
            'CONFIRMA TU PASE DIGITAL',
          ]}
        />

        {/* SECCIÓN 9: DRESS NOTES (CÓDIGO DE VESTIMENTA) */}
        {enabled('dress_code') && (
          <section
            id="ax-dress"
            data-editor-section="dressCode"
            className="ax-dress ax-section"
          >
            <div className="ax-container">
              <SectionHeader
                code="ESTILO & ETIQUETA"
                eyebrow={sectionHeading(
                  config,
                  'dress_code',
                  'eyebrow',
                  'Dress notes'
                )}
                title={sectionHeading(
                  config,
                  'dress_code',
                  'title',
                  content.dressCode.title || 'Código de estilo'
                )}
                subtitle="Una noche para brillar con elegancia contemporánea y disfrutar cada momento en la pista."
              />

              <div className="ax-dress__grid">
                <article className="ax-dress__card">
                  <div className="ax-dress__icon-wrap">
                    <Sparkles size={20} />
                  </div>
                  <span className="ax-dress__role">SILUETA DE GALA</span>
                  <h3>Para Ellas</h3>
                  <p>{content.dressCode.womenNotes}</p>
                </article>

                <article className="ax-dress__card">
                  <div className="ax-dress__icon-wrap">
                    <Crown size={20} />
                  </div>
                  <span className="ax-dress__role">SASTRERÍA FORMAL</span>
                  <h3>Para Ellos</h3>
                  <p>{content.dressCode.menNotes}</p>
                </article>
              </div>

              <div className="ax-dress__checklist">
                <span>
                  <Check size={14} /> Etiqueta de noche
                </span>
                <span>
                  <Check size={14} /> Calzado cómodo para bailar
                </span>
                <span>
                  <Check size={14} /> Look con sello propio
                </span>
              </div>

              {content.dressCode.reservedColors.length > 0 && (
                <div className="ax-dress__palette">
                  <span className="ax-dress__palette-label">
                    TONO RESERVADO PARA LA QUINCEAÑERA
                  </span>
                  <div className="ax-dress__swatches">
                    {content.dressCode.reservedColors.map((swatch, idx) => (
                      <div
                        className="ax-dress__swatch"
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

        {/* SECCIÓN 10: DETALLES Y REGALOS */}
        {enabled('gifts') &&
          (Boolean(content.gifts.introMessage) ||
            content.gifts.registries.length > 0 ||
            Boolean(content.gifts.bankTransfer?.enabled) ||
            content.gifts.cashEnvelopeAtVenue) && (
            <section
              id="ax-gifts"
              data-editor-section="gifts"
              className="ax-gifts ax-section ax-sheet"
            >
              <div className="ax-container">
                <SectionHeader
                  code="DETALLES"
                  eyebrow={sectionHeading(
                    config,
                    'gifts',
                    'eyebrow',
                    'Con cariño'
                  )}
                  title={sectionHeading(config, 'gifts', 'title', 'Detalles')}
                  subtitle={content.gifts.introMessage}
                />

                <div className="ax-gifts__grid">
                  {content.gifts.registries.map((reg, idx) => (
                    <article
                      className="ax-gifts__card"
                      key={`${reg.storeName}-${idx}`}
                    >
                      <Gift size={22} className="ax-gifts__icon" />
                      <span>MESA DE REGALOS</span>
                      <h3>{reg.storeName}</h3>
                      {reg.eventNumber && <p>Evento: {reg.eventNumber}</p>}
                      <a
                        href={reg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ax-button ax-button--primary"
                      >
                        <span>Ver mesa de regalos</span>
                        <ArrowRight size={15} />
                      </a>
                    </article>
                  ))}

                  {content.gifts.bankTransfer?.enabled && (
                    <article className="ax-gifts__card ax-gifts__card--wide">
                      <CreditCard size={22} className="ax-gifts__icon" />
                      <span>TRANSFERENCIA BANCARIA</span>
                      <h3>
                        {content.gifts.bankTransfer.bankName} ·{' '}
                        {content.gifts.bankTransfer.accountHolder}
                      </h3>
                      <p className="ax-gifts__clabe">
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
                        className="ax-button ax-button--primary"
                      >
                        {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
                        <span>
                          {copiedClabe ? '¡CLABE copiada!' : 'Copiar CLABE'}
                        </span>
                      </button>
                    </article>
                  )}

                  {content.gifts.cashEnvelopeAtVenue && (
                    <article className="ax-gifts__card">
                      <Gift size={22} className="ax-gifts__icon" />
                      <span>EN LA RECEPCIÓN</span>
                      <h3>Buzón de sobres en el atelier</h3>
                      <p>
                        Durante la gala habrá un espacio especial en recepción por si deseas entregar un sobre o tarjeta para {quinceName}.
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
            id="ax-stay"
            data-editor-section="accommodation"
            className="ax-stay ax-section"
          >
            <div className="ax-container">
              <SectionHeader
                code="ESTANCIA"
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
                  'Dónde quedarte'
                )}
              />

              <div className="ax-stay__grid">
                {content.accommodation.map((hotel, idx) => (
                  <article
                    className="ax-stay__card"
                    key={`${hotel.hotelName}-${idx}`}
                  >
                    <Hotel size={22} className="ax-stay__icon" />
                    <h3>{hotel.hotelName}</h3>
                    <p>{hotel.distanceNote}</p>
                    {hotel.discountCode && (
                      <span className="ax-stay__code">
                        Código: {hotel.discountCode}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 12: BACKSTAGE SOCIAL (ÁLBUM Y MÚSICA) */}
        {enabled('social_features') && (
          <section
            id="ax-social"
            data-editor-section="socialFeatures"
            className="ax-social ax-section"
          >
            <div className="ax-container">
              <SectionHeader
                code="BACKSTAGE & MEMORIA"
                eyebrow={sectionHeading(
                  config,
                  'social_features',
                  'eyebrow',
                  'Backstage'
                )}
                title={sectionHeading(
                  config,
                  'social_features',
                  'title',
                  'Nuestra memoria'
                )}
                subtitle="Comparte tus fotografías desde el front row y sugiere las canciones que no pueden faltar en la pista."
              />

              <div className="ax-social__grid">
                <div className="ax-social__panel">
                  <div className="ax-social__panel-head">
                    <Camera size={20} />
                    <span>ÁLBUM DE INVITADOS</span>
                  </div>
                  <h3>La gala desde tu lente</h3>
                  <SharedAlbum
                    slug={slug}
                    token={guestGroup?.guestToken}
                    preview={isBuilderPreview}
                  />
                </div>

                {(content.socialFeatures.enableSongRequests ||
                  content.socialFeatures.enableAudioGuestbook) && (
                  <div className="ax-social__panel">
                    <div className="ax-social__panel-head">
                      <Music2 size={20} />
                      <span>RUNWAY PLAYLIST</span>
                    </div>
                    <h3>Sugiere tu canción</h3>
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
                <div className="ax-social__hashtag">
                  <Sparkles size={15} />
                  <span>{content.socialFeatures.hashtag}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECCIÓN 13: LISTA VIP (RSVP + PASE QR) */}
        {enabled('rsvp') && (
          <section
            id="ax-rsvp"
            data-editor-section="rsvp"
            className="ax-rsvp ax-section ax-sheet ax-sheet--dark"
          >
            <div className="ax-container">
              <SectionHeader
                code="FRONT ROW RSVP"
                eyebrow={sectionHeading(
                  config,
                  'rsvp',
                  'eyebrow',
                  'Estás en la lista'
                )}
                title={sectionHeading(
                  config,
                  'rsvp',
                  'title',
                  'Confirma tu asistencia'
                )}
                subtitle={
                  guestGroup
                    ? `Acreditación reservada para ${guestGroup.groupName} (${guestGroup.allocatedAdults} adultos${
                        guestGroup.allocatedChildren > 0
                          ? ` y ${guestGroup.allocatedChildren} niños`
                          : ''
                      }).`
                    : 'Usa tu enlace personal para confirmar tu asistencia y generar tu pase QR.'
                }
                light
              />

              <div className="ax-rsvp__pass">
                <div className="ax-rsvp__pass-bar">
                  <span>
                    <Ticket size={15} /> ACREDITACIÓN DE GALA · ATELIER XV
                  </span>
                  <span>{quinceName.toUpperCase()}</span>
                </div>

                {!generatedPass ? (
                  <form onSubmit={handleSubmitRsvp} className="ax-rsvp__form">
                    <div className="ax-rsvp__field">
                      <label htmlFor="ax-rsvp-name">
                        Nombre de familia o invitado
                      </label>
                      <input
                        id="ax-rsvp-name"
                        type="text"
                        required
                        value={rsvpName}
                        readOnly={Boolean(guestGroup)}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Ej. Familia López García"
                      />
                    </div>

                    <div className="ax-rsvp__row">
                      <div className="ax-rsvp__field">
                        <label htmlFor="ax-rsvp-attend">
                          ¿Nos acompañas en la gala?
                        </label>
                        <select
                          id="ax-rsvp-attend"
                          value={willAttend}
                          onChange={(e) =>
                            setWillAttend(e.target.value as 'yes' | 'no')
                          }
                        >
                          <option value="yes">
                            ¡Sí, ahí estaré!
                          </option>
                          <option value="no">
                            No podré asistir
                          </option>
                        </select>
                      </div>

                      <div className="ax-rsvp__field">
                        <label htmlFor="ax-rsvp-phone">Teléfono WhatsApp</label>
                        <input
                          id="ax-rsvp-phone"
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                    </div>

                    {willAttend === 'yes' && (
                      <>
                        <div className="ax-rsvp__row">
                          <div className="ax-rsvp__field">
                            <label htmlFor="ax-rsvp-adults">
                              Adultos confirmados (Máx. {maxAdults})
                            </label>
                            <select
                              id="ax-rsvp-adults"
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
                              <div className="ax-rsvp__field">
                                <label htmlFor="ax-rsvp-children">
                                  Jóvenes / Niños (Máx. {maxChildren})
                                </label>
                                <select
                                  id="ax-rsvp-children"
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
                          <div className="ax-rsvp__field">
                            <label htmlFor="ax-rsvp-diet">
                              Restricciones alimentarias (opcional)
                            </label>
                            <input
                              id="ax-rsvp-diet"
                              type="text"
                              value={dietaryNotes}
                              onChange={(e) => setDietaryNotes(e.target.value)}
                              placeholder="Ej. Menú vegetariano, alergia..."
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="ax-rsvp__field">
                      <label htmlFor="ax-rsvp-message">
                        Dedicatoria para {quinceName} (opcional)
                      </label>
                      <textarea
                        id="ax-rsvp-message"
                        rows={3}
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Escribe tus mejores deseos para esta noche..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="ax-button ax-button--primary ax-button--full"
                    >
                      <Sparkles size={16} />
                      <span>
                        {willAttend === 'yes'
                          ? 'Confirmar asistencia y generar pase QR'
                          : 'Enviar respuesta'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="ax-rsvp__confirmed">
                    <div className="ax-rsvp__confirmed-badge">
                      <Check size={16} />
                      <span>ACREDITACIÓN CONFIRMADA</span>
                    </div>
                    <h3>{generatedPass.groupName}</h3>
                    <p className="ax-rsvp__confirmed-meta">
                      <Users size={15} />
                      <span>
                        {generatedPass.adults} Adultos
                        {generatedPass.children > 0
                          ? ` · ${generatedPass.children} Niños`
                          : ''}{' '}
                        · {generatedPass.tableName}
                      </span>
                    </p>

                    <div className="ax-rsvp__qr-box">
                      <QRCodeSVG
                        value={generatedPass.qrPayload}
                        size={176}
                        level="M"
                      />
                    </div>

                    <p className="ax-rsvp__confirmed-note">
                      {content.rsvp.customConfirmationMessage}
                    </p>

                    <button
                      type="button"
                      onClick={() => setGeneratedPass(null)}
                      className="ax-button ax-button--ghost"
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

      {/* FOOTER EDITORIAL CENTRADO */}
      <footer className="ax-footer">
        <div className="ax-footer__bow" aria-hidden="true">
          <CoutureBow />
        </div>
        <span className="ax-footer__kicker">ATELIER XV · EDICIÓN DE GALA</span>
        <strong>{quinceName}</strong>
        <p>
          {dateLabel} · {mainLocation?.venueName || content.hero.tagline}
        </p>
        <a href="#ax-hero" className="ax-footer__top">
          Volver al inicio de la edición ↑
        </a>
      </footer>
    </div>
  );
}
