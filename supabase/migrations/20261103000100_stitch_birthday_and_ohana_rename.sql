-- Preserve the original Ohana ID so existing invitations and demo links keep working.
UPDATE public.templates_catalog
SET name = 'Ohana: Fiesta en la Isla'
WHERE id = 'ohana-lilo-stitch';

-- Replace only the original seed badge. Custom copy in saved invitations stays intact.
UPDATE public.events
SET config = jsonb_set(config, '{content,hero,badgeText}', '"FIESTA OHANA · UNA ISLA PARA TODOS"'::jsonb)
WHERE template_id = 'ohana-lilo-stitch'
  AND config #>> '{content,hero,badgeText}' = 'LILO & STITCH · FIESTA OHANA';

INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES (
  'stitch-birthday', 'Stitch: Aventura Hawaiana', 'kids_birthday', 'Cumpleaños infantil / Stitch', 'Nueva colección',
  'Stitch llega a la fiesta entre olas, flores, piñas y cuatro aventuras para celebrar juntos.',
  'Postal tropical expansible + ruta de olas en scroll', '/images/stitch-birthday/preview.webp',
  '{"bgPrimary":"#FFF4DB","bgSecondary":"#C9F1EC","textPrimary":"#123952","textMuted":"#416A79","accentPrimary":"#F36B69","accentSecondary":"#277FAA"}'::jsonb,
  '{"headingFont":"Fredoka","scriptFont":"Fredoka","bodyFont":"Plus Jakarta Sans"}'::jsonb,
  'editorial-curtain', 'confetti', 28
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
