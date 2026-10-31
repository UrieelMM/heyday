-- Register the two children's worlds so events can reference their template IDs.
INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'pirate-treasure-voyage', 'Piratas: Isla del Tesoro', 'kids_birthday', 'Cumpleaños Infantil / Piratas', 'Nueva colección',
    'Una travesía pirata entre cartas náuticas, timón dorado, cuatro puertos de aventura y un tesoro para compartir.',
    'Portillo expansible + timón viajero + ruta del tesoro', '/images/pirate-treasure-voyage/ship.webp',
    '{"bgPrimary":"#F8F1DE","bgSecondary":"#E6E4CD","textPrimary":"#12394C","textMuted":"#536C71","accentPrimary":"#BB6840","accentSecondary":"#2D8F8B"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Georgia","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'confetti', 15
  ),
  (
    'dino-jungle-expedition', 'Dino Safari', 'kids_birthday', 'Cumpleaños Infantil / Dinosaurios', 'Nueva colección',
    'Una expedición jurásica entre fósiles, selva de arcilla, cuatro estaciones de descubrimiento y una fiesta prehistórica.',
    'Huevo jurásico expansible + huellas en scroll + excavación', '/images/dino-jungle-expedition/triceratops.webp',
    '{"bgPrimary":"#F5F4DD","bgSecondary":"#DCE7BF","textPrimary":"#263E2B","textMuted":"#5D6E51","accentPrimary":"#C86B35","accentSecondary":"#7A9D45"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Fredoka","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'confetti', 16
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
