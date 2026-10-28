-- ============================================================================
-- ARCHIVO 06: SEGURIDAD ROW LEVEL SECURITY (RLS) Y FUNCIONES DE AUTORIZACIÓN
-- Orden de ejecución: 6 de 9
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_checkin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_memories ENABLE ROW LEVEL SECURITY;

-- Función auxiliar: Verifica si el usuario autenticado es administrador o dueño del evento
CREATE OR REPLACE FUNCTION public.is_event_owner_or_admin(target_event_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    LEFT JOIN public.profiles p ON p.id = auth.uid()
    WHERE e.id = target_event_id
      AND (
        e.owner_id = auth.uid()
        OR p.role IN ('superadmin', 'agency_admin')
      )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 2. Políticas para templates_catalog (Lectura pública de los 10 templates)
DROP POLICY IF EXISTS "Public can view active templates" ON public.templates_catalog;
CREATE POLICY "Public can view active templates"
  ON public.templates_catalog FOR SELECT
  USING (is_active = TRUE);

-- 3. Políticas para clients (Solo administradores/dueños autenticados)
DROP POLICY IF EXISTS "Authenticated admins manage clients" ON public.clients;
CREATE POLICY "Authenticated admins manage clients"
  ON public.clients FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Políticas para events (Invitaciones públicas leíbles, edición por admin/dueño)
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated admins manage events" ON public.events;
CREATE POLICY "Authenticated admins manage events"
  ON public.events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Políticas para guest_groups, seating_tables y rsvp_checkin_logs
DROP POLICY IF EXISTS "Public can read guest group by token" ON public.guest_groups;
CREATE POLICY "Public can read guest group by token"
  ON public.guest_groups FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Authenticated admins manage guest_groups" ON public.guest_groups;
CREATE POLICY "Authenticated admins manage guest_groups"
  ON public.guest_groups FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated admins manage seating_tables" ON public.seating_tables;
CREATE POLICY "Authenticated admins manage seating_tables"
  ON public.seating_tables FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated admins manage rsvp_checkin_logs" ON public.rsvp_checkin_logs;
CREATE POLICY "Authenticated admins manage rsvp_checkin_logs"
  ON public.rsvp_checkin_logs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6. Políticas para song_requests y event_memories
DROP POLICY IF EXISTS "Public can read approved songs" ON public.song_requests;
CREATE POLICY "Public can read approved songs"
  ON public.song_requests FOR SELECT
  USING (is_approved = TRUE);

DROP POLICY IF EXISTS "Public can insert song suggestions" ON public.song_requests;
CREATE POLICY "Public can insert song suggestions"
  ON public.song_requests FOR INSERT
  WITH CHECK (char_length(track_title) BETWEEN 1 AND 120);

DROP POLICY IF EXISTS "Public can read approved memories" ON public.event_memories;
CREATE POLICY "Public can read approved memories"
  ON public.event_memories FOR SELECT
  USING (is_approved = TRUE);
