'use client';

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
  Music2,
  Navigation,
  Volume2,
} from 'lucide-react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { buildGoogleCalendarUrl, buildIcsFileContent } from '@/lib/calendar/ics-generator';
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import './eternal-elegance.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface EternalEleganceExperienceProps {
  slug: string;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
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

const fontVariable: Record<string, string> = {
  'Cormorant Garamond': '--font-cormorant',
  'Playfair Display': '--font-playfair',
  Cinzel: '--font-cinzel',
  'Pinyon Script': '--font-pinyon',
  'Great Vibes': '--font-great-vibes',
  Montserrat: '--font-montserrat',
  Inter: '--font-inter',
  'Plus Jakarta Sans': '--font-jakarta',
};

const fontStack = (font: string, fallback: string) =>
  fontVariable[font] ? `var(${fontVariable[font]}), ${fallback}` : `'${font}', ${fallback}`;

function Botanical({ className = '' }: { className?: string }) {
  return (
    <svg className={`ee-botanical ${className}`} viewBox="0 0 180 250" fill="none" aria-hidden="true">
      <path className="ee-draw" d="M91 247C75 203 76 166 91 130c14-36 18-75 3-126" />
      <path className="ee-draw" d="M82 209c-18-7-32-17-41-35M78 177c16-10 27-23 34-40M84 149c-18-8-34-23-40-42M98 115c17-9 27-22 33-38M103 77C87 65 78 48 78 28" />
      <path className="ee-draw" d="M42 174c-9 5-20 7-30 4 5-12 15-20 29-18M111 137c12 3 22 0 31-7-8-9-17-13-27-12M44 107c-14 0-26-8-32-18 12-7 26-5 37 4M130 77c13 2 25-3 37-14-12-8-25-8-38 0M78 29C65 22 59 11 57 1c13-1 25 6 31 17" />
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
      <h2 className="ee-heading ee-reveal">{title}</h2>
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
            {guestGroup && <p className="ee-opening__recipient">Una invitación para <strong>{guestGroup.groupName}</strong></p>}
            <motion.button
              type="button"
              className="ee-envelope"
              onClick={() => setOpening(true)}
              disabled={opening}
              animate={opening ? { y: 30, scale: 1.08, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Abrir invitación de boda"
            >
              <span className="ee-envelope__flap" />
              <span className="ee-envelope__fold ee-envelope__fold--left" />
              <span className="ee-envelope__fold ee-envelope__fold--right" />
              <span className="ee-envelope__card">
                <span>Para</span>
                <strong>{guestGroup?.groupName || 'nuestros seres queridos'}</strong>
                {guestGroup && <small>{guestGroup.allocatedAdults + guestGroup.allocatedChildren} pases reservados</small>}
              </span>
              <motion.span
                className="ee-envelope__seal"
                animate={opening ? { rotate: 22, scale: 0 } : { rotate: [0, -5, 5, 0], scale: [1, 1.04, 1] }}
                transition={opening ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {config.theme.envelope.sealMonogram}
              </motion.span>
            </motion.button>
            <p className="ee-opening__hint">Toca el sello para abrir la invitación</p>
            {config.audio.enabled && <p className="ee-opening__audio"><Volume2 size={13} /> Una experiencia con música</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EternalEleganceExperience({
  slug,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
}: EternalEleganceExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(forceEnvelopeOpen || isBuilderPreview);
  const [activeSection, setActiveSection] = useState('hero');
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [songs, setSongs] = useState([
    { id: '1', title: 'September', artist: 'Earth, Wind & Fire', votes: 14 },
    { id: '2', title: 'Vivir Mi Vida', artist: 'Marc Anthony', votes: 11 },
  ]);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
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

  useEffect(() => setIsOpen(forceEnvelopeOpen || isBuilderPreview), [forceEnvelopeOpen, isBuilderPreview]);

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

      root.querySelectorAll<HTMLElement>('.ee-photo img').forEach((image) => {
        gsap.fromTo(image, { scale: 1.13, yPercent: -3 }, {
          scale: 1, yPercent: 3, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7, ...scrollerOption },
        });
      });

      root.querySelectorAll<HTMLElement>('.ee-botanical').forEach((botanical) => {
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

      const heroPhoto = root.querySelector('.ee-hero__photo');
      const hero = root.querySelector('.ee-hero');
      if (heroPhoto && hero) gsap.fromTo(heroPhoto,
        { clipPath: 'inset(8% 10% 8% 10% round 48% 48% 0 0)' },
        { clipPath: 'inset(0% 0% 0% 0% round 48% 48% 0 0)', ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, ...scrollerOption } });
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

  const addSong = (event: React.FormEvent) => {
    event.preventDefault();
    if (!songTitle.trim()) return;
    setSongs((current) => [{ id: String(Date.now()), title: songTitle.trim(), artist: songArtist.trim() || 'Artista', votes: 1 }, ...current]);
    setSongTitle('');
    setSongArtist('');
    toast.success('Canción agregada a la lista de esta vista');
  };

  const submitRsvp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rsvpName.trim()) return;
    if (willAttend === 'no') {
      setPass(null);
      toast.success('Gracias por avisarnos');
      return;
    }
    if (adults + children < 1) {
      toast.error('Selecciona al menos una persona para confirmar');
      return;
    }
    setPass({
      name: rsvpName.trim(), adults, children,
      payload: `DEMO:${slug}:${guestGroup?.guestToken || 'invitado'}:${adults}:${children}`,
    });
  };

  const style = {
    '--ee-bg': theme.colors.bgPrimary,
    '--ee-bg-alt': theme.colors.bgSecondary,
    '--ee-ink': theme.colors.textPrimary,
    '--ee-muted': theme.colors.textMuted,
    '--ee-gold': theme.colors.accentPrimary,
    '--ee-bronze': theme.colors.accentSecondary,
    '--ee-serif': fontStack(theme.fonts.headingFont, 'Georgia, serif'),
    '--ee-script': fontStack(theme.fonts.scriptFont, 'cursive'),
    '--ee-sans': fontStack(theme.fonts.bodyFont, 'Arial, sans-serif'),
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className="ee-root" style={style}>
      {!isBuilderPreview && <Opening config={config} eventDate={eventDate} guestGroup={guestGroup} isOpen={isOpen} onOpen={openInvitation} />}
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
              <div className="ee-hero__photo ee-photo">
                <img src={content.hero.coverImageUrl} alt={`Celebración de ${content.hero.mainTitle}`} fetchPriority="high" decoding="async" style={{ objectPosition: `${content.hero.focalPoint.x}% ${content.hero.focalPoint.y}%` }} />
              </div>
              <span className="ee-hero__photo-caption">EL COMIENZO DE NUESTRO PARA SIEMPRE</span>
              <Botanical className="ee-hero__branch" />
            </div>
            {isSectionEnabled('quote_story') && <a className="ee-hero__scroll" href="#story" aria-label="Descubrir nuestra historia"><span>DESLIZA PARA DESCUBRIR</span><ArrowDown size={16} /></a>}
          </section>
        )}

        {isSectionEnabled('quote_story') && (
          <section id="story" className="ee-story ee-section">
            <Botanical className="ee-story__branch" />
            <div className="ee-story__inner">
              <p className="ee-overline ee-reveal"><Diamond /> NUESTRA HISTORIA <Diamond /></p>
              <span className="ee-story__quote-mark ee-reveal">“</span>
              <blockquote className="ee-story__quote ee-reveal">{content.quoteStory.quoteText.replace(/^[“\"]|[”\"]$/g, '')}</blockquote>
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
            <SectionIntro eyebrow="CON AMOR Y GRATITUD" title="Junto a quienes nos dieron alas" />
            <p className="ee-family__blessing ee-reveal">{content.vipParents.blessingMessage}</p>
            <div className="ee-family__grid ee-stagger">
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
            <SectionIntro eyebrow="CUENTA REGRESIVA" title="El gran día se acerca" />
            <div className="ee-countdown__clock ee-stagger" aria-label="Tiempo restante para el evento">
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
            <SectionIntro eyebrow="EL ESCENARIO" title="Dónde celebraremos" />
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
          </section>
        )}

        {isSectionEnabled('timeline') && content.timeline.length > 0 && (
          <section id="timeline" className="ee-timeline ee-section">
            <div className="ee-timeline__intro"><SectionIntro eyebrow="EL PROGRAMA" title="Un día para recordar" align="left" /><p className="ee-reveal">Cada momento fue pensado para compartirlo con ustedes.</p></div>
            <div className="ee-timeline__list">
              <span className="ee-timeline__line"><span className="ee-timeline__line-fill" /></span>
              {content.timeline.map((item, index) => (
                <article key={item.id} className="ee-timeline__item ee-reveal">
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
            <SectionIntro eyebrow="INSTANTES QUE GUARDAMOS" title="Nuestra historia en imágenes" />
            <div className="ee-gallery__grid ee-stagger">
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

        {isSectionEnabled('dress_code') && (
          <section id="dress-code" className="ee-dress ee-section">
            <div className="ee-dress__inner">
              <SectionIntro eyebrow="CÓDIGO DE VESTIMENTA" title={content.dressCode.title} />
              <div className="ee-dress__details ee-stagger">
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
            <SectionIntro eyebrow="UN DETALLE CON CARIÑO" title="Mesa de regalos" />
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
            <div className="ee-stay__intro"><SectionIntro eyebrow="PARA QUIENES NOS VISITAN" title="Quédense un poco más" align="left" /><p className="ee-reveal">Algunas opciones para disfrutar San Miguel de Allende con calma.</p></div>
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
            <SectionIntro eyebrow="LA CELEBRACIÓN CONTINÚA" title="Hagamos recuerdos juntos" />
            {content.socialFeatures.hashtag && <p className="ee-memories__hashtag ee-reveal">{content.socialFeatures.hashtag}</p>}
            <div className="ee-memories__grid">
              {content.socialFeatures.enableSongRequests && (
                <div className="ee-memories__panel ee-reveal">
                  <Music2 size={25} strokeWidth={1.3} />
                  <h3>La música de nuestra noche</h3>
                  <p>¿Qué canción no puede faltar en la pista?</p>
                  <form onSubmit={addSong} className="ee-memories__form">
                    <label className="sr-only" htmlFor="ee-song">Canción</label><input id="ee-song" value={songTitle} onChange={(event) => setSongTitle(event.target.value)} placeholder="Nombre de la canción" required />
                    <label className="sr-only" htmlFor="ee-artist">Artista</label><input id="ee-artist" value={songArtist} onChange={(event) => setSongArtist(event.target.value)} placeholder="Artista" />
                    <button type="submit" aria-label="Sugerir canción"><ArrowRight size={19} /></button>
                  </form>
                  <div className="ee-song-list">{songs.map((song) => <div key={song.id}><span><strong>{song.title}</strong><small>{song.artist}</small></span><button type="button" onClick={() => setSongs((current) => current.map((item) => item.id === song.id ? { ...item, votes: item.votes + 1 } : item))} aria-label={`Votar por ${song.title}`}><Heart size={14} /> {song.votes}</button></div>)}</div>
                </div>
              )}
              {content.socialFeatures.enableAudioGuestbook && (
                <div className="ee-memories__panel ee-memories__panel--voice ee-reveal">
                  <span className="ee-memories__wave" aria-hidden="true">||||||||||||||||</span>
                  <h3>Tu voz, nuestro recuerdo</h3>
                  <p>Déjanos unas palabras que podamos volver a escuchar.</p>
                  <button type="button" className="ee-button ee-button--outline" onClick={() => toast.info('Grabación de voz disponible próximamente')}><Volume2 size={16} /> Dejar un mensaje</button>
                </div>
              )}
            </div>
          </section>
        )}

        {isSectionEnabled('rsvp') && (
          <section id="rsvp" className="ee-rsvp ee-section">
            <Botanical className="ee-rsvp__branch ee-rsvp__branch--left" />
            <Botanical className="ee-rsvp__branch ee-rsvp__branch--right" />
            <div className="ee-rsvp__card ee-reveal">
              <SectionIntro eyebrow="TE ESPERAMOS CON AMOR" title="Confirma tu asistencia" />
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
                  <small>Esta invitación es una demostración visual. Las respuestas no se guardan.</small>
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
        <span className="ee-footer__symbol">∞</span>
        <p>{content.hero.mainTitle}</p>
        <small>{dateText} · Gracias por ser parte de nuestra historia</small>
        <a href="#hero" aria-label="Volver al inicio">Volver al inicio ↑</a>
      </footer>
    </div>
  );
}
