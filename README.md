# Agri Hidro Farm Backend

IoT backend MVP for **Agri Hidro Tekno**. NestJS + Knex + PostgreSQL.

## Prerequisites

- **Node.js** 20+ (LTS)
- **Yarn**
- **PostgreSQL** 14+ (for local dev without Docker)
- **Docker** & **Docker Compose** (optional, for containerized dev/prod)

## Environment

Copy the example env and set your values (do not commit real secrets):

```bash
cp .env.example .env
```

Required variables:

| Variable            | Description                    |
|---------------------|--------------------------------|
| `DATABASE_URL`      | PostgreSQL connection string   |
| `POSTGRES_DB`       | Database name                  |
| `POSTGRES_USER`     | Database user                  |
| `POSTGRES_PASSWORD` | Database password              |
| `NODE_ENV`          | `development` or `production`  |

Example `DATABASE_URL`:

```
postgresql://USER:PASSWORD@localhost:5432/DB_NAME
```

---

## Server setup (production)

On your server (VPS, Raspberry Pi, etc.):

**1. Install Docker and Docker Compose**

- Linux (Debian/Ubuntu): [Install Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose plugin](https://docs.docker.com/compose/install/).
- Ensure the app user can run `docker` and `docker compose`.

**2. Clone the repo and go to the project**

```bash
git clone <your-repo-url> agri-hidro-backend
cd agri-hidro-backend
```

**3. Create production `.env`**

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable             | Example / note                                      |
|----------------------|-----------------------------------------------------|
| `POSTGRES_PASSWORD`  | Strong password (used by `db` and by `DATABASE_URL`) |
| `JWT_SECRET`         | Long random string (e.g. `openssl rand -hex 32`)    |
| `POSTGRES_DB`        | `agri_hidro` (optional; this is the default)        |
| `POSTGRES_USER`      | `postgres` (optional; this is the default)          |

Do **not** set `DATABASE_URL` when using `docker-compose.prod.yml` — it is built from `POSTGRES_*` and the `db` service hostname.

Optional (push notifications): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

**4. Build and start app + database**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

- Migrations run automatically on app startup.
- App listens on **port 8080** (override with `PORT` in `.env` if needed).

**5. Check that it’s running**

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

API: `http://<server-ip>:8080`. Put a reverse proxy (Nginx/Caddy) or [Cloudflare Tunnel](#cloudflare-tunnel-optional) in front if you want HTTPS or a domain.

**6. Updates (after `git pull`)**

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run again on app startup; for new migration files the image is rebuilt so they are included.

---

## GitHub Actions: auto-deploy on push

When you **push to `main` or `master`**, the **Deploy** workflow runs **after CI passes** and updates the server (pull + rebuild). No need to SSH in manually.

### Private server (no public SSH) – recommended

Your server is not reachable from the internet, so GitHub’s runners cannot SSH into it. Use one of these:

---

#### Option A: Self-hosted runner (auto on every push)

The deploy job runs **on your server** via a GitHub Actions self-hosted runner. No public SSH, no secrets.

**1. On the server**

- Clone the repo and complete [Server setup](#server-setup-production) (e.g. `$HOME/agri-hidro-backend`, `.env`, first `docker compose ... up -d --build`).
- Install Docker (and Docker Compose). Ensure the user that will run the runner can run `docker compose` and `git`.

**2. Install the GitHub Actions runner**

- Repo **Settings → Actions → Runners → New self-hosted runner**.
- Follow the instructions for your OS (Linux). Use the default runner group.
- Run the runner as a service so it stays up (the setup script offers this).
- The runner will run jobs in the repo’s workspace (e.g. `~/work/<repo>/<repo>`). The deploy workflow does **not** use that checkout; it `cd`s into your app directory and runs `git pull` and `docker compose` there.

**3. Set the app directory (optional)**

- Repo **Settings → Secrets and variables → Actions → Variables**.
- Add variable `APP_DIR` = path to the app on the server (e.g. `/home/ubuntu/agri-hidro-backend`). If you don’t set it, the workflow uses `$HOME/agri-hidro-backend` on the runner.

**4. Git pull on the server**

- So `git pull` works without prompts, either:
  - Clone with HTTPS and a [Personal Access Token](https://github.com/settings/tokens) (repo scope), or  
  - Use SSH and add a deploy key to the server and to the repo (Deploy keys).

After this, every push to `main`/`master` (after CI succeeds) triggers the Deploy workflow on your runner and runs `git pull` + `docker compose ... up -d --build` on the server.

---

#### Option B: Cron on the server (no runner)

The server pulls and rebuilds on a schedule. No GitHub Actions runner, no inbound access.

**1. On the server**

- Clone the repo and complete [Server setup](#server-setup-production).
- Make the script executable:  
  `chmod +x /path/to/agri-hidro-backend/scripts/deploy-on-server.sh`

**2. Schedule it (e.g. every 5 minutes)**

```bash
crontab -e
# add (adjust path and user):
*/5 * * * * /home/YOUR_USER/agri-hidro-backend/scripts/deploy-on-server.sh >> /var/log/agri-deploy.log 2>&1
```

The script only runs `git pull` and `docker compose ... up -d --build` when there are new commits on the current branch. Ensure `git pull` works (HTTPS token or SSH key).

---

### Public server (optional: SSH from GitHub)

If your server **is** reachable by SSH from the internet, you can use a GitHub-hosted runner and SSH instead:

1. In `.github/workflows/deploy.yml`, change `runs-on: [self-hosted]` to `runs-on: ubuntu-latest`.
2. Add back the SSH step (see git history or the [original workflow](https://github.com/...) that used `appleboy/ssh-action` with `SSH_PRIVATE_KEY`, `SERVER_HOST`, `SERVER_USER`).
3. Add secrets: `SSH_PRIVATE_KEY`, `SERVER_HOST`, `SERVER_USER` (and `SERVER_PORT` if needed).

---

### When deploy runs (self-hosted / cron)

- **Self-hosted:** After a **push** to `main` or `master`, once **CI** succeeds, the **Deploy** workflow runs on your runner and updates the server. You can also run **Actions → Deploy → Run workflow** manually.
- **Cron:** The server checks for new commits on the schedule you set (e.g. every 5 min) and deploys only when there are changes.

---

## How to run Docker

Use **Docker Compose** with the project’s compose files. You need Docker and Docker Compose installed.

### Development (`docker-compose.dev.yml`)

- App runs with **hot reload** (source mounted).
- Env: `.env`.
- App port: **3000**, DB port: **5432**.

```bash
# Create env (copy .env.example and set values)
cp .env.example .env

# Start app + PostgreSQL (builds images, runs in foreground)
docker compose -f docker-compose.dev.yml up --build

# Or run in background
docker compose -f docker-compose.dev.yml up -d --build
```

**First time or after schema changes** – run migrations inside the app container:

```bash
docker compose -f docker-compose.dev.yml run --rm app npm run knex:migrate:latest
```

**Stop:**

```bash
docker compose -f docker-compose.dev.yml down
```

**View logs:**

```bash
docker compose -f docker-compose.dev.yml logs -f app
```

### Production (`docker-compose.prod.yml`)

- No source mount; runs built app from multi-stage Dockerfile.
- Migrations run automatically on app startup when `DATABASE_URL` is set.
- Env: `.env`.
- App port: **8080** (override with `PORT`).

```bash
# Create env (copy .env.example and set POSTGRES_PASSWORD, JWT_SECRET, etc.)
cp .env.example .env
# DATABASE_URL is built from POSTGRES_* when using compose.

# Build and start in background
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run on container start. To run them manually, **rebuild the image first** so the container includes your latest migration files (prod image copies migrations at build time):

```bash
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml run --rm app npm run knex:migrate:latest
```

Or in one step (rebuild then migrate):

```bash
docker compose -f docker-compose.prod.yml run --rm --build app npm run knex:migrate:latest
```

**Stop:**

```bash
docker compose -f docker-compose.prod.yml down
```

**View logs:**

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### Quick reference

| Action              | Development                                      | Production                                       |
|---------------------|--------------------------------------------------|--------------------------------------------------|
| Start               | `docker compose -f docker-compose.dev.yml up --build`  | `docker compose -f docker-compose.prod.yml up -d --build` |
| Stop                | `docker compose -f docker-compose.dev.yml down`       | `docker compose -f docker-compose.prod.yml down`       |
| Migrate (first run) | `docker compose -f docker-compose.dev.yml run --rm app npm run knex:migrate:latest` | `docker compose -f docker-compose.prod.yml build app` then `run --rm app npm run knex:migrate:latest` |
| Logs                | `docker compose -f docker-compose.dev.yml logs -f app` | `docker compose -f docker-compose.prod.yml logs -f app` |

### Update Docker and run migrations

Rebuild images, start containers, then run migrations:

**Development:**

```bash
docker compose -f docker-compose.dev.yml up -d --build && docker compose -f docker-compose.dev.yml run --rm app npm run knex:migrate:latest
```

**Production:**

```bash
docker compose -f docker-compose.prod.yml up -d --build && docker compose -f docker-compose.prod.yml run --rm app npm run knex:migrate:latest
```

For prod, the migration runs inside the **built** image, so new migration files are only included after a rebuild. If you added migrations after the last build, run `docker compose -f docker-compose.prod.yml build app` first, or use `run --rm --build app ...` to rebuild before migrating.

(Production containers also run migrations on startup when `DATABASE_URL` is set; the `run --rm app npm run knex:migrate:latest` step is optional if you prefer to rely on that.)

---

## Development

### Option A: Local (no Docker)

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start PostgreSQL (local or existing instance). Create a database and set `DATABASE_URL` in `.env`.

3. Run migrations:

   ```bash
   npm run knex:migrate:latest
   ```

4. Start the app in watch mode:

   ```bash
   yarn start:dev
   ```

   API: **http://localhost:3000**

### Option B: Docker (dev with hot reload)

1. Create `.env` (see [Environment](#environment)).

2. Build and start app + PostgreSQL:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

3. (First time or after schema changes) Run migrations in the app container:

   ```bash
   docker compose -f docker-compose.dev.yml run --rm app npm run knex:migrate:latest
   ```

4. API: **http://localhost:3000**. Code changes reload automatically.

---

## Build

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Build the app:

   ```bash
   yarn build
   ```

   Output: `dist/`. Run with:

   ```bash
   yarn start:prod
   ```

   (Requires `DATABASE_URL` and `npm run knex:migrate:latest` if needed.)

---

## Production (Docker)

1. Create `.env` with `POSTGRES_PASSWORD`, `JWT_SECRET`, and optionally `POSTGRES_DB`, `POSTGRES_USER`. `DATABASE_URL` is set automatically by compose to point at the `db` service.

2. Build and start:

   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. Migrations run automatically on app startup. App listens on port **8080** (or `PORT`). No source mount; config via env.

### Cloudflare Tunnel (optional)

Run the tunnel **outside** the app’s docker-compose (so it’s separate from `docker-compose.prod.yml`).

**Cloudflared on host vs container:**  
If cloudflared runs **on the host** (binary), it connects to `http://127.0.0.1:8080` on the **host**. That only reaches your app if the container’s port is **published** to the host. Our `docker-compose.prod.yml` already exposes `8080:8080`, so host `127.0.0.1:8080` is the app. If the port weren’t exposed, you’d get connection refused.

**Option A – Docker (standalone container):**  
Containers can’t reach the host’s `localhost`, so the tunnel must use the app’s Docker network or host network.

**A1 – Same network as the app (works on Linux, Mac, Windows):**

```bash
# Start app + db
docker compose -f docker-compose.prod.yml up -d --build

# Run tunnel on the same network so it can reach the app by service name
docker run -d --restart unless-stopped --name cloudflared-tunnel \
  --network agri-hidro-backend_default \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token "$CLOUDFLARE_TUNNEL_TOKEN"
```

In **Cloudflare Zero Trust** → your tunnel → **Public Hostname** → **Private Service**: set the URL to **`http://app:8080`** (not localhost).  
If your compose project name is different, use that network: `docker network ls` and pick the one like `<project>_default`.

**A2 – Linux only (host network):** If you prefer to keep `localhost:8080` in Cloudflare, run cloudflared with **`--net host`** (or `--network host`) so the container shares the host network and can reach `127.0.0.1:8080`:

```bash
docker run -d --restart unless-stopped --name cloudflared-tunnel \
  --net host \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token "$CLOUDFLARE_TUNNEL_TOKEN"
```

Then in Cloudflare the Private Service can stay **`http://localhost:8080`** (or **`http://127.0.0.1:8080`**).

**A3 – Docker Desktop (Mac/Windows):** Use the host’s special hostname: in Cloudflare set the Private Service to **`http://host.docker.internal:8080`**, and run the tunnel without `--network` (default bridge). No `--network host` on Mac/Windows.

Stop the tunnel: `docker stop cloudflared-tunnel && docker rm cloudflared-tunnel`

**Option B – Binary on the host.** Install cloudflared from GitHub (not in default apt):

  ```bash
  docker compose -f docker-compose.prod.yml up -d --build

  # On the Pi: install cloudflared (one-time) — pick the line that matches your Pi:
  # 64-bit OS (Raspberry Pi OS 64-bit, aarch64):
  ARCH=arm64
  # 32-bit OS (Raspberry Pi OS 32-bit, armv7l):
  # ARCH=armhf

  sudo curl -sL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb" -o /tmp/cloudflared.deb
  sudo dpkg -i /tmp/cloudflared.deb
  rm -f /tmp/cloudflared.deb
  cloudflared --version
  ```

  Or detect arch automatically and install:

  ```bash
  ARCH=$(dpkg --print-architecture)
  case "$ARCH" in
    arm64)   ARCH=arm64 ;;
    armhf)   ARCH=armhf ;;
    *)       echo "Unsupported: $ARCH"; exit 1 ;;
  esac
  sudo curl -sL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb" -o /tmp/cloudflared.deb
  sudo dpkg -i /tmp/cloudflared.deb
  cloudflared --version
  ```

  Then run the tunnel (use your token from `.env`):

  ```bash
  cloudflared tunnel --no-autoupdate run --token YOUR_CLOUDFLARE_TUNNEL_TOKEN
  ```

  In **Cloudflare Zero Trust** → your tunnel → **Public Hostname**, set the service to **`http://localhost:8080`**.

---

## Database (Knex)

| Command                       | Description                 |
|------------------------------|-----------------------------|
| `npm run knex:migrate:latest`  | Apply migrations            |
| `npm run knex:migrate:rollback` | Rollback last migration     |
| `npm run knex:migrate:make <name>` | Create a new migration  |

Migrations: `migrations/`. Config: `knexfile.ts`.

---

## API (Auth)

| Method | Path        | Description   |
|--------|-------------|---------------|
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login         |

**Register** body: `{ "username": "string", "password": "string", "role": "admin" | "user" }`  
**Login** body: `{ "username": "string", "password": "string" }`  

Responses omit passwords; JWT can be added later.

---

## Tests

```bash
# unit
yarn test

# e2e
yarn test:e2e

# coverage
yarn test:cov
```

---

## License

UNLICENSED (private).
