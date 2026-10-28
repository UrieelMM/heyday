-- ============================================================================
-- ARCHIVO 06: RLS PARA UN SOLO ADMINISTRADOR HEYDAY
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

-- Solo una cuenta promovida desde SQL Editor puede administrar el proyecto.
-- SECURITY DEFINER evita la recursión al consultar profiles desde sus políticas.
CREATE OR REPLACE FUNCTION public.is_heyday_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role IN ('superadmin'::public.user_role, 'agency_admin'::public.user_role)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_heyday_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_heyday_admin() TO authenticated;

-- Retirar las políticas anteriores si estos archivos se ejecutaron parcialmente.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view active templates" ON public.templates_catalog;
DROP POLICY IF EXISTS "Authenticated admins manage clients" ON public.clients;
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
DROP POLICY IF EXISTS "Authenticated admins manage events" ON public.events;
DROP POLICY IF EXISTS "Public can read guest group by token" ON public.guest_groups;
DROP POLICY IF EXISTS "Authenticated admins manage guest_groups" ON public.guest_groups;
DROP POLICY IF EXISTS "Authenticated admins manage seating_tables" ON public.seating_tables;
DROP POLICY IF EXISTS "Authenticated admins manage rsvp_checkin_logs" ON public.rsvp_checkin_logs;
DROP POLICY IF EXISTS "Public can read approved songs" ON public.song_requests;
DROP POLICY IF EXISTS "Public can insert song suggestions" ON public.song_requests;
DROP POLICY IF EXISTS "Public can read approved memories" ON public.event_memories;

DROP POLICY IF EXISTS "Read own or admin profile" ON public.profiles;
CREATE POLICY "Read own or admin profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR (SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages profiles" ON public.profiles;
CREATE POLICY "Admin manages profiles" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Public reads active templates" ON public.templates_catalog;
CREATE POLICY "Public reads active templates" ON public.templates_catalog
  FOR SELECT TO anon, authenticated USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin manages templates" ON public.templates_catalog;
CREATE POLICY "Admin manages templates" ON public.templates_catalog
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

-- Los endpoints públicos usarán un cliente de servidor y devolverán solo los
-- campos autorizados de una invitación publicada.
DROP POLICY IF EXISTS "Admin manages clients" ON public.clients;
CREATE POLICY "Admin manages clients" ON public.clients
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages events" ON public.events;
CREATE POLICY "Admin manages events" ON public.events
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages seating" ON public.seating_tables;
CREATE POLICY "Admin manages seating" ON public.seating_tables
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages guest groups" ON public.guest_groups;
CREATE POLICY "Admin manages guest groups" ON public.guest_groups
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages guest members" ON public.guest_members;
CREATE POLICY "Admin manages guest members" ON public.guest_members
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages RSVP logs" ON public.rsvp_checkin_logs;
CREATE POLICY "Admin manages RSVP logs" ON public.rsvp_checkin_logs
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages songs" ON public.song_requests;
CREATE POLICY "Admin manages songs" ON public.song_requests
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));

DROP POLICY IF EXISTS "Admin manages memories" ON public.event_memories;
CREATE POLICY "Admin manages memories" ON public.event_memories
  FOR ALL TO authenticated
  USING ((SELECT public.is_heyday_admin()))
  WITH CHECK ((SELECT public.is_heyday_admin()));
