# Migraciones de HeyDay

Las nueve migraciones de `supabase/migrations/` están ordenadas por timestamp para usarse con Supabase CLI. Están preparadas para un proyecto **nuevo** y todavía no se han ejecutado contra una base real.

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

## Al crear el proyecto

1. Instala Supabase CLI desde su distribución oficial. En la raíz del repositorio ejecuta `supabase init` para generar `supabase/config.toml`, luego `supabase login` y `supabase link --project-ref <project-ref>`.
2. Ejecuta `supabase db push`. Comprueba después `supabase migration list` y que `public.templates_catalog` tenga diez filas.
3. Crea tu usuario en **Authentication > Users**. El trigger crea su perfil con rol `client_host`, sin privilegios de administrador.
4. Desde **SQL Editor**, promueve **solo tu cuenta** y verifica que la consulta devuelva una fila:

```sql
UPDATE public.profiles
SET role = 'agency_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-correo@ejemplo.com')
RETURNING id, email, role;
```

5. Copia `.env.example` a `.env.local` y configura la URL, la clave **publishable** y la clave **secret**. La clave secret y `QR_MASTER_SECRET` son exclusivamente del servidor y nunca deben llevar el prefijo `NEXT_PUBLIC_`.

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

## Estado de la aplicación

El dashboard todavía usa autenticación de demostración y guarda invitaciones en `localStorage`; las páginas públicas y el formulario RSVP también muestran datos de demostración. Configurar `.env.local` **no conecta automáticamente estos flujos a Supabase**. Esa integración requiere reemplazar la autenticación de prueba, leer y escribir datos desde el servidor, validar eventos publicados y tokens de invitados, y generar URLs firmadas para las fotos privadas. Los endpoints públicos deben devolver solo campos permitidos y usar la clave secret únicamente en el servidor.

El límite de 50 fotos se aplica en la tabla `event_memories`. La carga del archivo y la creación del registro deben coordinarse desde el servidor para limpiar un archivo si la inserción falla. Las subidas anónimas directas a Storage están deshabilitadas.
