import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';
import type { NewSceneTemplateId } from '@/lib/templates/new-scenes-config';
import { HeroMedia } from '../core/HeroMedia';

const motifs: Record<NewSceneTemplateId, string> = {
  'marea-azul': '≈', 'ritmo-de-dos': '●', 'mini-cosmos': '✦', 'atelier-xv': 'XV',
};

export function NewSceneHero({ templateId, config, eventDate, guestGroup, actionHref }: {
  templateId: NewSceneTemplateId;
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const { hero } = config.content;
  const date = new Date(eventDate);
  const dateText = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(date);
  const destination = actionHref === '#st-story' ? 'quote_story' : actionHref === '#st-rsvp' ? 'rsvp' : actionHref === '#st-locations' ? 'locations' : 'hero';
  const nextTitle = config.content.sectionHeadings?.[destination]?.title || 'Descubre la celebración';

  return (
    <section id="ns-hero" data-editor-section="hero" className="ns-hero" aria-label="Portada de la invitación">
      <div className="ns-hero__stage">
        <div className="ns-hero__field" aria-hidden="true" />
        <div className="ns-hero__motif" aria-hidden="true">{motifs[templateId]}</div>
        <div className="ns-hero__media">
          <HeroMedia hero={hero} alt={`Escena visual de ${hero.mainTitle}`} />
          <span className="ns-hero__media-shade" aria-hidden="true" />
        </div>
        <div className="ns-hero__intro">
          <span className="ns-hero__badge">{hero.badgeText}</span>
          <h1>{hero.mainTitle}</h1>
          <p className="ns-hero__tagline">{hero.tagline}</p>
          {guestGroup && <p className="ns-hero__guest">Invitación para {guestGroup.groupName}</p>}
          <p className="ns-hero__date">{dateText}</p>
        </div>
        <div className="ns-hero__outro" aria-hidden="true">
          <span>{hero.badgeText}</span><p>{nextTitle}</p>
        </div>
        {actionHref !== '#ns-hero' && <a className="ns-hero__cta" href={actionHref}>Explorar: {nextTitle}<span aria-hidden="true">↗</span></a>}
        <span className="ns-hero__scroll" aria-hidden="true">DESLIZA ↓</span>
      </div>
    </section>
  );
}
