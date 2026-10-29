#!/bin/sh
set -eu

if [ -z "${CRON_SECRET:-}" ]; then
  echo "CRON_SECRET no está configurado" >&2
  exit 1
fi

curl --fail --silent --show-error \
  --retry 3 \
  --retry-all-errors \
  --header "Authorization: Bearer ${CRON_SECRET}" \
  http://app:3000/api/cron/photo-retention
