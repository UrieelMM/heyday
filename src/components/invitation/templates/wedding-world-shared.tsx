'use client';

import type { CSSProperties, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import type { WeddingWorldTemplateId } from '@/lib/templates/wedding-world-config';
import { weddingHeroDesktopSrc } from '@/lib/templates/wedding-world-config';
import { HeroMedia } from '../core/HeroMedia';

gsap.registerPlugin(ScrollTrigger);
export type WeddingVariant = 'garden' | 'stars' | 'vineyard';

const presentation: Record<WeddingVariant, { brand: string; overline: string; bridge: string; cta: string; symbol: string; moments: string[]; chapter: string }> = {
  garden: { brand: 'ATELIER BOTÁNICO', overline: 'UNA PROMESA ENTRE FLORES', bridge: 'Aquí comienza a florecer nuestro para siempre', cta: 'Descubre nuestra historia', symbol: '✿', chapter: 'EL JARDÍN', moments: ['LA SEMILLA', 'LA PROMESA', 'LA MESA', 'EL RECUERDO'] },
  stars: { brand: 'OBSERVATORIO DEL AMOR', overline: 'UNA NOCHE ESCRITA EN EL CIELO', bridge: 'El universo nos trajo hasta aquí', cta: 'Mira nuestra historia', symbol: '✧', chapter: 'EL CIELO', moments: ['EL ENCUENTRO', 'LA LUNA', 'LA VELADA', 'EL AMANECER'] },
  vineyard: { brand: 'CUADERNO DE VENDIMIA', overline: 'UNA HISTORIA PARA BRINDAR', bridge: 'Lo mejor de la vida se comparte', cta: 'Brinda con nosotros', symbol: '❧', chapter: 'LA VENDIMIA', moments: ['EL ORIGEN', 'LA PROMESA', 'LA COSECHA', 'EL BRINDIS'] },
};

export function WeddingWorldHero({ variant, config, eventDate, guestGroup, actionHref, motif, seal }: {
  variant: WeddingVariant; config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null;
  actionHref: string; motif: ReactNode; seal: ReactNode;
}) {
  const { hero, locations } = config.content;
  const copy = presentation[variant];
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(eventDate));
  return <section className={`ww-hero ww-hero--${variant}`} id="ww-hero" data-editor-section="hero" aria-label={`Portada de ${copy.brand.toLowerCase()}`}>
    <div className="ww-hero__stage">
      <div className="ww-hero__texture" aria-hidden="true" />
      <nav className="ww-nav" aria-label="Navegación de la invitación"><a className="ww-nav__brand" href="#ww-hero">{copy.symbol} {copy.brand}</a><div><a href="#ww-stations">Momentos</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div></nav>
      <div className="ww-hero__copy"><p className="ww-overline">{copy.overline}</p><h1>{hero.mainTitle}</h1><span className="ww-hairline" aria-hidden="true"/><p className="ww-hero__tagline">{hero.tagline}</p><p className="ww-hero__date">{date}<span aria-hidden="true"> · </span>{locations[0]?.venueName}</p>{guestGroup && <p className="ww-hero__guest">Una invitación especial para {guestGroup.groupName}</p>}</div>
      <div className="ww-hero__visual"><HeroMedia hero={hero} alt={`Celebración de ${hero.mainTitle}`} desktopSrc={weddingHeroDesktopSrc(hero.coverImageUrl)} /><span className="ww-hero__photo-tag">{hero.badgeText}</span></div>
      <div className="ww-hero__emblem" aria-hidden="true">{seal}<div className="ww-hero__emblem-core">{motif}</div></div>
      <div className="ww-hero__bridge" aria-hidden="true"><span>{copy.overline}</span><p>{copy.bridge}</p></div>
      <a className="ww-hero__cta" href={actionHref}>{copy.cta}<span aria-hidden="true">↗</span></a>
      <span className="ww-hero__scroll" aria-hidden="true">DESLIZA PARA CONTINUAR ↓</span>
    </div>
  </section>;
}

export function WeddingSeal({ variant, names }: { variant: WeddingVariant; names: string }) {
  const id = `ww-seal-path-${variant}`;
  return <svg className="ww-seal" viewBox="0 0 260 260" aria-hidden="true"><defs><path id={id} d="M130 130m-105 0a105 105 0 1 1 210 0a105 105 0 1 1-210 0"/></defs><circle cx="130" cy="130" r="117" fill="none" stroke="currentColor" strokeWidth="1"/><circle cx="130" cy="130" r="79" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".65"/><text><textPath href={`#${id}`}>✦ {names.toUpperCase()} ✦ 19 DICIEMBRE 2026 ✦ {presentation[variant].brand} ✦ </textPath></text></svg>;
}

export function WeddingWorldMarquee({ variant, second = false }: { variant: WeddingVariant; second?: boolean }) {
  const phrases: Record<WeddingVariant, [string, string]> = {
    garden: ['FLORECER JUNTOS · CELEBRAR SIEMPRE · ', 'UN JARDÍN PARA NUESTRA HISTORIA · '],
    stars: ['EL CIELO ES TESTIGO · UNA NOCHE INFINITA · ', 'DOS CAMINOS · UNA CONSTELACIÓN · '],
    vineyard: ['ENTRE VIDES · ENTRE COPAS · ENTRE NOSOTROS · ', 'UNA COSECHA DE AMOR · UN BRINDIS ETERNO · '],
  };
  return <div className={`ww-marquee${second ? ' ww-marquee--second' : ''}`} aria-hidden="true"><div>{Array.from({ length: 6 }, (_, i) => <span key={i}>{phrases[variant][second ? 1 : 0]}</span>)}</div></div>;
}

export function WeddingWorldStations({ variant, config }: { variant: WeddingVariant; config: InvitationConfig }) {
  const copy = presentation[variant];
  const images = config.content.gallery.images;
  return <section id="ww-stations" className="ww-stations" aria-label="Cuatro momentos de la boda"><header className="ww-stations__head"><p className="ww-overline">CAPÍTULO 02 · {copy.chapter}</p><h2>Cuatro momentos.<br/><em>Una historia.</em></h2><p>Un recorrido por los instantes que queremos compartir contigo.</p></header><div className="ww-stations__grid">{copy.moments.map((label, index) => { const item = images[index]; return <article className="ww-station" style={{ '--ww-stack-index': index } as CSSProperties} key={label}><div className="ww-station__image"><img src={item?.url || config.content.hero.coverImageUrl} alt={item?.caption || label} loading="lazy"/></div><div className="ww-station__body"><span>0{index + 1} / {label}</span><h3>{item?.caption || label}</h3><p>{config.content.timeline[index]?.description}</p></div></article>; })}</div></section>;
}

export function setupWeddingWorldScenes(root: HTMLElement, id: WeddingWorldTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const tween = (element: Element, start = 'top 92%', end = 'top 48%') => ({ trigger: element, scroller, start, end, scrub: .9 });
  const hero = root.querySelector<HTMLElement>('.ww-hero');
  const visual = root.querySelector<HTMLElement>('.ww-hero__visual');
  if (hero && visual) {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true } })
      .to(root.querySelector('.ww-hero__copy'), { yPercent: -22, opacity: 0, duration: .38 }, .06)
      .to(root.querySelector('.ww-hero__emblem'), { xPercent: id === 'midnight-constellation' ? -80 : 66, yPercent: -38, rotate: id === 'golden-harvest-vineyard' ? 90 : -45, scale: .65, opacity: .18, duration: .7 }, .1)
      .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0px', borderWidth: 0, duration: .72 }, .16)
      .fromTo(root.querySelector('.ww-hero__bridge'), { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .2 }, .78);
  }
  const progress = root.querySelector<HTMLElement>('.ww-progress__bar');
  if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, scroller, start: 'top top', end: 'bottom bottom', scrub: .4 } });
  const story = root.querySelector<HTMLElement>('.st-story');
  if (story) {
    gsap.fromTo(story.querySelectorAll('.st-story__word'), { opacity: .24 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: tween(story, 'top 75%', 'bottom 45%') });
    story.querySelectorAll<SVGGeometryElement>('.ww-story__draw').forEach(path => { if (typeof path.getTotalLength !== 'function') return; const length = path.getTotalLength(); gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: tween(story, 'top 85%', 'bottom 45%') }); });
    const art = story.querySelector<SVGSVGElement>('.ww-story__art');
    if (art) gsap.fromTo(art, { xPercent: -50, scale: .84, rotate: -8 }, { xPercent: -50, scale: 1.08, rotate: 5, scrollTrigger: tween(story, 'top 85%', 'bottom 40%') });
  }
  const reveal = (selector: string, from: gsap.TweenVars) => root.querySelectorAll<HTMLElement>(selector).forEach((item, index) => gsap.fromTo(item, { ...from, rotate: typeof from.rotate === 'number' ? from.rotate * (index % 2 ? -1 : 1) : from.rotate }, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: tween(item) }));
  reveal('.st-story > .grid > div, .ww-station', { y: 65, opacity: .55, scale: .92 });
  reveal('.st-family__card, .st-countdown__unit, .st-locations__card, .st-gallery__photo, .st-dress > .grid > div, .st-gifts .grid > div', { y: 40, opacity: .55 });
  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  if (timeline) {
    const line = timeline.querySelector<HTMLElement>('.st-timeline__line');
    const runner = timeline.querySelector<HTMLElement>('.ww-timeline__runner');
    if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: tween(timeline, 'top 80%', 'bottom 48%') });
    if (runner) gsap.fromTo(runner, { top: '0%' }, { top: '93%', ease: 'none', scrollTrigger: tween(timeline, 'top 80%', 'bottom 48%') });
  }
  reveal('.st-timeline__item', { x: 35, opacity: .55 });
}
