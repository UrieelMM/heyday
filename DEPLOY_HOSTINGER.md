# Despliegue en Hostinger VPS con Docker

Esta configuración ejecuta tres contenedores:

- `app`: servidor standalone de Next.js, sin publicar directamente el puerto 3000.
- `caddy`: proxy inverso, HTTPS automático y renovación de certificados.
- `cron`: opcional; ejecuta diariamente la retención de álbumes a las 15:00 UTC.

Supabase continúa siendo un servicio externo; no se levanta una base de datos en el VPS.

## 1. Preparar dominio y servidor

1. Crea registros DNS `A` para el dominio (y `www`, si se usará) apuntando a la IP pública del VPS.
2. En el firewall de Hostinger permite TCP `22`, `80` y `443`, y UDP `443` para HTTP/3.
3. Instala Docker Engine y el plugin de Docker Compose desde el repositorio oficial de Docker.
4. Clona el repositorio en el VPS y entra en su directorio.

No publiques el puerto 3000 en el firewall: sólo Caddy debe acceder al contenedor de la app.

## 2. Configurar variables

```bash
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Completa todos los valores. `DOMAIN` debe contener sólo el host, sin `https://` ni rutas. Si se servirán ambos hosts, puede escribirse `heyday.party, www.heyday.party`.

Genera secretos independientes, por ejemplo:

```bash
openssl rand -base64 48
```

Las variables `NEXT_PUBLIC_*` son públicas por definición y se integran durante la compilación. Los demás secretos sólo se entregan al contenedor en tiempo de ejecución. El archivo `.env.production` está ignorado por Git y por el contexto de Docker.

## 3. Construir y arrancar

```bash
docker compose --env-file .env.production config
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f --tail=100 app caddy
```

Caddy solicitará el certificado TLS cuando el DNS ya apunte al VPS y los puertos 80/443 sean accesibles. Comprueba después:

```bash
curl --fail https://heyday.party/api/health
```

La respuesta esperada es `{"status":"ok"}`.

### Cambiar del hostname provisional al dominio propio

El VPS actual usa provisionalmente `srv2107050.hstgr.cloud`. Una vez registrado
el dominio, crea un registro `A` para `heyday.party` que apunte a
`179.197.88.57` y espera a que el DNS resuelva. En el VPS, edita
`/opt/heyday/.env.production`, cambia `DOMAIN` a `heyday.party` y
`NEXT_PUBLIC_APP_URL` a `https://heyday.party`; después ejecuta:

```bash
cd /opt/heyday
docker compose --env-file .env.production up -d --build
```

Caddy solicitará el nuevo certificado automáticamente. La reconstrucción es
necesaria porque Next.js incorpora las variables públicas durante el build.

La tarea de retención permanece desactivada por defecto: además de enviar
recordatorios, elimina las fotografías de álbumes vencidos. Antes de activarla,
verifica el dominio remitente en Resend, configura `RESEND_FROM_EMAIL` con una
dirección de ese dominio y confirma el destinatario de prueba. Actualmente la
aplicación envía todos los avisos a `PHOTO_RETENTION_TEST_EMAIL`, no al correo
de cada cliente. Después de verificar el flujo, activa la tarea con:

```bash
docker compose --env-file .env.production --profile retention up -d cron
```

Para pausarla de nuevo:

```bash
docker compose --env-file .env.production --profile retention stop cron
```

## 4. Actualizar la aplicación

El workflow `.github/workflows/deploy-hostinger.yml` valida cada pull request a `main` y despliega automáticamente cada push a `main`. El VPS conserva `.env.production`; GitHub Actions envía solamente los archivos versionados del commit y construye allí la imagen con las variables de producción.

### Activar GitHub Actions una sola vez

1. Genera una llave exclusiva para el despliegue (en esta máquina ya existe `~/.ssh/heyday_github_actions`):

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/heyday_github_actions -C heyday-github-actions
   ```

   Cuando se solicite la passphrase, déjala vacía para que GitHub Actions pueda usarla sin interacción. No reemplaces una llave existente.

2. En Hostinger abre **VPS → srv2107050.hstgr.cloud → Ajustes → Claves SSH** y añade el contenido de `~/.ssh/heyday_github_actions.pub`. Sólo se copia la llave **pública** al VPS.
3. Verifica que la nueva llave entra y que el servidor está preparado:

   ```bash
   ssh -i ~/.ssh/heyday_github_actions root@179.197.88.57 'test -f /opt/heyday/.env.production && docker compose version'
   ```

4. En GitHub abre **UrieelMM/heyday → Settings → Secrets and variables → Actions → New repository secret**. Crea estos cuatro secretos:

   | Nombre | Valor |
   | --- | --- |
   | `HOSTINGER_HOST` | `179.197.88.57` |
   | `HOSTINGER_USER` | `root` |
   | `HOSTINGER_SSH_PRIVATE_KEY` | Contenido completo de `~/.ssh/heyday_github_actions` (llave **privada**). |
   | `HOSTINGER_SSH_KNOWN_HOSTS` | Entrada verificada del VPS en `~/.ssh/known_hosts`. Obténla con `ssh-keygen -F 179.197.88.57 -f ~/.ssh/known_hosts`. |

   Antes de copiar una entrada nueva de `ssh-keyscan`, verifica la huella del host por un canal confiable. No desactives `StrictHostKeyChecking`.

5. Haz push a `main` y revisa **Actions → CI y despliegue en Hostinger**. El job de despliegue espera a que `app` esté saludable y comprueba `https://heyday.party/api/health`. Si el arranque falla, intenta restaurar la versión anterior.

El despliegue guarda cada commit en `/opt/heyday/.releases/<SHA>` y apunta `/opt/heyday/current` a la versión activa. Para revisar qué versión corre:

```bash
readlink -f /opt/heyday/current
```

### Actualización manual

Si se actualiza el checkout de `/opt/heyday` a mano:

```bash
docker compose --env-file .env.production up -d --build
docker image prune -f
```

Si cambia alguna variable `NEXT_PUBLIC_*`, es obligatorio reconstruir la imagen. Para cambios en secretos del servidor basta recrear los contenedores:

```bash
docker compose --env-file .env.production up -d --force-recreate
```

## Operación y diagnóstico

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f --tail=200
docker compose --env-file .env.production restart app
```

El certificado y la configuración interna de Caddy se conservan en volúmenes nombrados. Para respaldarlos:

```bash
docker run --rm -v invitaciones-digitales_caddy_data:/data -v "$PWD":/backup alpine tar czf /backup/caddy-data.tgz -C /data .
```

No ejecutes `docker compose down -v` en producción: la opción `-v` elimina esos volúmenes.
