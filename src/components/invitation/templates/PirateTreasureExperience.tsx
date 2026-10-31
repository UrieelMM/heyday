'use client';

import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldName } from '@/lib/templates/kids-world-config';
import { KidsWorldFrame } from './kids-world-shared';

/** Eight identical spokes keep the ship's wheel truly symmetrical. */
export function PirateWheel() {
  return <svg className="pw-wheel" viewBox="0 0 240 240" fill="none" aria-hidden="true">
    <defs><linearGradient id="pw-wheel-gold" x1="35" y1="30" x2="206" y2="215" gradientUnits="userSpaceOnUse"><stop stopColor="#fff1b5"/><stop offset=".48" stopColor="#dca958"/><stop offset="1" stopColor="#9c6534"/></linearGradient></defs>
    <circle cx="120" cy="120" r="91" fill="#103d4c" stroke="#f7dfaa" strokeWidth="3"/>
    {Array.from({ length: 8 }, (_, index) => <g key={index} transform={`rotate(${index * 45} 120 120)`}>
      <rect x="113" y="7" width="14" height="113" rx="6" fill="url(#pw-wheel-gold)" stroke="#6e4c2c" strokeWidth="2"/>
      <circle cx="120" cy="14" r="10" fill="#ffe5a0" stroke="#6e4c2c" strokeWidth="2"/>
    </g>)}
    <circle cx="120" cy="120" r="76" fill="none" stroke="url(#pw-wheel-gold)" strokeWidth="13"/>
    <circle cx="120" cy="120" r="20" fill="#ffe7ad" stroke="#6e4c2c" strokeWidth="5"/>
    <path d="M120 106v28m-14-14h28" stroke="#945d30" strokeWidth="4" strokeLinecap="round"/>
    <path d="M57 78c15-20 33-29 54-33" stroke="#fff8d5" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
  </svg>;
}

export function PirateSeal({ name }: { name: string }) {
  return <svg className="kw-seal" viewBox="0 0 260 260" aria-hidden="true">
    <defs><path id="pw-seal-path" d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
    <circle cx="130" cy="130" r="111" fill="none" stroke="currentColor" opacity=".65"/>
    <text><textPath href="#pw-seal-path">✦ TRIPULACIÓN DE {name.toUpperCase()} ✦ RUMBO AL TESORO ✦ </textPath></text>
  </svg>;
}

export function PirateStoryMap() {
  return <svg className="kw-story__map pw-story__map" viewBox="0 0 600 430" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M55 355C130 330 94 251 183 272s92-62 140-54 94 19 115-40 51-93 112-105" stroke="#cf9160" strokeWidth="5" strokeDasharray="10 12" strokeLinecap="round"/>
    <circle className="kw-story__draw" cx="79" cy="350" r="27" stroke="#8a6b42" strokeWidth="3"/>
    <circle className="kw-story__draw" cx="338" cy="218" r="34" stroke="#8a6b42" strokeWidth="3"/>
    <circle className="kw-story__draw" cx="535" cy="67" r="35" stroke="#8a6b42" strokeWidth="3"/>
    <path d="m531 40 8 21 20 6-20 7-8 21-7-21-21-7 21-6Z" fill="#e5b660" stroke="#8a6b42" strokeWidth="3"/>
    <path className="kw-story__draw" d="M130 80c31-23 60-23 91 0m-91 0c31 23 60 23 91 0m-46-43v86M387 337c33-23 62-23 94 0m-94 0c33 23 62 23 94 0" stroke="#2d8f8b" strokeWidth="3"/>
  </svg>;
}

export function PirateTreasureExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string;
}) {
  return <KidsWorldFrame variant="pirate" config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={actionHref}
    motif={<PirateWheel />} seal={<PirateSeal name={kidsWorldName(config.content.hero.mainTitle)} />}
    overline="UN PASE PARA LA TRIPULACIÓN" bridge="¡Rumbo al tesoro!" visualTag="01 / MAR ABIERTO" cta="Sube a bordo" />;
}
