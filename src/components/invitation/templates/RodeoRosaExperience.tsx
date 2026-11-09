'use client';

import { useId } from 'react';
import type { GuestGroup, InvitationConfig, SectionId } from '@/types/invitation.types';
import { kidsHeroDesktopSrc } from '@/lib/templates/kids-hero-media';
import { kidsWorldAge, kidsWorldName } from '@/lib/templates/kids-world-config';
import { HeroMedia } from '../core/HeroMedia';

function HorseshoeMedallion() {
  const metal = useId();
  const satin = useId();
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={metal} x1="80" y1="22" x2="80" y2="144" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF0BD" />
          <stop offset=".47" stopColor="#DA9458" />
          <stop offset=".7" stopColor="#F9D59A" />
          <stop offset="1" stopColor="#B87646" />
        </linearGradient>
        <linearGradient id={satin} x1="80" y1="85" x2="80" y2="148" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBB1C7" />
          <stop offset="1" stopColor="#C7547D" />
        </linearGradient>
      </defs>
      <path d="M38 24C18 43 14 65 18 85c5 32 28 53 62 53s57-21 62-53c4-20 0-42-20-61l-16 16c13 13 17 27 14 43-4 19-18 32-40 32S44 102 40 83c-3-16 1-30 14-43Z" fill={`url(#${metal})`} stroke="#713D32" strokeWidth="3" strokeLinejoin="round" />
      <path d="M37 40C6 94 44 128 80 128s74-34 43-88" stroke="#FFF2CB" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m30 55-2 7m-2 14 1 7m5 13 3 5m95-46 2 7m2 14-1 7m-5 13-3 5" stroke="#8A5138" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 107c-16-4-28-19-42-14-8 3-8 23-3 29 6 7 24 1 39-7l-13 29 10-5 6 9 3-24 3 24 6-9 10 5-13-29c15 8 33 14 39 7 5-6 5-26-3-29-14-5-26 10-42 14Z" fill={`url(#${satin})`} stroke="#993D60" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M76 112c-13-3-23-12-34-13m42 13c13-3 23-12 34-13" stroke="#FFE0E8" strokeWidth="2" strokeLinecap="round" />
      <rect x="73" y="104" width="14" height="15" rx="5" fill="#E384A5" stroke="#993D60" strokeWidth="2" />
    </svg>
  );
}

function RodeoSeal() {
  const circle = useId();
  return (
    <svg className="kw-seal rr-seal" viewBox="0 0 240 240" aria-hidden="true">
      <defs><path id={circle} d="M120 120m-91 0a91 91 0 1 1 182 0a91 91 0 1 1-182 0" /></defs>
      <circle cx="120" cy="120" r="117" fill="var(--kw-paper)" stroke="currentColor" strokeWidth="2" />
      <circle cx="120" cy="120" r="103" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="120" cy="120" r="78" fill="var(--kw-surface)" stroke="currentColor" strokeWidth="1" />
      <text><textPath href={`#${circle}`} textLength="560">✦ RODEO ROSA ✦ BOTAS Y MOÑOS ✦ RODEO ROSA ✦ BOTAS Y MOÑOS </textPath></text>
    </svg>
  );
}

export function RodeoLassoStory() {
  return (
    <svg className="kw-story__map rr-story__lasso" viewBox="0 0 900 640" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="kw-story__draw" d="M450 80C330 16 165 22 110 120 19 287 166 472 450 576c284-104 431-289 340-456C735 22 570 16 450 80Z" />
        <path className="kw-story__draw" d="M450 108C335 39 183 48 136 132 61 273 184 443 450 544c266-101 389-271 314-412-47-84-199-93-314-24Z" />
        <path className="kw-story__draw" d="M450 116c-44 6-70 29-98 56-61 58-139 30-118-24 19-50 113-60 216 12 103-72 197-62 216-12 21 54-57 82-118 24-28-27-54-50-98-56Z" />
        <path className="kw-story__draw" d="m143 278 12 30 30 12-30 12-12 30-12-30-30-12 30-12Zm614 0 12 30 30 12-30 12-12 30-12-30-30-12 30-12ZM450 469l8 19 19 8-19 8-8 19-8-19-19-8 19-8Z" />
      </g>
    </svg>
  );
}

export function RodeoSceneArt() {
  return (
    <span className="rr-scene-art" aria-hidden="true">
      <span className="rr-scene-art__motif"><span /></span>
      <span className="rr-scene-art__motif rr-scene-art__motif--companion"><span /></span>
    </span>
  );
}

export function RodeoRosaExperience({ config, eventDate, guestGroup, isSectionEnabled }: {
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  isSectionEnabled: (section: SectionId) => boolean;
}) {
  const { hero, locations } = config.content;
  const name = kidsWorldName(hero.mainTitle);
  const age = kidsWorldAge(hero.mainTitle);
  const parsedDate = new Date(eventDate);
  const date = Number.isNaN(parsedDate.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(parsedDate);
  const venue = isSectionEnabled('locations') ? locations[0] : undefined;
  const showStory = isSectionEnabled('quote_story');
  const showRsvp = isSectionEnabled('rsvp');
  const actionHref = showStory ? '#st-story' : showRsvp ? '#st-rsvp' : venue ? '#st-locations' : undefined;

  return (
    <section id="rr-hero" className="kw-hero rr-hero" data-editor-section="hero" aria-label="Portada de Rodeo Rosa">
      <div className="kw-hero__stage rr-hero__stage">
        <div className="kw-hero__atmosphere rr-hero__atmosphere" aria-hidden="true" />
        <RodeoSceneArt />
        <div className="kw-hero__ornament rr-hero__ornament rr-hero__ornament--bow" aria-hidden="true" />
        <div className="kw-hero__ornament rr-hero__ornament rr-hero__ornament--star" aria-hidden="true" />
        <nav className="kw-nav rr-nav" aria-label="Navegación de la invitación">
          <a href="#rr-hero" className="kw-nav__brand"><span aria-hidden="true">✦</span> Rodeo Rosa</a>
          <div>
            {showStory && <a href="#rr-stations">La fiesta</a>}
            {venue && <a href="#st-locations">Lugar</a>}
            {showRsvp && <a href="#st-rsvp" className="rr-nav__rsvp">Confirmar</a>}
          </div>
        </nav>
        <div className="kw-hero__visual rr-hero__visual">
          <HeroMedia hero={hero} alt={`Decoración del cumpleaños vaquero de ${name}`} desktopSrc={kidsHeroDesktopSrc(hero.coverImageUrl)} />
          <span className="kw-hero__visual-label">Bienvenidos al rancho</span>
        </div>
        <div className="kw-hero__copy rr-hero__copy">
          <p className="kw-eyebrow"><span className="kw-pulse" />{hero.badgeText}</p>
          <p className="rr-hero__script">El rodeo de</p>
          <h1>{name}</h1>
          {age && <p className="kw-hero__age">{age} años</p>}
          <p className="kw-hero__tagline">{hero.tagline}</p>
          <div className="kw-hero__chips">
            {date && <span>{date}</span>}
            {venue?.venueName && <span>{venue.venueName}</span>}
          </div>
          {guestGroup && <p className="kw-hero__guest">Boleto para {guestGroup.groupName}</p>}
        </div>
        <div className="kw-hero__motif rr-hero__motif" aria-hidden="true">
          <RodeoSeal />
          <div className="kw-hero__motif-core"><HorseshoeMedallion /></div>
        </div>
        <div className="kw-hero__bridge rr-hero__bridge" aria-hidden="true">
          <span>✦ &nbsp; Puertas abiertas &nbsp; ✦</span>
          <p>¡Que empiece el rodeo!</p>
        </div>
        {actionHref && <a className="kw-hero__cta rr-hero__cta" href={actionHref}>{showStory ? 'Entra al rancho' : showRsvp ? 'Confirma tu lugar' : 'Cómo llegar'}<span aria-hidden="true">↘</span></a>}
        <span className="kw-hero__scroll" aria-hidden="true">SIGUE EL SENDERO ↓</span>
      </div>
    </section>
  );
}
