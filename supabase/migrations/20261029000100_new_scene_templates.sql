INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'marea-azul', 'Marea Azul', 'wedding', 'Boda Costa / Mediterránea', 'Nueva colección',
    'Una boda junto al mar narrada con horizonte, azulejos de cobalto y luz de mediodía.',
    'Horizonte deslizante + escenas de marea', '/images/marea-azul/cover.svg',
    '{"bgPrimary":"#F7F4E9","bgSecondary":"#E2ECEB","textPrimary":"#102F45","textMuted":"#486A78","accentPrimary":"#155B8A","accentSecondary":"#D3865A"}'::jsonb,
    '{"headingFont":"Georgia","scriptFont":"Cormorant Garamond","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'editorial-curtain', 'none', 11
  ),
  (
    'ritmo-de-dos', 'Ritmo de Dos', 'wedding', 'Boda Retro / Música', 'Nueva colección',
    'Una boda como el póster de un concierto íntimo: tipografía cinética, vinilo y color cálido.',
    'Vinilo en movimiento + póster desplegable', '/images/ritmo-de-dos/cover.svg',
    '{"bgPrimary":"#F9EBCF","bgSecondary":"#F2C67A","textPrimary":"#512720","textMuted":"#765244","accentPrimary":"#B83A29","accentSecondary":"#3D665F"}'::jsonb,
    '{"headingFont":"Syne","scriptFont":"Georgia","bodyFont":"Space Grotesk"}'::jsonb,
    'pass-ticket-tear', 'none', 12
  ),
  (
    'mini-cosmos', 'Mini Cosmos', 'kids_birthday', 'Cumpleaños Infantil / Espacio', 'Nueva colección',
    'Una misión espacial para jugar y celebrar, con planetas, ruta orbital y controles claros para familias.',
    'Despegue orbital + constelación de capítulos', '/images/mini-cosmos/cover.svg',
    '{"bgPrimary":"#101B3D","bgSecondary":"#1C3059","textPrimary":"#F9F5E9","textMuted":"#B9CAE1","accentPrimary":"#B44D2E","accentSecondary":"#8AD6C5"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Fredoka","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'soft-stars', 13
  ),
  (
    'atelier-xv', 'Atelier XV', 'xv_years', 'XV Años / Moda Editorial', 'Nueva colección',
    'Quince años como manifiesto de estilo personal: recortes de atelier, cinta plateada y pasarela azul.',
    'Paneles de pasarela + capítulos de estilo', '/images/atelier-xv/cover.svg',
    '{"bgPrimary":"#EDEFF3","bgSecondary":"#DCE2ED","textPrimary":"#14294C","textMuted":"#5C6A83","accentPrimary":"#315BA1","accentSecondary":"#A9B5C7"}'::jsonb,
    '{"headingFont":"Times New Roman","scriptFont":"Georgia","bodyFont":"Montserrat"}'::jsonb,
    'editorial-curtain', 'none', 14
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
