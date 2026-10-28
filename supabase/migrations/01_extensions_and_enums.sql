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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('superadmin', 'agency_admin', 'client_host');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_category') THEN
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

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
    CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rsvp_mode') THEN
    CREATE TYPE public.rsvp_mode AS ENUM ('closed_list', 'open_registration');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rsvp_status') THEN
    CREATE TYPE public.rsvp_status AS ENUM ('pending', 'viewed', 'confirmed', 'declined');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'table_shape') THEN
    CREATE TYPE public.table_shape AS ENUM ('round', 'rectangular', 'sweetheart');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
    CREATE TYPE public.media_type AS ENUM ('photo', 'audio_message');
  END IF;
END
$$;
