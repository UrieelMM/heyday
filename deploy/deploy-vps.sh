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

compose "$release" "$sha" config --quiet
compose "$release" "$sha" build app

if ! compose "$release" "$sha" up --no-build --wait --wait-timeout 180 app caddy; then
  echo "El despliegue no quedó saludable; restaurando la versión anterior" >&2
  if [[ -f "$previous/compose.yaml" && "$previous" != "$release" ]]; then
    previous_tag="$(basename "$previous")"
    if [[ "$previous" == "$root" ]]; then
      compose "$previous" "$previous_tag" up --build --wait --wait-timeout 180 app caddy || true
    else
      compose "$previous" "$previous_tag" up --no-build --wait --wait-timeout 180 app caddy || true
    fi
  fi
  exit 1
fi

ln -sfn "$release" "$root/current"
echo "Desplegado commit $sha"
compose "$release" "$sha" ps
