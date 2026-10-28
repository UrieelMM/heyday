-- ============================================================================
-- ARCHIVO 08: VISTAS Y FUNCIONES RPC (HISTORIAL POR TEMPLATE, PAGINACIÓN, RSVP)
-- Orden de ejecución: 8 de 9
-- ============================================================================

-- 1. Vista pre-calculada para el Historial de Invitaciones por Template y Cliente
CREATE OR REPLACE VIEW public.v_template_invitations_history
WITH (security_invoker = true) AS
SELECT
  e.id,
  e.slug,
  e.client_name,
  e.client_email,
  e.client_phone,
  e.title,
  e.category,
  e.template_id,
  t.name AS template_name,
  t.category_label AS template_category_label,
  e.status,
  e.event_date,
  e.created_at,
  e.updated_at,
  e.views_count,
  COUNT(g.id) AS total_guest_groups,
  COALESCE(SUM(g.allocated_adults + g.allocated_children), 0) AS total_allocated_passes,
  COALESCE(SUM(g.confirmed_adults + g.confirmed_children), 0) AS total_confirmed_passes
FROM public.events e
LEFT JOIN public.templates_catalog t ON t.id = e.template_id
LEFT JOIN public.guest_groups g ON g.event_id = e.id
GROUP BY e.id, t.name, t.category_label;

REVOKE ALL ON public.v_template_invitations_history FROM PUBLIC, anon;
GRANT SELECT ON public.v_template_invitations_history TO authenticated, service_role;

-- 2. Función RPC para incrementar vistas de una invitación de forma atómica
CREATE OR REPLACE FUNCTION public.increment_event_views(target_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET views_count = views_count + 1
  WHERE slug = target_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.increment_event_views(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_event_views(TEXT) TO service_role;

-- 3. Función RPC para búsqueda paginada del historial por template, cliente y fechas
CREATE OR REPLACE FUNCTION public.get_paginated_invitations_history(
  p_template_id TEXT DEFAULT NULL,
  p_client_query TEXT DEFAULT NULL,
  p_date_field TEXT DEFAULT 'event_date', -- 'event_date' o 'created_at'
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_status public.event_status DEFAULT NULL,
  p_page INTEGER DEFAULT 1,
  p_page_size INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  title TEXT,
  template_id TEXT,
  template_name TEXT,
  status public.event_status,
  event_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  views_count INTEGER,
  total_allocated_passes BIGINT,
  total_confirmed_passes BIGINT,
  total_records BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT
      v.*,
      COUNT(*) OVER() AS full_count
    FROM public.v_template_invitations_history v
    WHERE
      (p_template_id IS NULL OR p_template_id = 'all' OR v.template_id = p_template_id)
      AND (p_status IS NULL OR v.status = p_status)
      AND (
        p_client_query IS NULL
        OR p_client_query = ''
        OR v.client_name ILIKE '%' || p_client_query || '%'
        OR v.title ILIKE '%' || p_client_query || '%'
        OR v.slug ILIKE '%' || p_client_query || '%'
      )
      AND (
        p_date_from IS NULL
        OR (CASE WHEN p_date_field = 'created_at' THEN v.created_at::date ELSE v.event_date::date END) >= p_date_from
      )
      AND (
        p_date_to IS NULL
        OR (CASE WHEN p_date_field = 'created_at' THEN v.created_at::date ELSE v.event_date::date END) <= p_date_to
      )
  )
  SELECT
    f.id,
    f.slug,
    f.client_name,
    f.client_email,
    f.client_phone,
    f.title,
    f.template_id,
    f.template_name,
    f.status,
    f.event_date,
    f.created_at,
    f.views_count,
    f.total_allocated_passes,
    f.total_confirmed_passes,
    f.full_count AS total_records
  FROM filtered f
  ORDER BY f.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(p_page_size, 10), 1), 100)
  OFFSET (GREATEST(COALESCE(p_page, 1), 1)::BIGINT - 1)
    * LEAST(GREATEST(COALESCE(p_page_size, 10), 1), 100);
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.get_paginated_invitations_history(
  TEXT, TEXT, TEXT, DATE, DATE, public.event_status, INTEGER, INTEGER
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_paginated_invitations_history(
  TEXT, TEXT, TEXT, DATE, DATE, public.event_status, INTEGER, INTEGER
) TO authenticated, service_role;
