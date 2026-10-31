-- Add the two new children's worlds to the event template catalog.
INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'safari-sunrise-adventure', 'Safari de la Sabana', 'kids_birthday', 'Cumpleaños Infantil / Safari', 'Nueva colección',
    'Una expedición de acuarela entre jirafas, cebras, senderos dorados y un picnic bajo las acacias.',
    'Binoculares viajeros + sendero de safari en scroll', '/images/safari-sunrise-adventure/hero-desktop.webp',
    '{"bgPrimary":"#FFF8DF","bgSecondary":"#E7D8AD","textPrimary":"#354B43","textMuted":"#687267","accentPrimary":"#AA6632","accentSecondary":"#789071"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Georgia","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'confetti', 17
  ),
  (
    'cowboy-ranch-roundup', 'Rancho Vaquero', 'kids_birthday', 'Cumpleaños Infantil / Vaqueros', 'Nueva colección',
    'Una fiesta western de collage entre ponis, senderos del desierto, juegos de rancho y pastel al atardecer.',
    'Sombrero viajero + ruta del rancho en scroll', '/images/cowboy-ranch-roundup/hero-desktop.webp',
    '{"bgPrimary":"#FFF3DF","bgSecondary":"#E8C5A4","textPrimary":"#49352F","textMuted":"#765C51","accentPrimary":"#AA4E3C","accentSecondary":"#557178"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Georgia","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'confetti', 18
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;

-- Use the wide compositions in catalog cards for the earlier children's worlds.
UPDATE public.templates_catalog SET preview_image_url = '/images/pirate-treasure-voyage/hero-desktop.webp'
WHERE id = 'pirate-treasure-voyage' AND preview_image_url = '/images/pirate-treasure-voyage/ship.webp';
UPDATE public.templates_catalog SET preview_image_url = '/images/dino-jungle-expedition/hero-desktop.webp'
WHERE id = 'dino-jungle-expedition' AND preview_image_url = '/images/dino-jungle-expedition/triceratops.webp';
UPDATE public.templates_catalog SET preview_image_url = '/images/fiesta-kids-adventure/hero-desktop.webp'
WHERE id = 'fiesta-kids-adventure' AND preview_image_url = '/images/fiesta-kids-adventure/adventure-island.webp';
