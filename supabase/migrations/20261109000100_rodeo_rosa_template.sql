INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES (
  'rodeo-rosa', 'Rodeo Rosa', 'kids_birthday', 'Cumpleaños infantil / Vaquera', 'Nueva colección',
  'Un cumpleaños vaquero entre moños, ponis, botas rosas y pastel en el rancho.',
  'Boleto de rodeo, arco expansible y herradura viajera', '/images/rodeo-rosa/hero-desktop.webp',
  '{"bgPrimary":"#FFF7EA","bgSecondary":"#F8DBDC","textPrimary":"#51282D","textMuted":"#765052","accentPrimary":"#9B3457","accentSecondary":"#E9A0B5"}'::jsonb,
  '{"headingFont":"Playfair Display","scriptFont":"Great Vibes","bodyFont":"Plus Jakarta Sans"}'::jsonb,
  'pass-ticket-tear', 'none', 29
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
