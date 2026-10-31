-- Keep catalog thumbnails aligned with the new wide hero assets.
-- Only update the original seed URLs so custom preview images are preserved.
UPDATE public.templates_catalog
SET preview_image_url = CASE id
  WHEN 'opera-carmesi' THEN '/images/opera-carmesi/hero-desktop.webp'
  WHEN 'pequeno-atlas' THEN '/images/pequeno-atlas/hero-desktop.webp'
  WHEN 'archivo-futuro' THEN '/images/archivo-futuro/hero-desktop.webp'
END
WHERE (id = 'opera-carmesi' AND preview_image_url = '/images/opera-carmesi/hero.webp')
   OR (id = 'pequeno-atlas' AND preview_image_url = '/images/pequeno-atlas/hero.webp')
   OR (id = 'archivo-futuro' AND preview_image_url = '/images/archivo-futuro/hero.webp');
