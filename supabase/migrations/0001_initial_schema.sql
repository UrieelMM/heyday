-- ============================================================================
-- MIGRACIÓN INICIAL: PLATAFORMA DE INVITACIONES DIGITALES
-- Motor: PostgreSQL 16 (Supabase)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TIPOS ENUMERADOS
CREATE TYPE user_role AS ENUM ('superadmin', 'agency_admin', 'client_host');
CREATE TYPE event_category AS ENUM (
  'wedding',
  'xv_years',
  'adult_birthday',
  'kids_birthday',
  'baptism_communion',
  'baby_shower',
  'graduation_gala'
);
CREATE TYPE event_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE rsvp_mode AS ENUM ('closed_list', 'open_registration');
CREATE TYPE rsvp_status AS ENUM ('pending', 'viewed', 'confirmed', 'declined');
CREATE TYPE table_shape AS ENUM ('round', 'rectangular', 'sweetheart');
CREATE TYPE media_type AS ENUM ('photo', 'audio_message');

-- 2. TABLA DE PERFILES DE USUARIO (Vinculada a auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client_host',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA PRINCIPAL DE EVENTOS / INVITACIONES
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 60),
  title TEXT NOT NULL,
  subtitle TEXT,
  category event_category NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'eternal-elegance',
  status event_status NOT NULL DEFAULT 'draft',
  
  -- Fechas y Configuración de Confirmación
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'America/Mexico_City',
  rsvp_mode rsvp_mode NOT NULL DEFAULT 'closed_list',
  rsvp_deadline_at TIMESTAMPTZ,
  max_guests_per_open_rsvp SMALLINT NOT NULL DEFAULT 4 CHECK (max_guests_per_open_rsvp BETWEEN 1 AND 15),
  
  -- Configuración Visual y Contenido Modular (Validado con Zod en Backend)
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Llave secreta única por evento para firmar códigos QR (HMAC-SHA256)
  qr_secret_key TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  
  -- Contadores rápidos
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_owner_id ON public.events(owner_id);

-- 4. TABLA DE MESAS PARA EL MAPA DE ASIENTOS (SEATING CHART)
CREATE TABLE public.seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape table_shape NOT NULL DEFAULT 'round',
  capacity SMALLINT NOT NULL DEFAULT 10 CHECK (capacity BETWEEN 1 AND 30),
  pos_x NUMERIC(8,2) NOT NULL DEFAULT 0,
  pos_y NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seating_tables_event_id ON public.seating_tables(event_id);

-- 5. TABLA DE GRUPOS FAMILIARES / PASES DE INVITADOS
CREATE TABLE public.guest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_token TEXT NOT NULL,
  group_name TEXT NOT NULL,
  whatsapp_phone TEXT,
  email TEXT,
  group_tag TEXT,
  
  -- Cupo asignado por el anfitrión
  allocated_adults SMALLINT NOT NULL DEFAULT 2 CHECK (allocated_adults >= 0),
  allocated_children SMALLINT NOT NULL DEFAULT 0 CHECK (allocated_children >= 0),
  
  -- Respuesta del invitado
  rsvp_status rsvp_status NOT NULL DEFAULT 'pending',
  confirmed_adults SMALLINT NOT NULL DEFAULT 0 CHECK (confirmed_adults >= 0),
  confirmed_children SMALLINT NOT NULL DEFAULT 0 CHECK (confirmed_children >= 0),
  dietary_notes TEXT,
  guest_message TEXT,
  
  -- Asignación logística y control de acceso
  table_id UUID REFERENCES public.seating_tables(id) ON DELETE SET NULL,
  whatsapp_sent_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  checked_in_count SMALLINT NOT NULL DEFAULT 0 CHECK (checked_in_count >= 0),
  last_checked_in_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(event_id, guest_token),
  CONSTRAINT chk_confirmed_within_allocated CHECK (
    confirmed_adults <= allocated_adults AND confirmed_children <= allocated_children
  )
);

CREATE INDEX idx_guest_groups_event_token ON public.guest_groups(event_id, guest_token);
CREATE INDEX idx_guest_groups_event_status ON public.guest_groups(event_id, rsvp_status);

-- 6. TABLA DE INTEGRANTES INDIVIDUALES POR GRUPO
CREATE TABLE public.guest_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.guest_groups(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_child BOOLEAN NOT NULL DEFAULT FALSE,
  will_attend BOOLEAN,
  menu_choice TEXT,
  dietary_restriction TEXT
);

CREATE INDEX idx_guest_members_group_id ON public.guest_members(group_id);

-- 7. TABLA DE SUGERENCIAS DE CANCIONES Y VOTACIÓN (DJ PLAYLIST)
CREATE TABLE public.song_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  itunes_track_id TEXT,
  track_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_art_url TEXT,
  preview_url TEXT,
  suggested_by_name TEXT NOT NULL,
  votes_count INTEGER NOT NULL DEFAULT 1,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_song_requests_event_id ON public.song_requests(event_id, votes_count DESC);

-- 8. TABLA DE RECUERDOS MULTIMEDIA (LIVE CAM & AUDIO GUESTBOOK)
CREATE TABLE public.event_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  author_name TEXT NOT NULL,
  caption TEXT,
  duration_seconds SMALLINT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_memories_event_id ON public.event_memories(event_id, created_at DESC);

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_memories ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_event_owner_or_admin(target_event_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE e.id = target_event_id
      AND (e.owner_id = auth.uid() OR p.role IN ('superadmin', 'agency_admin'))
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid());

CREATE POLICY "Owners manage their own events"
  ON public.events FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners manage guest_groups"
  ON public.guest_groups FOR ALL
  USING (public.is_event_owner_or_admin(event_id))
  WITH CHECK (public.is_event_owner_or_admin(event_id));

CREATE POLICY "Owners manage seating_tables"
  ON public.seating_tables FOR ALL
  USING (public.is_event_owner_or_admin(event_id))
  WITH CHECK (public.is_event_owner_or_admin(event_id));

CREATE POLICY "Public can read approved songs"
  ON public.song_requests FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Public can read approved memories"
  ON public.event_memories FOR SELECT
  USING (is_approved = TRUE);
