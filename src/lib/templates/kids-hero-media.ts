/** Keep responsive art direction for seed covers without replacing a user's uploaded hero. */
const heroDesktopByMobile: Record<string, string> = {
  '/images/fiesta-kids-adventure/adventure-island.webp': '/images/fiesta-kids-adventure/hero-desktop.webp',
  '/images/fiesta-kids-adventure/hero-mobile.webp': '/images/fiesta-kids-adventure/hero-desktop.webp',
  '/images/pirate-treasure-voyage/ship.webp': '/images/pirate-treasure-voyage/hero-desktop.webp',
  '/images/pirate-treasure-voyage/hero-mobile.webp': '/images/pirate-treasure-voyage/hero-desktop.webp',
  '/images/dino-jungle-expedition/triceratops.webp': '/images/dino-jungle-expedition/hero-desktop.webp',
  '/images/dino-jungle-expedition/hero-mobile.webp': '/images/dino-jungle-expedition/hero-desktop.webp',
  '/images/safari-sunrise-adventure/hero-mobile.webp': '/images/safari-sunrise-adventure/hero-desktop.webp',
  '/images/cowboy-ranch-roundup/hero-mobile.webp': '/images/cowboy-ranch-roundup/hero-desktop.webp',
};

export function kidsHeroDesktopSrc(mobileSrc: string): string | undefined {
  return heroDesktopByMobile[mobileSrc];
}
