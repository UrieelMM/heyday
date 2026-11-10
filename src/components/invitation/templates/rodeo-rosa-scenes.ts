import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createQuoteReveal, quoteWordTiming } from './quote-reveal';

gsap.registerPlugin(ScrollTrigger);

export function setupRodeoRosaScenes(root: HTMLElement) {
  const motion = gsap.matchMedia();
  motion.add({
    animate: '(prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 700px)',
  }, ({ conditions }) => {
    if (!conditions?.animate) return;
    const scroller = root.closest('[data-invitation-scroller]') ?? undefined;
    const one = (selector: string, scope: Element = root) => scope.querySelector(selector);
    const all = (selector: string, scope: Element = root) => [...scope.querySelectorAll(selector)];
    const scene = (trigger: Element, start = 'top bottom', end = 'top 52%', scrub: boolean | number = .28) =>
      gsap.timeline({ defaults: { ease: 'sine.inOut' }, scrollTrigger: { trigger, scroller, start, end, scrub, invalidateOnRefresh: true } });
    const section = (selector: string, animate: (element: Element) => void) => {
      const element = one(selector);
      if (element) animate(element);
    };

    section('.rr-hero', hero => {
      const visual = one('.rr-hero__visual', hero)!;
      scene(hero, 'top top', 'bottom bottom')
        .fromTo(all('img, video', visual), { scale: 1.04, yPercent: 1 }, { scale: 1.11, yPercent: -2, duration: 1 }, 0)
        .to(all('.rr-hero__ornament', hero), { yPercent: -35, rotation: -13, stagger: .06, duration: .83 }, 0)
        .to(one('.rr-hero__copy', hero), { yPercent: -14, scale: .97, opacity: 0, duration: .43 }, .08)
        .to(one('.rr-hero__motif', hero), { xPercent: -38, yPercent: -36, rotation: 27, scale: .8, opacity: .18, duration: .73 }, .12)
        .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: 0, borderWidth: 0, duration: .7 }, .17)
        .to(all('.kw-hero__visual-label, .kw-hero__scroll', hero), { opacity: 0, duration: .3 }, .4)
        .fromTo(one('.rr-hero__bridge', hero), { opacity: 0, y: 20, rotationX: -9 }, { opacity: 1, y: 0, rotationX: 0, duration: .31 }, .69);
    });

    section('.kw-progress__bar', bar => {
      scene(root, 'top top', 'bottom bottom', true).fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' });
    });

    // The ornaments move on their own planes, separately from the foreground choreography.
    all('.rr-scene-art').forEach((art, index) => {
      const hero = art.closest('.rr-hero');
      const chapter = hero ?? art.parentElement;
      if (!chapter || chapter.classList.contains('kw-opening')) return;
      const direction = index % 2 ? -1 : 1;
      const [front, back] = all('.rr-scene-art__motif', art);
      scene(chapter, hero ? 'top top' : 'top bottom', hero ? 'bottom bottom' : 'clamp(bottom top)')
        .fromTo(front, { x: 9 * direction, y: 26, rotation: -8 * direction, scale: .94 }, { x: -13 * direction, y: -32, rotation: 10 * direction, scale: 1.08, duration: 1 }, 0)
        .fromTo(back, { y: -16, rotation: 6 * direction }, { y: 28, rotation: -9 * direction, duration: 1 }, 0);
    });

    section('.st-story', story => {
      scene(story, 'top 96%', 'top 42%')
        .fromTo(one('.st-story__rule', story), { scaleY: .1 }, { scaleY: 1, transformOrigin: 'top', duration: 1 });
      const quote = one('blockquote', story);
      const words = quote ? all('.st-story__word', quote) : [];
      if (quote && words.length) {
        const timeline = createQuoteReveal(quote, 'sine.inOut');
        timeline.fromTo(words, { opacity: .73 }, { opacity: 1, ...quoteWordTiming }, 0);
        all('.kw-story__draw', story).forEach((path, index) => {
          const length = (path as SVGGeometryElement).getTotalLength();
          timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: .66 }, .08 * index);
        });
        timeline.fromTo(one('.rr-story__lasso', story), { scale: .91, rotation: -5 }, { scale: 1, rotation: 0, duration: 1 }, 0);
      }
      const signature = one('.st-story__signature', story);
      if (signature) scene(signature).fromTo(signature, { letterSpacing: '.31em', opacity: .77 }, { letterSpacing: '.25em', opacity: 1 });

      all(':scope > .grid > div', story).forEach(card => {
        const timeline = scene(card, 'top 96%', 'top 49%')
          .fromTo(card, { y: 12, opacity: .76 }, { y: 0, opacity: 1, duration: 1 }, 0);
        const image = one('.kw-story-card__image', card);
        if (image) {
          timeline.fromTo(image, { filter: 'saturate(.55)' }, { filter: 'saturate(1)', duration: .94 }, .06);
        }
      });
    });

    section('#rr-stations', stations => {
      const header = one('.kw-stations__head', stations)!;
      scene(header)
        .fromTo(all('h2, p:last-child', header), { y: 10, opacity: .78 }, { y: 0, opacity: 1, stagger: .09 });
      all('.kw-ambient__station-motif', stations).forEach((motif, index) => {
        scene(stations, 'top bottom', 'bottom 18%')
          .to(motif, { yPercent: -42 - index * 7, rotation: index % 2 ? -17 : 14 });
      });
      all('.kw-station', stations).forEach(card => {
        // The in-flow anchor stays at the card's original position when the card sticks.
        const mobile = conditions.mobile;
        const anchor = mobile ? card.previousElementSibling ?? card : card;
        const timeline = mobile ? scene(anchor, 'top 42%', 'top 17%', .22) : scene(anchor, 'top 111%', 'top 67%', .16);
        timeline
          .fromTo(one('.kw-station__image img', card), { scale: 1.1, yPercent: 2 }, { scale: 1, yPercent: 0, duration: 1 }, 0)
          .fromTo(all('.rr-station__door', card), {
            x: 0,
            xPercent: (index: number) => mobile ? 0 : index ? 17 : -17,
          }, {
            xPercent: (index: number) => index ? 102 : -102,
            duration: mobile ? .94 : .79,
            ease: mobile ? 'sine.inOut' : 'sine.out',
          }, mobile ? .06 : 0)
          .fromTo(all('.kw-station__content > *', card), { y: 5, opacity: .81 }, { y: 0, opacity: 1, stagger: .055, duration: .72 }, .17);
      });
    });

    section('.st-family', family => {
      all('.st-family__card', family).forEach((card, index) => {
        scene(card)
          .fromTo(card, { rotationX: -12, y: 9, scale: .985 }, { rotationX: 0, y: 0, scale: 1, transformPerspective: 850, transformOrigin: 'top', duration: 1 }, 0)
          .fromTo(one('.rr-family__seal', card), { rotation: index % 2 ? -20 : 20, scale: .82, opacity: .75 }, { rotation: 0, scale: 1, opacity: 1, duration: .82 }, .03)
          .fromTo(all('h3, p', card), { y: 5, opacity: .78 }, { y: 0, opacity: 1, stagger: { amount: .12 }, duration: .66 }, .2);
      });
    });

    section('.st-countdown', countdown => {
      all('.st-countdown__unit', countdown).forEach(dial => {
        scene(dial, 'top bottom', 'bottom 58%', .5)
          .fromTo(one('.rr-dial__sweep', dial), { attr: { 'stroke-dashoffset': .36 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1 }, 0)
          .fromTo(all(':scope > span', dial), { opacity: .9 }, { opacity: 1, duration: 1 }, 0);
      });
    });

    section('.st-locations', locations => {
      all('.st-locations__photo', locations).forEach(frame => {
        scene(frame, 'top 96%', 'bottom 64%')
          .fromTo(frame, { clipPath: 'inset(6% 12% 8% 12% round 36% 36% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)', duration: .92 }, 0)
          .fromTo(one('img', frame), { scale: 1.16, yPercent: 4 }, { scale: 1.06, yPercent: -2, duration: 1 }, 0);
      });
      all('.st-locations__details', locations).forEach(details => {
        scene(details).fromTo(all(':scope > *', details), { y: 6, opacity: .79 }, { y: 0, opacity: 1, stagger: .09 });
      });
    });

    section('.st-timeline__track', track => {
      const runner = one('.kw-timeline__runner', track) as HTMLElement;
      scene(track, 'top 78%', 'bottom 70%')
        .fromTo(one('.st-timeline__line', track), { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', duration: 1, ease: 'none' }, 0)
        .fromTo(runner, { y: 0 }, { y: () => (track as HTMLElement).clientHeight - runner.offsetHeight, duration: 1, ease: 'none' }, 0)
        .to(one('img', runner), { rotation: 160, duration: 1, ease: 'none' }, 0);
      all('.st-timeline__item', track).forEach(card => {
        scene(card)
          .fromTo(card, { scaleX: .96, y: 7 }, { scaleX: 1, y: 0, transformOrigin: 'left center', duration: 1 }, 0)
          .fromTo(one('.st-timeline__dot', card), { scale: .8 }, { scale: 1, duration: .57 }, .07)
          .fromTo(all('.st-timeline__time, h3, p', card), { x: -4, opacity: .81 }, { x: 0, opacity: 1, stagger: .06, duration: .7 }, .15);
      });
    });

    section('.st-gallery', gallery => {
      all('.st-gallery__photo', gallery).forEach((card, index) => {
        const direction = index % 2 ? -1 : 1;
        const timeline = scene(card, 'top 98%', 'top 57%')
          .fromTo(card, { rotation: 3 * direction, y: 12, scale: .96 }, { rotation: 0, y: 0, scale: 1, duration: 1 }, 0)
          .fromTo(one('img', card), { clipPath: 'circle(39% at 50% 47%)', scale: 1.13 }, { clipPath: 'circle(82% at 50% 47%)', scale: 1, duration: .9 }, .02);
        const caption = one('.st-gallery__caption', card);
        if (caption) timeline.fromTo(caption, { yPercent: 22, opacity: .72 }, { yPercent: 0, opacity: 1, duration: .56 }, .44);
      });
    });

    section('.st-dress', dress => {
      all(':scope > .grid > div', dress).forEach(card => {
        scene(card, 'top 96%', 'top 48%')
          .fromTo(card, { opacity: .74, '--rr-dress-stitch-cut': '50%' }, { opacity: 1, '--rr-dress-stitch-cut': '0%', duration: 1 }, 0);
      });
    });

    section('.st-gifts', gifts => {
      scene(gifts, 'top 96%', 'top 52%')
        .fromTo(one('svg.lucide-gift', gifts), { rotation: -19, scale: .78 }, { rotation: 0, scale: 1, duration: .8 }, 0)
        .fromTo(all('h2, h2 + p', gifts), { y: 5, opacity: .78 }, { y: 0, opacity: 1, stagger: .08, duration: .7 }, .13);
      const letter = one('.rr-letter', gifts);
      if (letter) {
        scene(letter)
          .fromTo(one('.rr-letter__flap', letter), { rotationX: 135 }, { rotationX: 0, duration: .84 }, 0)
          .fromTo(one('.rr-letter__paper', letter), { yPercent: 45 }, { yPercent: 0, duration: .69 }, .24);
      }
    });

    section('.st-stay', stay => {
      all(':scope > .grid > div', stay).forEach((card, index) => {
        scene(card).fromTo(card, { rotationZ: index % 2 ? -3 : 3, rotationX: -9, scale: .98 }, { rotationZ: 0, rotationX: 0, scale: 1, transformOrigin: 'top', transformPerspective: 850 });
      });
    });

    section('.rr-film', film => {
      scene(film, 'top 96%', 'bottom 72%')
        .fromTo(film, { rotation: -3, scale: .97 }, { rotation: 0, scale: 1, duration: 1 }, 0)
        .fromTo(all('img', film), { clipPath: 'inset(0% 67% 0% 0%)', x: 6 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, stagger: .09, duration: .77 }, .05);
    });
    section('.shared-album__note', note => {
      scene(note).fromTo(note, { opacity: .81, y: 4 }, { opacity: 1, y: 0 });
    });

    section('.rr-record', record => {
      scene(record, 'top 96%', 'bottom 70%')
        .fromTo(one('.rr-record__disc', record), { rotation: -95, scale: .86 }, { rotation: 25, scale: 1, duration: 1 }, 0)
        .fromTo(all('i', record), { scaleY: .43 }, { scaleY: 1, stagger: .065, duration: .66 }, .08);
    });
    all('.st-social--music h3').forEach(title => {
      scene(title).fromTo(title, { opacity: .81, scale: .98 }, { opacity: 1, scale: 1 });
    });

    section('.st-rsvp', rsvp => {
      const stamp = one('.rr-rsvp__stamp', rsvp)!;
      scene(stamp)
        .fromTo(stamp, { rotation: -9, scale: 1.12, y: -8, opacity: .71 }, { rotation: 5, scale: 1, y: 0, opacity: 1, duration: .86 }, 0)
        .fromTo(all('h2, h2 + p', rsvp), { opacity: .8 }, { opacity: 1, stagger: .09, duration: .66 }, .16);
    });

    section('footer', footer => {
      scene(footer, 'top bottom', 'clamp(bottom bottom)')
        .fromTo(one('p', footer), { opacity: .79, letterSpacing: '.09em' }, { opacity: 1, letterSpacing: '.04em' });
    });

    // Photos, fonts and editor changes can shift the scroll positions after mounting.
    const observer = new ResizeObserver(() => ScrollTrigger.refresh(true));
    observer.observe(root);
    return () => observer.disconnect();
  }, root);
  return () => motion.revert();
}
