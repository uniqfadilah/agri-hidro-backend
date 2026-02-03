Initialize Knex with PostgreSQL and configure Docker for Development and Production.

Context:
- Company: Agri Hidro Tekno
- Project: IoT backend MVP
- Backend: NestJS (TypeScript)
- Package Manager: Yarn
- Query builder: Knex
- Database: PostgreSQL
- Use rules from /prompts/_base

Scope:
- Knex initialization
- PostgreSQL connection
- Docker setup for development and production

Environment:
- Development
- Production

Rules:
- Knex migrations are the single source of truth for database schema
- Use environment variables for all secrets
- Do not hardcode credentials
- Keep configuration clean and minimal
- Follow clean architecture principles
- Do not touch frontend code
- Do not implement business logic

Environment Variables:
- DATABASE_URL
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- NODE_ENV

Tasks:

1️⃣ Knex Initialization
- Add Knex and pg using Yarn
- Configure `knexfile.ts` (or equivalent)
- Use PostgreSQL client
- Use `DATABASE_URL` for database connection
- Prepare migrations for future tables

2️⃣ Dockerfile
- Create a multi-stage Dockerfile
- Use Node.js LTS (alpine)
- Install dependencies using Yarn
- Development stage:
  - Run NestJS with `nest start --watch`
- Production stage:
  - Build application using `yarn build`
  - Run compiled output with `node dist/main.js`

3️⃣ Docker Compose (Development)
- Create `docker-compose.dev.yml`
- Services:
  - app (NestJS)
  - db (PostgreSQL)
- Enable hot reload with volume mounting
- Load environment from `.env.development`
- Expose port 3000

4️⃣ Docker Compose (Production)
- Create `docker-compose.prod.yml`
- Services:
  - app (NestJS)
  - db (PostgreSQL)
- No source code volume mounting
- Load environment from `.env.production`

5️⃣ Knex & Docker Compatibility
- Knex migrations must be executable in both environments
- Database connection must work in Docker

Output:
- knexfile.ts
- migrations/ (initial migration)
- Dockerfile
- docker-compose.dev.yml
- docker-compose.prod.yml
- .dockerignore

Result:
- Knex connects successfully to PostgreSQL
- Development runs with hot reload via Docker
- Production runs optimized and stable
- Backend foundation ready for Auth and Orders
