-- ============================================================================
-- ARCHIVO 04: MESAS, GRUPOS DE INVITADOS, LINKS NOMINALES Y LOGS DE RSVP/QR
-- Orden de ejecución: 4 de 9
-- ============================================================================

-- 1. Mesas del Evento (Seating Chart)
CREATE TABLE IF NOT EXISTS public.seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ej. 'Mesa 1', 'Mesa de Honor'
  shape public.table_shape NOT NULL DEFAULT 'round',
  capacity SMALLINT NOT NULL DEFAULT 10 CHECK (capacity BETWEEN 1 AND 30),
  pos_x NUMERIC(8,2) NOT NULL DEFAULT 0,
  pos_y NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seating_tables_event_id ON public.seating_tables(event_id);

-- 2. Grupos de Invitados / Familias (Smart Guest Links ?g=guest_token)
CREATE TABLE IF NOT EXISTS public.guest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_token TEXT NOT NULL, -- Ej. 'fam-lopez-8a2f'
  group_name TEXT NOT NULL,  -- Ej. 'Familia López García'
  whatsapp_phone TEXT,
  email TEXT,
  group_tag TEXT,            -- Ej. 'Familia Novia', 'VIP'
  
  -- Cupo máximo asignado por el organizador
  allocated_adults SMALLINT NOT NULL DEFAULT 2 CHECK (allocated_adults >= 0),
  allocated_children SMALLINT NOT NULL DEFAULT 0 CHECK (allocated_children >= 0),
  
  -- Confirmación RSVP
  rsvp_status public.rsvp_status NOT NULL DEFAULT 'pending',
  confirmed_adults SMALLINT NOT NULL DEFAULT 0 CHECK (confirmed_adults >= 0),
  confirmed_children SMALLINT NOT NULL DEFAULT 0 CHECK (confirmed_children >= 0),
  dietary_notes TEXT,
  guest_message TEXT,
  
  -- Logística y Escaneo QR en Recepción
  table_id UUID REFERENCES public.seating_tables(id) ON DELETE SET NULL,
  table_name_fallback TEXT DEFAULT 'Mesa por asignar',
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

CREATE INDEX IF NOT EXISTS idx_guest_groups_event_token ON public.guest_groups(event_id, guest_token);
CREATE INDEX IF NOT EXISTS idx_guest_groups_event_status ON public.guest_groups(event_id, rsvp_status);

DROP TRIGGER IF EXISTS trg_guest_groups_updated_at ON public.guest_groups;
CREATE TRIGGER trg_guest_groups_updated_at
  BEFORE UPDATE ON public.guest_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Miembros Individuales por Grupo Familiar (Opcional)
CREATE TABLE IF NOT EXISTS public.guest_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.guest_groups(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_child BOOLEAN NOT NULL DEFAULT FALSE,
  will_attend BOOLEAN,
  menu_choice TEXT,
  dietary_restriction TEXT
);

CREATE INDEX IF NOT EXISTS idx_guest_members_group_id ON public.guest_members(group_id);

-- 4. Bitácora de Confirmaciones RSVP y Escaneos QR en Puerta
CREATE TABLE IF NOT EXISTS public.rsvp_checkin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.guest_groups(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('rsvp_confirmed', 'rsvp_declined', 'qr_checkin')),
  adults_count SMALLINT NOT NULL DEFAULT 0,
  children_count SMALLINT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_checkin_logs_event_id ON public.rsvp_checkin_logs(event_id, created_at DESC);
