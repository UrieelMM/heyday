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
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Fotos de invitados y audio privados; el servidor entrega URLs firmadas.
-- El selector de fotos actual permite archivos de hasta 8 MB.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guest-memories',
  'guest-memories',
  FALSE,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Los assets públicos no incluyen datos personales ni fotos del álbum.
DROP POLICY IF EXISTS "Public read access on event-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload event-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public guests upload memories" ON storage.objects;

DROP POLICY IF EXISTS "Admin manages event assets" ON storage.objects;
CREATE POLICY "Admin manages event assets" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'event-assets' AND (SELECT public.is_heyday_admin()))
  WITH CHECK (bucket_id = 'event-assets' AND (SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages guest memories" ON storage.objects;
CREATE POLICY "Admin manages guest memories" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'guest-memories' AND (SELECT public.is_heyday_admin()))
  WITH CHECK (bucket_id = 'guest-memories' AND (SELECT public.is_heyday_admin()));

-- No se permite carga anónima directa. Un endpoint de servidor validará el
-- evento, el token del invitado, tamaño/tipo, cuota y autorización de subida.
