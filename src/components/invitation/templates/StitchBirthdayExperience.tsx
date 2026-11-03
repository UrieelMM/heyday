'use client';

import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { StoryWorldHero } from './story-world-shared';

function SurfboardMark() {
  return <svg viewBox="0 0 240 240" fill="none" aria-hidden="true"><defs><linearGradient id="stitch-board" x1="45" y1="20" x2="190" y2="220"><stop stopColor="#fff4ba"/><stop offset="1" stopColor="#f36b69"/></linearGradient></defs><path d="M120 16C78 48 65 137 120 222c55-85 42-174 0-206Z" fill="url(#stitch-board)" stroke="currentColor" strokeWidth="5"/><path d="M120 22v195M83 135h74M91 175h58" stroke="currentColor" strokeWidth="4"/><circle cx="120" cy="85" r="22" fill="#277faa"/><path d="M120 60v50m-25-25h50m-43-17 36 35m0-35-36 35" stroke="#fff4db" strokeWidth="5" strokeLinecap="round"/></svg>;
}

function HibiscusMark() {
  return <svg className="stitch-hibiscus" viewBox="0 0 240 240" fill="none" aria-hidden="true"><g fill="#f36b69" stroke="#123952" strokeWidth="4"><path d="M120 114C55 76 43 17 83 18c21 1 38 40 37 96Z"/><path d="M126 116c12-74 57-110 83-76 18 23-28 65-83 76Z"/><path d="M129 125c65-11 111 19 87 53-17 25-68 10-87-53Z"/><path d="M115 129c25 65 8 113-31 96-27-12-10-70 31-96Z"/><path d="M108 119C42 143 2 120 18 82c12-27 69-14 90 37Z"/></g><circle cx="120" cy="120" r="24" fill="#ffe28a" stroke="#123952" strokeWidth="4"/><path d="M120 118c7-43 19-62 27-72" stroke="#123952" strokeWidth="4" strokeLinecap="round"/></svg>;
}

export function StitchWaveStory() {
  return <svg className="sw-story__art stitch-story__art" viewBox="0 0 800 500" fill="none" aria-hidden="true"><path className="sw-story__draw" d="M15 310q100-90 200 0t200 0q100-90 200 0t170 0M15 365q100-90 200 0t200 0q100-90 200 0t170 0M15 420q100-90 200 0t200 0q100-90 200 0t170 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/><circle className="sw-story__draw" cx="400" cy="130" r="95" stroke="currentColor" strokeWidth="5"/><path className="sw-story__draw" d="M400 12v25m0 186v25M282 130h25m186 0h25M316 46l18 18m132 132 18 18m0-168-18 18M334 196l-18 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path className="sw-story__draw" d="M365 145q35-55 70 0M365 175q35-55 70 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>;
}

export function StitchBirthdayExperience({ config, eventDate, guestGroup, actionHref }: { config: InvitationConfig; eventDate: string; guestGroup?: GuestGroup | null; actionHref: string }) {
  return <StoryWorldHero variant="stitch" config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={actionHref} motif={<><SurfboardMark /><HibiscusMark /></>} />;
}
