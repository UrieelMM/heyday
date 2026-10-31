-- Add three new wedding experiences to the database-backed template catalog.
INSERT INTO public.templates_catalog (
  id, name, category, category_label, badge, description, signature_animation,
  preview_image_url, default_colors, default_fonts, envelope_variant, ambient_effect, sort_order
) VALUES
  (
    'glass-garden-vows', 'Jardín de Cristal', 'wedding', 'Boda / Jardín Botánico', 'Nueva colección',
    'Una ceremonia entre luz, cristal y flores blancas: invernadero expandible, herbario animado y cuatro momentos para florecer juntos.',
    'Invernadero expansible + herbario dibujado con scroll', '/images/glass-garden-vows/hero-desktop.webp',
    '{"bgPrimary":"#F7F7EF","bgSecondary":"#E7EDE2","textPrimary":"#253B32","textMuted":"#62756A","accentPrimary":"#65836C","accentSecondary":"#B8A77F"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'wax-seal-classic', 'white-petals', 19
  ),
  (
    'midnight-constellation', 'Bajo las Estrellas', 'wedding', 'Boda / Noche Celestial', 'Nueva colección',
    'Una boda nocturna escrita en el cielo: arco lunar, constelaciones que se trazan y una velada iluminada por mil pequeñas luces.',
    'Arco lunar expansible + constelación progresiva', '/images/midnight-constellation/hero-desktop.webp',
    '{"bgPrimary":"#101B31","bgSecondary":"#1C2B46","textPrimary":"#F8F2E9","textMuted":"#B9C8D8","accentPrimary":"#D6B87C","accentSecondary":"#829FBD"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'editorial-curtain', 'soft-stars', 20
  ),
  (
    'golden-harvest-vineyard', 'Vendimia de Amor', 'wedding', 'Boda / Viñedo al Atardecer', 'Nueva colección',
    'Una celebración de cosecha entre vides, vino y luz ámbar: etiqueta editorial, sarmientos en movimiento y cuatro brindis compartidos.',
    'Etiqueta expansible + enredaderas en scroll', '/images/golden-harvest-vineyard/hero-desktop.webp',
    '{"bgPrimary":"#F8F0E4","bgSecondary":"#EFE0CF","textPrimary":"#432F31","textMuted":"#806966","accentPrimary":"#8A3D4E","accentSecondary":"#BC8656"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    'wax-seal-classic', 'gold-sparkles', 21
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, category_label = EXCLUDED.category_label,
  badge = EXCLUDED.badge, description = EXCLUDED.description,
  signature_animation = EXCLUDED.signature_animation, preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors, default_fonts = EXCLUDED.default_fonts,
  envelope_variant = EXCLUDED.envelope_variant, ambient_effect = EXCLUDED.ambient_effect,
  sort_order = EXCLUDED.sort_order;
