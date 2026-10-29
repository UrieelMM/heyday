import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { OccasionTemplateId } from '@/lib/templates/occasion-config';

gsap.registerPlugin(ScrollTrigger);

export function setupOccasionScenes(
  root: HTMLElement,
  templateId: OccasionTemplateId
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const hero = root.querySelector<HTMLElement>('.oc-hero');
  const visual = root.querySelector<HTMLElement>('.oc-hero__visual');
  const copy = root.querySelector<HTMLElement>('.oc-hero__copy');
  const final = root.querySelector<HTMLElement>('.oc-hero__final');

  if (hero && visual && copy && final) {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(copy, { yPercent: -18, opacity: 0, duration: 0.42 }, 0.08);

    if (templateId === 'sweet-oh-baby') {
      timeline
        .to('.oc-hero__mobile-moon', { x: -90, y: 35, rotate: -20, duration: 0.7 }, 0.12)
        .to('.oc-hero__mobile-cloud', { x: 90, y: -28, rotate: 9, duration: 0.7 }, 0.12)
        .to('.oc-hero__mobile-star', { x: 55, y: 62, rotate: 42, duration: 0.7 }, 0.12)
        .to('.oc-hero__mobile-bar', { scaleX: 1.35, opacity: 0.14, duration: 0.7 }, 0.12)
        .to(visual, {
          left: '0%',
          top: '0%',
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          rotate: 0,
          duration: 0.72,
        }, 0.14);
    } else {
      timeline
        .to('.oc-hero__crest', { scale: 1.32, rotate: 4, opacity: 0.11, duration: 0.72 }, 0.12)
        .to('.oc-hero__credential', { x: -150, rotate: -9, opacity: 0, duration: 0.52 }, 0.1)
        .to(visual, {
          left: '0%',
          top: '0%',
          width: '100%',
          height: '100%',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.72,
        }, 0.14);
    }

    timeline.fromTo(
      final,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.2 },
      0.78
    );
  }

  const story = root.querySelector<HTMLElement>('.st-story');
  const words = root.querySelectorAll<HTMLElement>('.st-story__word');
  if (story && words.length) {
    gsap.fromTo(
      words,
      { opacity: templateId === 'sweet-oh-baby' ? 0.3 : 0.18 },
      {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: story,
          scroller,
          start: 'top 76%',
          end: 'bottom 55%',
          scrub: 0.7,
        },
      }
    );
  }

  root.querySelectorAll<HTMLElement>('.st-story > .grid > div').forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        x: templateId === 'grad-gala-night' ? (index ? 70 : -70) : 0,
        y: templateId === 'sweet-oh-baby' ? 55 : 20,
        rotate: templateId === 'sweet-oh-baby' ? (index ? 4 : -4) : 0,
        opacity: 0.45,
      },
      {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          scroller,
          start: 'top 96%',
          end: 'top 62%',
          scrub: 0.7,
        },
      }
    );
  });

  root.querySelectorAll<HTMLElement>('.st-family__card').forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 42,
        rotate: templateId === 'sweet-oh-baby' ? [-4, 2, 5][index % 3] : 0,
        opacity: 0.52,
      },
      {
        y: 0,
        rotate: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          scroller,
          start: 'top 96%',
          end: 'top 62%',
          scrub: 0.7,
        },
      }
    );
  });

  const countdown = root.querySelector<HTMLElement>('.st-countdown');
  if (countdown) {
    gsap.fromTo(
      countdown.querySelectorAll('.st-countdown__unit'),
      {
        y: templateId === 'grad-gala-night' ? 58 : 30,
        scale: templateId === 'sweet-oh-baby' ? 0.84 : 1,
        opacity: 0.42,
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        stagger: 0.11,
        ease: 'none',
        scrollTrigger: {
          trigger: countdown,
          scroller,
          start: 'top 82%',
          end: 'center 56%',
          scrub: 0.7,
        },
      }
    );
  }

  root.querySelectorAll<HTMLElement>('.st-locations__card').forEach((card) => {
    gsap.fromTo(
      card,
      {
        clipPath: templateId === 'sweet-oh-baby'
          ? 'inset(10% 7% 10% 7% round 42% 42% 18px 18px)'
          : 'inset(7% 5% 7% 5%)',
        y: 42,
        opacity: 0.62,
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          scroller,
          start: 'top 96%',
          end: 'top 58%',
          scrub: 0.8,
        },
      }
    );
  });

  const program = root.querySelector<HTMLElement>('.st-timeline');
  const line = program?.querySelector<HTMLElement>('.st-timeline__line');
  if (program && line) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: program,
          scroller,
          start: 'top 78%',
          end: 'bottom 48%',
          scrub: 0.7,
        },
      }
    );
  }

  root.querySelectorAll<HTMLElement>('.st-timeline__item').forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        x: templateId === 'grad-gala-night' ? 72 : index % 2 ? 36 : -36,
        opacity: 0.48,
      },
      {
        x: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          scroller,
          start: 'top 94%',
          end: 'top 66%',
          scrub: 0.65,
        },
      }
    );
  });

  root.querySelectorAll<HTMLElement>('.st-gallery__photo').forEach((photo, index) => {
    gsap.fromTo(
      photo,
      {
        x: templateId === 'grad-gala-night' ? (index ? 80 : -80) : 0,
        y: templateId === 'sweet-oh-baby' ? 55 : 25,
        rotate: templateId === 'sweet-oh-baby' ? (index ? 6 : -6) : 0,
        opacity: 0.44,
      },
      {
        x: 0,
        y: 0,
        rotate: templateId === 'sweet-oh-baby' && index === 1 ? 2 : 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: photo,
          scroller,
          start: 'top 96%',
          end: 'top 62%',
          scrub: 0.7,
        },
      }
    );
  });

  const rsvp = root.querySelector<HTMLElement>('.st-rsvp > div');
  if (rsvp) {
    gsap.fromTo(
      rsvp,
      { y: 42, opacity: 0.58 },
      {
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rsvp,
          scroller,
          start: 'top 92%',
          end: 'top 70%',
          scrub: 0.55,
        },
      }
    );
  }
}
