import type { CSSProperties } from 'react';
import type { InvitationConfig } from '@/types/invitation.types';

export function HeroMedia({ hero, alt, className, style, desktopSrc }: {
  hero: InvitationConfig['content']['hero'];
  alt: string;
  className?: string;
  style?: CSSProperties;
  desktopSrc?: string;
}) {
  const mediaStyle = { width: '100%', height: '100%', objectFit: 'cover' as const, objectPosition: `${hero.focalPoint.x}% ${hero.focalPoint.y}%`, ...style };
  if (hero.coverVideoUrl) {
    return <video src={hero.coverVideoUrl} poster={hero.coverImageUrl} autoPlay loop muted playsInline preload="metadata" aria-label={alt} className={className} style={mediaStyle} />;
  }
  const image = <img src={hero.coverImageUrl} alt={alt} fetchPriority="high" decoding="async" className={className} style={mediaStyle} />;
  return desktopSrc
    ? <picture style={{ display: 'block', width: '100%', height: '100%' }}><source media="(min-width: 701px)" srcSet={desktopSrc} type="image/webp" />{image}</picture>
    : image;
}
