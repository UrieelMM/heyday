import type { GuestGroup, InvitationConfig, TemplateId } from '@/types/invitation.types';

type SignatureId = Extract<TemplateId, 'boho-terracotta' | 'modern-minimal-noir' | 'neon-xv-euphoria'>;

const heroCopy: Record<SignatureId, { eyebrow: string; bridge: string; action: string; mark: string }> = {
  'boho-terracotta': {
    eyebrow: 'UN AMOR QUE FLORECE',
    bridge: 'Florecer es mejor juntos.',
    action: 'Descubre nuestra historia',
    mark: '✳',
  },
  'modern-minimal-noir': {
    eyebrow: 'THE WEDDING EDIT / 01',
    bridge: 'Una historia. Un sí. Nuestra fecha.',
    action: 'Explora la edición',
    mark: '—',
  },
  'neon-xv-euphoria': {
    eyebrow: 'XV / ONE NIGHT ONLY',
    bridge: 'Esta noche es nuestra.',
    action: 'Entra a la fiesta',
    mark: '✦',
  },
};

export function SignatureHero({
  templateId,
  config,
  eventDate,
  guestGroup,
  actionHref,
}: {
  templateId: SignatureId;
  config: InvitationConfig;
  eventDate: string;
  guestGroup?: GuestGroup | null;
  actionHref: string;
}) {
  const { hero } = config.content;
  const copy = heroCopy[templateId];
  const title = templateId === 'neon-xv-euphoria'
    ? hero.mainTitle.replace(/^mis\s*xv\s*[:—-]?\s*/i, '').trim() || hero.mainTitle
    : hero.mainTitle;
  const neonNameBreak = templateId === 'neon-xv-euphoria' && title.length > 7 && !title.includes(' ')
    ? Math.ceil(title.length / 2) : null;
  const date = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
  }).format(new Date(eventDate));

  return (
    <section id="st-hero" className="st-hero" aria-label="Portada de la invitación">
      <div className="st-hero__stage">
        <div className="st-hero__texture" aria-hidden="true" />
        <div className="st-hero__symbol" aria-hidden="true">{copy.mark}</div>
        {templateId === 'boho-terracotta' && (
          <svg className="st-hero__botanical" viewBox="0 0 180 360" fill="none" aria-hidden="true">
            <path d="M88 350C82 273 94 193 48 37M88 350C100 274 123 183 145 53" />
            <path d="M54 65c-26-16-36-38-35-52 25 11 38 28 35 52Zm13 45c-29-8-48-26-53-42 29 3 47 18 53 42Zm11 51c-30-2-50-15-60-30 29-3 51 9 60 30Zm59-79c24-22 28-46 24-59-23 16-31 35-24 59Zm-12 57c27-13 42-33 44-49-28 8-42 25-44 49Zm-14 56c27-8 45-25 51-40-29 3-45 17-51 40Z" />
          </svg>
        )}
        {templateId === 'modern-minimal-noir' && (
          <div className="st-hero__editorial-rule" aria-hidden="true"><span>ATELIER / 2026</span><span>LOVE ISSUE Nº 01</span></div>
        )}
        {templateId === 'neon-xv-euphoria' && (
          <div className="st-hero__orbit" aria-hidden="true"><i /><i /><i /></div>
        )}

        <div className="st-hero__visual">
          <img
            src={hero.coverImageUrl}
            alt={templateId === 'neon-xv-euphoria' ? 'Luces de una celebración nocturna de XV años' : `Escena de ${hero.mainTitle}`}
            style={{ objectPosition: `${hero.focalPoint.x}% ${hero.focalPoint.y}%` }}
            fetchPriority="high"
          />
          <div className="st-hero__visual-wash" aria-hidden="true" />
          {templateId === 'boho-terracotta' && <span className="st-hero__photo-label" aria-hidden="true">amor en cada detalle · edición destino</span>}
          {templateId === 'modern-minimal-noir' && <span className="st-hero__photo-label" aria-hidden="true">FIG. 01 — EL COMIENZO</span>}
          {templateId === 'neon-xv-euphoria' && <span className="st-hero__photo-label" aria-hidden="true">ADMIT ONE / VIP XV</span>}
        </div>

        <div className="st-hero__copy">
          <p className="st-hero__eyebrow">{copy.eyebrow}</p>
          <p className="st-hero__event-label">{templateId === 'neon-xv-euphoria' ? 'MIS QUINCE AÑOS' : 'CELEBRAMOS NUESTRA BODA'}</p>
          <h1 aria-label={neonNameBreak ? title : undefined}>{neonNameBreak ? <>{title.slice(0, neonNameBreak)}<br className="st-hero__mobile-break" />{title.slice(neonNameBreak)}</> : title}</h1>
          <p className="st-hero__tagline">{hero.tagline}</p>
          {guestGroup && <p className="st-hero__guest">Invitación para {guestGroup.groupName}</p>}
          <p className="st-hero__date">{date}</p>
        </div>

        {templateId === 'neon-xv-euphoria' && (
          <div className="st-hero__ticket" aria-hidden="true"><span>ALL ACCESS</span><strong>XV</strong><small>ONE NIGHT / ONE MEMORY</small></div>
        )}
        <div className="st-hero__final"><span>{copy.eyebrow}</span><p>{copy.bridge}</p></div>
        <a className="st-hero__cta" href={actionHref}>{copy.action}<span aria-hidden="true"> ↗</span></a>
        <span className="st-hero__scroll" aria-hidden="true">DESLIZA PARA DESCUBRIR ↓</span>
      </div>
    </section>
  );
}
