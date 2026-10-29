import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { celebrationAge, celebrationName, isFirstCommunion, type CelebrationTemplateId } from '@/lib/templates/celebration-config';
import { HeroMedia } from '../core/HeroMedia';

const heroCopy = {
  'golden-jubilee': {
    eyebrow: 'THE GOLDEN EVENING', event: 'UNA NOCHE DE GALA', bridge: 'Brindemos por la vida.',
    action: 'Descubre la celebración', label: 'EDICIÓN DORADA · 01',
  },
  'fiesta-kids-adventure': {
    eyebrow: '¡MISIÓN CUMPLEAÑOS!', event: 'LA GRAN AVENTURA DE', bridge: '¡Que empiece la aventura!',
    action: 'Explora la fiesta', label: 'DESTINO: DIVERSIÓN',
  },
  'celestial-baptism': {
    eyebrow: 'CELESTIAL GRACE', event: 'CELEBRAMOS EL BAUTIZO DE', bridge: 'Una luz para toda la vida.',
    action: 'Conoce este día', label: 'UN DÍA DE GRACIA',
  },
} as const;

export function CelebrationHero({
  templateId, config, eventDate, guestGroup, actionHref,
}: {
  templateId: CelebrationTemplateId;
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const hero = config.content.hero;
  const copy = templateId === 'celestial-baptism' && isFirstCommunion(hero.mainTitle)
    ? { ...heroCopy[templateId], event: 'CELEBRAMOS LA PRIMERA COMUNIÓN DE', bridge: 'Un encuentro de fe y amor.' }
    : heroCopy[templateId];
  const name = celebrationName(templateId, hero.mainTitle);
  const age = celebrationAge(templateId, hero.mainTitle);
  const date = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(new Date(eventDate));

  return (
    <section id="cs-hero" className="cs-hero" aria-label="Portada de la invitación">
      <div className="cs-hero__stage">
        <div className="cs-hero__texture" aria-hidden="true" />
        {templateId === 'golden-jubilee' && (
          <div className="cs-hero__deco" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        )}
        {templateId === 'fiesta-kids-adventure' && (
          <div className="cs-hero__play" aria-hidden="true"><i className="cs-hero__play-sun">✳</i><i className="cs-hero__play-star">✦</i><i className="cs-hero__play-doodle">〰</i></div>
        )}
        {templateId === 'celestial-baptism' && (
          <svg className="cs-hero__olive" viewBox="0 0 180 360" fill="none" aria-hidden="true">
            <path d="M90 350C68 260 95 151 135 22" />
            <path d="M102 285c-29-8-47-31-49-50 27 9 45 29 49 50Zm3-41c22-23 31-47 29-66-21 16-32 38-29 66Zm8-42c-25-9-41-31-43-48 25 8 41 27 43 48Zm10-41c24-20 35-45 36-62-23 14-36 34-36 62Zm9-43c-22-11-33-31-33-47 22 9 34 25 33 47Z" />
          </svg>
        )}
        {age && <span className="cs-hero__age" aria-hidden="true">{age}</span>}

        <div className="cs-hero__visual">
          <HeroMedia hero={hero} alt={`Imagen de la celebración de ${hero.mainTitle}`} />
          <div className="cs-hero__visual-wash" aria-hidden="true" />
          <span className="cs-hero__photo-label" aria-hidden="true">{copy.label}</span>
        </div>

        <div className="cs-hero__copy">
          <p className="cs-hero__eyebrow">{copy.eyebrow}</p>
          <p className="cs-hero__event">{copy.event}</p>
          <h1 aria-label={hero.mainTitle}>{name}</h1>
          {age && <p className="cs-hero__age-line">{age} {templateId === 'fiesta-kids-adventure' ? 'años de diversión' : 'años de historias'}</p>}
          <p className="cs-hero__tagline">{hero.tagline}</p>
          {guestGroup && <p className="cs-hero__guest">Invitación para {guestGroup.groupName}</p>}
          <p className="cs-hero__date">{date}</p>
        </div>

        <div className="cs-hero__final"><span>{copy.eyebrow}</span><p>{copy.bridge}</p></div>
        <a className="cs-hero__cta" href={actionHref}>{copy.action}<span aria-hidden="true"> ↗</span></a>
        <span className="cs-hero__scroll" aria-hidden="true">DESLIZA PARA DESCUBRIR ↓</span>
      </div>
    </section>
  );
}
