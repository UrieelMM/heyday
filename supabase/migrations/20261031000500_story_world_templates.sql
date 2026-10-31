-- Register the three new invitation worlds in the database-backed catalog.
INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'ohana-lilo-stitch', 'Ohana: Lilo & Stitch', 'kids_birthday', 'Cumpleaños infantil / Isla tropical', 'Nueva colección',
    'Una postal hawaiana de ohana, surf y flores con cuatro paradas para celebrar en familia.',
    'Postal expansible + olas dibujadas en scroll', '/images/ohana-lilo-stitch/hero-desktop.webp',
    '{"bgPrimary":"#F9F0D6","bgSecondary":"#D5F1E6","textPrimary":"#164A53","textMuted":"#4C7474","accentPrimary":"#D65C59","accentSecondary":"#57BFB6"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Fredoka","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'editorial-curtain', 'confetti', 25
  ),
  (
    'solar-pop-xv', 'Solar Pop XV', 'xv_years', 'XV años / Pop solar', 'Nueva colección',
    'Quince vueltas al sol entre bloques de color, collage editorial y destellos que se revelan al deslizar.',
    'Portal solar expansible + collage de cuatro destellos', '/images/solar-pop-xv/hero-desktop.webp',
    '{"bgPrimary":"#FFF5DF","bgSecondary":"#FFE0B7","textPrimary":"#153887","textMuted":"#5E5A7B","accentPrimary":"#EE368F","accentSecondary":"#FFC73D"}'::jsonb,
    '{"headingFont":"Syne","scriptFont":"Syne","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'confetti', 26
  ),
  (
    'cafe-para-siempre', 'Café para Siempre', 'wedding', 'Boda / Café de ciudad', 'Nueva colección',
    'Una boda narrada como carta de café: conversación íntima, mesa reservada y cuatro tiempos compartidos.',
    'Carta expansible + menú ilustrado en scroll', '/images/cafe-para-siempre/hero-desktop.webp',
    '{"bgPrimary":"#F8F0E4","bgSecondary":"#EAD8BE","textPrimary":"#4A3028","textMuted":"#766056","accentPrimary":"#8C3F3D","accentSecondary":"#C58C58"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'wax-seal-classic', 'none', 27
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
