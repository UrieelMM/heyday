import gsap from 'gsap';

export const quoteWordTiming = { duration: .33, stagger: { amount: .67 } };

export function createQuoteReveal(quote: Element, ease = 'none') {
  // The last line and its illustration finish together, regardless of the cards below.
  return gsap.timeline({
    defaults: { ease, duration: 1 },
    scrollTrigger: {
      trigger: quote,
      scroller: quote.closest('[data-invitation-scroller]') ?? undefined,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
    },
  });
}

export function drawQuotePaths(timeline: gsap.core.Timeline, paths: Iterable<SVGGeometryElement>) {
  for (const path of paths) {
    if (typeof path.getTotalLength !== 'function') continue;
    const length = path.getTotalLength();
    timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0 }, 0);
  }
}
