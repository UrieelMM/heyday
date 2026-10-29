import type { CSSProperties } from 'react';
import type { InvitationConfig } from '@/types/invitation.types';

export function HeroMedia({ hero, alt, className, style }: {
  hero: InvitationConfig['content']['hero'];
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  const mediaStyle = { width: '100%', height: '100%', objectFit: 'cover' as const, objectPosition: `${hero.focalPoint.x}% ${hero.focalPoint.y}%`, ...style };
  return hero.coverVideoUrl
    ? <video src={hero.coverVideoUrl} poster={hero.coverImageUrl} autoPlay loop muted playsInline preload="metadata" aria-label={alt} className={className} style={mediaStyle} />
    : <img src={hero.coverImageUrl} alt={alt} fetchPriority="high" decoding="async" className={className} style={mediaStyle} />;
}
