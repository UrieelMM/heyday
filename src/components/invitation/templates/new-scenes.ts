import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { NewSceneTemplateId } from '@/lib/templates/new-scenes-config';

gsap.registerPlugin(ScrollTrigger);

export function setupNewScenes(root: HTMLElement, templateId: NewSceneTemplateId) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scroller = root.closest('[data-invitation-scroller]') || undefined;
  const hero = root.querySelector<HTMLElement>('.ns-hero');
  const media = root.querySelector<HTMLElement>('.ns-hero__media');
  const intro = root.querySelector<HTMLElement>('.ns-hero__intro');
  const outro = root.querySelector<HTMLElement>('.ns-hero__outro');
  const motif = root.querySelector<HTMLElement>('.ns-hero__motif');
  if (hero && media && intro && outro && motif) {
    const scene = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      trigger: hero, scroller, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true,
    } });
    scene.to(intro, { opacity: 0, yPercent: -18, duration: 0.42 }, 0.08);
    if (templateId === 'marea-azul') {
      scene.to(media, { left: '0%', top: '0%', width: '100%', height: '100%', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.72 }, 0.14);
      scene.to(motif, { xPercent: -25, opacity: 0, duration: 0.58 }, 0.12);
    } else if (templateId === 'ritmo-de-dos') {
      scene.to(media, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0%', rotate: 0, duration: 0.72 }, 0.14);
      scene.to(motif, { rotate: 155, scale: 1.4, opacity: 0, duration: 0.66 }, 0.12);
    } else if (templateId === 'mini-cosmos') {
      scene.to(media, { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '0%', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.72 }, 0.14);
      scene.to(motif, { yPercent: -65, rotate: 40, opacity: 0, duration: 0.64 }, 0.12);
    } else {
      scene.to(media, { left: '0%', top: '0%', width: '100%', height: '100%', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.72 }, 0.14);
      scene.to(motif, { xPercent: 50, opacity: 0, duration: 0.55 }, 0.12);
    }
    scene.fromTo(outro, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.18 }, 0.79);
  }

  const story = root.querySelector<HTMLElement>('.st-story');
  const words = story?.querySelectorAll<HTMLElement>('.st-story__word');
  if (story && words?.length) gsap.fromTo(words, { opacity: 0.25 }, { opacity: 1, stagger: 0.035, ease: 'none', scrollTrigger: {
    trigger: story, scroller, start: 'top 82%', end: 'bottom 58%', scrub: 0.65,
  } });

  root.querySelectorAll<HTMLElement>('.st-family__card').forEach((card, i) => {
    gsap.fromTo(card, {
      x: templateId === 'ritmo-de-dos' ? (i % 2 ? 65 : -65) : 0,
      y: templateId === 'mini-cosmos' ? (i % 2 ? 58 : -58) : 38,
      rotate: templateId === 'ritmo-de-dos' ? (i % 2 ? 9 : -9) : 0,
      opacity: 0.5,
    }, { x: 0, y: 0, rotate: 0, opacity: 1, ease: 'none', scrollTrigger: {
      trigger: card, scroller, start: 'top 94%', end: 'top 65%', scrub: 0.6,
    } });
  });

  const countdown = root.querySelector<HTMLElement>('.st-countdown');
  if (countdown) gsap.fromTo(countdown.querySelectorAll('.st-countdown__unit'), {
    y: templateId === 'mini-cosmos' ? 55 : 32, opacity: 0.35,
  }, { y: 0, opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: {
    trigger: countdown, scroller, start: 'top 86%', end: 'center 54%', scrub: 0.65,
  } });

  root.querySelectorAll<HTMLElement>('.st-locations__card').forEach((card, i) => {
    gsap.fromTo(card, { clipPath: templateId === 'atelier-xv' ? 'inset(0 48% 0 0)' : 'inset(0 0 32% 0)', opacity: 0.75 }, {
      clipPath: 'inset(0 0 0% 0)', opacity: 1, ease: 'none', scrollTrigger: {
        trigger: card, scroller, start: 'top 88%', end: 'top 48%', scrub: 0.7,
      }, delay: i * 0.04,
    });
  });

  const timeline = root.querySelector<HTMLElement>('.st-timeline');
  const line = timeline?.querySelector<HTMLElement>('.st-timeline__line');
  if (timeline && line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: {
    trigger: timeline, scroller, start: 'top 80%', end: 'bottom 45%', scrub: 0.7,
  } });
  root.querySelectorAll<HTMLElement>('.st-timeline__item').forEach((item, i) => {
    gsap.fromTo(item, { x: templateId === 'marea-azul' ? -55 : templateId === 'atelier-xv' ? 62 : (i % 2 ? 45 : -45), opacity: 0.45 }, {
      x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: item, scroller, start: 'top 94%', end: 'top 62%', scrub: 0.6 },
    });
  });
  root.querySelectorAll<HTMLElement>('.st-gallery__photo').forEach((photo, i) => {
    gsap.fromTo(photo, {
      x: templateId === 'marea-azul' ? (i % 2 ? 60 : -60) : 0,
      y: templateId === 'mini-cosmos' ? 65 : 38,
      rotate: templateId === 'ritmo-de-dos' ? (i % 2 ? 12 : -12) : 0,
      opacity: 0.5,
    }, { x: 0, y: 0, rotate: 0, opacity: 1, ease: 'none', scrollTrigger: {
      trigger: photo, scroller, start: 'top 95%', end: 'top 56%', scrub: 0.7,
    } });
  });

  const rsvpCard = root.querySelector<HTMLElement>('.st-rsvp > div');
  if (rsvpCard) gsap.fromTo(rsvpCard, { y: 32, opacity: 0.6 }, {
    y: 0, opacity: 1, ease: 'none', scrollTrigger: {
      trigger: rsvpCard, scroller, start: 'top 95%', end: 'top 72%', scrub: 0.6,
    },
  });
}
