'use client';

import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { kidsWorldName } from '@/lib/templates/kids-world-config';
import { KidsWorldFrame } from './kids-world-shared';

/** Mirrored eggshell halves and centered hatchling tracks form the hero emblem. */
export function DinoEgg() {
  return <svg className="dj-egg" viewBox="0 0 240 260" fill="none" aria-hidden="true">
    <defs><linearGradient id="dj-egg-clay" x1="50" y1="30" x2="195" y2="243" gradientUnits="userSpaceOnUse"><stop stopColor="#fff2bc"/><stop offset=".55" stopColor="#d9dd9d"/><stop offset="1" stopColor="#86a96d"/></linearGradient></defs>
    <path d="M120 17C69 17 31 80 31 146c0 58 39 97 89 97s89-39 89-97C209 80 171 17 120 17Z" fill="url(#dj-egg-clay)" stroke="#385a32" strokeWidth="6"/>
    <path d="M34 153 62 141 78 160 96 139 120 158 144 139 162 160 178 141 206 153" stroke="#385a32" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M55 77c15-23 32-39 55-44" stroke="white" strokeWidth="7" strokeLinecap="round" opacity=".72"/>
    <path d="M79 105c15-12 31-12 41 0 10-12 26-12 41 0" stroke="#6b9257" strokeWidth="5" strokeLinecap="round"/>
    <path d="M75 187c14-13 29-13 45 0 16-13 31-13 45 0" stroke="#6b9257" strokeWidth="5" strokeLinecap="round"/>
    <ellipse cx="120" cy="131" rx="30" ry="24" fill="#739c5b" stroke="#385a32" strokeWidth="4"/>
    <circle cx="108" cy="126" r="3.5" fill="#213d2e"/><circle cx="132" cy="126" r="3.5" fill="#213d2e"/>
    <path d="M113 139q7 6 14 0" stroke="#213d2e" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}

export function DinoSeal({ name }: { name: string }) {
  return <svg className="kw-seal" viewBox="0 0 260 260" aria-hidden="true">
    <defs><path id="dj-seal-path" d="M130 130m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0"/></defs>
    <circle cx="130" cy="130" r="111" fill="none" stroke="currentColor" opacity=".65"/>
    <text><textPath href="#dj-seal-path">✦ EXPEDICIÓN DE {name.toUpperCase()} ✦ ERA DE LA FIESTA ✦ </textPath></text>
  </svg>;
}

export function DinoStoryFossils() {
  return <svg className="kw-story__map dj-story__map" viewBox="0 0 600 430" fill="none" aria-hidden="true">
    <path className="kw-story__draw" d="M44 337C129 325 106 249 184 256s77-46 132-43 82-76 128-75 72-64 111-86" stroke="#8ba963" strokeWidth="5" strokeDasharray="8 13" strokeLinecap="round"/>
    <g stroke="#b57443" strokeWidth="4" strokeLinecap="round"><path className="kw-story__draw" d="M92 341c-10-18-26-23-38-12-9 10-3 28 11 31 14 3 25-5 27-19Zm3 0c10-18 26-23 38-12 9 10 3 28 -11 31-14 3-25-5-27-19Z"/><path className="kw-story__draw" d="M271 212c-8-16-22-20-34-10-8 8-2 23 10 26 12 3 22-4 24-16Zm3 0c8-16 22-20 34-10 8 8-2 23-10 26-12 3-22-4-24-16Z"/></g>
    <circle className="kw-story__draw" cx="514" cy="70" r="43" stroke="#b57443" strokeWidth="4"/>
    <path className="kw-story__draw" d="M500 52c27-17 49 14 25 29-19 11-31-10-16-20 10-7 20 5 11 12" stroke="#b57443" strokeWidth="4" strokeLinecap="round"/>
    <path className="kw-story__draw" d="M380 337c22-28 44-28 66 0 22-28 44-28 66 0" stroke="#8ba963" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}

export function DinoJungleExperience({ config, eventDate, guestGroup, actionHref }: {
  config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string;
}) {
  return <KidsWorldFrame variant="dino" config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={actionHref}
    motif={<DinoEgg />} seal={<DinoSeal name={kidsWorldName(config.content.hero.mainTitle)} />}
    overline="UN PASE PARA PEQUEÑOS EXPLORADORES" bridge="¡Bienvenidos a la era de la fiesta!" visualTag="01 / ERA JURÁSICA" cta="Entrar a la selva" />;
}
