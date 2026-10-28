import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CelebrationTemplateId } from '@/lib/templates/celebration-config';

gsap.registerPlugin(ScrollTrigger);

export function setupCelebrationScenes(root: HTMLElement, templateId: CelebrationTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const hero = root.querySelector<HTMLElement>('.cs-hero');
  const visual = root.querySelector<HTMLElement>('.cs-hero__visual');
  const copy = root.querySelector<HTMLElement>('.cs-hero__copy');
  const final = root.querySelector<HTMLElement>('.cs-hero__final');

  if (hero && visual && copy && final) {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2, invalidateOnRefresh: true },
    });
    timeline.to(copy, { yPercent: -18, opacity: 0, duration: 0.4 }, 0.1);
    timeline.to(visual, {
      left: '0%', top: '0%', width: '100%', height: '100%',
      borderRadius: templateId === 'celestial-baptism' ? '0%' : templateId === 'fiesta-kids-adventure' ? '0px' : undefined,
      rotate: 0, duration: 0.68,
    }, 0.17);
    if (templateId === 'golden-jubilee') {
      timeline.to(root.querySelector('.cs-hero__deco'), { scale: 1.16, opacity: 0.15, duration: 0.7 }, 0.14);
      timeline.to(root.querySelector('.cs-hero__age'), { yPercent: -16, opacity: 0.2, duration: 0.7 }, 0.14);
    } else if (templateId === 'fiesta-kids-adventure') {
      timeline.to(root.querySelector('.cs-hero__play-sun'), { x: -85, rotate: -24, duration: 0.7 }, 0.15);
      timeline.to(root.querySelector('.cs-hero__play-star'), { x: 80, y: -50, rotate: 28, duration: 0.7 }, 0.15);
      timeline.to(root.querySelector('.cs-hero__age'), { rotate: -13, yPercent: -12, opacity: 0.15, duration: 0.7 }, 0.15);
    } else {
      timeline.to(root.querySelector('.cs-hero__olive'), { x: -45, rotate: -9, opacity: 0.18, duration: 0.7 }, 0.15);
    }
    timeline.fromTo(final, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.21 }, 0.76);
  }

  const story = root.querySelector<HTMLElement>('.st-story');
  const words = root.querySelectorAll<HTMLElement>('.st-story__word');
  if (story && words.length) {
    gsap.fromTo(words, { opacity: templateId === 'celestial-baptism' ? 0.5 : 0.55 }, {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: { trigger: story, scroller, start: 'top 78%', end: 'bottom 56%', scrub: 0.7 },
    });
  }

  root.querySelectorAll<HTMLElement>('.st-story > .grid > div').forEach((card, index) => {
    gsap.fromTo(card, {
      y: templateId === 'fiesta-kids-adventure' ? 60 : 36,
      rotate: templateId === 'fiesta-kids-adventure' ? (index ? 5 : -5) : 0,
      opacity: 0.55,
    }, {
      y: 0, rotate: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, scroller, start: 'top 97%', end: 'top 62%', scrub: 0.7 },
    });
  });

  root.querySelectorAll<HTMLElement>('.st-family__card').forEach((card, index) => {
    gsap.fromTo(card, {
      x: templateId === 'celestial-baptism' ? (index ? 34 : -34) : 0,
      y: templateId === 'fiesta-kids-adventure' ? 55 : 25,
      rotate: templateId === 'fiesta-kids-adventure' ? (index ? 4 : -4) : 0,
      opacity: 0.55,
    }, {
      x: 0, y: 0, rotate: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, scroller, start: 'top 96%', end: 'top 62%', scrub: 0.7 },
    });
  });

  const countdown = root.querySelector<HTMLElement>('.st-countdown');
  if (countdown) {
    gsap.fromTo(countdown.querySelectorAll('.st-countdown__unit'), {
      y: templateId === 'fiesta-kids-adventure' ? 58 : 40, opacity: 0.48,
      rotate: templateId === 'fiesta-kids-adventure' ? -5 : 0,
    }, {
      y: 0, opacity: 1, rotate: 0, stagger: 0.11, ease: 'none',
      scrollTrigger: { trigger: countdown, scroller, start: 'top 82%', end: 'center 56%', scrub: 0.7 },
    });
  }

  root.querySelectorAll<HTMLElement>('.st-locations__card').forEach((card) => {
    gsap.fromTo(card, { y: 42, opacity: 0.6 }, {
      y: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, scroller, start: 'top 96%', end: 'top 62%', scrub: 0.7 },
    });
  });

  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  const line = timeline?.querySelector<HTMLElement>('.st-timeline__line');
  if (timeline && line) {
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1, transformOrigin: 'top', ease: 'none',
      scrollTrigger: { trigger: timeline, scroller, start: 'top 78%', end: 'bottom 50%', scrub: 0.7 },
    });
  }
  root.querySelectorAll<HTMLElement>('.st-timeline__item').forEach((item, index) => {
    gsap.fromTo(item, {
      x: templateId === 'golden-jubilee' ? 45 : templateId === 'celestial-baptism' ? 22 : (index % 2 ? 34 : -34),
      opacity: 0.5,
    }, {
      x: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: item, scroller, start: 'top 94%', end: 'top 66%', scrub: 0.65 },
    });
  });

  root.querySelectorAll<HTMLElement>('.st-gallery__photo').forEach((photo, index) => {
    gsap.fromTo(photo, {
      x: templateId === 'golden-jubilee' ? (index ? 65 : -65) : 0,
      y: templateId === 'celestial-baptism' ? 44 : 65,
      rotate: templateId === 'fiesta-kids-adventure' ? (index ? 8 : -8) : 0,
      opacity: 0.48,
    }, {
      x: 0, y: 0, rotate: templateId === 'fiesta-kids-adventure' && index === 1 ? 3 : 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: photo, scroller, start: 'top 97%', end: 'top 62%', scrub: 0.7 },
    });
  });
}
