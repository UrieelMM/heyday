'use client';
import { SharedAlbum } from '../core/SharedAlbum';
import { SocialFeatures } from '../core/SocialFeatures';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Apple, ArrowDown, ArrowRight, CalendarDays, Camera, CarFront, Check, Clock3, Gift, Heart, ImagePlus, MapPin, MapPinned, Music2, Route, Sparkles, Volume2 } from 'lucide-react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { buildGoogleCalendarUrl, buildIcsFileContent } from '@/lib/calendar/ics-generator';
import { FloatingAudioPlayer } from '../core/FloatingAudioPlayer';
import { createDefaultInvitationConfig } from '@/lib/templates/templates-catalog';
import './royal-xv-enchanted.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RoyalXVProps {
  slug: string;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
}

const formatDate = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(parsed);
};

const quinceName = (title: string) => title.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || title;

// Older saved demos may still contain the wedding seed content. Only replace recognisable
// seed copy, so a host's own edits remain untouched.
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

function Butterfly({ className = '' }: { className?: string }) {
  return (
    <svg className={`rx-butterfly ${className}`} viewBox="0 0 92 82" fill="none" aria-hidden="true">
      <path d="M46 45C28 8 2 5 6 31c2 13 21 19 40 14ZM46 45C64 8 90 5 86 31c-2 13-21 19-40 14ZM45 47C25 42 16 51 22 65c6 15 20 9 24-18ZM47 47c20-5 29 4 23 18-6 15-20 9-24-18Z" fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M46 26v36M42 31l-8-11M50 31l8-11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="30" cy="30" r="1.3" fill="currentColor" /><circle cx="62" cy="30" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Twinkle({ className = '' }: { className?: string }) {
  return <svg className={`rx-twinkle ${className}`} viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M17 0c1.8 9 6 13.2 17 17-11 3.8-15.2 8-17 17C15.2 25 11 20.8 0 17 11 13.2 15.2 9 17 0Z" fill="currentColor" /></svg>;
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return <div className={`rx-section-heading rx-reveal${light ? ' rx-section-heading--light' : ''}`}><span>{eyebrow}</span><h2>{title}</h2><i aria-hidden="true" /></div>;
}

function Opening({ config, guestGroup, name, isOpen, onOpen }: { config: InvitationConfig; guestGroup?: GuestGroup | null; name: string; isOpen: boolean; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(() => { onOpen(); setOpening(false); }, 1000);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);

  return <AnimatePresence>{!isOpen && <motion.div className="rx-opening" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
    <div className="rx-opening__halo" aria-hidden="true" />
    <Twinkle className="rx-opening__star rx-opening__star--one" /><Twinkle className="rx-opening__star rx-opening__star--two" />
    <Butterfly className="rx-opening__butterfly rx-opening__butterfly--one" /><Butterfly className="rx-opening__butterfly rx-opening__butterfly--two" />
    <div className="rx-opening__content">
      <p className="rx-kicker">UNA NOCHE HECHA PARA SOÑAR</p>
      <p className="rx-opening__script">Te invito a celebrar</p>
      <h1>Mis XV <em>{name}</em></h1>
      <p className="rx-opening__intro">Hay una historia esperando por nosotros. La mía empieza aquí, contigo.</p>
      <motion.div className={`rx-opening__envelope${opening ? ' rx-opening__envelope--open' : ''}`} animate={opening ? { y: 28, opacity: 0, scale: 1.04 } : { y: 0, opacity: 1, scale: 1 }} transition={{ duration: .6, delay: opening ? .24 : 0 }}>
        <span className="rx-opening__envelope-side rx-opening__envelope-side--left" aria-hidden="true" />
        <span className="rx-opening__envelope-side rx-opening__envelope-side--right" aria-hidden="true" />
        <span className="rx-opening__envelope-bottom" aria-hidden="true" />
        <span className="rx-opening__envelope-flap" aria-hidden="true" />
        <span className="rx-opening__seal" aria-hidden="true">XV</span>
        <span className="rx-opening__recipient"><span>ESTA INVITACIÓN ES PARA</span><strong>{guestGroup?.groupName || 'Ti, que eres parte de mi historia'}</strong><small>{guestGroup ? `${guestGroup.allocatedAdults + guestGroup.allocatedChildren} pases reservados` : 'Una noche para recordar'}</small></span>
      </motion.div>
      <motion.button className="rx-button rx-button--light" type="button" disabled={opening} onClick={() => setOpening(true)} whileHover={{ y: -3 }} whileTap={{ scale: .98 }}>Abrir mi invitación <ArrowRight size={17} /></motion.button>
      {config.audio.enabled && <p className="rx-opening__audio"><Volume2 size={14} /> Una experiencia con música</p>}
    </div>
  </motion.div>}</AnimatePresence>;
}

export function RoyalXVEnchantedExperience({ slug, eventDate, config, guestGroup, forceEnvelopeOpen = false, isBuilderPreview = false }: RoyalXVProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(forceEnvelopeOpen || isBuilderPreview);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpName, setRsvpName] = useState(guestGroup?.groupName || '');
  const [rsvpPhone, setRsvpPhone] = useState(guestGroup?.whatsappPhone || '');
  const [willAttend, setWillAttend] = useState('yes');
  const [adults, setAdults] = useState(guestGroup?.allocatedAdults || 1);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState('');
  const [passPayload, setPassPayload] = useState('');
  const [passName, setPassName] = useState('');
  const content = useMemo(() => royalContent(config), [config]);
  const name = quinceName(content.hero.mainTitle);
  const dateLabel = formatDate(eventDate);
  const maxAdults = guestGroup?.allocatedAdults ?? 4;
  const maxChildren = guestGroup?.allocatedChildren ?? 2;
  const enabled = (id: string) => config.sectionsOrder.find((section) => section.id === id)?.enabled ?? true;

  useEffect(() => setIsOpen(forceEnvelopeOpen || isBuilderPreview), [forceEnvelopeOpen, isBuilderPreview]);
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(eventDate).getTime() - Date.now());
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 });
    };
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, [eventDate]);

  useGSAP(() => {
    if (!isOpen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = rootRef.current?.querySelector<HTMLElement>('.rx-hero');
    if (hero) {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance.from('.rx-hero__kicker, .rx-hero__script', { y: 28, opacity: 0, duration: 1, stagger: .12 })
        .from('.rx-hero__title-line', { yPercent: 110, rotate: 4, duration: 1.25, stagger: .16 }, .2)
        .from('.rx-hero__line, .rx-hero__details, .rx-hero__guest, .rx-hero__actions', { y: 26, opacity: 0, duration: .85, stagger: .1 }, .6)
        .from('.rx-hero__visual', { scale: .9, opacity: 0, duration: 1.4 }, .2);
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
        .to('.rx-hero__copy', { yPercent: -22, opacity: 0, duration: .55 }, 0)
        .to('.rx-hero__watermark', { scale: 1.42, rotate: -10, opacity: 0, duration: 1 }, 0)
        .to('.rx-hero__visual', { left: '0%', top: '0%', width: '100%', height: '100%', clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
        .to('.rx-hero__visual img', { scale: 1.08, yPercent: -5, duration: 1 }, 0)
        .fromTo('.rx-hero__reveal', { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: .38 }, .55)
        .to('.rx-hero__scroll', { opacity: 0, duration: .3 }, 0);
    }
    gsap.utils.toArray<HTMLElement>('.rx-reveal').forEach((element) => {
      gsap.fromTo(element, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray<HTMLElement>('.rx-parallax').forEach((element) => {
      gsap.fromTo(element, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: .8 } });
    });
    gsap.utils.toArray<HTMLElement>('.rx-section-heading h2').forEach((title) => {
      gsap.fromTo(title, { scale: .86, opacity: .35 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: title, start: 'top 95%', end: 'top 48%', scrub: .8 } });
    });
    const words = gsap.utils.toArray<HTMLElement>('.rx-story__word');
    if (words.length) gsap.to(words, { opacity: 1, stagger: .055, ease: 'none', scrollTrigger: { trigger: '.rx-story blockquote', start: 'top 78%', end: 'bottom 42%', scrub: .6 } });
    gsap.utils.toArray<HTMLElement>('.rx-family__card').forEach((card, index) => {
      gsap.fromTo(card, { y: 95, rotate: index % 2 ? 8 : -8, scale: .85, opacity: .25 }, { y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 50%', scrub: .75 } });
    });
    if (rootRef.current?.querySelector('.rx-countdown__grid')) gsap.fromTo('.rx-countdown__grid > div', { scale: .55, opacity: .15, rotate: -18 }, { scale: 1, opacity: 1, rotate: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.rx-countdown__grid', start: 'top 90%', end: 'center 52%', scrub: .8 } });
    if (rootRef.current?.querySelector('.rx-location__map')) gsap.fromTo('.rx-location__map', { clipPath: 'inset(18% 18% 18% 18% round 45% 45% 2% 2%)', scale: .85 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.rx-location', start: 'top 90%', end: 'center 45%', scrub: .9 } });
    if (rootRef.current?.querySelector('.rx-timeline__track')) gsap.fromTo('.rx-timeline__track', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.rx-timeline__list', start: 'top 70%', end: 'bottom 68%', scrub: .5 } });
    gsap.utils.toArray<HTMLElement>('.rx-gallery__photo').forEach((photo, index) => {
      gsap.fromTo(photo, { y: 110 + index * 18, x: (index - 1) * 65, rotate: (index - 1) * 19, opacity: .4 }, { y: index === 1 ? 25 : 0, x: 0, rotate: [-5, 3, -3][index] || 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.rx-gallery__grid', start: 'top 94%', end: 'center 52%', scrub: .8 } });
    });
    if (rootRef.current?.querySelector('.rx-dress__grid')) gsap.fromTo('.rx-dress__grid > div', { y: 85, rotateY: 25, opacity: .25 }, { y: 0, rotateY: 0, opacity: 1, stagger: .14, ease: 'none', scrollTrigger: { trigger: '.rx-dress__grid', start: 'top 90%', end: 'center 55%', scrub: .8 } });
    gsap.utils.toArray<HTMLElement>('.rx-social__grid > div').forEach((card, index) => {
      gsap.fromTo(card, { xPercent: index ? 18 : -18, opacity: .2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'center 62%', scrub: .7 } });
    });
  }, { scope: rootRef, dependencies: [isOpen] });

  const open = useCallback(() => setIsOpen(true), []);
  const handleCalendar = () => {
    const ics = buildIcsFileContent({ title: content.hero.mainTitle, description: `Mis XV años: ${name}`, location: content.locations[0]?.address || '', startDateIso: eventDate });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${slug}.ics`; link.click(); URL.revokeObjectURL(url);
  };
  const handleRsvp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBuilderPreview || !guestGroup) { toast.error('Abre tu enlace personal para confirmar'); return; }
    try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guestToken: guestGroup.guestToken, groupName: rsvpName, willAttend: willAttend === 'yes', confirmedAdults: adults, confirmedChildren: children, guestMessage: message }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); if (result.pass) { setPassName(result.pass.groupName); setPassPayload(result.pass.qrPayload); } else { setPassName(''); toast.success('Gracias por avisarnos'); } } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo guardar tu respuesta'); }
  };

  const mainLocation = content.locations[0];
  const mapAddress = mainLocation ? `${mainLocation.venueName}, ${mainLocation.address}` : '';
  const mapsQuery = encodeURIComponent(mapAddress);
  const calendarUrl = buildGoogleCalendarUrl({ title: content.hero.mainTitle, description: `Mis XV años: ${name}`, location: mainLocation?.address || '', startDateIso: eventDate });

  return <div ref={rootRef} className="rx-root" style={{ '--rx-accent': config.theme.colors.accentPrimary, '--rx-accent-soft': config.theme.colors.accentSecondary } as React.CSSProperties}>
    {!isBuilderPreview && <Opening config={config} guestGroup={guestGroup} name={name} isOpen={isOpen} onOpen={open} />}
    <FloatingAudioPlayer enabled={config.audio.enabled} trackUrl={config.audio.trackUrl} trackTitle={config.audio.trackTitle} isEnvelopeOpen={isOpen} accentColor={config.theme.colors.accentPrimary} />
    <nav className="rx-nav" aria-label="Navegación de la invitación"><a className="rx-nav__brand" href="#inicio"><span>XV</span>{name}</a><div><a href="#detalles">Detalles</a><a href="#momentos">Momentos</a><a href="#confirmar" className="rx-nav__rsvp">Confirmar <ArrowRight size={14} /></a></div></nav>
    <main>
      {enabled('hero') && <section id="inicio" className="rx-hero" aria-labelledby="rx-hero-title">
        <div className="rx-hero__stage">
          <span className="rx-hero__watermark" aria-hidden="true">XV</span>
          <div className="rx-hero__orbit rx-hero__orbit--one" aria-hidden="true" /><div className="rx-hero__orbit rx-hero__orbit--two" aria-hidden="true" />
          <Twinkle className="rx-hero__star" /><Twinkle className="rx-hero__star rx-hero__star--second" />
          <div className="rx-hero__visual"><div className="rx-hero__image-wrap"><img src={content.hero.coverImageUrl} alt={`Portal floral hacia la celebración de XV años de ${name}`} fetchPriority="high" decoding="async" style={{ objectPosition: `${content.hero.focalPoint.x}% ${content.hero.focalPoint.y}%` }} /></div><span className="rx-hero__vertical">THE ENCHANTED NIGHT · XV</span><Butterfly className="rx-hero__butterfly" /><Twinkle className="rx-hero__twinkle" /></div>
          <div className="rx-hero__copy"><p className="rx-kicker rx-hero__kicker">{content.hero.badgeText}</p><p className="rx-hero__script">Érase una vez...</p><h1 id="rx-hero-title"><span className="rx-hero__title-mask"><span className="rx-hero__title-line"><small>Mis</small> XV</span></span><span className="rx-hero__title-mask"><em className="rx-hero__title-line">{name}</em></span></h1><p className="rx-hero__line">Una noche para brillar, bailar y escribir un nuevo capítulo contigo.</p><div className="rx-hero__details"><span>{dateLabel}</span><span>{mainLocation?.venueName || content.hero.tagline}</span></div>{guestGroup && <p className="rx-hero__guest">Un lugar especial para {guestGroup.groupName}</p>}<div className="rx-hero__actions"><a className="rx-button rx-button--cream" href="#confirmar">Confirma tu asistencia <ArrowRight size={17} /></a></div></div>
          <div className="rx-hero__reveal"><span>CAPÍTULO XV</span><p>La noche en que<br /><em>todo brilla.</em></p><a href="#historia">Descubre mi historia <ArrowDown size={16} /></a></div>
          <a className="rx-hero__scroll" href="#historia">Desliza para descubrir <ArrowDown size={16} /></a>
        </div>
      </section>}

      {enabled('quote_story') && <section id="historia" className="rx-story rx-section"><Butterfly className="rx-story__butterfly rx-parallax" /><Twinkle className="rx-story__star" /><p className="rx-kicker rx-reveal">EL PRINCIPIO DE MI HISTORIA</p><blockquote aria-label={content.quoteStory.quoteText}><span aria-hidden="true">“{content.quoteStory.quoteText.replace(/^[“\"]|[”\"]$/g, '').split(/\s+/).map((word, index) => <span className="rx-story__word" key={`${word}-${index}`}>{word} </span>)}”</span></blockquote><p className="rx-story__signature rx-reveal">— {content.quoteStory.quoteAuthor || name}</p>{content.quoteStory.storyBlocks && <div className="rx-story__chapters">{content.quoteStory.storyBlocks.map((block, index) => <article className="rx-story__chapter rx-reveal" key={`${block.title}-${index}`}><span>0{index + 1} / MI HISTORIA</span><h3>{block.title}</h3><p>{block.description}</p></article>)}</div>}</section>}

      {enabled('vip_parents') && content.vipParents.groups.length > 0 && <section className="rx-family rx-section"><SectionHeading eyebrow="MIS PERSONAS FAVORITAS" title="Con quienes me vieron crecer" /><p className="rx-family__intro rx-reveal">{content.vipParents.blessingMessage}</p><div className="rx-family__grid">{content.vipParents.groups.map((group) => <article className="rx-family__card" key={group.groupTitle}><Twinkle /><span>{group.groupTitle}</span>{group.names.map((person) => <strong key={person}>{person}</strong>)}</article>)}</div></section>}

      {enabled('countdown') && <section className="rx-countdown rx-section"><Butterfly className="rx-countdown__butterfly" /><SectionHeading eyebrow="CADA VEZ MÁS CERCA" title="La magia comienza en…" light /><div className="rx-countdown__grid rx-reveal" aria-label="Cuenta regresiva para mis XV años">{Object.entries(timeLeft).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, '0')}</strong><span>{{ days: 'DÍAS', hours: 'HORAS', minutes: 'MINUTOS', seconds: 'SEGUNDOS' }[unit as keyof typeof timeLeft]}</span></div>)}</div><p className="rx-countdown__date rx-reveal">{dateLabel}</p><div className="rx-countdown__actions rx-reveal"><a href={calendarUrl} target="_blank" rel="noopener noreferrer"><CalendarDays size={17} /> Google Calendar</a><button type="button" onClick={handleCalendar}><CalendarDays size={17} /> Apple / Outlook</button></div></section>}

      {enabled('locations') && mainLocation && <section id="detalles" className="rx-location rx-section"><SectionHeading eyebrow="EL LUGAR DE NUESTRO ENCUENTRO" title="Nos vemos ahí" /><div className="rx-location__layout"><div className="rx-location__map rx-reveal"><iframe title={`Mapa de ${mainLocation.venueName}`} src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><span>01 / EL DESTINO</span></div><div className="rx-location__info rx-reveal"><p className="rx-kicker">{mainLocation.title}</p><h3>{mainLocation.venueName}</h3><p className="rx-location__time"><Clock3 size={18} /> {mainLocation.time}</p><p className="rx-location__address"><MapPin size={18} /> {mainLocation.address}</p><p className="rx-location__help">Elige cómo llegar y prepárate para una noche inolvidable.</p><div className="rx-location__routes"><a href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=${mapsQuery}`} target="_blank" rel="noopener noreferrer"><CarFront size={18} /> Uber</a><a href={`https://maps.apple.com/?daddr=${mapsQuery}`} target="_blank" rel="noopener noreferrer"><Apple size={18} /> Apple Maps</a><a href={mainLocation.googleMapsUrl} target="_blank" rel="noopener noreferrer"><MapPinned size={18} /> Google Maps</a><a href={mainLocation.wazeUrl} target="_blank" rel="noopener noreferrer"><Route size={18} /> Waze</a></div></div></div></section>}

      {enabled('timeline') && content.timeline.length > 0 && <section className="rx-timeline rx-section"><SectionHeading eyebrow="EL PLAN DE LA NOCHE" title="Momentos para recordar" /><div className="rx-timeline__list"><span className="rx-timeline__track" aria-hidden="true" />{content.timeline.map((item, index) => <article className="rx-timeline__item rx-reveal" key={item.id}><span className="rx-timeline__number">0{index + 1}</span><div><span className="rx-timeline__time">{item.time}</span><h3>{item.title}</h3><p>{item.description}</p></div><Twinkle /></article>)}</div></section>}

      {enabled('gallery') && content.gallery.images.length > 0 && <section id="momentos" className="rx-gallery rx-section"><SectionHeading eyebrow="PEQUEÑOS VISTAZOS" title="El mundo de mis XV" /><div className="rx-gallery__grid">{content.gallery.images.map((image, index) => <figure className={`rx-gallery__photo rx-gallery__photo--${index + 1}`} key={`${image.url}-${index}`}><div><img src={image.url} alt={image.caption || `Imagen de mis XV ${index + 1}`} loading="lazy" /></div><figcaption><span>0{index + 1}</span>{image.caption}</figcaption></figure>)}</div><p className="rx-gallery__note rx-reveal">Cada detalle fue elegido para compartirlo contigo.</p></section>}

      {enabled('dress_code') && <section className="rx-dress rx-section"><Butterfly className="rx-dress__butterfly" /><SectionHeading eyebrow="DRESS CODE" title={content.dressCode.title} light /><p className="rx-dress__intro rx-reveal">Ven con tu mejor versión. Esta noche también es para que tú brilles.</p><div className="rx-dress__grid rx-reveal"><div><span>PARA ELLAS</span><p>{content.dressCode.womenNotes}</p></div><div><span>PARA ELLOS</span><p>{content.dressCode.menNotes}</p></div></div>{content.dressCode.reservedColors.length > 0 && <div className="rx-dress__reserved rx-reveal"><span>TONOS RESERVADOS</span><div>{content.dressCode.reservedColors.map((color) => <i key={color.name} title={color.name} style={{ backgroundColor: color.hex }} />)}</div><p>{content.dressCode.reservedNote}</p></div>}</section>}

      {enabled('gifts') && <section className="rx-gifts rx-section"><Gift className="rx-gifts__icon rx-reveal" /><SectionHeading eyebrow="UN DETALLE ESPECIAL" title="El mejor regalo es verte ahí" /><p className="rx-gifts__text rx-reveal">{content.gifts.introMessage}</p>{content.gifts.registries.length > 0 && <div className="rx-gifts__links rx-reveal">{content.gifts.registries.map((registry) => <a key={registry.storeName} href={registry.url} target="_blank" rel="noopener noreferrer">{registry.storeName} <ArrowRight size={16} /></a>)}</div>}</section>}

      {enabled('social_features') && <section className="rx-social rx-section"><SectionHeading eyebrow="LA NOCHE TAMBIÉN ES TUYA" title="Hagamos recuerdos juntos" /><div className="rx-social__grid"><div className="rx-social__album rx-reveal"><Camera size={31} /><span>ÁLBUM DE INVITADOS</span><h3>La noche desde tus ojos</h3><SharedAlbum slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} /></div><div className="rx-social__music rx-reveal"><SocialFeatures slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} songsEnabled={content.socialFeatures.enableSongRequests} audioEnabled={content.socialFeatures.enableAudioGuestbook} /></div></div>{content.socialFeatures.hashtag && <p className="rx-social__hashtag rx-reveal">{content.socialFeatures.hashtag}</p>}</section>}

      {enabled('rsvp') && <section id="confirmar" className="rx-rsvp rx-section"><Twinkle className="rx-rsvp__star" /><SectionHeading eyebrow="NO SERÍA LO MISMO SIN TI" title="¿Nos vemos en mis XV?" light /><p className="rx-rsvp__intro rx-reveal">{guestGroup ? `Esta invitación está reservada para ${guestGroup.groupName}. Tienen ${guestGroup.allocatedAdults + guestGroup.allocatedChildren} pases.` : 'Abre tu enlace personal para confirmar tu asistencia.'}</p><div className="rx-rsvp__card rx-reveal">{passName ? <div className="rx-rsvp__pass"><span><Check size={18} /> PASE DIGITAL</span><h3>{passName}</h3><p>{adults} adultos{children > 0 ? ` · ${children} niños` : ''}</p><div className="rx-rsvp__qr"><QRCodeSVG value={passPayload} size={164} level="M" /></div><p>{content.rsvp.customConfirmationMessage}</p><small>Guarda este pase para presentarlo en el evento.</small><button type="button" onClick={() => setPassName('')}>Modificar datos</button></div> : <form onSubmit={handleRsvp}><label>Nombre o familia<input required value={rsvpName} readOnly={Boolean(guestGroup)} onChange={(event) => setRsvpName(event.target.value)} placeholder="Tu nombre" /></label><div className="rx-rsvp__row"><label>¿Nos acompañas?<select value={willAttend} onChange={(event) => setWillAttend(event.target.value)}><option value="yes">¡Sí, ahí estaré!</option><option value="no">No podré asistir</option></select></label><label>WhatsApp<input type="tel" value={rsvpPhone} onChange={(event) => setRsvpPhone(event.target.value)} placeholder="Tu número" /></label></div>{willAttend === 'yes' && <div className="rx-rsvp__row"><label>Adultos<select value={adults} onChange={(event) => setAdults(Number(event.target.value))}>{Array.from({ length: maxAdults }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}</select></label>{config.content.rsvp.allowChildrenSelection && maxChildren > 0 && <label>Niños<select value={children} onChange={(event) => setChildren(Number(event.target.value))}>{Array.from({ length: maxChildren + 1 }, (_, index) => index).map((count) => <option key={count} value={count}>{count}</option>)}</select></label>}</div>}<label>Un mensaje para {name} <span>(opcional)</span><textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe tus mejores deseos..." /></label><button className="rx-button" type="submit">{willAttend === 'yes' ? 'Confirmar asistencia' : 'Enviar respuesta'} <ArrowRight size={17} /></button><small>Usa tu enlace personal para guardar tu respuesta.</small></form>}</div></section>}
    </main>
    <footer className="rx-footer"><Butterfly /><span>XV</span><strong>{name}</strong><p>{dateLabel} · Gracias por ser parte de mi historia</p><a href="#inicio">Volver al inicio ↑</a></footer>
  </div>;
}
