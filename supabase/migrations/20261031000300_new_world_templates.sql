-- Register three distinct scene experiences in the database catalog.
INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'opera-carmesi', 'Ópera Carmesí', 'xv_years', 'XV años / Teatro', 'Nueva colección',
    'Una noche teatral en cuatro actos: telón carmesí, sello Art Déco y una gran entrada que se revela al deslizar.',
    'Telón escénico + programa en cuatro actos', '/images/opera-carmesi/hero.webp',
    '{"bgPrimary":"#2D0D19","bgSecondary":"#451626","textPrimary":"#F8EBDD","textMuted":"#DABBB5","accentPrimary":"#D7AF72","accentSecondary":"#8E384C"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'gold-sparkles', 22
  ),
  (
    'pequeno-atlas', 'Pequeño Atlas', 'baby_shower', 'Baby shower / Exploración', 'Nueva colección',
    'Un mapa en acuarela para celebrar una nueva vida: rosa de los vientos, postales y cuatro destinos por descubrir.',
    'Mapa desplegable + ruta ilustrada', '/images/pequeno-atlas/hero.webp',
    '{"bgPrimary":"#FAF2DF","bgSecondary":"#E5E9D7","textPrimary":"#344A3B","textMuted":"#617566","accentPrimary":"#517C70","accentSecondary":"#D7A578"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'editorial-curtain', 'white-petals', 23
  ),
  (
    'archivo-futuro', 'Archivo del Futuro', 'graduation_gala', 'Graduación / Arquitectura', 'Nueva colección',
    'Una bitácora gráfica de la generación: geometría cobalto, horizonte de luz y cuatro hitos hacia lo que sigue.',
    'Acreditación editorial + riel de progreso', '/images/archivo-futuro/hero.webp',
    '{"bgPrimary":"#112C65","bgSecondary":"#1D448D","textPrimary":"#F4F6F3","textMuted":"#C8D6E9","accentPrimary":"#FFD064","accentSecondary":"#4F78C7"}'::jsonb,
    '{"headingFont":"Plus Jakarta Sans","scriptFont":"Cormorant Garamond","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'pass-ticket-tear', 'none', 24
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
