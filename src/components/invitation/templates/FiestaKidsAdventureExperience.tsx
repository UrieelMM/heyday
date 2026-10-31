'use client';

import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { celebrationAge, celebrationName } from '@/lib/templates/celebration-config';
import { HeroMedia } from '../core/HeroMedia';

gsap.registerPlugin(ScrollTrigger);

const imageRoot = '/images/fiesta-kids-adventure';

/** A balanced compass made from mirrored paths, so it stays crisp at every size. */
export function AdventureCompass({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fk-compass-gold" x1="50" y1="24" x2="188" y2="213" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff2ae"/><stop offset=".48" stopColor="#ffbb57"/><stop offset="1" stopColor="#d96650"/>
        </linearGradient>
        <linearGradient id="fk-compass-blue" x1="75" y1="53" x2="173" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8be4d0"/><stop offset="1" stopColor="#168c92"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="106" fill="#fff9e9" stroke="#173e54" strokeWidth="7"/>
      <circle cx="120" cy="120" r="91" fill="#eaf7df" stroke="#d47a56" strokeWidth="2" strokeDasharray="3 8"/>
      <circle cx="120" cy="120" r="74" fill="#fff6d4" stroke="#173e54" strokeWidth="3"/>
      <path d="M120 31v22m0 134v22M31 120h22m134 0h22" stroke="#173e54" strokeWidth="5" strokeLinecap="round"/>
      <path d="M120 53 138 103 187 120 138 137 120 187 102 137 53 120 102 103Z" fill="url(#fk-compass-gold)" stroke="#173e54" strokeWidth="5" strokeLinejoin="round"/>
      <path d="m120 53 18 50-18 17-18-17Z" fill="url(#fk-compass-blue)"/>
      <path d="m120 187 18-50-18-17-18 17Z" fill="#ed745b"/>
      <circle cx="120" cy="120" r="17" fill="#173e54"/><circle cx="120" cy="120" r="9" fill="#fff2ae"/>
      <path d="M79 78c12-13 25-20 40-21" stroke="white" strokeWidth="5" strokeLinecap="round" opacity=".85"/>
    </svg>
  );
}

export function AdventureSeal({ name }: { name: string }) {
  return (
    <svg className="fk-seal" viewBox="0 0 260 260" aria-hidden="true">
      <defs><path id="fk-seal-path" d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
      <circle cx="130" cy="130" r="111" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5"/>
      <text><textPath href="#fk-seal-path">★ GRAN AVENTURA ★ {name.toUpperCase()} ★ JUEGOS Y PASTEL ★ </textPath></text>
    </svg>
  );
}

export function AdventureMap() {
  return (
    <svg className="fk-map" viewBox="0 0 600 420" fill="none" aria-hidden="true">
      <path className="fk-map__draw" d="M43 352C143 350 77 278 182 289S275 247 234 197 331 145 360 183 448 169 421 100 496 59 558 59" stroke="#e07558" strokeWidth="5" strokeDasharray="12 12" strokeLinecap="round"/>
      <circle className="fk-map__draw" cx="72" cy="349" r="27" stroke="#1d8c90" strokeWidth="3" strokeDasharray="5 8"/>
      <circle className="fk-map__draw" cx="348" cy="185" r="35" stroke="#1d8c90" strokeWidth="3" strokeDasharray="5 8"/>
      <circle className="fk-map__draw" cx="536" cy="66" r="34" stroke="#1d8c90" strokeWidth="3" strokeDasharray="5 8"/>
      <path d="m70 325 10 23-10 23-10-23ZM350 161l9 22-9 22-9-22ZM536 44l9 22-9 22-9-22Z" fill="#ffca61" stroke="#173e54" strokeWidth="3"/>
      <path className="fk-map__draw" d="M444 329c17-41 37-41 54 0 17-41 37-41 54 0M201 78l20-33 20 33m-40 0h40" stroke="#1d8c90" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FiestaKidsAdventureHero({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const { hero, locations } = config.content;
  const name = celebrationName('fiesta-kids-adventure', hero.mainTitle);
  const age = celebrationAge('fiesta-kids-adventure', hero.mainTitle);
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(eventDate));
  return (
    <section id="fk-hero" data-editor-section="hero" className="fk-hero" aria-label="Portada de la aventura">
      <div className="fk-hero__stage">
        <div className="fk-hero__sky" aria-hidden="true"/>
        <nav className="fk-nav" aria-label="Navegación de la aventura">
          <a href="#fk-hero" className="fk-nav__brand">★ {name}</a>
          <div><a href="#fk-stations">Explora</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div>
        </nav>
        <span className="fk-hero__sun" aria-hidden="true"/>
        <span className="fk-hero__cloud fk-hero__cloud--one" aria-hidden="true"/>
        <span className="fk-hero__cloud fk-hero__cloud--two" aria-hidden="true"/>
        <div className="fk-hero__copy">
          <p className="fk-eyebrow"><span className="fk-dot"/>{hero.badgeText}</p>
          <p className="fk-hero__overline">UNA INVITACIÓN PARA EXPLORADORES</p>
          <h1>{name}</h1>
          <p className="fk-hero__age">{age ? `${age} años de aventuras` : 'Un día de aventuras'}</p>
          <p className="fk-hero__tagline">{hero.tagline}</p>
          <div className="fk-hero__chips"><span>{date}</span>{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
          {guestGroup && <p className="fk-hero__guest">Un pase especial para {guestGroup.groupName}</p>}
        </div>
        <div className="fk-hero__visual">
          <HeroMedia hero={hero} alt={`Aventura de cumpleaños de ${name}`} />
          <span className="fk-hero__visual-label">01 / DESTINO AVENTURA</span>
        </div>
        <div className="fk-hero__compass"><AdventureSeal name={name}/><AdventureCompass className="fk-compass"/></div>
        <div className="fk-hero__bridge"><span>EL MAPA SE ABRE</span><p>¡Que empiece la aventura!</p></div>
        <a className="fk-hero__cta" href={actionHref}>Descubre la fiesta <span aria-hidden="true">↗</span></a>
        <span className="fk-hero__scroll" aria-hidden="true">DESLIZA PARA EXPLORAR ↓</span>
      </div>
    </section>
  );
}

export function FiestaKidsMarquee({ second = false }: { second?: boolean }) {
  const phrase = second ? 'SIGUIENTE PARADA ★ RECUERDOS INOLVIDABLES ★ ' : 'JUEGA ★ EXPLORA ★ CELEBRA ★ ';
  return <div className={`fk-marquee${second ? ' fk-marquee--second' : ''}`} aria-hidden="true"><div>{Array.from({ length: 6 }, (_, i) => <span key={i}>{phrase}</span>)}</div></div>;
}

const stations = [
  { number: '01', title: 'El mapa secreto', description: 'La aventura comienza con pistas y un mundo por descubrir.', image: 'adventure-island.webp', label: 'PUNTO DE PARTIDA' },
  { number: '02', title: 'Campamento explorador', description: 'Juegos para toda la pandilla de pequeños aventureros.', image: 'explorer-camp.webp', label: 'PREPARA TUS BINOCULARES' },
  { number: '03', title: 'La gran búsqueda', description: 'Seguimos el camino hasta encontrar nuestro tesoro favorito.', image: 'paper-adventure.webp', label: 'SIGUE LAS PISTAS' },
  { number: '04', title: 'Fiesta y pastel', description: 'Un cierre con velitas, amigos y muchos recuerdos.', image: 'birthday-feast.webp', label: 'MISIÓN CUMPLIDA' },
];

export function FiestaKidsStations({ config }: { config: InvitationConfig }) {
  return (
    <section id="fk-stations" className="fk-stations fk-sheet" aria-label="Estaciones de la aventura">
      <div className="fk-stations__head"><p className="fk-eyebrow"><span className="fk-dot"/>CAPÍTULO 02 · EL RECORRIDO</p><h2>Cuatro paradas. <em>Una gran aventura.</em></h2><p>Hay un mundo entero por descubrir antes de soplar las velitas.</p></div>
      <div className="fk-stations__grid">{stations.map((station, index) => (
        <article className="fk-station" key={station.number} style={{ '--fk-stack-index': index } as CSSProperties}>
          <div className="fk-station__image"><img src={config.content.gallery.images[index]?.url || `${imageRoot}/${station.image}`} alt={config.content.gallery.images[index]?.caption || station.title} loading="lazy"/></div>
          <div className="fk-station__content"><span>{station.number} / {station.label}</span><h3>{config.content.gallery.images[index]?.caption || station.title}</h3><p>{config.content.timeline[index]?.description || station.description}</p></div>
        </article>
      ))}</div>
    </section>
  );
}

export function setupFiestaKidsAdventureScenes(root: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const options = (trigger: Element, start = 'top 88%', end = 'top 45%') => ({ trigger, scroller, start, end, scrub: 0.9 });
  const hero = root.querySelector<HTMLElement>('.fk-hero');
  const visual = root.querySelector<HTMLElement>('.fk-hero__visual');
  if (hero && visual) {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: 0.9, invalidateOnRefresh: true } });
    tl.to('.fk-hero__copy', { yPercent: -18, opacity: 0, duration: .32 }, .08)
      .to('.fk-hero__compass', { xPercent: 68, yPercent: -60, rotate: 95, scale: .6, opacity: .2, duration: .65 }, .1)
      .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0px', borderWidth: 0, duration: .7 }, .17)
      .fromTo('.fk-hero__bridge', { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .2 }, .76);
    gsap.to('.fk-hero__cloud--one', { x: -55, scrollTrigger: options(hero, 'top top', 'bottom bottom') });
    gsap.to('.fk-hero__cloud--two', { x: 70, scrollTrigger: options(hero, 'top top', 'bottom bottom') });
  }
  const progress = root.querySelector<HTMLElement>('.fk-progress__bar');
  if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, scroller, start: 'top top', end: 'bottom bottom', scrub: .4 } });
  const story = root.querySelector<HTMLElement>('.st-story');
  if (story) {
    gsap.fromTo(story.querySelectorAll('.st-story__word'), { opacity: .32 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: options(story, 'top 75%', 'bottom 55%') });
    story.querySelectorAll<SVGGeometryElement>('.fk-map__draw').forEach((path) => {
      const length = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: options(story, 'top 78%', 'bottom 48%') });
    });
    const map = story.querySelector<SVGSVGElement>('.fk-map');
    if (map) gsap.fromTo(map, { xPercent: -50, rotate: -12, scale: .82 }, { xPercent: -50, rotate: 8, scale: 1.08, scrollTrigger: options(story, 'top 85%', 'bottom 45%') });
  }
  const reveal = (selector: string, from: gsap.TweenVars, end = 'top 55%') => root.querySelectorAll<HTMLElement>(selector).forEach((item, index) => {
    gsap.fromTo(item, { ...from, rotate: typeof from.rotate === 'number' ? from.rotate * (index % 2 ? -1 : 1) : from.rotate }, { x: 0, y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: options(item, 'top 96%', end) });
  });
  reveal('.st-story > .grid > div', { y: 50, rotateY: 12, opacity: .55 });
  reveal('.fk-station', { y: 65, scale: .9, opacity: .6 }, 'top 65%');
  reveal('.st-family__card', { y: 45, rotate: 5, scale: .92, opacity: .55 });
  reveal('.st-countdown__unit', { y: 45, rotate: 8, scale: .8, opacity: .5 });
  reveal('.st-locations__card', { y: 50, opacity: .5 });
  root.querySelectorAll<HTMLElement>('.st-locations__card img').forEach((photo) => {
    gsap.fromTo(photo, { clipPath: 'inset(12% 10% round 24px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: options(photo, 'top 90%', 'top 45%') });
  });
  reveal('.st-gallery__photo', { y: 60, rotate: 7, opacity: .5 });
  reveal('.st-dress > .grid > div, .st-gifts > div, .st-social > div', { y: 45, opacity: .5 });
  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  if (timeline) {
    const rail = timeline.querySelector<HTMLElement>('.st-timeline__line');
    const runner = timeline.querySelector<HTMLElement>('.fk-timeline__runner');
    if (rail) gsap.fromTo(rail, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: options(timeline, 'top 77%', 'bottom 48%') });
    if (runner) gsap.fromTo(runner, { top: '0%' }, { top: '93%', ease: 'none', scrollTrigger: options(timeline, 'top 77%', 'bottom 48%') });
  }
  reveal('.st-timeline__item', { x: 40, opacity: .55 });
}
