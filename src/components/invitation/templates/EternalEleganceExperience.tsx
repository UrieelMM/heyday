'use client';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
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
  Gift,
  Heart,
  ImagePlus,
  MapPin,
  Music2,
  Navigation,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { sectionHeading } from '@/lib/templates/section-heading';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { buildGoogleCalendarUrl, buildIcsFileContent } from '@/lib/calendar/ics-generator';
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import { HeroMedia } from '../core/HeroMedia';
import './eternal-elegance.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface EternalEleganceExperienceProps {
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
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(parsed);
};

function Botanical({ className = '' }: { className?: string }) {
  return (
    <svg className={`ee-botanical ${className}`} viewBox="0 0 180 250" fill="none" aria-hidden="true">
      <path className="ee-draw" d="M91 247C75 203 76 166 91 130c14-36 18-75 3-126" />
      <path className="ee-draw" d="M82 209c-18-7-32-17-41-35M78 177c16-10 27-23 34-40M84 149c-18-8-34-23-40-42M98 115c17-9 27-22 33-38M103 77C87 65 78 48 78 28" />
      <path className="ee-draw" d="M42 174c-9 5-20 7-30 4 5-12 15-20 29-18M111 137c12 3 22 0 31-7-8-9-17-13-27-12M44 107c-14 0-26-8-32-18 12-7 26-5 37 4M130 77c13 2 25-3 37-14-12-8-25-8-38 0M78 29C65 22 59 11 57 1c13-1 25 6 31 17" />
    </svg>
  );
}

function WeddingRings({ className = '' }: { className?: string }) {
  return (
    <svg className={`ee-rings ${className}`} viewBox="0 0 220 150" fill="none" aria-hidden="true">
      <ellipse className="ee-draw" cx="84" cy="79" rx="58" ry="53" />
      <ellipse className="ee-draw" cx="136" cy="79" rx="58" ry="53" />
      <path className="ee-draw" d="M110 6v17M102 14h16M36 17l8 11M30 29l12 5M188 17l-8 11M194 29l-12 5M109 128v16M101 136h16" />
      <path className="ee-draw" d="M83 37l5 7-5 7-5-7 5-7ZM138 107l5 7-5 7-5-7 5-7Z" />
    </svg>
  );
}

function Flourish() {
  return (
    <svg className="ee-flourish ee-reveal" viewBox="0 0 180 28" fill="none" aria-hidden="true">
      <path className="ee-draw" d="M1 14h53c12 0 19-4 26-13M179 14h-53c-12 0-19-4-26-13M80 27c4-5 7-10 10-13 3 3 6 8 10 13M90 8l5 6-5 6-5-6 5-6Z" />
    </svg>
  );
}

function Diamond() {
  return <span className="ee-diamond" aria-hidden="true" />;
}

function SectionIntro({ eyebrow, title, align = 'center' }: { eyebrow: string; title: string; align?: 'center' | 'left' }) {
  return (
    <div className={`ee-section-intro ${align === 'left' ? 'ee-section-intro--left' : ''}`}>
      <div className="ee-overline ee-reveal"><Diamond />{eyebrow}<Diamond /></div>
      <h2 className="ee-heading">{title}</h2>
      <Flourish />
    </div>
  );
}

function Opening({ config, eventDate, guestGroup, isOpen, onOpen }: {
  config: InvitationConfig;
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
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);

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
          <Botanical className="ee-opening__botanical ee-opening__botanical--left" />
          <Botanical className="ee-opening__botanical ee-opening__botanical--right" />
          <div className="ee-opening__content">
            <p className="ee-overline"><Diamond /> UNA CELEBRACIÓN DEL AMOR <Diamond /></p>
            <p className="ee-opening__script">Estás invitado a celebrar</p>
            <h1 className="ee-opening__title">{config.content.hero.mainTitle}</h1>
            <p className="ee-opening__date">{formatDate(eventDate)} · {config.content.hero.tagline.split('•').slice(1).join('•').trim() || config.content.hero.tagline}</p>
            <motion.div
              className={`ee-envelope ee-envelope--${config.theme.envelope.variant}${opening ? ' ee-envelope--opening' : ''}`}
              animate={opening ? { y: 25, scale: 1.04, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.62, delay: opening ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ee-envelope__fold ee-envelope__fold--left" aria-hidden="true" />
              <span className="ee-envelope__fold ee-envelope__fold--right" aria-hidden="true" />
              <span className="ee-envelope__fold ee-envelope__fold--bottom" aria-hidden="true" />
              <span className="ee-envelope__flap" aria-hidden="true" />
              <span className="ee-envelope__seal" aria-hidden="true">{config.theme.envelope.sealMonogram}</span>
              <span className="ee-envelope__address">
                <span className="ee-envelope__label">CON AMOR PARA</span>
                <strong className="ee-envelope__name">{guestGroup?.groupName || 'Nuestros seres queridos'}</strong>
                <span className="ee-envelope__passes">{guestGroup ? `${guestGroup.allocatedAdults + guestGroup.allocatedChildren} pases reservados` : 'Un lugar muy especial espera por ti'}</span>
              </span>
            </motion.div>
            <motion.button type="button" className="ee-opening__button" onClick={() => setOpening(true)} disabled={opening} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              {config.theme.envelope.openButtonText} <ArrowRight size={16} />
            </motion.button>
            {config.audio.enabled && <p className="ee-opening__audio"><Volume2 size={13} /> Una experiencia con música</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type WeddingLocation = InvitationConfig['content']['locations'][number];

function MapServiceIcon({ service }: { service: 'uber' | 'apple' | 'google' | 'waze' }) {
  if (service === 'uber') return <span className="ee-map-service__uber" aria-hidden="true">U</span>;
  if (service === 'apple') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 12.8c0-2 1.6-3 1.7-3.1-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 2-1.4 2.4-.4 5.9 1 7.8.7.9 1.4 1.9 2.4 1.9s1.4-.6 2.7-.6 1.7.6 2.7.6 1.7-.9 2.3-1.9c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.5-.9-2.5-2.9ZM14.8 6.9c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.9-.4 2.5-1.1Z" /></svg>;
  if (service === 'google') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M12 22s7-7.7 7-13a7 7 0 0 0-14 0c0 5.3 7 13 7 13Z" /><path fill="#34A853" d="M5 9c0 5.3 7 13 7 13V2a7 7 0 0 0-7 7Z" /><path fill="#FBBC04" d="M5 9c0 2.1 1.1 4.7 2.5 7L15.6 3a7 7 0 0 0-10.6 6Z" /><circle cx="12" cy="9" r="2.8" fill="#fff" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 14c0-5 3.6-8.5 8.5-8.5 5 0 8 3.5 8 8v2c0 1.4-1.1 2.5-2.5 2.5H9l-2 2v-2.5C5.2 17 4 15.8 4 14Z" /><path d="M9 12.4h.1m6 0h.1M9 15c1.4 1.5 4.8 1.5 6.2 0" strokeLinecap="round" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>;
}

function LocationDirections({ locations }: { locations: WeddingLocation[] }) {
  const [selectedId, setSelectedId] = useState(locations[0].id);
  const location = locations.find((item) => item.id === selectedId) || locations[0];
  const { lat, lng } = location.coordinates;
  const coordinate = `${lat},${lng}`;
  const destinationName = encodeURIComponent(location.venueName);
  const services = [
    { id: 'uber' as const, name: 'Uber', url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Blatitude%5D=${lat}&dropoff%5Blongitude%5D=${lng}&dropoff%5Bnickname%5D=${destinationName}` },
    { id: 'apple' as const, name: 'Apple Maps', url: `https://maps.apple.com/?daddr=${encodeURIComponent(coordinate)}&dirflg=d` },
    { id: 'google' as const, name: 'Google Maps', url: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinate)}&travelmode=driving` },
    { id: 'waze' as const, name: 'Waze', url: location.wazeUrl || `https://waze.com/ul?ll=${encodeURIComponent(coordinate)}&navigate=yes` },
  ];

  return (
    <div id="directions" className="ee-directions ee-reveal">
      <div className="ee-directions__heading">
        <div><span className="ee-small-index">TU CAMINO HACIA NOSOTROS</span><h3>Encuentra el camino</h3></div>
        <p>Elige el momento al que nos acompañarás y abre tu ruta favorita.</p>
      </div>
      <div className="ee-directions__tabs" role="tablist" aria-label="Seleccionar ubicación">
        {locations.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={item.id === location.id} className={item.id === location.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)}><span>0{index + 1}</span>{item.title}</button>)}
      </div>
      <div className="ee-directions__body">
        <div className="ee-directions__map">
          <iframe key={location.id} title={`Mapa de ${location.venueName}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(coordinate)}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="ee-directions__map-label"><MapPin size={16} /> {location.venueName}</div>
        </div>
        <div className="ee-directions__detail">
          <span className="ee-directions__pin"><MapPin size={23} strokeWidth={1.3} /></span>
          <span className="ee-small-index">{location.title} · {location.time}</span>
          <h4>{location.venueName}</h4>
          <p>{location.address}</p>
          <div className="ee-directions__services">
            {services.map((service) => <a key={service.id} href={service.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ruta a ${location.venueName} en ${service.name}`}><MapServiceIcon service={service.id} /><span>{service.name}</span><ArrowRight size={14} /></a>)}
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
  const [isOpen, setIsOpen] = useState(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope));
  const [activeSection, setActiveSection] = useState('hero');
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpName, setRsvpName] = useState(guestGroup?.groupName || '');
  const [rsvpPhone, setRsvpPhone] = useState(guestGroup?.whatsappPhone || '');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [adults, setAdults] = useState(guestGroup?.allocatedAdults ?? 2);
  const [children, setChildren] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [pass, setPass] = useState<{ name: string; payload: string; adults: number; children: number } | null>(null);
  const openInvitation = useCallback(() => setIsOpen(true), []);
  const { content, theme } = config;
  const dateText = formatDate(eventDate);
  const isSectionEnabled = (id: string) => config.sectionsOrder.find((section) => section.id === id)?.enabled ?? true;
  const sectionSignature = config.sectionsOrder.map((section) => `${section.id}:${section.enabled}`).join('|');

  useEffect(() => setIsOpen(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope)), [forceEnvelopeOpen, isBuilderPreview, previewEnvelope]);

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

  useGSAP(() => {
    const root = rootRef.current;
    if (!root || !isOpen) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroller = root.closest('[data-invitation-scroller]') || undefined;
    const scrollerOption = scroller ? { scroller } : {};

    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[id]'));
    const scrollTarget = scroller || window;
    let activeFrame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(activeFrame);
      activeFrame = requestAnimationFrame(() => {
        const scrollerBounds = scroller?.getBoundingClientRect();
        const marker = (scrollerBounds?.top || 0) + (scrollerBounds?.height || window.innerHeight) * 0.34;
        const current = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        });
        if (current) setActiveSection(current.id);
      });
    };
    scrollTarget.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();

    if (!reduced) {
      gsap.fromTo(root.querySelectorAll('.ee-hero .ee-entrance'),
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.16, ease: 'power3.out', delay: 0.2 });
      const heroVisual = root.querySelector('.ee-hero__visual');
      if (heroVisual) gsap.fromTo(heroVisual,
        { x: 48, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.25 });

      root.querySelectorAll<HTMLElement>('.ee-reveal').forEach((element) => {
        gsap.fromTo(element, { y: 38, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none', ...scrollerOption },
        });
      });

      root.querySelectorAll<HTMLElement>('.ee-photo:not(.ee-hero__photo) img').forEach((image) => {
        gsap.fromTo(image, { scale: 1.13, yPercent: -3 }, {
          scale: 1, yPercent: 3, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7, ...scrollerOption },
        });
      });

      root.querySelectorAll<SVGElement>('.ee-botanical, .ee-rings, .ee-flourish').forEach((botanical) => {
        const paths = botanical.querySelectorAll<SVGPathElement>('.ee-draw');
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.fromTo(path,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.7, ease: 'power2.out', scrollTrigger: { trigger: botanical, start: 'top 88%', ...scrollerOption } });
        });
      });

      root.querySelectorAll<HTMLElement>('.ee-stagger').forEach((group) => {
        gsap.fromTo(group.children, { y: 25, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.11, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: group, start: 'top 86%', ...scrollerOption },
        });
      });

      const timelineLine = root.querySelector('.ee-timeline__line-fill');
      const timelineList = root.querySelector('.ee-timeline__list');
      if (timelineLine && timelineList) gsap.fromTo(timelineLine, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: timelineList, start: 'top 65%', end: 'bottom 65%', scrub: 0.4, ...scrollerOption },
      });

      const hero = root.querySelector('.ee-hero');
      if (hero) {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true, ...scrollerOption } })
          .to(root.querySelector('.ee-hero__copy'), { y: -80, opacity: 0, duration: .57 }, 0)
          .to(root.querySelector('.ee-hero__watermark'), { scale: 1.35, rotate: -12, opacity: 0, duration: 1 }, 0)
          .to(root.querySelector('.ee-hero__visual'), { left: '0%', top: '0%', width: '100%', height: '100%', maxWidth: 'none', padding: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
          .to(root.querySelector('.ee-hero__visual'), { '--ee-wash-opacity': .76, duration: .65 }, .28)
          .to(root.querySelector('.ee-hero__photo'), { maxHeight: 'none', clipPath: 'inset(0% 0% 0% 0% round 0px)', borderRadius: 0, duration: 1 }, 0)
          .to(root.querySelector('.ee-hero__photo img, .ee-hero__photo video'), { scale: 1.1, yPercent: -4, duration: 1 }, 0)
          .to(root.querySelector('.ee-hero__visual-frame'), { opacity: 0, duration: .35 }, 0)
          .to(root.querySelector('.ee-hero__branch'), { y: -110, rotate: 40, opacity: 0, duration: .7 }, 0)
          .fromTo(root.querySelector('.ee-hero__final'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, .57);
        const heroScroll = root.querySelector('.ee-hero__scroll');
        if (heroScroll) heroTimeline.to(heroScroll, { opacity: 0, duration: .25 }, 0);
      }

      root.querySelectorAll<HTMLElement>('.ee-section-intro .ee-heading').forEach((heading) => {
        gsap.fromTo(heading, { scale: .86, opacity: .3 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: heading, start: 'top 96%', end: 'top 46%', scrub: .75, ...scrollerOption } });
      });
      const quoteWords = root.querySelectorAll<HTMLElement>('.ee-story__word');
      const quote = root.querySelector('.ee-story__quote');
      if (quote && quoteWords.length) gsap.to(quoteWords, { opacity: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 43%', scrub: .6, ...scrollerOption } });
      root.querySelectorAll<HTMLElement>('.ee-family__grid article').forEach((card, index) => {
        gsap.fromTo(card, { y: 88, rotate: index % 2 ? 5 : -5, scale: .88, opacity: .25 }, { y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 94%', end: 'top 52%', scrub: .75, ...scrollerOption } });
      });
      const clock = root.querySelector('.ee-countdown__clock');
      if (clock) gsap.fromTo(clock.children, { scale: .64, y: 40, opacity: .15 }, { scale: 1, y: 0, opacity: 1, stagger: .11, ease: 'none', scrollTrigger: { trigger: clock, start: 'top 89%', end: 'center 54%', scrub: .8, ...scrollerOption } });
      root.querySelectorAll<HTMLElement>('.ee-location__photo').forEach((photo) => {
        gsap.fromTo(photo, { clipPath: 'inset(16% 16% 16% 16% round 46% 46% 0 0)', scale: .88 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 95%', end: 'center 52%', scrub: .85, ...scrollerOption } });
      });
      const map = root.querySelector('.ee-directions__map');
      if (map) gsap.fromTo(map, { clipPath: 'inset(12% 12% 12% 12% round 46% 46% 0 0)', scale: .9 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'none', scrollTrigger: { trigger: map, start: 'top 96%', end: 'center 52%', scrub: .85, ...scrollerOption } });
      root.querySelectorAll<HTMLElement>('.ee-timeline__item').forEach((item) => {
        gsap.fromTo(item, { x: 45, opacity: .2, scale: .92 }, { x: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: item, start: 'top 91%', end: 'top 55%', scrub: .7, ...scrollerOption } });
      });
      root.querySelectorAll<HTMLElement>('.ee-gallery__item').forEach((photo, index) => {
        gsap.fromTo(photo, { y: 100 + index * 14, x: index % 2 ? 38 : -38, rotate: index % 2 ? 8 : -8, opacity: .3 }, { y: 0, x: 0, rotate: [0, 0, -1.2, 1.2][index % 4], opacity: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 98%', end: 'top 53%', scrub: .8, ...scrollerOption } });
      });
      root.querySelectorAll<HTMLElement>('.ee-album__photo').forEach((photo, index) => {
        gsap.fromTo(photo, { x: index === 1 ? 80 : -80, y: 75, rotate: index === 1 ? 20 : -20, opacity: .3 }, { x: 0, y: 0, rotate: [-8, 9, -3][index] || 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.ee-album__collage', start: 'top 92%', end: 'center 52%', scrub: .75, ...scrollerOption } });
      });
      const dressDetails = root.querySelector('.ee-dress__details');
      if (dressDetails) gsap.fromTo(dressDetails.children, { y: 80, rotateY: 22, opacity: .2 }, { y: 0, rotateY: 0, opacity: 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: dressDetails, start: 'top 92%', end: 'center 54%', scrub: .8, ...scrollerOption } });
      root.querySelectorAll<HTMLElement>('.ee-memories__panel').forEach((panel, index) => {
        gsap.fromTo(panel, { xPercent: index ? 14 : -14, opacity: .2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 96%', end: 'center 62%', scrub: .8, ...scrollerOption } });
      });
      const rsvpCard = root.querySelector('.ee-rsvp__card');
      if (rsvpCard) gsap.fromTo(rsvpCard, { y: 90, scale: .86, opacity: .3 }, { y: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: rsvpCard, start: 'top 96%', end: 'center 55%', scrub: .85, ...scrollerOption } });
      root.querySelectorAll<SVGElement>('.ee-section > .ee-botanical, .ee-section > .ee-rings').forEach((ornament) => {
        gsap.fromTo(ornament, { y: -24 }, { y: 24, ease: 'none', scrollTrigger: { trigger: ornament.parentElement, start: 'top bottom', end: 'bottom top', scrub: .9, ...scrollerOption } });
      });
    }

    ScrollTrigger.create({
      trigger: root,
      start: 'top top', end: 'bottom bottom', ...scrollerOption,
      onUpdate: (self) => {
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      cancelAnimationFrame(activeFrame);
      scrollTarget.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, { scope: rootRef, dependencies: [isOpen, isBuilderPreview, sectionSignature] });

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
    const url = URL.createObjectURL(new Blob([file], { type: 'text/calendar;charset=utf-8' }));
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
      window.setTimeout(() => setCopiedClabe(false), 2400);
    } catch {
      toast.error('No se pudo copiar la CLABE');
    }
  };

  const submitRsvp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isBuilderPreview || !guestGroup) { toast.error('Abre tu enlace personal para confirmar'); return; }
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guestToken: guestGroup.guestToken, groupName: rsvpName, willAttend: willAttend === 'yes', confirmedAdults: adults, confirmedChildren: children, dietaryNotes, guestMessage }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      if (result.pass) setPass({ name: result.pass.groupName, adults, children, payload: result.pass.qrPayload });
      else { setPass(null); toast.success('Gracias por avisarnos'); }
    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo guardar tu respuesta'); }
  };

  const style = {
    '--ee-bg': theme.colors.bgPrimary,
    '--ee-bg-alt': theme.colors.bgSecondary,
    '--ee-ink': theme.colors.textPrimary,
    '--ee-muted': theme.colors.textMuted,
    '--ee-gold': theme.colors.accentPrimary,
    '--ee-bronze': theme.colors.accentSecondary,
    '--ee-seal': theme.envelope.sealColor || theme.colors.accentSecondary,
    '--ee-serif': invitationFontStack(theme.fonts.headingFont),
    '--ee-script': invitationFontStack(theme.fonts.scriptFont),
    '--ee-sans': invitationFontStack(theme.fonts.bodyFont),
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className="ee-root" style={style}>
      {(!isBuilderPreview || previewEnvelope) && <Opening config={config} eventDate={eventDate} guestGroup={guestGroup} isOpen={isOpen} onOpen={openInvitation} />}
      <FloatingAudioPlayer enabled={config.audio.enabled} trackUrl={config.audio.trackUrl} trackTitle={config.audio.trackTitle} isEnvelopeOpen={isOpen} accentColor={theme.colors.accentPrimary} />

      <div className="ee-progress" aria-hidden="true"><div ref={progressRef} /></div>
      <header className="ee-nav">
        <a href="#hero" className="ee-nav__brand" aria-label={`Volver al inicio de ${content.hero.mainTitle}`}>
          <span className="ee-nav__monogram">{theme.envelope.sealMonogram}</span>
          <span className="ee-nav__names">{content.hero.mainTitle}</span>
        </a>
        <div className="ee-nav__links">
          {isSectionEnabled('locations') && <a className={activeSection === 'locations' ? 'is-active' : ''} href="#locations">Lugar</a>}
          {isSectionEnabled('timeline') && <a className={activeSection === 'timeline' ? 'is-active' : ''} href="#timeline">Programa</a>}
          {isSectionEnabled('gallery') && <a className={activeSection === 'gallery' ? 'is-active' : ''} href="#gallery">Momentos</a>}
        </div>
        {isSectionEnabled('rsvp') && <a href="#rsvp" className="ee-nav__rsvp">Confirmar <ArrowRight size={15} /></a>}
      </header>

      <main>
        {isSectionEnabled('hero') && (
          <section id="hero" className="ee-hero">
            <div className="ee-hero__stage">
            <span className="ee-hero__watermark" aria-hidden="true">∞</span>
            <span className="ee-hero__rule ee-hero__rule--top" aria-hidden="true" />
            <span className="ee-hero__rule ee-hero__rule--bottom" aria-hidden="true" />
            <div className="ee-hero__side-note"><span>EST. 2026</span><span>UNA HISTORIA PARA SIEMPRE</span></div>
            <div className="ee-hero__copy">
              <p className="ee-overline ee-entrance"><Diamond /> {content.hero.badgeText} <Diamond /></p>
              <p className="ee-hero__script ee-entrance">Nos elegimos, una y otra vez</p>
              <h1 className="ee-hero__title ee-entrance">{content.hero.mainTitle}</h1>
              <div className="ee-hero__divider ee-entrance"><span /><Diamond /><span /></div>
              <p className="ee-hero__date ee-entrance">{dateText}</p>
              <p className="ee-hero__place ee-entrance">{content.hero.tagline.split('•').slice(1).join('•').trim() || content.hero.tagline}</p>
              {guestGroup && <p className="ee-hero__guest ee-entrance">Con especial cariño para {guestGroup.groupName}</p>}
              {isSectionEnabled('rsvp') && <a className="ee-button ee-button--outline ee-entrance" href="#rsvp">Confirma tu asistencia <ArrowRight size={16} /></a>}
            </div>
            <div className="ee-hero__visual">
              <span className="ee-hero__visual-frame" aria-hidden="true" />
              <div className="ee-hero__photo ee-photo">
                <HeroMedia hero={content.hero} alt={`Celebración de ${content.hero.mainTitle}`} />
              </div>
              <span className="ee-hero__photo-caption">EL COMIENZO DE NUESTRO PARA SIEMPRE</span>
              <Botanical className="ee-hero__branch" />
            </div>
            <div className="ee-hero__final"><span>CAPÍTULO UNO · EL GRAN DÍA</span><p>El comienzo de<br /><em>nuestro para siempre.</em></p>{isSectionEnabled('quote_story') && <a href="#story">Nuestra historia <ArrowDown size={16} /></a>}</div>
            {isSectionEnabled('quote_story') && <a className="ee-hero__scroll" href="#story" aria-label="Descubrir nuestra historia"><span>DESLIZA PARA DESCUBRIR</span><ArrowDown size={16} /></a>}
            </div>
          </section>
        )}

        {isSectionEnabled('quote_story') && (
          <section id="story" className="ee-story ee-section">
            <Botanical className="ee-story__branch" />
            <WeddingRings className="ee-story__rings" />
            <div className="ee-story__inner">
              <p className="ee-overline ee-reveal"><Diamond /> {sectionHeading(config, 'quote_story', 'eyebrow', 'NUESTRA HISTORIA')} <Diamond /></p>
              <span className="ee-story__quote-mark ee-reveal">“</span>
              <blockquote className="ee-story__quote" aria-label={content.quoteStory.quoteText}><span aria-hidden="true">{content.quoteStory.quoteText.replace(/^[“\"]|[”\"]$/g, '').split(/\s+/).map((word, index) => <span className="ee-story__word" key={`${word}-${index}`}>{word} </span>)}</span></blockquote>
              {content.quoteStory.quoteAuthor && <p className="ee-story__author ee-reveal">— {content.quoteStory.quoteAuthor}</p>}
              {content.quoteStory.storyBlocks && content.quoteStory.storyBlocks.length > 0 && (
                <div className="ee-story__chapters ee-stagger">
                  {content.quoteStory.storyBlocks.map((block, index) => (
                    <article key={`${block.title}-${index}`}>
                      <span className="ee-small-index">CAPÍTULO 0{index + 1}</span>
                      <h3>{block.title}</h3>
                      <p>{block.description}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {isSectionEnabled('vip_parents') && content.vipParents.groups.length > 0 && (
          <section id="family" className="ee-family ee-section">
            <WeddingRings className="ee-family__rings" />
            <SectionIntro eyebrow={sectionHeading(config, 'vip_parents', 'eyebrow', 'CON AMOR Y GRATITUD')} title={sectionHeading(config, 'vip_parents', 'title', 'Junto a quienes nos dieron alas')} />
            <p className="ee-family__blessing ee-reveal">{content.vipParents.blessingMessage}</p>
            <div className="ee-family__grid">
              {content.vipParents.groups.map((group, index) => (
                <article key={`${group.groupTitle}-${index}`}>
                  <span className="ee-small-index">0{index + 1} / {group.groupTitle}</span>
                  <div className="ee-family__rule"><Diamond /></div>
                  {group.names.map((name) => <p key={name}>{name}</p>)}
                </article>
              ))}
            </div>
          </section>
        )}

        {isSectionEnabled('countdown') && (
          <section id="countdown" className="ee-countdown ee-section">
            <Botanical className="ee-countdown__branch ee-countdown__branch--left" />
            <Botanical className="ee-countdown__branch ee-countdown__branch--right" />
            <SectionIntro eyebrow={sectionHeading(config, 'countdown', 'eyebrow', 'CUENTA REGRESIVA')} title={sectionHeading(config, 'countdown', 'title', 'El gran día se acerca')} />
            <div className="ee-countdown__clock" aria-label="Tiempo restante para el evento">
              {[
                ['DÍAS', timeLeft.days], ['HORAS', timeLeft.hours], ['MINUTOS', timeLeft.minutes], ['SEGUNDOS', timeLeft.seconds],
              ].map(([label, value]) => (
                <div key={String(label)}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>
              ))}
            </div>
            <div className="ee-countdown__actions ee-reveal">
              <a className="ee-button ee-button--dark" href={calendarUrl} target="_blank" rel="noopener noreferrer"><CalendarDays size={16} /> Agendar en Google</a>
              <button className="ee-button ee-button--outline" type="button" onClick={downloadIcs}><CalendarDays size={16} /> Apple / Outlook</button>
            </div>
          </section>
        )}

        {isSectionEnabled('locations') && content.locations.length > 0 && (
          <section id="locations" className="ee-locations ee-section">
            <Botanical className="ee-locations__branch" />
            <SectionIntro eyebrow={sectionHeading(config, 'locations', 'eyebrow', 'EL ESCENARIO')} title={sectionHeading(config, 'locations', 'title', 'Dónde celebraremos')} />
            <div className="ee-locations__grid">
              {content.locations.map((location, index) => (
                <article className="ee-location ee-reveal" key={location.id}>
                  {location.imageUrl && (
                    <div className="ee-location__photo ee-photo">
                      <img src={location.imageUrl} alt={location.venueName} loading="lazy" decoding="async" />
                    </div>
                  )}
                  <div className="ee-location__detail">
                    <p className="ee-small-index">0{index + 1} / {location.title}</p>
                    <h3>{location.venueName}</h3>
                    <div className="ee-location__time"><Clock3 size={16} /> {location.time}</div>
                    <p className="ee-location__address">{location.address}</p>
                    <div className="ee-location__links">
                      <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer">Ver en Maps <ArrowRight size={15} /></a>
                      <a href={location.wazeUrl} target="_blank" rel="noopener noreferrer">Abrir en Waze <Navigation size={15} /></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <LocationDirections locations={content.locations} />
          </section>
        )}

        {isSectionEnabled('timeline') && content.timeline.length > 0 && (
          <section id="timeline" className="ee-timeline ee-section">
            <Botanical className="ee-timeline__branch" />
            <div className="ee-timeline__intro"><SectionIntro eyebrow={sectionHeading(config, 'timeline', 'eyebrow', 'EL PROGRAMA')} title={sectionHeading(config, 'timeline', 'title', 'Un día para recordar')} align="left" /><p className="ee-reveal">Cada momento fue pensado para compartirlo con ustedes.</p></div>
            <div className="ee-timeline__list">
              <span className="ee-timeline__line"><span className="ee-timeline__line-fill" /></span>
              {content.timeline.map((item, index) => (
                <article key={item.id} className="ee-timeline__item">
                  <span className="ee-timeline__dot"><Diamond /></span>
                  <time>{item.time}</time>
                  <div><span className="ee-small-index">MOMENTO 0{index + 1}</span><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        {isSectionEnabled('gallery') && content.gallery.images.length > 0 && (
          <section id="gallery" className="ee-gallery ee-section">
            <WeddingRings className="ee-gallery__rings" />
            <SectionIntro eyebrow={sectionHeading(config, 'gallery', 'eyebrow', 'INSTANTES QUE GUARDAMOS')} title={sectionHeading(config, 'gallery', 'title', 'Nuestra historia en imágenes')} />
            <div className="ee-gallery__grid">
              {content.gallery.images.map((photo, index) => (
                <figure key={`${photo.url}-${index}`} className={`ee-gallery__item ee-gallery__item--${index % 4}`}>
                  <div className="ee-photo"><img src={photo.url} alt={photo.caption || `Recuerdo ${index + 1}`} loading="lazy" decoding="async" /></div>
                  <figcaption><span>0{index + 1}</span>{photo.caption || 'Un recuerdo para siempre'}</figcaption>
                </figure>
              ))}
            </div>
            <p className="ee-gallery__closing ee-reveal">El amor vive en los detalles.</p>
          </section>
        )}

        {isSectionEnabled('gallery') && <section className="ee-album ee-section"><SectionIntro eyebrow="RECUERDOS DESDE TU MIRADA" title="Un álbum para todos" /><SharedAlbum slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} /></section>}

        {isSectionEnabled('dress_code') && (
          <section id="dress-code" className="ee-dress ee-section">
            <Botanical className="ee-dress__branch ee-dress__branch--left" />
            <Botanical className="ee-dress__branch ee-dress__branch--right" />
            <div className="ee-dress__inner">
              <SectionIntro eyebrow={sectionHeading(config, 'dress_code', 'eyebrow', 'CÓDIGO DE VESTIMENTA')} title={sectionHeading(config, 'dress_code', 'title', content.dressCode.title)} />
              <div className="ee-dress__details">
                <div><span className="ee-small-index">PARA ELLAS</span><p>{content.dressCode.womenNotes}</p></div>
                <div><span className="ee-small-index">PARA ELLOS</span><p>{content.dressCode.menNotes}</p></div>
              </div>
              {content.dressCode.reservedColors.length > 0 && (
                <div className="ee-dress__reserved ee-reveal">
                  <div className="ee-dress__swatches">{content.dressCode.reservedColors.map((color) => <span key={color.name} title={color.name} style={{ backgroundColor: color.hex }} />)}</div>
                  <p>{content.dressCode.reservedNote}</p>
                </div>
              )}
              {content.dressCode.pinterestBoardUrl && <a className="ee-text-link ee-reveal" href={content.dressCode.pinterestBoardUrl} target="_blank" rel="noopener noreferrer">Ver inspiración <ArrowRight size={16} /></a>}
            </div>
          </section>
        )}

        {isSectionEnabled('gifts') && (
          <section id="gifts" className="ee-gifts ee-section">
            <Botanical className="ee-gifts__branch" />
            <WeddingRings className="ee-gifts__rings" />
            <SectionIntro eyebrow={sectionHeading(config, 'gifts', 'eyebrow', 'UN DETALLE CON CARIÑO')} title={sectionHeading(config, 'gifts', 'title', 'Mesa de regalos')} />
            <p className="ee-gifts__intro ee-reveal">{content.gifts.introMessage}</p>
            <div className="ee-gifts__options ee-stagger">
              {content.gifts.registries.map((registry) => (
                <a key={registry.storeName} href={registry.url} target="_blank" rel="noopener noreferrer" className="ee-gift-option">
                  <Gift size={21} strokeWidth={1.3} />
                  <div><span className="ee-small-index">MESA DE REGALOS</span><strong>{registry.storeName}</strong><small>{registry.eventNumber}</small></div>
                  <ChevronRight size={17} />
                </a>
              ))}
              {content.gifts.bankTransfer?.enabled && (
                <div className="ee-gift-option ee-gift-option--bank">
                  <Gift size={21} strokeWidth={1.3} />
                  <div><span className="ee-small-index">TRANSFERENCIA</span><strong>{content.gifts.bankTransfer.bankName}</strong><small>CLABE {content.gifts.bankTransfer.clabe}</small></div>
                  <button type="button" onClick={copyClabe} aria-label="Copiar CLABE" title="Copiar CLABE">{copiedClabe ? <Check size={18} /> : <Copy size={17} />}</button>
                </div>
              )}
            </div>
            {content.gifts.cashEnvelopeAtVenue && <p className="ee-gifts__note ee-reveal">También habrá un espacio para lluvia de sobres el día del evento.</p>}
          </section>
        )}

        {isSectionEnabled('accommodation') && content.accommodation.length > 0 && (
          <section id="accommodation" className="ee-stay ee-section">
            <Botanical className="ee-stay__branch" />
            <div className="ee-stay__intro"><SectionIntro eyebrow={sectionHeading(config, 'accommodation', 'eyebrow', 'PARA QUIENES NOS VISITAN')} title={sectionHeading(config, 'accommodation', 'title', 'Quédense un poco más')} align="left" /><p className="ee-reveal">Algunas opciones para disfrutar San Miguel de Allende con calma.</p></div>
            <div className="ee-stay__list ee-stagger">
              {content.accommodation.map((hotel, index) => (
                <article key={`${hotel.hotelName}-${index}`}>
                  <span className="ee-small-index">ESTANCIA 0{index + 1}</span>
                  <div><h3>{hotel.hotelName}</h3><p>{hotel.distanceNote}</p>{hotel.discountCode && <small>Código: {hotel.discountCode}</small>}</div>
                  {hotel.bookingUrl && <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${hotel.hotelName}`}><ArrowRight size={19} /></a>}
                </article>
              ))}
            </div>
          </section>
        )}

        {isSectionEnabled('social_features') && (content.socialFeatures.enableSongRequests || content.socialFeatures.enableAudioGuestbook) && (
          <section id="memories" className="ee-memories ee-section">
            <WeddingRings className="ee-memories__rings" />
            <SectionIntro eyebrow={sectionHeading(config, 'social_features', 'eyebrow', 'LA CELEBRACIÓN CONTINÚA')} title={sectionHeading(config, 'social_features', 'title', 'Hagamos recuerdos juntos')} />
            {content.socialFeatures.hashtag && <p className="ee-memories__hashtag ee-reveal">{content.socialFeatures.hashtag}</p>}
            <SocialFeatures slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} songsEnabled={content.socialFeatures.enableSongRequests} audioEnabled={content.socialFeatures.enableAudioGuestbook} />
          </section>
        )}

        {isSectionEnabled('rsvp') && (
          <section id="rsvp" className="ee-rsvp ee-section">
            <Botanical className="ee-rsvp__branch ee-rsvp__branch--left" />
            <Botanical className="ee-rsvp__branch ee-rsvp__branch--right" />
            <div className="ee-rsvp__card">
              <SectionIntro eyebrow={sectionHeading(config, 'rsvp', 'eyebrow', 'TE ESPERAMOS CON AMOR')} title={sectionHeading(config, 'rsvp', 'title', 'Confirma tu asistencia')} />
              <p className="ee-rsvp__intro">{guestGroup ? `Una invitación reservada especialmente para ${guestGroup.groupName}. Tienen ${guestGroup.allocatedAdults + guestGroup.allocatedChildren} pases asignados.` : 'Nos encantará compartir este día contigo. Confirma para preparar tu lugar.'}</p>
              {!pass ? (
                <form onSubmit={submitRsvp} className="ee-rsvp__form">
                  <label>Nombre o familia<input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} readOnly={Boolean(guestGroup)} placeholder="Tu nombre completo" required /></label>
                  <div className="ee-rsvp__row">
                    <label>¿Nos acompañarás?<select value={willAttend} onChange={(event) => setWillAttend(event.target.value as 'yes' | 'no')}><option value="yes">Sí, con mucho gusto</option><option value="no">No podré asistir</option></select></label>
                    <label>WhatsApp<input type="tel" value={rsvpPhone} onChange={(event) => setRsvpPhone(event.target.value)} placeholder="Tu número" /></label>
                  </div>
                  {willAttend === 'yes' && <div className="ee-rsvp__row">
                    <label>Adultos<select value={adults} onChange={(event) => setAdults(Number(event.target.value))}>{Array.from({ length: guestGroup ? guestGroup.allocatedAdults + 1 : 4 }, (_, index) => guestGroup ? index : index + 1).map((value) => <option key={value} value={value}>{value} {value === 1 ? 'adulto' : 'adultos'}</option>)}</select></label>
                    {content.rsvp.allowChildrenSelection && (guestGroup?.allocatedChildren ?? 2) > 0 && <label>Niños<select value={children} onChange={(event) => setChildren(Number(event.target.value))}>{Array.from({ length: (guestGroup?.allocatedChildren ?? 2) + 1 }, (_, index) => index).map((value) => <option key={value} value={value}>{value} {value === 1 ? 'niño' : 'niños'}</option>)}</select></label>}
                  </div>}
                  {willAttend === 'yes' && content.rsvp.askDietaryRestrictions && <label>Restricciones alimentarias (opcional)<input value={dietaryNotes} onChange={(event) => setDietaryNotes(event.target.value)} placeholder="Cuéntanos si necesitas algo especial" /></label>}
                  <label>Déjanos un mensaje (opcional)<textarea rows={3} value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} placeholder="Unas palabras para nosotros" /></label>
                  <button className="ee-button ee-button--dark ee-rsvp__submit" type="submit">Enviar mi respuesta <ArrowRight size={17} /></button>
                  <small>Usa tu enlace personal para guardar tu respuesta.</small>
                </form>
              ) : (
                <div className="ee-rsvp__pass">
                  <Check size={24} />
                  <h3>¡Nos vemos ahí!</h3>
                  <p>{pass.name} · {pass.adults + pass.children} {pass.adults + pass.children === 1 ? 'asistente' : 'asistentes'}</p>
                  <div className="ee-rsvp__qr"><QRCodeSVG value={pass.payload} size={156} level="M" /></div>
                  <p className="ee-rsvp__pass-note">{content.rsvp.customConfirmationMessage}</p>
                  <button type="button" onClick={() => setPass(null)}>Modificar respuesta</button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="ee-footer">
        <Botanical className="ee-footer__branch ee-footer__branch--left" />
        <Botanical className="ee-footer__branch ee-footer__branch--right" />
        <span className="ee-footer__symbol">∞</span>
        <p>{content.hero.mainTitle}</p>
        <small>{dateText} · Gracias por ser parte de nuestra historia</small>
        <a href="#hero" aria-label="Volver al inicio">Volver al inicio ↑</a>
      </footer>
    </div>
  );
}
