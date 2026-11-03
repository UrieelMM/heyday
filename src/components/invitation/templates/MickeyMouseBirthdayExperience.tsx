'use client';

import { useId } from 'react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldAge, kidsWorldName } from '@/lib/templates/kids-world-config';
import { HeroMedia } from '../core/HeroMedia';

/** A symmetrical club emblem. The three circles share the same vertical axis. */
function ClubEarsMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 240 240" fill="none" aria-hidden="true">
    <circle cx="54" cy="61" r="43" fill="#172238" stroke="#FFF8E9" strokeWidth="5" />
    <circle cx="186" cy="61" r="43" fill="#172238" stroke="#FFF8E9" strokeWidth="5" />
    <circle cx="120" cy="130" r="92" fill="#172238" stroke="#FFF8E9" strokeWidth="6" />
    <circle cx="120" cy="130" r="70" fill="#E8312A" stroke="#FFD34D" strokeWidth="5" />
    <path d="M68 125C86 103 103 94 120 95C137 94 154 103 172 125" stroke="#FFF8E9" strokeWidth="5" strokeLinecap="round" />
    <path d="M77 152H163" stroke="#FFF8E9" strokeWidth="5" strokeLinecap="round" />
    <circle cx="101" cy="138" r="9" fill="#FFD34D" />
    <circle cx="139" cy="138" r="9" fill="#FFD34D" />
    <path d="M120 36L126 51L142 51L129 61L134 77L120 68L106 77L111 61L98 51L114 51Z" fill="#FFD34D" />
  </svg>;
}

function ClubSeal({ name }: { name: string }) {
  const pathId = useId().replace(/:/g, '');
  return <svg className="mmb-seal" viewBox="0 0 240 240" aria-hidden="true">
    <defs><path id={pathId} d="M120 120m-105 0a105 105 0 1 1 210 0a105 105 0 1 1-210 0" /></defs>
    <circle cx="120" cy="120" r="102" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 8" />
    <text><textPath href={`#${pathId}`}>CLUB DE CUMPLEAÑOS ✦ {name.toUpperCase()} ✦ OH BOY! ✦ </textPath></text>
  </svg>;
}

function Balloon({ className, color }: { className: string; color: string }) {
  return <svg className={className} viewBox="0 0 84 172" fill="none" aria-hidden="true">
    <path d="M42 99C18 99 6 77 6 51C6 25 21 7 42 7C63 7 78 25 78 51C78 77 66 99 42 99Z" fill={color} stroke="#172238" strokeWidth="4" />
    <path d="M42 99L34 111H50L42 99ZM42 111C57 130 24 139 42 164" stroke="#172238" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 37C23 28 28 22 35 20" stroke="#FFF8E9" strokeWidth="6" strokeLinecap="round" opacity=".7" />
  </svg>;
}

/** The paths are drawn by the shared ScrollTrigger scene controller. */
export function MickeyStoryBackdrop() {
  return <svg className="kw-story__map mmb-story__map" viewBox="0 0 900 560" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M65 433C143 320 225 306 310 382C394 457 486 432 549 323C611 213 698 221 819 93" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="15 20" />
    <circle className="kw-story__draw" cx="450" cy="270" r="147" stroke="currentColor" strokeWidth="4" />
    <circle className="kw-story__draw" cx="450" cy="270" r="105" stroke="currentColor" strokeWidth="3" strokeDasharray="9 13" />
    <circle className="kw-story__draw" cx="361" cy="157" r="54" stroke="currentColor" strokeWidth="4" />
    <circle className="kw-story__draw" cx="539" cy="157" r="54" stroke="currentColor" strokeWidth="4" />
    <path className="kw-story__draw" d="M450 54V19M450 522v-35M223 270h-35M712 270h-35M127 118l-20-20M773 118l20-20M127 445l-20 20M773 445l20 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>;
}

export function MickeyMouseBirthdayExperience({ config, eventDate, guestGroup, actionHref }: {
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

  return <section id="mm-hero" className="kw-hero mmb-hero" data-editor-section="hero" aria-label="Portada del cumpleaños de Mickey Mouse">
    <div className="kw-hero__stage mmb-hero__stage">
      <div className="kw-hero__atmosphere mmb-hero__atmosphere" aria-hidden="true" />
      <div className="mmb-hero__orbit" aria-hidden="true" />
      <span className="mmb-hero__star mmb-hero__star--one" aria-hidden="true">✦</span>
      <span className="mmb-hero__star mmb-hero__star--two" aria-hidden="true">✦</span>
      <span className="mmb-hero__star mmb-hero__star--three" aria-hidden="true">✦</span>
      <Balloon className="mmb-hero__balloon mmb-hero__balloon--red" color="#E8312A" />
      <Balloon className="mmb-hero__balloon mmb-hero__balloon--blue" color="#2B65B8" />
      <Balloon className="mmb-hero__balloon mmb-hero__balloon--yellow" color="#FFD34D" />

      <nav className="kw-nav mmb-nav" aria-label="Navegación de la invitación">
        <a href="#mm-hero" className="kw-nav__brand"><span aria-hidden="true">●</span> CLUB {name.toUpperCase()}</a>
        <div><a href="#mm-stations">Explorar</a><a href="#st-locations">Lugar</a><a href="#st-rsvp">Confirmar</a></div>
      </nav>

      <div className="kw-hero__copy mmb-hero__copy">
        <p className="kw-eyebrow"><span className="kw-pulse" />{hero.badgeText}</p>
        <p className="kw-hero__overline">HEY, AMIGO… ¡ESTÁS INVITADO!</p>
        <h1>{name}</h1>
        <p className="kw-hero__age">{age ? `cumple ${age}` : 'está de fiesta'} <span aria-hidden="true">✦</span></p>
        <p className="kw-hero__tagline">{hero.tagline}</p>
        <div className="kw-hero__chips">{date && <span>{date}</span>}{locations[0]?.time && <span>{locations[0].time}</span>}{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
        {guestGroup && <p className="kw-hero__guest">Pase especial para {guestGroup.groupName}</p>}
      </div>

      <div className="kw-hero__visual mmb-hero__visual">
        <div className="mmb-hero__visual-rays" aria-hidden="true" />
        <HeroMedia hero={hero} alt={`Mickey Mouse celebra el cumpleaños de ${name}`} className="mmb-hero__main-image" />
        <span className="kw-hero__visual-label">PASE Nº {age || '01'} · EDICIÓN ESPECIAL</span>
      </div>
      <div className="mmb-hero__friend" aria-hidden="true"><img src="/images/mickey-mouse-birthday/mickey-party.webp" alt="" /></div>
      <div className="kw-hero__motif mmb-hero__motif" aria-hidden="true"><ClubSeal name={name} /><div className="kw-hero__motif-core"><ClubEarsMark /></div></div>
      <div className="kw-hero__bridge" aria-hidden="true"><span>¡EL CLUB TE ESPERA!</span><p>La fiesta empieza<br />contigo.</p></div>
      <a className="kw-hero__cta" href={actionHref}>Descubre la fiesta <span aria-hidden="true">↗</span></a>
      <span className="kw-hero__scroll" aria-hidden="true">DESLIZA PARA ENTRAR ↓</span>
    </div>
  </section>;
}
