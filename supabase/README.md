# Guía de Implementación SQL en Supabase

Esta carpeta contiene toda la infraestructura de base de datos separada modularmente en **9 archivos SQL** numerados dentro de `supabase/migrations/`.

## Orden de Ejecución en el SQL Editor de Supabase

Cuando crees tu proyecto en [Supabase](https://supabase.com), abre la sección **SQL Editor** y ejecuta los archivos en el siguiente orden:

1. **[`01_extensions_and_enums.sql`](./migrations/01_extensions_and_enums.sql)**
   * Habilita `pgcrypto`, crea el trigger reutilizable `set_updated_at()` y define todos los tipos `ENUM` (`user_role`, `event_category`, `event_status`, `rsvp_mode`, `rsvp_status`, `table_shape`, `media_type`).
2. **[`02_profiles_and_clients.sql`](./migrations/02_profiles_and_clients.sql)**
   * Crea la tabla `public.profiles` (con trigger automático cuando se registra un usuario en `auth.users`) y la tabla `public.clients` para gestionar múltiples clientes.
3. **[`03_templates_and_events.sql`](./migrations/03_templates_and_events.sql)**
   * Crea el catálogo `public.templates_catalog` y la tabla principal `public.events` con índices optimizados para consultar el historial de invitaciones por template (`template_id`), por cliente (`client_name`) y por rango de fechas (`event_date`, `created_at`).
4. **[`04_guests_seating_and_rsvp.sql`](./migrations/04_guests_seating_and_rsvp.sql)**
   * Crea `public.seating_tables`, `public.guest_groups` (con validación de cupo máximo por familia y `guest_token`), `public.guest_members` y la bitácora `public.rsvp_checkin_logs`.
5. **[`05_social_features_and_memories.sql`](./migrations/05_social_features_and_memories.sql)**
   * Crea `public.song_requests` (DJ Playlist con votación) y `public.event_memories` (Audio Guestbook y Live Disposable Camera).
6. **[`06_rls_policies.sql`](./migrations/06_rls_policies.sql)**
   * Activa **Row Level Security (RLS)** en todas las tablas y define las políticas de lectura pública para invitaciones publicadas y control total para administradores autenticados.
7. **[`07_storage_buckets.sql`](./migrations/07_storage_buckets.sql)**
   * Crea los buckets `event-assets` y `guest-memories` en Supabase Storage con sus límites de tamaño, tipos MIME permitidos y políticas de acceso.
8. **[`08_rpc_functions_and_views.sql`](./migrations/08_rpc_functions_and_views.sql)**
   * Crea la vista `public.v_template_invitations_history` y la función RPC `public.get_paginated_invitations_history(...)` lista para paginar y filtrar invitaciones por `template_id`, nombre de cliente y rango de fechas directamente desde el servidor.
9. **[`09_seed_templates_and_demo_data.sql`](./migrations/09_seed_templates_and_demo_data.sql)**
   * Inserta los **10 templates iniciales** con sus colores, tipografías y configuraciones base.
