export const EDITOR_SECTION_TARGETS: Record<string, string> = {
  envelope: '[data-editor-section="envelope"], .ee-opening, .rx-opening',
  hero: '[data-editor-section="hero"], .st-hero, .cs-hero, .oc-hero, .ee-hero, .rx-hero',
  quoteStory: '.st-story, .ee-story, .rx-story',
  vipParents: '.st-family, .ee-family, .rx-family',
  countdown: '.st-countdown, .ee-countdown, .rx-countdown',
  locations: '.st-locations, .ee-locations, .rx-location',
  timeline: '.st-timeline, .ee-timeline, .rx-timeline',
  gallery: '.st-gallery, .ee-gallery, .rx-gallery',
  dressCode: '.st-dress, .ee-dress, .rx-dress',
  gifts: '.st-gifts, .ee-gifts, .rx-gifts',
  accommodation: '.st-stay, .ee-stay',
  socialFeatures: '[data-editor-section="socialFeatures"], .ee-album, .ee-memories, .rx-social',
  rsvp: '.st-rsvp, .ee-rsvp, .rx-rsvp',
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
