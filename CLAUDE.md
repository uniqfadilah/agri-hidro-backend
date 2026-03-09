# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS 11 backend for "Agri Hidro Tekno" — an IoT farm/water management system with JWT auth, role-based access control, and Firebase push notifications. Uses PostgreSQL 16 with Knex query builder and Objection ORM.

## Common Commands

```bash
# Development
yarn start:dev              # Start dev server with hot reload (port 8080)
yarn build                  # Compile TypeScript to dist/

# Testing
yarn test                   # Run unit tests (Jest)
yarn test:e2e               # Run end-to-end tests
yarn test -- --testPathPattern=<pattern>  # Run a single test file

# Linting & Formatting
yarn lint                   # ESLint with auto-fix
yarn format                 # Prettier formatting

# Database
yarn knex:migrate:latest    # Run pending migrations
yarn knex:seed:run          # Seed database
yarn knex:migrate:make <name>  # Create new migration
```

## Architecture

### Module Structure

NestJS modular architecture under `src/modules/`. Each module follows the pattern:
- `*.module.ts` — NestJS module definition
- `*.controller.ts` — Route handlers
- `*.service.ts` — Business logic
- `dto/*.dto.ts` — Request validation (class-validator decorators)

Feature modules: auth, users, customers, items, invoices, sellers, materials, expenses, tandon (water tanks), customer-items, material-sellers, push-tokens.

### Database Layer

- **ORM:** Objection.js models in `src/models/` extend `BaseModel` which applies `snakeCaseMappers()` (camelCase in code ↔ snake_case in DB)
- **Migrations:** Knex migrations in `migrations/` directory, configured in `knexfile.ts`
- **Connection:** `DATABASE_URL` env var, configured globally via `DatabaseModule` (`src/database.module.ts`)

### Authentication & Authorization

- JWT auth applied globally via `APP_GUARD` — all routes require auth by default
- `@Public()` decorator bypasses JWT guard (e.g., login, IoT device endpoints)
- `@Roles('admin')` + `RolesGuard` for admin-only endpoints
- `@CurrentUser()` parameter decorator extracts authenticated user from request
- JWT strategy in `src/modules/auth/strategies/jwt.strategy.ts`
- Tokens expire in 7 days

### Key Patterns

- Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` — unknown DTO fields are rejected
- IoT device endpoint (`POST /tandon/device/update-water`) is public and uses device-specific JWT secrets stored per tandon
- Firebase Admin SDK for push notifications via `PushTokensModule`
- Enum types in DB: `invoice_status_enum`, `expense_status_enum`, `tandon_status_enum`

## Environment

Requires `.env` file (see `.env.example`). Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Required for auth
- `FIREBASE_*` — Optional, for push notifications

## Docker

Multi-stage Dockerfile (Node 20-alpine). `docker-compose.prod.yml` runs app + PostgreSQL 16. Migrations run automatically on container start.