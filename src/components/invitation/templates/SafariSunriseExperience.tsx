'use client';

import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldName } from '@/lib/templates/kids-world-config';
import { KidsWorldFrame } from './kids-world-shared';

/** Paired lenses mirror around x=120 for a balanced safari emblem. */
export function SafariBinoculars() {
  return <svg className="sf-binoculars" viewBox="0 0 240 240" fill="none" aria-hidden="true">
    <defs><linearGradient id="sf-brass" x1="45" y1="30" x2="197" y2="207" gradientUnits="userSpaceOnUse"><stop stopColor="#ffe2a0"/><stop offset=".55" stopColor="#c47a37"/><stop offset="1" stopColor="#76512f"/></linearGradient></defs>
    <path d="M75 76V58c0-12 10-22 22-22h46c12 0 22 10 22 22v18" stroke="#5b4c31" strokeWidth="12" strokeLinecap="round"/>
    <path d="M96 73c-16-7-31-2-37 12L31 169c-7 20 7 41 28 41h41c16 0 27-12 27-28V92c0-11-10-20-31-19Zm48 0c16-7 31-2 37 12l28 84c7 20-7 41-28 41h-41c-16 0-27-12-27-28V92c0-11 10-20 31-19Z" fill="url(#sf-brass)" stroke="#4f4430" strokeWidth="5"/>
    <circle cx="79" cy="170" r="36" fill="#234d57" stroke="#f8e4b6" strokeWidth="9"/><circle cx="161" cy="170" r="36" fill="#234d57" stroke="#f8e4b6" strokeWidth="9"/>
    <circle cx="79" cy="170" r="23" fill="#74b6bb" opacity=".7"/><circle cx="161" cy="170" r="23" fill="#74b6bb" opacity=".7"/>
    <path d="M64 155c8-8 16-10 23-8m59 8c8-8 16-10 23-8" stroke="white" strokeWidth="5" strokeLinecap="round" opacity=".75"/>
    <rect x="106" y="90" width="28" height="30" rx="9" fill="#f1d297" stroke="#4f4430" strokeWidth="4"/>
  </svg>;
}

export function SafariSeal({ name }: { name: string }) {
  return <svg className="kw-seal" viewBox="0 0 260 260" aria-hidden="true">
    <defs><path id="sf-seal-path" d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
    <circle cx="130" cy="130" r="111" fill="none" stroke="currentColor" opacity=".65"/>
    <text><textPath href="#sf-seal-path">✦ SAFARI DE {name.toUpperCase()} ✦ RUMBO A LA SABANA ✦ </textPath></text>
  </svg>;
}

export function SafariTrailBackdrop() {
  return <svg className="kw-story__map sf-story__map" viewBox="0 0 600 430" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M300 426c-94-65-103-119-36-153 72-36 81-66 9-105-74-41-59-92 27-161" stroke="#c57f3e" strokeWidth="6" strokeDasharray="10 14" strokeLinecap="round"/>
    <g stroke="#697b49" strokeWidth="4" strokeLinecap="round">
      <path className="kw-story__draw" d="M78 189V82m0 26C51 95 42 78 24 66m54 42c27-13 36-30 54-42M522 189V82m0 26c-27-13-36-30-54-42m54 42c27-13 36-30 54-42"/>
      <path className="kw-story__draw" d="M24 66c28-21 72-21 108 0m336 0c36-21 80-21 108 0"/>
    </g>
    <circle className="kw-story__draw" cx="300" cy="74" r="50" stroke="#d5a058" strokeWidth="4"/>
    <path className="kw-story__draw" d="M42 319c51-50 107-50 158 0m200 0c51-50 107-50 158 0" stroke="#789071" strokeWidth="4"/>
  </svg>;
}

export function SafariSunriseExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string;
}) {
  return <KidsWorldFrame variant="safari" config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={actionHref}
    motif={<SafariBinoculars />} seal={<SafariSeal name={kidsWorldName(config.content.hero.mainTitle)} />}
    overline="UN PASE PARA PEQUEÑOS EXPLORADORES" bridge="¡Nos vemos en la sabana!" visualTag="01 / AMANECER EN LA SABANA" cta="Comenzar el safari" />;
}
