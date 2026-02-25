#!/usr/bin/env bash
# Run this on the server (e.g. from cron or after a webhook) to pull and rebuild.
# Usage: ./scripts/deploy-on-server.sh [APP_DIR]
# Example cron (every 5 min): */5 * * * * /home/you/agri-hidro-backend/scripts/deploy-on-server.sh >> /var/log/agri-deploy.log 2>&1

set -e
APP_DIR="${1:-${APP_DIR:-$HOME/agri-hidro-backend}}"
cd "$APP_DIR" || { echo "Error: not found: $APP_DIR"; exit 1; }
git fetch origin
if git diff --quiet HEAD origin/$(git rev-parse --abbrev-ref HEAD); then
  echo "$(date -Iseconds) No changes, skip deploy"
  exit 0
fi
git pull
docker compose -f docker-compose.prod.yml up -d --build
echo "$(date -Iseconds) Deploy done"
