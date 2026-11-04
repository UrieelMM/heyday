'use client';

import { useId } from 'react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldAge, kidsWorldName } from '@/lib/templates/kids-world-config';
import { HeroMedia } from '../core/HeroMedia';

/** A balloon built on one vertical axis so it remains balanced while it travels. */
function PlayBalloon() {
  return <svg viewBox="0 0 240 300" fill="none" aria-hidden="true">
    <defs><linearGradient id="bb-balloon-fill" x1="70" y1="15" x2="190" y2="208"><stop stopColor="#FFAE97"/><stop offset="1" stopColor="#EC5264"/></linearGradient></defs>
    <path d="M120 212C65 178 37 132 43 79C47 36 77 14 120 14C163 14 193 36 197 79C203 132 175 178 120 212Z" fill="url(#bb-balloon-fill)" stroke="#203B68" strokeWidth="6"/>
    <path d="M120 212L106 228H134L120 212Z" fill="#F26955" stroke="#203B68" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M120 228C141 250 100 261 120 290" stroke="#203B68" strokeWidth="5" strokeLinecap="round"/>
    <path d="M70 75C72 53 84 39 99 33" stroke="#FFF9E7" strokeWidth="12" strokeLinecap="round" opacity=".72"/>
    <path d="M120 65L130 91L157 92L136 108L144 134L120 118L96 134L104 108L83 92L110 91L120 65Z" fill="#FFF3B7"/>
  </svg>;
}

function PlaySeal({ name }: { name: string }) {
  const pathId = useId().replace(/:/g, '');
  return <svg className="bb-seal" viewBox="0 0 240 240" aria-hidden="true">
    <defs><path id={pathId} d="M120 120m-105 0a105 105 0 1 1 210 0a105 105 0 1 1-210 0" /></defs>
    <circle cx="120" cy="120" r="103" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 7" />
    <text><textPath href={`#${pathId}`}>JUEGA ✿ IMAGINA ✿ CELEBRA CON {name.toUpperCase()} ✿ </textPath></text>
  </svg>;
}

export function BlueyChalkStory() {
  return <svg className="kw-story__map bb-story__map" viewBox="0 0 900 560" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M45 425C155 412 120 252 270 249C398 246 391 380 510 342C625 305 604 141 820 100" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeDasharray="17 22" />
    <circle className="kw-story__draw" cx="450" cy="280" r="145" stroke="currentColor" strokeWidth="4" strokeDasharray="10 17" />
    <path className="kw-story__draw" d="M450 185L469 248L535 248L482 286L502 349L450 311L398 349L418 286L365 248L431 248Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <path className="kw-story__draw" d="M163 82c0-24 18-42 42-42s42 18 42 42c0 30-16 50-42 70-26-20-42-40-42-70Zm42 70-10 10h20l-10-10Zm0 10c12 18-11 25 2 42M703 405c0-24 18-42 42-42s42 18 42 42c0 30-16 50-42 70-26-20-42-40-42-70Zm42 70-10 10h20l-10-10Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path className="kw-story__draw" d="M80 100h35m-17-17v35M789 280h35m-17-17v35M285 467h35m-17-17v35" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>;
}

export function BlueyBirthdayExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const { hero, locations } = config.content;
  const name = kidsWorldName(hero.mainTitle);
  const age = kidsWorldAge(hero.mainTitle);
  const parsedDate = new Date(eventDate);
  const date = Number.isNaN(parsedDate.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(parsedDate);

  return <section id="bb-hero" className="kw-hero bb-hero" data-editor-section="hero" aria-label="Portada del cumpleaños de Bluey">
    <div className="kw-hero__stage bb-hero__stage">
      <div className="bb-hero__sky" aria-hidden="true" />
      <div className="bb-hero__sun" aria-hidden="true" />
      <div className="bb-hero__chalk bb-hero__chalk--one" aria-hidden="true">✳</div>
      <div className="bb-hero__chalk bb-hero__chalk--two" aria-hidden="true">✳</div>
      <div className="bb-hero__chalk bb-hero__chalk--three" aria-hidden="true">✳</div>
      <nav className="kw-nav bb-nav" aria-label="Navegación de la invitación">
        <a href="#bb-hero" className="kw-nav__brand">✿ PATIO DE {name.toUpperCase()}</a>
        <div><a href="#bb-stations">Juegos</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div>
      </nav>

      <div className="kw-hero__copy bb-hero__copy">
        <p className="kw-eyebrow"><span className="kw-pulse" />{hero.badgeText}</p>
        <p className="kw-hero__overline">HOY EL PATIO ES NUESTRO</p>
        <h1>{name}</h1>
        <p className="kw-hero__age">{age ? `cumple ${age}` : 'está de fiesta'} <span aria-hidden="true">✿</span></p>
        <p className="kw-hero__tagline">{hero.tagline}</p>
        <div className="kw-hero__chips">{date && <span>{date}</span>}{locations[0]?.time && <span>{locations[0].time}</span>}{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
        {guestGroup && <p className="kw-hero__guest">Un pase especial para {guestGroup.groupName}</p>}
      </div>

      <div className="kw-hero__visual bb-hero__visual">
        <div className="bb-hero__visual-cloud" aria-hidden="true" />
        <HeroMedia hero={hero} alt={`Bluey y Bingo invitan al cumpleaños de ${name}`} className="bb-hero__main-image" />
        <span className="kw-hero__visual-label">PASE DE JUEGO · {age || '01'}</span>
      </div>
      <div className="bb-hero__friend" aria-hidden="true"><img src="/images/bluey-birthday/bingo-dancing.webp" alt="" /></div>
      <div className="kw-hero__motif bb-hero__motif" aria-hidden="true"><PlaySeal name={name} /><div className="kw-hero__motif-core"><PlayBalloon /></div></div>
      <div className="kw-hero__bridge" aria-hidden="true"><span>¡EL JUEGO YA EMPEZÓ!</span><p>¡Ahora te toca<br />jugar a ti!</p></div>
      <a className="kw-hero__cta" href={actionHref}>Entra al patio <span aria-hidden="true">↗</span></a>
      <span className="kw-hero__scroll" aria-hidden="true">DESLIZA PARA JUGAR ↓</span>
    </div>
  </section>;
}
