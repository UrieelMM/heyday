-- ============================================================================
-- ARCHIVO 01: EXTENSIONES Y TIPOS ENUMERADOS (ENUMS)
-- Orden de ejecución: 1 de 9
-- ============================================================================

-- Extensión para UUIDs y funciones criptográficas (HMAC / gen_random_bytes)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Función trigger reutilizable para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tipos enumerados del dominio de invitaciones digitales
DO $$
BEGIN
  IF to_regtype('public.user_role') IS NULL THEN
    CREATE TYPE public.user_role AS ENUM ('superadmin', 'agency_admin', 'client_host');
  END IF;

  IF to_regtype('public.event_category') IS NULL THEN
    CREATE TYPE public.event_category AS ENUM (
      'wedding',
      'xv_years',
      'adult_birthday',
      'kids_birthday',
      'baptism_communion',
      'baby_shower',
      'graduation_gala'
    );
  END IF;

  IF to_regtype('public.event_status') IS NULL THEN
    CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF to_regtype('public.rsvp_mode') IS NULL THEN
    CREATE TYPE public.rsvp_mode AS ENUM ('closed_list', 'open_registration');
  END IF;

  IF to_regtype('public.rsvp_status') IS NULL THEN
    CREATE TYPE public.rsvp_status AS ENUM ('pending', 'viewed', 'confirmed', 'declined');
  END IF;

  IF to_regtype('public.table_shape') IS NULL THEN
    CREATE TYPE public.table_shape AS ENUM ('round', 'rectangular', 'sweetheart');
  END IF;

  IF to_regtype('public.media_type') IS NULL THEN
    CREATE TYPE public.media_type AS ENUM ('photo', 'audio_message');
  END IF;
END
$$;
