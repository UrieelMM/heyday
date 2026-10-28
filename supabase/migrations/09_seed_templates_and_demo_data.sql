-- ============================================================================
-- ARCHIVO 09: SEED INICIAL DE LOS 10 TEMPLATES OFICIALES
-- Orden de ejecución: 9 de 9
-- ============================================================================

INSERT INTO public.templates_catalog (
  id,
  name,
  category,
  category_label,
  badge,
  description,
  signature_animation,
  preview_image_url,
  default_colors,
  default_fonts,
  sort_order
)
VALUES
  (
    'eternal-elegance',
    'Eternal Elegance',
    'wedding',
    'Boda Clásica / Luxury',
    'Bestseller Bodas',
    'Editorial de alta costura en tonos marfil cálido y oro champagne, con arcos arquitectónicos que se expanden al hacer scroll.',
    'Arc Mask Reveal + Parallax Dorado',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FAF7F2","bgSecondary":"#F2ECE1","textPrimary":"#1E1B18","textMuted":"#6E655F","accentPrimary":"#C5A059","accentSecondary":"#8C7355"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Montserrat"}'::jsonb,
    1
  ),
  (
    'boho-terracotta',
    'Boho Terracotta',
    'wedding',
    'Boda Jardín / Playa / Destino',
    'Ideal Bodas Destino',
    'Orgánica y cálida con tonos terracota, verde salvia y arena, texturas de papel algodón e ilustraciones botánicas.',
    'Botanical Sway + Polaroid Stack',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FBF6F0","bgSecondary":"#EFE5DC","textPrimary":"#2C221E","textMuted":"#6D5B53","accentPrimary":"#C86D51","accentSecondary":"#6B7F6E"}'::jsonb,
    '{"headingFont":"Playfair Display","scriptFont":"Pinyon Script","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    2
  ),
  (
    'modern-minimal-noir',
    'Modern Minimal Noir',
    'wedding',
    'Boda Civil / Contemporánea',
    'Estilo Vogue',
    'Blanco y negro de alto contraste con estética de revista editorial, tipografía cinética y carrusel horizontal.',
    'Theme Inversion + Horizontal Pin Scroll',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FFFFFF","bgSecondary":"#0F0F0F","textPrimary":"#0A0A0A","textMuted":"#666666","accentPrimary":"#111111","accentSecondary":"#7A7A7A"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Pinyon Script","bodyFont":"Inter"}'::jsonb,
    3
  ),
  (
    'royal-xv-enchanted',
    'Royal XV Enchanted',
    'xv_years',
    'XV Años Gala Real',
    'Favorito XV Años',
    'Romántica e imperial en rosa cuarzo, oro rosa metálico y ciruela, con partículas de destellos dorados y cortejo de honor.',
    'Golden Sparkle Canvas + SVG Crown Draw',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FFF9FB","bgSecondary":"#F9EBEF","textPrimary":"#2D1920","textMuted":"#734F5A","accentPrimary":"#D4AF37","accentSecondary":"#B76E79"}'::jsonb,
    '{"headingFont":"Cinzel","scriptFont":"Great Vibes","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    4
  ),
  (
    'neon-xv-euphoria',
    'Neon XV Euphoria',
    'xv_years',
    'XV Años Moderno / Nocturno',
    'Tendencia Nocturna',
    'Estética glassmorphism sobre fondo midnight con acentos magenta y cian eléctrico, pase VIP y playlist interactiva.',
    'Neon Glow Scrub + VIP Ticket Tear',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#090614","bgSecondary":"#140E29","textPrimary":"#F8F7FF","textMuted":"#A39BBF","accentPrimary":"#FF2E93","accentSecondary":"#00F0FF"}'::jsonb,
    '{"headingFont":"Syne","scriptFont":"Great Vibes","bodyFont":"Space Grotesk"}'::jsonb,
    5
  ),
  (
    'golden-jubilee',
    'Golden Jubilee',
    'adult_birthday',
    'Cumpleaños 30s, 40s, 50s / Aniversario',
    'Gala Nocturna',
    'Sofisticación Art Déco en negro ónix y dorado imperial con burbujas ascendentes y números monumentales con parallax.',
    'Champagne Bubbles + Monumental Parallax',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#0D0D0D","bgSecondary":"#171614","textPrimary":"#F5F0E6","textMuted":"#A39B8B","accentPrimary":"#E5C158","accentSecondary":"#9E7B4F"}'::jsonb,
    '{"headingFont":"Playfair Display","scriptFont":"Pinyon Script","bodyFont":"Inter"}'::jsonb,
    6
  ),
  (
    'fiesta-kids-adventure',
    'Fiesta Kids Adventure',
    'kids_birthday',
    'Cumpleaños Infantil',
    'Interactivo',
    'Diseño alegre estilo Bento con tarjetas redondeadas, animaciones con rebote elástico y explosión de confeti al abrir.',
    'Elastic Bento Bounce + Confetti Burst',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FFFDF7","bgSecondary":"#FFF3D6","textPrimary":"#1E293B","textMuted":"#64748B","accentPrimary":"#FF6B6B","accentSecondary":"#4ECDC4"}'::jsonb,
    '{"headingFont":"Fredoka","scriptFont":"Fredoka","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    7
  ),
  (
    'celestial-baptism',
    'Celestial Grace',
    'baptism_communion',
    'Bautizo / Primera Comunión',
    'Ceremonia Religiosa',
    'Etérea y luminosa en azul cielo empolvado, blanco nube y dorado suave, con protagonismo para padres y padrinos.',
    'Soft Cloud Parallax + Olive Branch SVG',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#F8FAFC","bgSecondary":"#EDF4F8","textPrimary":"#1E2D3D","textMuted":"#5B7083","accentPrimary":"#C9A96E","accentSecondary":"#7FA6C4"}'::jsonb,
    '{"headingFont":"Cormorant Garamond","scriptFont":"Great Vibes","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    8
  ),
  (
    'sweet-oh-baby',
    'Sweet Oh Baby!',
    'baby_shower',
    'Baby Shower / Gender Reveal',
    'Incluye Votación Reveal',
    'Tonos pastel salvia y durazno cálido con módulo interactivo para que los invitados voten Team Niña o Team Niño.',
    'Floating Nursery Elements + Live Poll',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#FCF9F5","bgSecondary":"#F2EFE9","textPrimary":"#3D352E","textMuted":"#7A6F66","accentPrimary":"#8FB9A8","accentSecondary":"#F4A28C"}'::jsonb,
    '{"headingFont":"Playfair Display","scriptFont":"Great Vibes","bodyFont":"Plus Jakarta Sans"}'::jsonb,
    9
  ),
  (
    'grad-gala-night',
    'Grad & Gala Prestige',
    'graduation_gala',
    'Graduación / Gala Corporativa',
    'Control QR Ejecutivo',
    'Solemne y ejecutiva en azul marino noche y oro académico, diseñada para cenas de graduación con control de boletos QR.',
    'Academic Crest Reveal + Timeline Scrub',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    '{"bgPrimary":"#0B132B","bgSecondary":"#1C2541","textPrimary":"#F8F9FA","textMuted":"#94A3B8","accentPrimary":"#D4AF37","accentSecondary":"#5BC0BE"}'::jsonb,
    '{"headingFont":"Cinzel","scriptFont":"Pinyon Script","bodyFont":"Inter"}'::jsonb,
    10
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category_label = EXCLUDED.category_label,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  default_colors = EXCLUDED.default_colors,
  default_fonts = EXCLUDED.default_fonts;
