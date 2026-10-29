-- Acceso independiente por invitación para el editor del cliente.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS editor_pin_hash text,
  ADD COLUMN IF NOT EXISTS editor_pin_version uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS editor_failed_attempts smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS editor_locked_until timestamptz;

ALTER TABLE public.events
  ADD CONSTRAINT events_editor_failed_attempts_range
  CHECK (editor_failed_attempts BETWEEN 0 AND 5);

-- Las invitaciones anteriores reciben su PIN al pulsar "Generar acceso" en el panel.
COMMENT ON COLUMN public.events.editor_pin_hash IS 'Hash scrypt del PIN de 4 dígitos; nunca se envía al navegador.';

-- Fotos (8 MB) y archivos de audio/video para el editor (30 MB).
UPDATE storage.buckets SET file_size_limit = 31457280,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'video/webm']
WHERE id = 'event-assets';

-- Consume un intento bajo bloqueo de fila, evitando eludir el límite con solicitudes simultáneas.
CREATE OR REPLACE FUNCTION public.begin_editor_pin_attempt(p_event_id uuid)
RETURNS smallint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  attempts smallint;
  locked_until timestamptz;
BEGIN
  SELECT editor_failed_attempts, editor_locked_until
    INTO attempts, locked_until
    FROM public.events WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND THEN RETURN -1; END IF;
  IF locked_until IS NOT NULL AND locked_until > now() THEN RETURN -1; END IF;
  IF locked_until IS NOT NULL AND locked_until <= now() THEN attempts := 0; END IF;
  attempts := LEAST(5, attempts + 1);
  UPDATE public.events SET editor_failed_attempts = attempts,
    editor_locked_until = CASE WHEN attempts >= 5 THEN now() + interval '15 minutes' ELSE NULL END
  WHERE id = p_event_id;
  RETURN attempts;
END;
$$;
REVOKE ALL ON FUNCTION public.begin_editor_pin_attempt(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_editor_pin_attempt(uuid) TO service_role;
