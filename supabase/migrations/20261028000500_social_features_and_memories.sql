-- ============================================================================
-- ARCHIVO 05: FEATURES SOCIALES (DJ PLAYLIST, AUDIO GUESTBOOK, LIVE CAMERA)
-- Orden de ejecución: 5 de 9
-- ============================================================================

-- 1. Sugerencias y Votación de Canciones para el DJ
CREATE TABLE IF NOT EXISTS public.song_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  itunes_track_id TEXT,
  track_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_art_url TEXT,
  preview_url TEXT,
  suggested_by_name TEXT NOT NULL,
  votes_count INTEGER NOT NULL DEFAULT 1 CHECK (votes_count >= 0),
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_song_requests_event_votes ON public.song_requests(event_id, votes_count DESC);

-- 2. Recuerdos Multimedia (Audio Guestbook & Live Disposable Camera)
CREATE TABLE IF NOT EXISTS public.event_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type public.media_type NOT NULL,
  storage_path TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Invitado',
  caption TEXT,
  duration_seconds SMALLINT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_memories_event_id ON public.event_memories(event_id, created_at DESC);

-- El álbum compartido admite como máximo 50 fotos por evento. El bloqueo del
-- evento serializa cargas concurrentes para que no se exceda el límite.
CREATE OR REPLACE FUNCTION public.enforce_event_photo_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'photo' THEN
    PERFORM 1 FROM public.events WHERE id = NEW.event_id FOR UPDATE;
    IF (
      SELECT COUNT(*)
      FROM public.event_memories
      WHERE event_id = NEW.event_id
        AND type = 'photo'
        AND (TG_OP = 'INSERT' OR id <> NEW.id)
    ) >= 50 THEN
      RAISE EXCEPTION 'El álbum permite hasta 50 fotos por evento'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

DROP TRIGGER IF EXISTS trg_event_photo_limit ON public.event_memories;
CREATE TRIGGER trg_event_photo_limit
  BEFORE INSERT OR UPDATE OF event_id, type ON public.event_memories
  FOR EACH ROW EXECUTE FUNCTION public.enforce_event_photo_limit();
