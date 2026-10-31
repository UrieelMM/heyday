'use client';

import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import type { NewWorldTemplateId } from '@/lib/templates/new-world-config';
import { HeroMedia } from '../core/HeroMedia';

gsap.registerPlugin(ScrollTrigger);

type Variant = 'opera' | 'atlas' | 'future';
const presentation = {
  opera: { brand: 'ÓPERA CARMESÍ', overline: 'LA NOCHE ES NUESTRA', bridge: 'Que comience la función', cta: 'Descubre la historia', chapter: 'CUATRO ACTOS', symbol: '✦' },
  atlas: { brand: 'PEQUEÑO ATLAS', overline: 'PÁGINA UNO · UNA NUEVA VIDA', bridge: 'Un mundo entero por descubrir', cta: 'Explora el mapa', chapter: 'CUATRO DESTINOS', symbol: '✺' },
  future: { brand: 'ARCHIVO DEL FUTURO', overline: 'EXPEDIENTE · GENERACIÓN 2026', bridge: 'El futuro empieza hoy', cta: 'Abre el archivo', chapter: 'CUATRO HITOS', symbol: '↗' },
} as const;

function WorldMotif({ variant }: { variant: Variant }) {
  if (variant === 'opera') return <svg viewBox="0 0 240 240" fill="none" aria-hidden="true"><path d="M120 23v194M32 188Q49 93 120 33q71 60 88 155M45 188h150M58 162h124M73 133h94M92 105h56" stroke="currentColor" strokeWidth="4"/><path d="M120 38C68 72 53 133 53 181M120 38c52 34 67 95 67 143" stroke="currentColor" strokeWidth="2"/><circle cx="120" cy="83" r="9" fill="currentColor"/><path d="M105 205h30m-15-17v29" stroke="currentColor" strokeWidth="4"/></svg>;
  if (variant === 'atlas') return <svg viewBox="0 0 240 240" fill="none" aria-hidden="true"><circle cx="120" cy="120" r="93" stroke="currentColor" strokeWidth="3"/><circle cx="120" cy="120" r="68" stroke="currentColor" strokeWidth="2"/><path d="m120 33 17 70 70 17-70 17-17 70-17-70-70-17 70-17 17-70Z" stroke="currentColor" strokeWidth="3"/><path d="m120 73 11 36 36 11-36 11-11 36-11-36-36-11 36-11 11-36Z" fill="currentColor" opacity=".25"/><circle cx="120" cy="120" r="10" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 240 240" fill="none" aria-hidden="true"><path d="M32 198h176M32 162h176M32 126h176M32 90h176M32 54h176M48 39v174m48-174v174m48-174v174m48-174v174" stroke="currentColor" strokeWidth="2" opacity=".55"/><path d="M48 175 120 103l33 33 39-39m-43 0h43v43" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/></svg>;
}

export function NewWorldStoryArt({ variant }: { variant: Variant }) {
  return <svg className="nw-story__art" viewBox="0 0 800 500" fill="none" aria-hidden="true">
    {variant === 'opera' ? <><path className="nw-story__draw" d="M44 474V44q178 190 356 20Q578 234 756 44v430M80 474V134q160 165 320 18 160 147 320-18v340M400 64v410" stroke="currentColor" strokeWidth="3"/><path className="nw-story__draw" d="M145 430Q400 220 655 430M195 440Q400 285 605 440" stroke="currentColor" strokeWidth="2"/></>
      : variant === 'atlas' ? <><path className="nw-story__draw" d="M34 75q96-88 184 8t181-3q104-94 187 8t180-5M35 330q88 100 181 8t186 2q91 93 182-4t181 0M95 480q95-140 210-85t194-59q120-100 209 44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 14"/><circle className="nw-story__draw" cx="400" cy="245" r="170" stroke="currentColor" strokeWidth="2"/><path className="nw-story__draw" d="m400 65 25 155 155 25-155 25-25 155-25-155-155-25 155-25 25-155Z" stroke="currentColor" strokeWidth="2"/></>
      : <><path className="nw-story__draw" d="M70 420h660M70 420V70M70 340h660M70 260h660M70 180h660M70 100h660M210 70v350M350 70v350M490 70v350M630 70v350" stroke="currentColor" strokeWidth="2"/><path className="nw-story__draw" d="m70 365 170-92 135 35 142-158 143 19m-45-60 45 60-60 45" stroke="currentColor" strokeWidth="9"/></>}
  </svg>;
}

function WorldSeal({ variant, title }: { variant: Variant; title: string }) {
  const path = `nw-seal-${variant}`;
  return <svg className="nw-seal" viewBox="0 0 260 260" aria-hidden="true"><defs><path id={path} d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs><circle cx="130" cy="130" r="119" fill="none" stroke="currentColor"/><circle cx="130" cy="130" r="78" fill="none" stroke="currentColor" opacity=".5"/><text><textPath href={`#${path}`}>✦ {title.toUpperCase()} ✦ {presentation[variant].brand} ✦ CELEBREMOS JUNTOS ✦ </textPath></text></svg>;
}

function WorldExperience({ variant, config, eventDate, guestGroup, actionHref }: { variant: Variant; config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string }) {
  const copy = presentation[variant];
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(eventDate));
  const { hero, locations } = config.content;
  return <section className={`nw-hero nw-hero--${variant}`} data-editor-section="hero" id="nw-hero" aria-label={`Portada de ${copy.brand}`}>
    <div className="nw-hero__stage">
      <div className="nw-hero__texture" aria-hidden="true" />
      <nav className="nw-nav" aria-label="Navegación de la invitación"><a className="nw-nav__brand" href="#nw-hero">{copy.symbol} {copy.brand}</a><div><a href="#nw-moments">Momentos</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div></nav>
      <div className="nw-hero__copy"><p className="nw-overline">{copy.overline}</p><h1>{hero.mainTitle}</h1><p className="nw-hero__tagline">{hero.tagline}</p><p className="nw-hero__date">{date}<span aria-hidden="true"> · </span>{locations[0]?.venueName}</p>{guestGroup && <p className="nw-hero__guest">Pase para {guestGroup.groupName}</p>}</div>
      <div className="nw-hero__visual"><HeroMedia hero={hero} alt={`Portada de ${hero.mainTitle}`} /><span className="nw-hero__photo-tag">{hero.badgeText}</span></div>
      <div className="nw-hero__emblem" aria-hidden="true"><WorldSeal variant={variant} title={hero.mainTitle}/><div className="nw-hero__emblem-core"><WorldMotif variant={variant}/></div></div>
      <div className="nw-hero__bridge" aria-hidden="true"><span>{copy.overline}</span><p>{copy.bridge}</p></div>
      <a className="nw-hero__cta" href={actionHref}>{copy.cta}<span aria-hidden="true">↗</span></a>
      <span className="nw-hero__scroll" aria-hidden="true">DESLIZA PARA CONTINUAR ↓</span>
    </div>
  </section>;
}

export const OperaCarmesiExperience = (props: Omit<Parameters<typeof WorldExperience>[0], 'variant'>) => <WorldExperience variant="opera" {...props}/>;
export const PequenoAtlasExperience = (props: Omit<Parameters<typeof WorldExperience>[0], 'variant'>) => <WorldExperience variant="atlas" {...props}/>;
export const ArchivoFuturoExperience = (props: Omit<Parameters<typeof WorldExperience>[0], 'variant'>) => <WorldExperience variant="future" {...props}/>;

export function NewWorldMarquee({ variant, second = false }: { variant: Variant; second?: boolean }) {
  const phrases = variant === 'opera' ? ['TERCERA LLAMADA · UNA NOCHE PARA BRILLAR · ', 'EL TELÓN SE ABRE · EL RECUERDO COMIENZA · ']
    : variant === 'atlas' ? ['UN NUEVO VIAJE COMIENZA · CONTIGO A NUESTRO LADO · ', 'PEQUEÑAS HUELLAS · GRANDES AVENTURAS · ']
      : ['EL FUTURO EMPIEZA AQUÍ · GENERACIÓN 2026 · ', 'TODO LO QUE VIENE · LO CONSTRUIMOS JUNTOS · '];
  return <div className={`nw-marquee${second ? ' nw-marquee--second' : ''}`} aria-hidden="true"><div>{Array.from({ length: 6 }, (_, i) => <span key={i}>{phrases[second ? 1 : 0]}</span>)}</div></div>;
}

export function NewWorldMoments({ variant, config }: { variant: Variant; config: InvitationConfig }) {
  const copy = presentation[variant];
  return <section className={`nw-moments nw-moments--${variant}`} id="nw-moments" aria-label="Momentos de la celebración"><header className="nw-moments__head"><p className="nw-overline">CAPÍTULO 02 · {copy.chapter}</p><h2>{variant === 'opera' ? 'La noche, acto por acto.' : variant === 'atlas' ? 'Nuestro mapa de momentos.' : 'Cuatro pasos hacia adelante.'}</h2><p>{variant === 'opera' ? 'Una función que sólo está completa contigo.' : variant === 'atlas' ? 'Pequeñas paradas para un gran comienzo.' : 'Cada etapa nos trajo hasta aquí.'}</p></header><div className="nw-moments__grid">{config.content.gallery.images.slice(0,4).map((image, index) => <article className="nw-moment" style={{ '--nw-stack-index': index } as CSSProperties} key={index}><div className="nw-moment__image"><img src={image.url} alt={image.caption} loading="lazy" /></div><div className="nw-moment__body"><span>0{index + 1} / 04</span><h3>{image.caption}</h3><p>{config.content.timeline[index]?.description}</p></div></article>)}</div></section>;
}

export function setupNewWorldScenes(root: HTMLElement, id: NewWorldTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const config = (element: Element, start = 'top 90%', end = 'top 50%') => ({ trigger: element, scroller, start, end, scrub: .9 });
  const hero = root.querySelector<HTMLElement>('.nw-hero');
  const visual = root.querySelector<HTMLElement>('.nw-hero__visual');
  if (hero && visual) gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true } })
    .to(root.querySelector('.nw-hero__copy'), { yPercent: -18, opacity: 0, duration: .38 }, .05)
    .to(root.querySelector('.nw-hero__emblem'), { xPercent: id === 'archivo-futuro' ? 85 : -75, rotate: id === 'pequeno-atlas' ? 75 : -35, scale: .66, opacity: .16, duration: .7 }, .08)
    .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0px', clipPath: 'inset(0% 0% 0% 0%)', duration: .76 }, .15)
    .fromTo(root.querySelector('.nw-hero__bridge'), { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: .2 }, .78);
  const progress = root.querySelector<HTMLElement>('.nw-progress__bar');
  if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, scroller, start: 'top top', end: 'bottom bottom', scrub: .4 } });
  const story = root.querySelector<HTMLElement>('.st-story');
  if (story) {
    gsap.fromTo(story.querySelectorAll('.st-story__word'), { opacity: .24 }, { opacity: 1, stagger: .045, ease: 'none', scrollTrigger: config(story, 'top 75%', 'bottom 45%') });
    story.querySelectorAll<SVGGeometryElement>('.nw-story__draw').forEach(path => { const length = path.getTotalLength(); gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: config(story, 'top 85%', 'bottom 45%') }); });
  }
  root.querySelectorAll<HTMLElement>('.st-story > .grid > div, .nw-moment, .st-family__card, .st-countdown__unit, .st-locations__card, .st-gallery__photo, .st-dress > .grid > div, .st-gifts .grid > div').forEach((card, index) => gsap.fromTo(card, { y: 46, rotate: index % 2 ? 3 : -3, scale: .94, opacity: .48 }, { y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: config(card) }));
  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  if (timeline) {
    const line = timeline.querySelector('.st-timeline__line'); const runner = timeline.querySelector('.nw-timeline__runner');
    if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: config(timeline, 'top 80%', 'bottom 48%') });
    if (runner) gsap.fromTo(runner, { top: '0%' }, { top: '92%', ease: 'none', scrollTrigger: config(timeline, 'top 80%', 'bottom 48%') });
  }
}
