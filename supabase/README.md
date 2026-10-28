# Migraciones de HeyDay

Las nueve migraciones de `supabase/migrations/` están ordenadas por timestamp para usarse con Supabase CLI. Se aplicaron al proyecto `odpiybzxaviifydyqfbk` (`heyday.party`) el 28 de octubre de 2026. `supabase migration list --linked` confirmó que las nueve versiones locales y remotas coinciden. Una consulta posterior devolvió 10 diseños, 10 tablas con RLS y 2 buckets.

| Orden | Migración | Contenido |
| --- | --- | --- |
| 1 | `20261028000100_extensions_and_enums.sql` | Extensión, trigger de fechas y enums |
| 2 | `20261028000200_profiles_and_clients.sql` | Perfiles de Auth y clientes |
| 3 | `20261028000300_templates_and_events.sql` | Catálogo e invitaciones |
| 4 | `20261028000400_guests_seating_and_rsvp.sql` | Invitados, mesas y registros RSVP/QR |
| 5 | `20261028000500_social_features_and_memories.sql` | Canciones y recuerdos; máximo de 50 fotos por evento |
| 6 | `20261028000600_rls_policies.sql` | RLS para el administrador de HeyDay |
| 7 | `20261028000700_storage_buckets.sql` | Assets públicos y recuerdos privados, hasta 8 MB por archivo |
| 8 | `20261028000800_rpc_functions_and_views.sql` | Vista y funciones de historial y métricas |
| 9 | `20261028000900_seed_templates.sql` | Los diez diseños del catálogo actual de la app |

## Para continuar el desarrollo

1. La CLI está instalada como dependencia de desarrollo y `supabase/config.toml` está inicializado. En una máquina nueva ejecuta `npx supabase login` y `npx supabase link --project-ref odpiybzxaviifydyqfbk`.
2. Para futuras migraciones, crea un archivo SQL con un timestamp posterior, ejecuta `npx supabase db push --linked` y comprueba `npx supabase migration list --linked`. No vuelvas a ejecutar manualmente las nueve migraciones ya aplicadas.
3. La cuenta administradora `urieel.mm@gmail.com` ya existe en **Authentication > Users** con el correo confirmado y el rol `agency_admin`. El trigger crea cualquier cuenta nueva con rol `client_host`, sin privilegios de administrador.
4. Para promover otra cuenta en el futuro, usa **SQL Editor** y comprueba que la consulta devuelva una fila:

```sql
UPDATE public.profiles
SET role = 'agency_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-correo@ejemplo.com')
RETURNING id, email, role;
```

5. `.env.local` contiene la URL y la clave **publishable** entregadas para este proyecto. Cuando se implemente el acceso del servidor a datos privados, agrega la clave **secret** en `SUPABASE_SECRET_KEY`. Esa clave y `QR_MASTER_SECRET` son exclusivamente del servidor y nunca deben llevar el prefijo `NEXT_PUBLIC_`.

No combines `supabase db push` con cambios de esquema desde SQL Editor: el editor no registra las migraciones en el historial de la CLI. El `UPDATE` anterior cambia datos, no el esquema. Para futuras modificaciones, crea un archivo de migración con un timestamp posterior.

## Comprobaciones después de migrar

```sql
SELECT count(*) AS disenos FROM public.templates_catalog;
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN (
  'profiles', 'clients', 'templates_catalog', 'events', 'seating_tables',
  'guest_groups', 'guest_members', 'rsvp_checkin_logs', 'song_requests', 'event_memories'
)
ORDER BY tablename;
SELECT id, public, file_size_limit FROM storage.buckets
WHERE id IN ('event-assets', 'guest-memories');
```

El resultado esperado es **10 diseños**, RLS activo en las **10 tablas**, `event-assets` público y `guest-memories` privado.

El 28 de octubre de 2026 se verificó que la cuenta administradora tiene `email_confirmed = true` y `role = agency_admin`.

## Estado de la aplicación

Los clientes de navegador y servidor ya usan la URL y la clave pública del proyecto. El login autentica con Supabase Auth y `src/middleware.ts` verifica la sesión y el rol de administrador antes de permitir `/dashboard`. El dashboard aún guarda invitaciones en `localStorage`; las páginas públicas y el formulario RSVP también muestran datos de demostración. Conectar esos flujos requiere leer y escribir datos desde el servidor, validar eventos publicados y tokens de invitados, y generar URLs firmadas para las fotos privadas. Los endpoints públicos deben devolver solo campos permitidos y usar la clave secret únicamente en el servidor.

El límite de 50 fotos se aplica en la tabla `event_memories`. La carga del archivo y la creación del registro deben coordinarse desde el servidor para limpiar un archivo si la inserción falla. Las subidas anónimas directas a Storage están deshabilitadas.
