import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupRodeoRosaScenes(root: HTMLElement) {
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const scroller = root.closest('[data-invitation-scroller]') ?? undefined;
    const one = (selector: string, scope: Element = root) => scope.querySelector(selector);
    const all = (selector: string, scope: Element = root) => [...scope.querySelectorAll(selector)];
    const scene = (trigger: Element, start = 'top 98%', end = 'top 58%') =>
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger, scroller, start, end, scrub: true, invalidateOnRefresh: true } });
    const section = (selector: string, animate: (element: Element) => void) => {
      const element = one(selector);
      if (element) animate(element);
    };

    section('.rr-hero', hero => {
      const visual = one('.rr-hero__visual', hero)!;
      scene(hero, 'top top', 'bottom bottom')
        .fromTo(all('img, video', visual), { scale: 1.05, yPercent: 1 }, { scale: 1.16, yPercent: -4, duration: 1 }, 0)
        .to(all('.rr-hero__ornament', hero), { yPercent: -60, rotation: -22, stagger: .08, duration: .75 }, 0)
        .to(one('.rr-hero__copy', hero), { yPercent: -23, scale: .94, opacity: 0, duration: .35 }, .08)
        .to(one('.rr-hero__motif', hero), { xPercent: -62, yPercent: -58, rotation: 48, scale: .65, opacity: .18, duration: .67 }, .12)
        .to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: 0, borderWidth: 0, duration: .7 }, .17)
        .to(all('.kw-hero__visual-label, .kw-hero__scroll', hero), { opacity: 0, duration: .3 }, .4)
        .fromTo(one('.rr-hero__bridge', hero), { opacity: 0, y: 38, rotationX: -22 }, { opacity: 1, y: 0, rotationX: 0, duration: .24 }, .76);
    });

    section('.kw-progress__bar', bar => {
      scene(root, 'top top', 'bottom bottom').fromTo(bar, { scaleX: 0 }, { scaleX: 1 });
    });

    // The ornaments move on their own planes, separately from the foreground choreography.
    all('.rr-scene-art').forEach((art, index) => {
      const hero = art.closest('.rr-hero');
      const chapter = hero ?? art.parentElement;
      if (!chapter || chapter.classList.contains('kw-opening')) return;
      const direction = index % 2 ? -1 : 1;
      const [front, back] = all('.rr-scene-art__motif', art);
      scene(chapter, hero ? 'top top' : 'top bottom', hero ? 'bottom bottom' : 'clamp(bottom top)')
        .fromTo(front, { x: 14 * direction, y: 38, rotation: -12 * direction, scale: .88 }, { x: -20 * direction, y: -48, rotation: 16 * direction, scale: 1.13, duration: 1 }, 0)
        .fromTo(back, { y: -25, rotation: 9 * direction }, { y: 42, rotation: -14 * direction, duration: 1 }, 0);
    });

    section('.st-story', story => {
      scene(story, 'top 96%', 'top 42%')
        .fromTo(one('.st-story__rule', story), { scaleY: .1 }, { scaleY: 1, transformOrigin: 'top', duration: 1 });
      const quote = one('blockquote', story);
      const words = quote ? all('.st-story__word', quote) : [];
      if (quote && words.length) {
        const timeline = scene(quote, 'top bottom', 'bottom bottom');
        timeline.fromTo(words, { opacity: .62 }, { opacity: 1, stagger: { amount: .72 }, duration: .28 }, 0);
        all('.kw-story__draw', story).forEach((path, index) => {
          const length = (path as SVGGeometryElement).getTotalLength();
          timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: .66 }, .08 * index);
        });
        timeline.fromTo(one('.rr-story__lasso', story), { scale: .8, rotation: -8 }, { scale: 1, rotation: 0, duration: 1 }, 0);
      }
      const signature = one('.st-story__signature', story);
      if (signature) scene(signature).fromTo(signature, { letterSpacing: '.45em', opacity: .6 }, { letterSpacing: '.25em', opacity: 1 });

      // The small prints unfold from opposite edges like pages of a letter.
      all(':scope > .grid > div', story).forEach((card, index) => {
        const direction = index % 2 ? -1 : 1;
        const timeline = scene(card)
          .fromTo(card, { rotationY: 23 * direction, scale: .94 }, { rotationY: 0, scale: 1, transformPerspective: 700, duration: 1 }, 0)
          .fromTo(all('h3, p', card), { y: 12, opacity: .62 }, { y: 0, opacity: 1, stagger: .1, duration: .6 }, .3);
        const image = one('.kw-story-card__image', card);
        if (image) timeline.fromTo(image, { clipPath: 'inset(38% 0% 0% 0% round 15px)', objectPosition: '50% 14%' }, { clipPath: 'inset(0% 0% 0% 0% round 15px)', objectPosition: '50% 50%', duration: .8 }, .1);
      });
    });

    section('#rr-stations', stations => {
      const header = one('.kw-stations__head', stations)!;
      scene(header)
        .fromTo(all('h2, p:last-child', header), { y: 20, opacity: .6 }, { y: 0, opacity: 1, stagger: .15 });
      all('.kw-ambient__station-motif', stations).forEach((motif, index) => {
        scene(stations, 'top bottom', 'bottom 18%')
          .to(motif, { yPercent: -70 - index * 10, rotation: index % 2 ? -32 : 25 });
      });
      all('.kw-station', stations).forEach(card => {
        const timeline = scene(card, 'top 98%', 'top 53%');
        timeline
          .fromTo(one('.kw-station__image img', card), { scale: 1.26, yPercent: 5 }, { scale: 1, yPercent: 0, duration: 1 }, 0)
          .fromTo(all('.rr-station__door', card), { x: 0, xPercent: 0 }, { xPercent: (index: number) => index ? 102 : -102, duration: .83 }, .05)
          .fromTo(all('.kw-station__content > *', card), { y: 12, opacity: .58 }, { y: 0, opacity: 1, stagger: .08, duration: .45 }, .39);
      });
    });

    section('.st-family', family => {
      all('.st-family__card', family).forEach((card, index) => {
        scene(card)
          .fromTo(card, { rotationX: -28, y: 15, scale: .96 }, { rotationX: 0, y: 0, scale: 1, transformPerspective: 650, transformOrigin: 'top', duration: 1 }, 0)
          .fromTo(one('.rr-family__seal', card), { rotation: index % 2 ? -45 : 45, scale: .58, opacity: .55 }, { rotation: 0, scale: 1, opacity: 1, duration: .58 }, .08)
          .fromTo(all('h3, p', card), { y: 9, opacity: .64 }, { y: 0, opacity: 1, stagger: { amount: .13 }, duration: .43 }, .4);
      });
    });

    section('.st-countdown', countdown => {
      all('.st-countdown__unit', countdown).forEach((dial, index) => {
        const delay = index % 2 ? .18 : 0;
        scene(dial, 'top 98%', 'bottom 72%')
          .fromTo(one('.rr-dial__sweep', dial), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .82 }, delay)
          .fromTo(all(':scope > span', dial), { rotationX: -58, y: 15, opacity: .65 }, { rotationX: 0, y: 0, opacity: 1, transformPerspective: 360, stagger: .08, duration: .57 }, delay + .16);
      });
    });

    section('.st-locations', locations => {
      all('.st-locations__photo', locations).forEach(frame => {
        scene(frame, 'top 96%', 'bottom 64%')
          .fromTo(frame, { clipPath: 'inset(9% 20% 12% 20% round 48% 48% 14% 14%)' }, { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)', duration: .8 }, 0)
          .fromTo(one('img', frame), { scale: 1.27, yPercent: 8 }, { scale: 1.08, yPercent: -3, duration: 1 }, 0);
      });
      all('.st-locations__details', locations).forEach(details => {
        scene(details).fromTo(all(':scope > *', details), { y: 12, opacity: .62 }, { y: 0, opacity: 1, stagger: .14 });
      });
    });

    section('.st-timeline__track', track => {
      const runner = one('.kw-timeline__runner', track) as HTMLElement;
      scene(track, 'top 78%', 'bottom 70%')
        .fromTo(one('.st-timeline__line', track), { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', duration: 1 }, 0)
        .fromTo(runner, { y: 0 }, { y: () => (track as HTMLElement).clientHeight - runner.offsetHeight, duration: 1 }, 0)
        .to(one('img', runner), { rotation: 360, duration: 1 }, 0);
      all('.st-timeline__item', track).forEach(card => {
        scene(card)
          .fromTo(card, { scaleX: .89, y: 14 }, { scaleX: 1, y: 0, transformOrigin: 'left center', duration: 1 }, 0)
          .fromTo(one('.st-timeline__dot', card), { scale: .6 }, { scale: 1, duration: .38 }, .1)
          .fromTo(all('.st-timeline__time, h3, p', card), { x: -9, opacity: .62 }, { x: 0, opacity: 1, stagger: .1, duration: .57 }, .23);
      });
    });

    section('.st-gallery', gallery => {
      all('.st-gallery__photo', gallery).forEach((card, index) => {
        const direction = index % 2 ? -1 : 1;
        const timeline = scene(card, 'top 98%', 'top 57%')
          .fromTo(card, { rotation: 5 * direction, y: 24, scale: .89 }, { rotation: 0, y: 0, scale: 1, duration: 1 }, 0)
          .fromTo(one('img', card), { clipPath: 'circle(23% at 50% 47%)', scale: 1.25 }, { clipPath: 'circle(82% at 50% 47%)', scale: 1, duration: .87 }, .05);
        const caption = one('.st-gallery__caption', card);
        if (caption) timeline.fromTo(caption, { yPercent: 48, opacity: .5 }, { yPercent: 0, opacity: 1, duration: .43 }, .57);
      });
    });

    section('.st-dress', dress => {
      all(':scope > .grid > div', dress).forEach((card, index) => {
        const left = index === 0;
        scene(card)
          .fromTo(card, { rotationY: left ? -43 : 43, scale: .94 }, { rotationY: 0, scale: 1, transformOrigin: left ? 'left' : 'right', transformPerspective: 650, duration: 1 }, 0)
          .fromTo(one('.rr-dress__badge', card), { rotation: left ? 24 : -24, y: -10 }, { rotation: 0, y: 0, duration: .65 }, .16)
          .fromTo(all('h3, p', card), { opacity: .58 }, { opacity: 1, stagger: .12, duration: .5 }, .38);
      });
    });

    section('.st-gifts', gifts => {
      scene(gifts, 'top 96%', 'top 52%')
        .fromTo(one('svg.lucide-gift', gifts), { rotation: -38, scale: .55 }, { rotation: 0, scale: 1, duration: .65 }, 0)
        .fromTo(all('h2, h2 + p', gifts), { y: 8, opacity: .65 }, { y: 0, opacity: 1, stagger: .14, duration: .63 }, .2);
      const letter = one('.rr-letter', gifts);
      if (letter) {
        scene(letter, 'top 96%', 'top 58%')
          .fromTo(one('.rr-letter__flap', letter), { rotationX: 175 }, { rotationX: 0, duration: .55 }, 0)
          .fromTo(one('.rr-letter__paper', letter), { yPercent: 58 }, { yPercent: 0, duration: .55 }, .36);
      }
    });

    section('.st-stay', stay => {
      all(':scope > .grid > div', stay).forEach((card, index) => {
        scene(card).fromTo(card, { rotationZ: index % 2 ? -6 : 6, rotationX: -18, scale: .94 }, { rotationZ: 0, rotationX: 0, scale: 1, transformOrigin: 'top', transformPerspective: 650 });
      });
    });

    section('.rr-film', film => {
      scene(film, 'top 96%', 'bottom 72%')
        .fromTo(film, { rotation: -6, scale: .92 }, { rotation: 0, scale: 1, duration: 1 }, 0)
        .fromTo(all('img', film), { clipPath: 'inset(0% 95% 0% 0%)', x: 14 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, stagger: .14, duration: .62 }, .1);
    });
    section('.shared-album__note', note => {
      scene(note).fromTo(note, { opacity: .65, y: 7 }, { opacity: 1, y: 0 });
    });

    section('.rr-record', record => {
      scene(record, 'top 96%', 'bottom 70%')
        .fromTo(one('.rr-record__disc', record), { rotation: -145, scale: .66 }, { rotation: 25, scale: 1, duration: 1 }, 0)
        .fromTo(all('i', record), { scaleY: .17 }, { scaleY: 1, stagger: .1, duration: .55 }, .24);
    });
    all('.st-social--music h3').forEach(title => {
      scene(title).fromTo(title, { opacity: .62, scale: .94 }, { opacity: 1, scale: 1 });
    });

    section('.st-rsvp', rsvp => {
      const stamp = one('.rr-rsvp__stamp', rsvp)!;
      scene(stamp)
        .fromTo(stamp, { rotation: -22, scale: 1.28, y: -15, opacity: .48 }, { rotation: 5, scale: 1, y: 0, opacity: 1, duration: .7 }, 0)
        .fromTo(all('h2, h2 + p', rsvp), { opacity: .65 }, { opacity: 1, stagger: .14, duration: .5 }, .3);
    });

    section('footer', footer => {
      scene(footer, 'top bottom', 'clamp(bottom bottom)')
        .fromTo(one('p', footer), { opacity: .62, letterSpacing: '.17em' }, { opacity: 1, letterSpacing: '.04em' });
    });

    // Photos, fonts and editor changes can shift the scroll positions after mounting.
    const observer = new ResizeObserver(() => ScrollTrigger.refresh(true));
    observer.observe(root);
    return () => observer.disconnect();
  }, root);
  return () => motion.revert();
}
