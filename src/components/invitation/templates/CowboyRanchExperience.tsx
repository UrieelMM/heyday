'use client';

import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldName } from '@/lib/templates/kids-world-config';
import { KidsWorldFrame } from './kids-world-shared';

/** Crown, brim and band are mirrored along x=120. */
export function CowboyHat() {
  return <svg className="cb-hat" viewBox="0 0 240 240" fill="none" aria-hidden="true">
    <defs><linearGradient id="cb-leather" x1="45" y1="31" x2="188" y2="196" gradientUnits="userSpaceOnUse"><stop stopColor="#f7c879"/><stop offset=".55" stopColor="#c57346"/><stop offset="1" stopColor="#863f31"/></linearGradient></defs>
    <path d="M62 151 78 66c3-16 17-25 32-19l10 7 10-7c15-6 29 3 32 19l16 85" fill="url(#cb-leather)" stroke="#69382d" strokeWidth="6" strokeLinejoin="round"/>
    <path d="M68 123c29 15 75 15 104 0l6 28c-37 17-79 17-116 0l6-28Z" fill="#284f62" stroke="#69382d" strokeWidth="5"/>
    <path d="M20 141c27 20 61 27 100 27s73-7 100-27c-4 36-47 61-100 61s-96-25-100-61Z" fill="#c5794e" stroke="#69382d" strokeWidth="6"/>
    <path d="M61 157c38 12 80 12 118 0" stroke="#ffe4ae" strokeWidth="4" strokeLinecap="round"/>
    <path d="M103 134h34v27h-34z" fill="#eec886" stroke="#6b3d31" strokeWidth="4"/><path d="M114 138v19m12-19v19" stroke="#7d523b" strokeWidth="3"/>
    <path d="M86 72c6-12 12-17 20-18" stroke="#fff0c5" strokeWidth="6" strokeLinecap="round" opacity=".7"/>
  </svg>;
}

export function CowboySeal({ name }: { name: string }) {
  return <svg className="kw-seal" viewBox="0 0 260 260" aria-hidden="true">
    <defs><path id="cb-seal-path" d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
    <circle cx="130" cy="130" r="111" fill="none" stroke="currentColor" opacity=".7"/>
    <text><textPath href="#cb-seal-path">★ RANCHO DE {name.toUpperCase()} ★ FIESTA DEL OESTE ★ </textPath></text>
  </svg>;
}

export function CowboyTrailBackdrop() {
  return <svg className="kw-story__map cb-story__map" viewBox="0 0 600 430" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M300 427c-70-41-74-86-25-119 57-39 56-80 1-115-62-39-54-88 24-175" stroke="#b97152" strokeWidth="6" strokeDasharray="11 13" strokeLinecap="round"/>
    <path className="kw-story__draw" d="M16 201h142l-26-78H42l-26 78Zm426 0h142l-26-78h-90l-26 78Z" stroke="#a7654b" strokeWidth="4" strokeLinejoin="round"/>
    <path className="kw-story__draw" d="M82 320V205m-25 46h50m-50 0v-25m50 25v-25M518 320V205m-25 46h50m-50 0v-25m50 25v-25" stroke="#557178" strokeWidth="5" strokeLinecap="round"/>
    <path className="kw-story__draw" d="M54 355c44-35 92-35 136 0m220 0c44-35 92-35 136 0" stroke="#a7654b" strokeWidth="4"/>
    <circle className="kw-story__draw" cx="300" cy="75" r="45" stroke="#e7b66d" strokeWidth="4"/>
  </svg>;
}

export function CowboyRanchExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string;
}) {
  return <KidsWorldFrame variant="cowboy" config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={actionHref}
    motif={<CowboyHat />} seal={<CowboySeal name={kidsWorldName(config.content.hero.mainTitle)} />}
    overline="UN PASE PARA LA PANDILLA VAQUERA" bridge="¡El rancho está de fiesta!" visualTag="01 / RUMBO AL RANCHO" cta="Entrar al rancho" />;
}
