#!/usr/bin/env bash
set -euo pipefail

cd /repo

export ASSISTME_STATE_DIR="/tmp/assistme-test"
export ASSISTME_CONFIG_PATH="${ASSISTME_STATE_DIR}/assistme.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${ASSISTME_STATE_DIR}/credentials"
mkdir -p "${ASSISTME_STATE_DIR}/agents/main/sessions"
echo '{}' >"${ASSISTME_CONFIG_PATH}"
echo 'creds' >"${ASSISTME_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${ASSISTME_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm assistme reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${ASSISTME_CONFIG_PATH}"
test ! -d "${ASSISTME_STATE_DIR}/credentials"
test ! -d "${ASSISTME_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${ASSISTME_STATE_DIR}/credentials"
echo '{}' >"${ASSISTME_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm assistme uninstall --state --yes --non-interactive

test ! -d "${ASSISTME_STATE_DIR}"

echo "OK"
