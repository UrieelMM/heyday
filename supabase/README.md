# Migraciones de HeyDay

Las migraciones de `supabase/migrations/` están ordenadas por timestamp para usarse con Supabase CLI. Las primeras once se aplicaron al proyecto `odpiybzxaviifydyqfbk` (`heyday.party`) el 28 de octubre de 2026. La migración 12, que activa la retención de álbumes y la eliminación futura, debe revisarse y aplicarse expresamente antes del despliegue.

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
| 10 | `20261028001000_guest_photo_quota.sql` | Cuota de fotos por pase |
| 11 | `20261028001100_social_checkin.sql` | Votos, audio y check-in |
| 12 | `20261028001200_album_retention.sql` | Miniaturas, enlaces y caducidad del álbum |

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

El dashboard utiliza Supabase con la sesión del administrador para cargar y gestionar invitaciones y pases. Las invitaciones se crean como borrador y se publican desde el historial. El servidor usa `SUPABASE_SECRET_KEY` para leer invitaciones publicadas, confirmar asistencia y administrar el álbum privado. Configura esta variable también en el entorno de producción; nunca la expongas al navegador.

La migración `20261028001000_guest_photo_quota.sql` limita el álbum a 50 fotos por evento y 5 por grupo de invitados, incluso en cargas concurrentes. El enlace personal identifica al grupo y es necesario para acceder al álbum y confirmar asistencia. Las imágenes de portada y galería se guardan en `event-assets`; los recuerdos se guardan en `guest-memories`. Ambos aceptan JPG, PNG y WebP de hasta 8 MB por foto. La eliminación de una invitación elimina también los archivos almacenados bajo su carpeta.

La migración `20261028001100_social_checkin.sql` agrega votos únicos por pase, un límite de tres mensajes de voz por grupo y registro de entradas con bloqueo transaccional. Los invitados acceden a canciones y voz con su enlace personal; el organizador puede escuchar mensajes y ver fotos y canciones en Recepción. El escáner requiere cámara y un origen seguro (HTTPS o localhost). Las visitas se contabilizan una vez por pestaña y sesión del navegador; no son visitantes únicos verificados. Activa las funciones sociales deseadas en el constructor y guarda los cambios.

La migración `20261028001200_album_retention.sql` inicia, al crear cada invitación, una vigencia de seis meses para sus fotos. La carga convierte las imágenes a WebP de alta calidad y genera miniaturas. El cron de Vercel llama diariamente a `/api/cron/photo-retention`: envía mediante Resend un recordatorio a 1 mes, 15 días y 7 días (por ahora a `PHOTO_RETENTION_TEST_EMAIL`), y elimina originales y miniaturas al vencer. Cada correo incluye el enlace privado `/api/albums/download/[token]`, que genera el ZIP por streaming. Configura `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CRON_SECRET` y `NEXT_PUBLIC_APP_URL` en producción. La aplicación admite temporalmente `NEXT_PUBLIC_RESEND_API_KEY`, pero debe migrarse a `RESEND_API_KEY` para que la credencial no se exponga al navegador.
