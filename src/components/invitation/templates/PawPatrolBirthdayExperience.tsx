'use client';

import { useId } from 'react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldAge, kidsWorldName } from '@/lib/templates/kids-world-config';
import { HeroMedia } from '../core/HeroMedia';

/** Symmetric dispatch shield, with separate light and paw layers. */
function RescueShield() {
  return <svg viewBox="0 0 240 270" fill="none" aria-hidden="true">
    <defs><linearGradient id="pp-shield-blue" x1="55" y1="24" x2="190" y2="240"><stop stopColor="#67C2ED"/><stop offset="1" stopColor="#216CB8"/></linearGradient></defs>
    <path d="M120 12C88 31 59 35 24 34V142C24 195 63 230 120 258C177 230 216 195 216 142V34C181 35 152 31 120 12Z" fill="#F7CE47" stroke="#17345D" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M120 29C92 45 66 49 40 48V139C40 182 72 213 120 238C168 213 200 182 200 139V48C174 49 148 45 120 29Z" fill="url(#pp-shield-blue)" stroke="#FFF9EB" strokeWidth="5"/>
    <path d="M120 47L127 63L144 65L131 77L134 94L120 85L106 94L109 77L96 65L113 63Z" fill="#FFF9EB"/>
    <ellipse cx="76" cy="126" rx="14" ry="19" transform="rotate(-18 76 126)" fill="#FFF9EB"/>
    <ellipse cx="106" cy="111" rx="13" ry="19" transform="rotate(-5 106 111)" fill="#FFF9EB"/>
    <ellipse cx="134" cy="111" rx="13" ry="19" transform="rotate(5 134 111)" fill="#FFF9EB"/>
    <ellipse cx="164" cy="126" rx="14" ry="19" transform="rotate(18 164 126)" fill="#FFF9EB"/>
    <path d="M120 136c-18 0-43 18-43 41 0 16 12 26 27 26 7 0 11-4 16-4s9 4 16 4c15 0 27-10 27-26 0-23-25-41-43-41Z" fill="#FFF9EB"/>
    <path d="M73 58C87 53 102 47 120 37" stroke="#FFF" strokeWidth="7" strokeLinecap="round" opacity=".58"/>
  </svg>;
}

/** Lookout silhouette uses x=120 as its axis and stays behind the editable cover. */
function LookoutTower() {
  return <svg className="pp-hero__tower" viewBox="0 0 240 420" fill="none" aria-hidden="true">
    <path d="M120 17v42M98 41h44" stroke="#F7CE47" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="120" cy="18" r="12" fill="#E34E48"/>
    <path d="M55 100L120 56L185 100V158H55V100Z" fill="#F7CE47" stroke="#17345D" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M70 104h100v46H70z" fill="#EAF7FF" stroke="#17345D" strokeWidth="6"/>
    <path d="M120 104v46M70 127h100" stroke="#17345D" strokeWidth="4"/>
    <path d="M76 160h88l-13 184H89L76 160Z" fill="#E34E48" stroke="#17345D" strokeWidth="7"/>
    <path d="M101 176h38l-5 142h-28l-5-142Z" fill="#F7CE47" stroke="#17345D" strokeWidth="5"/>
    <path d="M36 348h168v31H36z" fill="#2674B9" stroke="#17345D" strokeWidth="7"/>
    <path d="M19 381h202v26H19z" fill="#F7CE47" stroke="#17345D" strokeWidth="7"/>
  </svg>;
}

function RescueSeal({ name }: { name: string }) {
  const pathId = useId().replace(/:/g, '');
  return <svg className="pp-seal" viewBox="0 0 240 240" aria-hidden="true">
    <defs><path id={pathId} d="M120 120m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
    <circle cx="120" cy="120" r="102" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 8"/>
    <text><textPath href={`#${pathId}`}>MISIÓN CUMPLEAÑOS ✦ {name.toUpperCase()} ✦ PATRULLA EN ACCIÓN ✦ </textPath></text>
  </svg>;
}

export function PawPatrolRadarStory() {
  return <svg className="kw-story__map pp-story__map" viewBox="0 0 900 560" fill="none" aria-hidden="true">
    <circle className="kw-story__draw" cx="450" cy="280" r="220" stroke="currentColor" strokeWidth="4" strokeDasharray="12 17" />
    <circle className="kw-story__draw" cx="450" cy="280" r="150" stroke="currentColor" strokeWidth="4" />
    <circle className="kw-story__draw" cx="450" cy="280" r="80" stroke="currentColor" strokeWidth="3" />
    <path className="kw-story__draw" d="M450 20v520M190 280h520M450 280L662 68" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path className="kw-story__draw" d="M74 456C160 390 170 230 277 255C368 276 365 396 469 385C580 372 590 192 819 114" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeDasharray="18 20" />
    <path className="kw-story__draw" d="M230 120l12 27 29 2-22 19 7 29-26-15-26 15 7-29-22-19 29-2 12-27ZM740 376l12 27 29 2-22 19 7 29-26-15-26 15 7-29-22-19 29-2 12-27Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>;
}

export function PawPatrolBirthdayExperience({ config, eventDate, guestGroup, actionHref }: {
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
  return <section id="pp-hero" className="kw-hero pp-hero" data-editor-section="hero" aria-label="Portada de la misión Paw Patrol">
    <div className="kw-hero__stage pp-hero__stage">
      <div className="pp-hero__sky" aria-hidden="true" />
      <div className="pp-hero__radar" aria-hidden="true"><span /></div>
      <LookoutTower />
      <nav className="kw-nav pp-nav" aria-label="Navegación de la invitación">
        <a href="#pp-hero" className="kw-nav__brand">✦ MISIÓN {name.toUpperCase()}</a>
        <div><a href="#pp-stations">Misiones</a><a href="#st-locations">Base</a><a href="#st-rsvp">Confirmar</a></div>
      </nav>
      <div className="kw-hero__copy pp-hero__copy">
        <p className="kw-eyebrow"><span className="kw-pulse" />{hero.badgeText}</p>
        <p className="kw-hero__overline">ATENCIÓN, EQUIPO: NUEVA MISIÓN</p>
        <h1>{name}</h1>
        <p className="kw-hero__age">{age ? `cumple ${age}` : 'está de fiesta'} <span aria-hidden="true">★</span></p>
        <p className="kw-hero__tagline">{hero.tagline}</p>
        <div className="kw-hero__chips">{date && <span>{date}</span>}{locations[0]?.time && <span>{locations[0].time}</span>}{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
        {guestGroup && <p className="kw-hero__guest">Pase especial para {guestGroup.groupName}</p>}
      </div>
      <div className="kw-hero__visual pp-hero__visual">
        <div className="pp-hero__visual-rings" aria-hidden="true" />
        <HeroMedia hero={hero} alt={`La patrulla invita al cumpleaños de ${name}`} className="pp-hero__main-image" />
        <span className="kw-hero__visual-label">ACCESO DE HÉROE · {age || '01'}</span>
      </div>
      <div className="pp-hero__friend" aria-hidden="true"><img src="/images/paw-patrol-birthday/skye.webp" alt="" /></div>
      <div className="pp-hero__logo" aria-hidden="true"><img src="/images/paw-patrol-birthday/logo.webp" alt="" /></div>
      <div className="kw-hero__motif pp-hero__motif" aria-hidden="true"><RescueSeal name={name}/><div className="kw-hero__motif-core"><RescueShield /></div></div>
      <div className="kw-hero__bridge pp-hero__bridge" aria-hidden="true"><span>SEÑAL RECIBIDA · EQUIPO LISTO</span><p>¡La misión es<br />celebrar contigo!</p></div>
      <a className="kw-hero__cta" href={actionHref}>Aceptar misión <span aria-hidden="true">↗</span></a>
      <span className="kw-hero__scroll" aria-hidden="true">DESLIZA PARA DESPEGAR ↓</span>
    </div>
  </section>;
}
