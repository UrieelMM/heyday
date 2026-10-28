-- ============================================================================
-- ARCHIVO 03: CATÁLOGO DE LOS 10 TEMPLATES E HISTORIAL DE INVITACIONES (EVENTS)
-- Orden de ejecución: 3 de 9
-- ============================================================================

-- 1. Catálogo de Templates disponibles en la plataforma
CREATE TABLE IF NOT EXISTS public.templates_catalog (
  id TEXT PRIMARY KEY, -- Ej. 'eternal-elegance', 'boho-terracotta'
  name TEXT NOT NULL,
  category public.event_category NOT NULL,
  category_label TEXT NOT NULL,
  badge TEXT,
  description TEXT NOT NULL,
  signature_animation TEXT,
  preview_image_url TEXT NOT NULL,
  default_colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  default_fonts JSONB NOT NULL DEFAULT '{}'::jsonb,
  envelope_variant TEXT NOT NULL CHECK (envelope_variant IN ('wax-seal-classic', 'editorial-curtain', 'pass-ticket-tear')),
  ambient_effect TEXT NOT NULL CHECK (ambient_effect IN ('none', 'gold-sparkles', 'white-petals', 'soft-stars', 'confetti')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla Principal de Invitaciones (Events) con soporte de Historial por Template y Cliente
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  -- Datos rápidos del cliente para filtros directos y búsqueda paginada
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  
  -- URL única personalizada (ej. heyday.party/invitacion/boda-sofia-y-mateo)
  slug TEXT NOT NULL UNIQUE CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    AND char_length(slug) BETWEEN 3 AND 60
  ),
  
  -- Relación con el Template utilizado (permite historial por template)
  template_id TEXT NOT NULL REFERENCES public.templates_catalog(id) ON UPDATE CASCADE DEFAULT 'eternal-elegance',
  category public.event_category NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  status public.event_status NOT NULL DEFAULT 'draft',
  
  -- Fechas del evento y configuración RSVP
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'America/Mexico_City',
  rsvp_mode public.rsvp_mode NOT NULL DEFAULT 'closed_list',
  rsvp_deadline_at TIMESTAMPTZ,
  max_guests_per_open_rsvp SMALLINT NOT NULL DEFAULT 4 CHECK (max_guests_per_open_rsvp BETWEEN 1 AND 15),
  
  -- JSON maestro con colores, tipografías, sobre, secciones y contenido
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Clave única por evento para firmar códigos QR (HMAC-SHA256)
  qr_secret_key TEXT NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  
  -- Métricas
  views_count INTEGER NOT NULL DEFAULT 0 CHECK (views_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices optimizados para Historial por Template, Paginación y Filtros por Fecha y Cliente
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_template_history ON public.events(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_client_name_lower ON public.events(lower(client_name));
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
