import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TemplateId } from '@/types/invitation.types';

gsap.registerPlugin(ScrollTrigger);

export function setupSignatureScenes(root: HTMLElement, templateId: TemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;

  const hero = root.querySelector<HTMLElement>('.st-hero');
  const visual = root.querySelector<HTMLElement>('.st-hero__visual');
  const copy = root.querySelector<HTMLElement>('.st-hero__copy');
  const final = root.querySelector<HTMLElement>('.st-hero__final');
  if (hero && visual && copy && final) {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4, invalidateOnRefresh: true },
    });
    // Give the opening frame room to breathe, then expand the photo over a longer scroll range.
    // The same timeline runs in reverse, so the return to the opening frame stays gradual too.
    timeline.to(copy, { yPercent: templateId === 'neon-xv-euphoria' ? -30 : -18, opacity: 0, duration: 0.42 }, 0.1);
    if (templateId === 'boho-terracotta') {
      timeline.to(root.querySelector('.st-hero__botanical'), { x: -65, rotate: -11, opacity: 0.25, duration: 0.72 }, 0.14);
      timeline.to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0% 0% 0% 0%', rotate: 0, duration: 0.72 }, 0.14);
    } else if (templateId === 'modern-minimal-noir') {
      timeline.to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', duration: 0.72 }, 0.14);
      timeline.to(root.querySelector('.st-hero__editorial-rule'), { y: -70, opacity: 0, duration: 0.44 }, 0.1);
    } else {
      timeline.to(root.querySelector('.st-hero__ticket'), { x: 170, rotate: 18, opacity: 0, duration: 0.55 }, 0.12);
      timeline.to(root.querySelector('.st-hero__orbit'), { scale: 1.7, opacity: 0.2, duration: 0.72 }, 0.14);
      timeline.to(visual, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0px', duration: 0.72 }, 0.14);
    }
    timeline.fromTo(final, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.18 }, 0.8);
  }

  const words = root.querySelectorAll<HTMLElement>('.st-story__word');
  const story = root.querySelector<HTMLElement>('.st-story');
  if (story && words.length) {
    gsap.fromTo(words, { opacity: 0.22 }, {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: { trigger: story, scroller, start: 'top 75%', end: 'bottom 55%', scrub: 0.7 },
    });
  }

  const cards = root.querySelectorAll<HTMLElement>('.st-family .st-family__card');
  cards.forEach((card, index) => {
    gsap.fromTo(card, {
      x: index % 2 === 0 ? -48 : 48,
      rotate: templateId === 'boho-terracotta' ? (index % 2 === 0 ? -5 : 5) : 0,
      opacity: 0.55,
    }, {
      x: 0, rotate: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, scroller, start: 'top 95%', end: 'top 54%', scrub: 0.7 },
    });
  });

  const countdown = root.querySelector<HTMLElement>('.st-countdown');
  if (countdown) {
    gsap.fromTo(countdown.querySelectorAll('.st-countdown__unit'), { y: 45, opacity: 0.45 }, {
      y: 0, opacity: 1, stagger: 0.13, ease: 'none',
      scrollTrigger: { trigger: countdown, scroller, start: 'top 82%', end: 'center 55%', scrub: 0.7 },
    });
  }

  const line = root.querySelector<HTMLElement>('.st-timeline__line');
  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  if (line && timeline) {
    gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none',
      scrollTrigger: { trigger: timeline, scroller, start: 'top 78%', end: 'bottom 45%', scrub: 0.7 },
    });
  }
  root.querySelectorAll<HTMLElement>('.st-timeline__item').forEach((item, index) => {
    gsap.fromTo(item, { x: templateId === 'modern-minimal-noir' ? 70 : 36, opacity: 0.5 }, {
      x: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: item, scroller, start: 'top 94%', end: 'top 68%', scrub: 0.6 },
    });
  });

  root.querySelectorAll<HTMLElement>('.st-gallery__photo').forEach((photo, index) => {
    gsap.fromTo(photo, {
      x: templateId === 'modern-minimal-noir' ? 90 : (index % 2 === 0 ? -40 : 40),
      y: templateId === 'neon-xv-euphoria' ? 55 : 30,
      rotate: templateId === 'boho-terracotta' ? (index % 2 === 0 ? -8 : 8) : 0,
      opacity: 0.4,
    }, {
      x: 0, y: 0, rotate: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: photo, scroller, start: 'top 96%', end: 'top 62%', scrub: 0.7 },
    });
  });
}
