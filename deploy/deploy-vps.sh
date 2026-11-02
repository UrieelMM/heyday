#!/usr/bin/env bash
set -euo pipefail

sha="${1:?Falta el SHA del commit}"
if [[ ! "$sha" =~ ^[a-f0-9]{40}$ ]]; then
  echo "SHA de despliegue inválido" >&2
  exit 1
fi

root=/opt/heyday
release="$root/.releases/$sha"
env_file="$root/.env.production"

if [[ ! -f "$release/compose.yaml" || ! -f "$env_file" ]]; then
  echo "Faltan compose.yaml o $env_file en el VPS" >&2
  exit 1
fi

previous="$root"
if [[ -L "$root/current" ]]; then
  previous="$(readlink -f "$root/current")"
fi

compose() {
  local directory="$1"
  local tag="$2"
  shift 2
  APP_IMAGE_TAG="$tag" docker compose \
    --project-name invitaciones-digitales \
    --env-file "$env_file" \
    -f "$directory/compose.yaml" "$@"
}

restore_previous() {
  echo "El despliegue no quedó saludable; restaurando la versión anterior" >&2
  if [[ -f "$previous/compose.yaml" && "$previous" != "$release" ]]; then
    previous_tag="$(basename "$previous")"
    if [[ "$previous" == "$root" ]]; then
      compose "$previous" "$previous_tag" up --build --wait --wait-timeout 180 app caddy || true
    else
      compose "$previous" "$previous_tag" up --no-build --wait --wait-timeout 180 app caddy || true
    fi
  fi
}

compose "$release" "$sha" config --quiet
compose "$release" "$sha" build app

if ! compose "$release" "$sha" up --no-build --force-recreate --wait --wait-timeout 180 app caddy; then
  restore_previous
  exit 1
fi

container_id="$(compose "$release" "$sha" ps -q app)"
expected_image_id="$(docker image inspect "heyday-app:$sha" --format '{{.Id}}')"
actual_image_id="$(docker inspect "$container_id" --format '{{.Image}}')"
if [[ "$actual_image_id" != "$expected_image_id" ]]; then
  echo "El contenedor activo no usa la imagen del commit $sha" >&2
  restore_previous
  exit 1
fi

ln -sfn "$release" "$root/current"
echo "Desplegado commit $sha"
compose "$release" "$sha" ps
