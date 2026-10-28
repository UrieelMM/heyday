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
  public_url TEXT NOT NULL,
  author_name TEXT NOT NULL,
  caption TEXT,
  duration_seconds SMALLINT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_memories_event_id ON public.event_memories(event_id, created_at DESC);
