'use client';

import { useId } from 'react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldAge, kidsWorldName } from '@/lib/templates/kids-world-config';
import { HeroMedia } from '../core/HeroMedia';

function PixelDiamond() {
  return <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
    <path d="M48 39H152L182 77V118L100 182L18 118V77L48 39Z" fill="#143D43" stroke="#0D282D" strokeWidth="8" strokeLinejoin="miter" />
    <path d="M48 39H152L171 75H29L48 39Z" fill="#ACF8EB" />
    <path d="M29 75H171L100 173L29 75Z" fill="#42CDBA" />
    <path d="M75 75H125L100 173L75 75Z" fill="#83E9D7" />
    <path d="M48 39L75 75H29L48 39ZM152 39L171 75H125L152 39Z" fill="#D3FFF5" />
    <path d="M48 39L75 75L100 53L125 75L152 39" stroke="#207F84" strokeWidth="5" />
  </svg>;
}

function CreeperMark() {
  return <svg viewBox="0 0 120 120" aria-hidden="true">
    <rect x="8" y="8" width="104" height="104" fill="#5A9D43" stroke="#203326" strokeWidth="8" />
    <path d="M30 34H48V55H30ZM72 34H90V55H72ZM48 55H72V77H48ZM38 76H53V96H38ZM67 76H82V96H67Z" fill="#203326" />
    <path d="M12 15H108M12 25H108" stroke="#9ECF6D" strokeOpacity=".5" strokeWidth="4" />
  </svg>;
}

function WorldSeal({ player }: { player: string }) {
  const id = useId().replace(/:/g, '');
  return <svg className="vxb-seal" viewBox="0 0 240 240" aria-hidden="true">
    <defs><path id={id} d="M120 120m-106 0a106 106 0 1 1 212 0a106 106 0 1 1-212 0" /></defs>
    <rect x="37" y="37" width="166" height="166" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
    <text><textPath href={`#${id}`}>MODO AVENTURA ◆ ${player.toUpperCase()} ◆ NUEVO MUNDO ◆ </textPath></text>
  </svg>;
}

/** A square route and four landmark blocks revealed by scroll. */
export function MinecraftStoryMap() {
  return <svg className="kw-story__map vxb-story__map" viewBox="0 0 900 560" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M98 452H238V361H340V279H452V188H564V103H790" stroke="currentColor" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter" strokeDasharray="22 16" />
    <path className="kw-story__draw" d="M88 441H177V530H88ZM295 334H374V413H295ZM517 159H596V238H517ZM735 58H814V137H735Z" stroke="currentColor" strokeWidth="5" />
    <path className="kw-story__draw" d="M118 462H147M334 354V392M537 179H576M755 77H795M46 148H246V184H46ZM626 392H848V428H626Z" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
    <path className="kw-story__draw" d="M90 70H148V128H90ZM310 58H358V106H310ZM414 415H462V463H414ZM694 252H752V310H694Z" stroke="currentColor" strokeWidth="3" />
  </svg>;
}

export function MinecraftBirthdayExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const { hero, locations } = config.content;
  const player = kidsWorldName(hero.mainTitle);
  const age = kidsWorldAge(hero.mainTitle);
  const parsed = new Date(eventDate);
  const date = Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(parsed);
  const base = '/images/minecraft-birthday/';

  return <section id="vx-hero" className="kw-hero vxb-hero" data-editor-section="hero" aria-label="Portal de cumpleaños Minecraft">
    <div className="kw-hero__stage vxb-hero__stage">
      <div className="kw-hero__atmosphere vxb-hero__sky" aria-hidden="true" />
      <div className="vxb-hero__sun" aria-hidden="true" />
      <div className="vxb-hero__cloud vxb-hero__cloud--one" aria-hidden="true" />
      <div className="vxb-hero__cloud vxb-hero__cloud--two" aria-hidden="true" />
      <div className="vxb-hero__cloud vxb-hero__cloud--three" aria-hidden="true" />
      <div className="vxb-hero__hills" aria-hidden="true"><span /><span /><span /></div>
      <img className="vxb-hero__block vxb-hero__block--one" src={`${base}grass-block.webp`} alt="" aria-hidden="true" />
      <img className="vxb-hero__block vxb-hero__block--two" src={`${base}grass-block.webp`} alt="" aria-hidden="true" />
      <div className="vxb-hero__diamond" aria-hidden="true"><PixelDiamond /></div>
      <div className="vxb-hero__chicken" aria-hidden="true"><img src={`${base}chicken.webp`} alt="" /></div>

      <nav className="kw-nav vxb-nav" aria-label="Navegación de la invitación">
        <a href="#vx-hero" className="kw-nav__brand"><span aria-hidden="true">▣</span> MUNDO DE {player.toUpperCase()}</a>
        <div><a href="#vx-stations">Misiones</a><a href="#st-locations">Mapa</a><a href="#st-rsvp">Entrar</a></div>
      </nav>

      <div className="kw-hero__copy vxb-hero__copy">
        <p className="kw-eyebrow"><span className="kw-pulse" />{hero.badgeText}</p>
        <img className="vxb-hero__logo" src={`${base}logo.webp`} alt="" aria-hidden="true" />
        <p className="kw-hero__overline">MISIÓN PRINCIPAL: CELEBRAR A</p>
        <h1>{player}</h1>
        <p className="kw-hero__age">{age ? `NIVEL ${age} DESBLOQUEADO` : 'NUEVA AVENTURA DESBLOQUEADA'}</p>
        <p className="kw-hero__tagline">{hero.tagline}</p>
        <div className="kw-hero__chips">{date && <span>{date}</span>}{locations[0]?.time && <span>{locations[0].time}</span>}{locations[0]?.venueName && <span>{locations[0].venueName}</span>}</div>
        {guestGroup && <p className="kw-hero__guest">Jugador invitado: {guestGroup.groupName}</p>}
      </div>

      <div className="kw-hero__visual vxb-hero__visual">
        <div className="vxb-hero__portal-grid" aria-hidden="true" />
        <HeroMedia hero={hero} alt={`Personajes de Minecraft invitan a celebrar a ${player}`} className="vxb-hero__main-image" />
        <span className="kw-hero__visual-label">MUNDO #{age || '01'} · ACCESO CONCEDIDO</span>
      </div>
      <div className="kw-hero__motif vxb-hero__motif" aria-hidden="true"><WorldSeal player={player} /><div className="kw-hero__motif-core"><CreeperMark /></div></div>
      <div className="kw-hero__bridge" aria-hidden="true"><span>MUNDO DESBLOQUEADO</span><p>La aventura<br />comienza aquí.</p></div>
      <a className="kw-hero__cta" href={actionHref}>Empezar aventura <span aria-hidden="true">→</span></a>
      <div className="vxb-hero__hud" aria-hidden="true"><span>♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥</span><span>◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆</span></div>
      <span className="kw-hero__scroll" aria-hidden="true">DESLIZA PARA ENTRAR ↓</span>
    </div>
  </section>;
}
