#!/bin/sh
set -e

# Run migrations and seeds when DATABASE_URL is set (e.g. in docker-compose)
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npm run knex:migrate:latest
  echo "Running database seeds..."
  npm run knex:seed:run
fi

exec "$@"
