-- ============================================================================
-- ARCHIVO 07: BUCKETS DE SUPABASE STORAGE Y POLÍTICAS DE OBJETOS MULTIMEDIA
-- Orden de ejecución: 7 de 9
-- ============================================================================

-- 1. Bucket para portadas, galerías y audios de las invitaciones (8 MB límite)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-assets',
  'event-assets',
  TRUE,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'audio/mpeg', 'audio/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Bucket para fotos en vivo de invitados y Audio Guestbook (5 MB límite)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guest-memories',
  'guest-memories',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de lectura pública y subida autenticada en storage.objects
DROP POLICY IF EXISTS "Public read access on event-assets" ON storage.objects;
CREATE POLICY "Public read access on event-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('event-assets', 'guest-memories'));

DROP POLICY IF EXISTS "Authenticated users upload event-assets" ON storage.objects;
CREATE POLICY "Authenticated users upload event-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-assets'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Public guests upload memories" ON storage.objects;
CREATE POLICY "Public guests upload memories"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'guest-memories');
