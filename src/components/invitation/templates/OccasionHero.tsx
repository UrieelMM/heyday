import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import { HeroMedia } from '../core/HeroMedia';
import type { OccasionTemplateId } from '@/lib/templates/occasion-config';

const heroCopy = {
  'sweet-oh-baby': {
    eyebrow: 'SWEET OH BABY',
    event: 'CELEBRAMOS LA DULCE ESPERA DE',
    bridge: 'Ya te soñamos. Ya te esperamos.',
    action: 'Descubre esta dulce espera',
    label: 'HECHO CON AMOR · 01',
  },
  'grad-gala-night': {
    eyebrow: 'CLASS OF 2026 · COMMENCEMENT',
    event: 'CEREMONIA Y GALA DE',
    bridge: 'El diploma cierra un capítulo. La historia continúa.',
    action: 'Consulta el programa',
    label: 'ACADEMIC GALA · ADMIT ONE',
  },
} as const;

export function OccasionHero({
  templateId,
  config,
  eventDate,
  guestGroup,
  actionHref,
}: {
  templateId: OccasionTemplateId;
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const hero = config.content.hero;
  const copy = heroCopy[templateId];
  const date = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }).format(new Date(eventDate));

  return (
    <section id="oc-hero" className="oc-hero" aria-label="Portada de la invitación">
      <div className="oc-hero__stage">
        <div className="oc-hero__texture" aria-hidden="true" />

        {templateId === 'sweet-oh-baby' ? (
          <div className="oc-hero__mobile" aria-hidden="true">
            <span className="oc-hero__mobile-bar" />
            <i className="oc-hero__mobile-moon">☾</i>
            <i className="oc-hero__mobile-cloud">☁</i>
            <i className="oc-hero__mobile-star">✦</i>
          </div>
        ) : (
          <svg className="oc-hero__crest" viewBox="0 0 260 310" fill="none" aria-hidden="true">
            <path d="M130 15 238 51v83c0 76-43 127-108 161C65 261 22 210 22 134V51L130 15Z" />
            <path d="M130 38 215 67v67c0 61-33 103-85 133-52-30-85-72-85-133V67l85-29Z" />
            <path d="M85 137h90M130 87v100M86 190c25-17 63-17 88 0M89 90c26 13 56 13 82 0" />
          </svg>
        )}

        <div className="oc-hero__visual">
          <HeroMedia hero={hero} alt={templateId === 'sweet-oh-baby'
            ? 'Móvil artesanal de luna, nubes y estrellas para baby shower'
            : 'Escenario azul marino y oro preparado para una ceremonia de graduación'} />
          <div className="oc-hero__visual-wash" aria-hidden="true" />
          <span className="oc-hero__photo-label" aria-hidden="true">
            {copy.label}
          </span>
        </div>

        <div className="oc-hero__copy">
          <p className="oc-hero__eyebrow">{copy.eyebrow}</p>
          <p className="oc-hero__event">{copy.event}</p>
          <h1>{hero.mainTitle}</h1>
          <p className="oc-hero__tagline">{hero.tagline}</p>
          {guestGroup && (
            <p className="oc-hero__guest">Invitación para {guestGroup.groupName}</p>
          )}
          <p className="oc-hero__date">{date}</p>
        </div>

        {templateId === 'grad-gala-night' && (
          <div className="oc-hero__credential" aria-hidden="true">
            <span>ACCESS / 2026</span>
            <strong>GALA</strong>
            <small>FORMAL CREDENTIAL · ROW 01</small>
          </div>
        )}

        <div className="oc-hero__final">
          <span>{copy.eyebrow}</span>
          <p>{copy.bridge}</p>
        </div>
        <a className="oc-hero__cta" href={actionHref}>
          {copy.action}<span aria-hidden="true"> ↗</span>
        </a>
        <span className="oc-hero__scroll" aria-hidden="true">
          DESLIZA PARA DESCUBRIR ↓
        </span>
      </div>
    </section>
  );
}
