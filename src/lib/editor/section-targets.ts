export const EDITOR_SECTION_TARGETS: Record<string, string> = {
  envelope: '[data-editor-section="envelope"], .ee-opening, .rx-opening, .mc-opening, .ax-opening, .rd-opening, .ma-opening, .nx-opening, .fk-opening',
  hero: '[data-editor-section="hero"], .st-hero, .cs-hero, .oc-hero, .ee-hero, .rx-hero, .mc-hero, .ax-hero, .rd-hero, .ma-hero, .nx-hero-scroll, .fk-hero',
  quoteStory: '[data-editor-section="quoteStory"], .st-story, .ee-story, .rx-story, .mc-story, .ax-story, .rd-story, .ma-story, .nx-story, .fk-stations',
  vipParents: '.st-family, .ee-family, .rx-family, .mc-family, .ax-family, .rd-family, .ma-family, .nx-family',
  countdown: '.st-countdown, .ee-countdown, .rx-countdown, .mc-countdown, .ax-countdown, .rd-countdown, .ma-countdown, .nx-countdown',
  locations: '.st-locations, .ee-locations, .rx-location, .mc-locations, .ax-locations, .rd-locations, .ma-locations, .nx-locations',
  timeline: '.st-timeline, .ee-timeline, .rx-timeline, .mc-timeline, .ax-timeline, .rd-timeline, .ma-timeline, .nx-timeline',
  gallery: '.st-gallery, .ee-gallery, .rx-gallery, .mc-gallery, .ax-gallery, .rd-gallery, .ma-gallery, .nx-gallery',
  dressCode: '.st-dress, .ee-dress, .rx-dress, .mc-dress, .ax-dress, .rd-dress, .ma-dress, .nx-dress',
  gifts: '.st-gifts, .ee-gifts, .rx-gifts, .mc-gifts, .ax-gifts, .rd-gifts, .ma-gifts, .nx-gifts',
  accommodation: '.st-stay, .ee-stay, .mc-stay, .ax-stay, .rd-stay, .ma-stay, .nx-stay',
  socialFeatures: '[data-editor-section="socialFeatures"], .ee-album, .ee-memories, .rx-social, .mc-social, .ax-social, .rd-social, .ma-social, .nx-social',
  rsvp: '.st-rsvp, .ee-rsvp, .rx-rsvp, .mc-rsvp, .ax-rsvp, .rd-rsvp, .ma-rsvp, .nx-rsvp',
};

export function editorTargetForElement(element: Element): { section: string; target: HTMLElement } | null {
  for (let current: Element | null = element; current; current = current.parentElement) {
    if (!(current instanceof HTMLElement)) continue;
    const target = current;
    const match = Object.entries(EDITOR_SECTION_TARGETS).find(([, selector]) => target.matches(selector));
    if (match) return { section: match[0], target: current };
  }
  return null;
}

export function editorTargetForSection(section: string): HTMLElement | null {
  const targetSection = section === 'theme' || section === 'audio' || section === 'sections' ? 'hero' : section;
  const selector = EDITOR_SECTION_TARGETS[targetSection];
  return selector ? document.querySelector<HTMLElement>(selector) : null;
}
