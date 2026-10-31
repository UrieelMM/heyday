'use client';

import type { CSSProperties, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldAge, kidsWorldName, type KidsWorldTemplateId } from '@/lib/templates/kids-world-config';
import { kidsHeroDesktopSrc } from '@/lib/templates/kids-hero-media';
import { HeroMedia } from '../core/HeroMedia';

gsap.registerPlugin(ScrollTrigger);

export type KidsWorldVariant = 'pirate' | 'dino' | 'safari' | 'cowboy';

const worldPresentation: Record<KidsWorldVariant, { heroId: string; stationId: string; heroLabel: string; stationLabel: string; mark: string; mediaAlt: string }> = {
  pirate: { heroId: 'pw-hero', stationId: 'pw-stations', heroLabel: 'Portada pirata', stationLabel: 'Puertos de la travesía', mark: '☸', mediaAlt: 'Viaje pirata' },
  dino: { heroId: 'dj-hero', stationId: 'dj-stations', heroLabel: 'Portada jurásica', stationLabel: 'Estaciones jurásicas', mark: '✦', mediaAlt: 'Expedición jurásica' },
  safari: { heroId: 'sf-hero', stationId: 'sf-stations', heroLabel: 'Portada del safari', stationLabel: 'Paradas del safari', mark: '◉', mediaAlt: 'Safari de cumpleaños' },
  cowboy: { heroId: 'cb-hero', stationId: 'cb-stations', heroLabel: 'Portada del rancho', stationLabel: 'Paradas del rancho', mark: '★', mediaAlt: 'Aventura vaquera' },
};

export function KidsWorldFrame({ variant, config, eventDate, guestGroup, actionHref, motif, seal, overline, bridge, visualTag, cta }: {
  variant: KidsWorldVariant;
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
  motif: ReactNode;
  seal: ReactNode;
  overline: string;
  bridge: string;
  visualTag: string;
  cta: string;
}) {
  const { hero, locations } = config.content;
  const name = kidsWorldName(hero.mainTitle);
  const age = kidsWorldAge(hero.mainTitle);
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(eventDate));
  const { heroId, stationId, heroLabel, mark, mediaAlt } = worldPresentation[variant];
  return (
    <section id={heroId} className={`kw-hero kw-hero--${variant}`} data-editor-section="hero" aria-label={heroLabel}>
      <div className="kw-hero__stage">
        <div className="kw-hero__atmosphere" aria-hidden="true" />
        <nav className="kw-nav" aria-label="Navegación de la invitación">
          <a href={`#${heroId}`} className="kw-nav__brand">{mark} {name}</a>
          <div><a href={`#${stationId}`}>Explorar</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div>
        </nav>
        <div className="kw-hero__ornament kw-hero__ornament--one" aria-hidden="true" />
        <div className="kw-hero__ornament kw-hero__ornament--two" aria-hidden="true" />
        <div className="kw-hero__copy">
          <p className="kw-eyebrow"><span className="kw-pulse"/>{hero.badgeText}</p>
          <p className="kw-hero__overline">{overline}</p>
          <h1>{name}</h1>
          <p className="kw-hero__age">{age ? `${age} años` : 'Un día inolvidable'}</p>
          <p className="kw-hero__tagline">{hero.tagline}</p>
          <div className="kw-hero__chips"><span>{date}</span>{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
          {guestGroup && <p className="kw-hero__guest">Un pase para {guestGroup.groupName}</p>}
        </div>
        <div className="kw-hero__visual">
          <HeroMedia hero={hero} alt={`${mediaAlt} de ${name}`} desktopSrc={kidsHeroDesktopSrc(hero.coverImageUrl)} />
          <span className="kw-hero__visual-label">{visualTag}</span>
        </div>
        <div className="kw-hero__motif" aria-hidden="true">{seal}<div className="kw-hero__motif-core">{motif}</div></div>
        <div className="kw-hero__bridge" aria-hidden="true"><span>{visualTag}</span><p>{bridge}</p></div>
        <a className="kw-hero__cta" href={actionHref}>{cta}<span aria-hidden="true">↗</span></a>
        <span className="kw-hero__scroll" aria-hidden="true">DESLIZA PARA DESCUBRIR ↓</span>
      </div>
    </section>
  );
}

export function KidsWorldMarquee({ variant, second = false }: { variant: KidsWorldVariant; second?: boolean }) {
  const phrases: Record<KidsWorldVariant, [string, string]> = {
    pirate: ['IZAR VELAS ✦ SEGUIR EL MAPA ✦ CELEBRAR ✦ ', 'RUMBO AL TESORO ✦ RECUERDOS A BORDO ✦ '],
    dino: ['EXPLORA ✦ EXCAVA ✦ CELEBRA ✦ ', 'HUELLAS GIGANTES ✦ RECUERDOS ETERNOS ✦ '],
    safari: ['OBSERVA ✦ DESCUBRE ✦ CELEBRA ✦ ', 'UN MUNDO SALVAJE ✦ UN DÍA INOLVIDABLE ✦ '],
    cowboy: ['ENSILLA ✦ JUEGA ✦ CELEBRA ✦ ', 'RUMBO AL RANCHO ✦ AMIGOS POR SIEMPRE ✦ '],
  };
  const phrase = phrases[variant][second ? 1 : 0];
  return <div className={`kw-marquee${second ? ' kw-marquee--second' : ''}`} aria-hidden="true"><div>{Array.from({ length: 6 }, (_, i) => <span key={i}>{phrase}</span>)}</div></div>;
}

const stationLabels: Record<KidsWorldVariant, string[]> = {
  pirate: ['PUERTO DE SALIDA', 'CARTA SECRETA', 'COFRE ESCONDIDO', 'FIESTA EN CUBIERTA'],
  dino: ['ENTRADA A LA SELVA', 'ZONA DE FÓSILES', 'SENDERO GIGANTE', 'GRAN FESTEJO'],
  safari: ['CAMPAMENTO BASE', 'SENDERO DORADO', 'AMIGOS DE LA SABANA', 'PICNIC DE CUMPLEAÑOS'],
  cowboy: ['PUERTAS DEL RANCHO', 'RUTA DEL OESTE', 'JUEGOS VAQUEROS', 'PASTEL AL ATARDECER'],
};

export function KidsWorldStations({ variant, config }: { variant: KidsWorldVariant; config: InvitationConfig }) {
  const { stationId, stationLabel } = worldPresentation[variant];
  const copy: Record<KidsWorldVariant, { heading: string; description: string; chapter: string }> = {
    pirate: { heading: 'Cuatro puertos. Un gran tesoro.', description: 'Sigue la carta y descubre cada parada de nuestra travesía.', chapter: 'LA TRAVESÍA' },
    dino: { heading: 'Cuatro hallazgos. Una gran aventura.', description: 'Sigue las huellas y descubre todo lo que nos espera.', chapter: 'LA EXPEDICIÓN' },
    safari: { heading: 'Cuatro paradas. Un mundo salvaje.', description: 'Sigue el sendero y descubre a nuestros amigos de la sabana.', chapter: 'EL SAFARI' },
    cowboy: { heading: 'Cuatro momentos. Un gran rodeo.', description: 'Sigue la ruta del rancho hasta el pastel al atardecer.', chapter: 'EL RANCHO' },
  };
  const { heading, description, chapter } = copy[variant];
  const images = config.content.gallery.images;
  return (
    <section id={stationId} className="kw-stations kw-sheet" aria-label={stationLabel}>
      <div className="kw-stations__head"><p className="kw-eyebrow"><span className="kw-pulse"/>CAPÍTULO 02 · {chapter}</p><h2>{heading}</h2><p>{description}</p></div>
      <div className="kw-stations__grid">{stationLabels[variant].map((label, index) => {
        const image = images[index];
        return <article className="kw-station" key={label} style={{ '--kw-stack-index': index } as CSSProperties}>
          <div className="kw-station__image"><img src={image?.url || config.content.hero.coverImageUrl} alt={image?.caption || label} loading="lazy" /></div>
          <div className="kw-station__content"><span>0{index + 1} / {label}</span><h3>{image?.caption || label}</h3><p>{config.content.timeline[index]?.description || description}</p></div>
        </article>;
      })}</div>
    </section>
  );
}

export function setupKidsWorldScenes(root: HTMLElement, id: KidsWorldTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const trigger = (element: Element, start = 'top 90%', end = 'top 48%') => ({ trigger: element, scroller, start, end, scrub: .9 });
  const hero = root.querySelector<HTMLElement>('.kw-hero');
  const visual = root.querySelector<HTMLElement>('.kw-hero__visual');
  if (hero && visual) {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true } });
    tl.to(root.querySelector('.kw-hero__copy'), { yPercent: -20, opacity: 0, duration: .35 }, .08)
      .to(root.querySelector('.kw-hero__motif'), { xPercent: id === 'pirate-treasure-voyage' || id === 'cowboy-ranch-roundup' ? 68 : -62, yPercent: -58, rotate: id === 'pirate-treasure-voyage' || id === 'cowboy-ranch-roundup' ? 120 : -20, scale: .65, opacity: .25, duration: .67 }, .12)
      .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0px', borderWidth: 0, duration: .7 }, .17)
      .fromTo(root.querySelector('.kw-hero__bridge'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .22 }, .76);
    root.querySelectorAll<HTMLElement>('.kw-hero__ornament').forEach((item, index) => {
      gsap.to(item, { x: index ? 70 : -60, y: index ? -35 : 25, rotate: index ? 16 : -14, scrollTrigger: trigger(hero, 'top top', 'bottom bottom') });
    });
  }
  const progress = root.querySelector<HTMLElement>('.kw-progress__bar');
  if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, scroller, start: 'top top', end: 'bottom bottom', scrub: .4 } });
  const story = root.querySelector<HTMLElement>('.st-story');
  if (story) {
    gsap.fromTo(story.querySelectorAll('.st-story__word'), { opacity: .3 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: trigger(story, 'top 75%', 'bottom 53%') });
    story.querySelectorAll<SVGGeometryElement>('.kw-story__draw').forEach((path) => {
      if (typeof path.getTotalLength !== 'function') return;
      const length = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: trigger(story, 'top 80%', 'bottom 47%') });
    });
    const backdrop = story.querySelector<SVGSVGElement>('.kw-story__map');
    if (backdrop) gsap.fromTo(backdrop, { xPercent: -50, scale: .82, rotate: -12 }, { xPercent: -50, scale: 1.07, rotate: 8, scrollTrigger: trigger(story, 'top 85%', 'bottom 45%') });
  }
  const reveal = (selector: string, from: gsap.TweenVars, end = 'top 56%') => root.querySelectorAll<HTMLElement>(selector).forEach((item, index) => {
    gsap.fromTo(item, { ...from, rotate: typeof from.rotate === 'number' ? from.rotate * (index % 2 ? -1 : 1) : from.rotate }, { x: 0, y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: trigger(item, 'top 96%', end) });
  });
  reveal('.st-story > .grid > div', { y: 48, rotateY: 13, opacity: .58 });
  reveal('.kw-station', { y: 65, scale: .88, opacity: .58 }, 'top 66%');
  reveal('.st-family__card', { y: 45, rotate: 5, scale: .91, opacity: .58 });
  reveal('.st-countdown__unit', { y: 45, rotate: 8, scale: .8, opacity: .48 });
  reveal('.st-locations__card', { y: 52, opacity: .52 });
  root.querySelectorAll<HTMLElement>('.st-locations__card img').forEach(photo => gsap.fromTo(photo, { clipPath: 'inset(12% 10% round 25px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: trigger(photo, 'top 90%', 'top 45%') }));
  reveal('.st-gallery__photo', { y: 58, rotate: 8, opacity: .52 });
  reveal('.st-dress > .grid > div, .st-gifts > div, .st-social > div', { y: 42, opacity: .55 });
  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  if (timeline) {
    const rail = timeline.querySelector<HTMLElement>('.st-timeline__line');
    const runner = timeline.querySelector<HTMLElement>('.kw-timeline__runner');
    if (rail) gsap.fromTo(rail, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: trigger(timeline, 'top 78%', 'bottom 48%') });
    if (runner) gsap.fromTo(runner, { top: '0%' }, { top: '93%', ease: 'none', scrollTrigger: trigger(timeline, 'top 78%', 'bottom 48%') });
  }
  reveal('.st-timeline__item', { x: 40, opacity: .55 });
}
