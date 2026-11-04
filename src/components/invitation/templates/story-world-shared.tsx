'use client';

import type { CSSProperties, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import type { StoryWorldTemplateId } from '@/lib/templates/story-world-config';
import { storyWorldDesktopSrc } from '@/lib/templates/story-world-config';
import { HeroMedia } from '../core/HeroMedia';

gsap.registerPlugin(ScrollTrigger);
export type StoryVariant = 'ohana' | 'stitch' | 'solar' | 'cafe';

const copy = {
  ohana: { brand: 'OHANA · FIESTA EN LA ISLA', eyebrow: 'UNA ISLA PARA CELEBRAR', bridge: 'Nuestra familia es nuestra aventura', cta: 'Explora la isla', symbol: '✿', chapter: 'CUATRO PARADAS EN LA ISLA' },
  stitch: { brand: 'STITCH · AVENTURA HAWAIANA', eyebrow: 'ALOHA, LA FIESTA COMIENZA', bridge: 'Una aventura tan grande como nuestra familia', cta: 'Explora la fiesta', symbol: '✿', chapter: 'CUATRO AVENTURAS CON STITCH' },
  solar: { brand: 'SOLAR POP XV', eyebrow: 'QUINCE VUELTAS AL SOL', bridge: 'Hoy brillamos en todos los colores', cta: 'Entra en mi universo', symbol: '✺', chapter: 'CUATRO DESTELLOS' },
  cafe: { brand: 'CAFÉ PARA SIEMPRE', eyebrow: 'LA MESA ESTÁ RESERVADA', bridge: 'Nos encontramos aquí, una vez más', cta: 'Lee nuestra historia', symbol: '☕', chapter: 'CUATRO TIEMPOS' },
} as const;

export function StoryWorldSeal({ variant, title }: { variant: StoryVariant; title: string }) {
  const id = `sw-seal-path-${variant}`;
  return <svg className="sw-seal" viewBox="0 0 260 260" aria-hidden="true"><defs><path id={id} d="M130 130m-105 0a105 105 0 1 1 210 0a105 105 0 1 1-210 0"/></defs><circle cx="130" cy="130" r="118" fill="none" stroke="currentColor"/><circle cx="130" cy="130" r="79" fill="none" stroke="currentColor" opacity=".55"/><text><textPath href={`#${id}`}>✦ {title.toUpperCase()} ✦ {copy[variant].brand} ✦ NOS VEMOS PRONTO ✦ </textPath></text></svg>;
}

export function StoryWorldHero({ variant, config, eventDate, guestGroup, actionHref, motif }: {
  variant: StoryVariant; config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string; motif: ReactNode;
}) {
  const { hero, locations } = config.content;
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(eventDate));
  return <section className={`sw-hero sw-hero--${variant}`} id="sw-hero" data-editor-section="hero" aria-label={`Portada de ${copy[variant].brand}`}>
    <div className="sw-hero__stage">
      <div className="sw-hero__texture" aria-hidden="true" />
      <nav className="sw-nav" aria-label="Navegación de la invitación"><a className="sw-nav__brand" href="#sw-hero">{copy[variant].symbol} {variant === 'stitch' ? 'STITCH · ALOHA' : copy[variant].brand}</a><div><a href="#sw-moments">Momentos</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div></nav>
      <div className="sw-hero__copy"><p className="sw-overline">{copy[variant].eyebrow}</p><h1>{hero.mainTitle}</h1><p className="sw-hero__tagline">{hero.tagline}</p><div className="sw-hero__facts"><span>{date}</span><span>{locations[0]?.venueName}</span></div>{guestGroup && <p className="sw-hero__guest">Pase especial para {guestGroup.groupName}</p>}</div>
      <div className="sw-hero__visual"><HeroMedia hero={hero} alt={`Celebración de ${hero.mainTitle}`} desktopSrc={storyWorldDesktopSrc(hero.coverImageUrl)} /><span className="sw-hero__photo-tag">{hero.badgeText}</span></div>
      {variant === 'stitch' && <div className="sw-hero__stitch-art" aria-hidden="true"><img src="/images/stitch-birthday/stitch-pineapple-drink.webp" alt="" /><img src="/images/stitch-birthday/stitch-surfing.webp" alt="" /></div>}
      <div className="sw-hero__accent" aria-hidden="true"><StoryWorldSeal variant={variant} title={hero.mainTitle}/><div className="sw-hero__motif">{motif}</div></div>
      {variant === 'solar' && <span className="sw-hero__watermark" aria-hidden="true">XV</span>}
      {variant === 'cafe' && <div className="sw-hero__menu-stamp" aria-hidden="true"><span>MENU DU JOUR</span><strong>01 / 04</strong><span>AVEC AMOUR</span></div>}
      <div className="sw-hero__bridge" aria-hidden="true"><span>{copy[variant].eyebrow}</span><p>{copy[variant].bridge}</p></div>
      <a className="sw-hero__cta" href={actionHref}>{copy[variant].cta}<span aria-hidden="true">↗</span></a>
      <span className="sw-hero__scroll" aria-hidden="true">DESLIZA PARA DESCUBRIR ↓</span>
    </div>
  </section>;
}

export function StoryWorldMarquee({ variant, second = false }: { variant: StoryVariant; second?: boolean }) {
  const lines = variant === 'ohana' ? ['OHANA SIGNIFICA FAMILIA · UNA FIESTA EN LA ISLA · ', 'SOL · MAR · JUEGOS · ABRAZOS · ']
    : variant === 'stitch' ? ['ALOHA · STITCH · UNA FIESTA DE OTRO PLANETA · ', 'OLAS · HULA · PASTEL · OHANA · ']
    : variant === 'solar' ? ['MÁS COLOR · MÁS LUZ · MÁS YO · ', 'QUINCE VUELTAS AL SOL · UNA NOCHE ÚNICA · ']
      : ['CAFÉ · AMOR · CONVERSACIONES SIN FIN · ', 'UNA MESA PARA DOS · UN BRINDIS PARA TODOS · '];
  return <div className={`sw-marquee${second ? ' sw-marquee--second' : ''}`} aria-hidden="true"><div>{Array.from({length:6},(_,i)=><span key={i}>{lines[second?1:0]}</span>)}</div></div>;
}

export function StoryWorldMoments({ variant, config }: { variant: StoryVariant; config: InvitationConfig }) {
  const title = variant === 'ohana' ? 'El mapa de nuestra fiesta.' : variant === 'stitch' ? 'Cuatro aventuras con Stitch.' : variant === 'solar' ? 'Cuatro formas de brillar.' : 'Nuestra carta del día.';
  const description = variant === 'ohana' ? 'Cada parada trae una nueva sorpresa.' : variant === 'stitch' ? 'Un recorrido de juegos, olas, pastel y música.' : variant === 'solar' ? 'Una noche hecha de energía y color.' : 'Cada momento se sirve con amor.';
  return <section className={`sw-moments sw-moments--${variant}`} id="sw-moments" data-editor-section="quoteStory" aria-label="Cuatro momentos de la celebración">{variant === 'ohana' && <div className="sw-ohana__motif-layer" aria-hidden="true">{(['hibiscus','surfboard','shell','sun','hibiscus'] as const).map((motif,index)=><span className={`sw-ohana__motif sw-ohana__motif--${index+1}`} key={index}><img src={`/images/ohana-lilo-stitch/ambient-${motif}.svg`} alt=""/></span>)}</div>}<header className="sw-moments__head"><p className="sw-overline">CAPÍTULO 02 · {copy[variant].chapter}</p><h2>{title}</h2><p>{description}</p></header><div className="sw-moments__grid">{config.content.gallery.images.slice(0,4).map((item,index)=><article className="sw-moment" style={{'--sw-stack-index':index} as CSSProperties} key={index}><div className="sw-moment__image"><img src={item.url} alt={item.caption} loading="lazy"/></div><div className="sw-moment__body"><span>0{index+1} / 04</span><h3>{item.caption}</h3><p>{config.content.timeline[index]?.description}</p></div></article>)}</div></section>;
}

export function setupStoryWorldScenes(root: HTMLElement, id: StoryWorldTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const scrub = (trigger: Element, start='top 90%', end='top 48%') => ({trigger,scroller,start,end,scrub:.9});
  const hero = root.querySelector<HTMLElement>('.sw-hero');
  const visual = root.querySelector<HTMLElement>('.sw-hero__visual');
  if (hero && visual) {
    const heroTimeline = gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:hero,scroller,start:'top top',end:'bottom bottom',scrub:.9,invalidateOnRefresh:true}});
    heroTimeline.to(root.querySelector('.sw-hero__copy'),{yPercent:-20,opacity:0,duration:.4},.05)
      .to(root.querySelector('.sw-hero__accent'),{xPercent:id==='solar-pop-xv'?80:-75,yPercent:-27,rotate:id==='ohana-lilo-stitch'||id==='stitch-birthday'?-35:48,scale:.68,opacity:.2,duration:.7},.1)
      .to(visual,{left:'0%',top:'0%',width:'100%',height:'100%',borderRadius:'0px',rotate:0,clipPath:'inset(0% 0% 0% 0%)',duration:.76},.15)
      .fromTo(root.querySelector('.sw-hero__bridge'),{opacity:0,y:42},{opacity:1,y:0,duration:.2},.77);
    if (id === 'stitch-birthday') heroTimeline.to(root.querySelectorAll('.sw-hero__stitch-art img'),{yPercent:-45,rotate:18,opacity:0,stagger:.08,duration:.45},.12);
  }
  const progress=root.querySelector<HTMLElement>('.sw-progress__bar');
  if(progress) gsap.fromTo(progress,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:root,scroller,start:'top top',end:'bottom bottom',scrub:.4}});
  const story=root.querySelector<HTMLElement>('.st-story');
  if(story){
    gsap.fromTo(story.querySelectorAll('.st-story__word'),{opacity:.23},{opacity:1,stagger:.04,ease:'none',scrollTrigger:scrub(story,'top 75%','bottom 43%')});
    story.querySelectorAll<SVGGeometryElement>('.sw-story__draw').forEach(path=>{const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:scrub(story,'top 83%','bottom 45%')});});
  }
  root.querySelectorAll<HTMLElement>('.st-story > .grid > div, .sw-moment, .st-family__card, .st-countdown__unit, .st-locations__card, .st-gallery__photo, .st-dress > .grid > div, .st-gifts .grid > div').forEach((card,index)=>gsap.fromTo(card,{y:45,rotate:index%2?4:-4,scale:.93,opacity:.52},{y:0,rotate:0,scale:1,opacity:1,ease:'none',scrollTrigger:scrub(card)}));
  if (id === 'ohana-lilo-stitch') {
    const moments = root.querySelector<HTMLElement>('.sw-moments--ohana');
    if (moments) moments.querySelectorAll<HTMLElement>('.sw-ohana__motif').forEach((motif,index)=>gsap.to(motif,{xPercent:index%2?-30:26,yPercent:index%2?-68:-105,rotate:index%2?-28:36,scale:index%2?.84:1.16,ease:'none',scrollTrigger:scrub(moments,'top 88%','bottom 15%')}));
  }
  const timeline=root.querySelector<HTMLElement>('.st-timeline');
  if(timeline){
    const line=timeline.querySelector('.st-timeline__line');const runner=timeline.querySelector('.sw-timeline__runner');
    if(line)gsap.fromTo(line,{scaleY:0},{scaleY:1,transformOrigin:'top',ease:'none',scrollTrigger:scrub(timeline,'top 80%','bottom 48%')});
    if(runner)gsap.fromTo(runner,{top:'0%'},{top:'92%',ease:'none',scrollTrigger:scrub(timeline,'top 80%','bottom 48%')});
  }
}
