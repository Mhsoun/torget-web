# torget-web

Public marketplace and admin UI for Torget — **Next.js 15**, React 19, Tailwind CSS, shadcn/ui.

## Architecture

```
Browser  →  torget-web (Next.js)  →  torget-core (HTTP API)
```

`torget-web` calls `torget-core` only. It never communicates with `torget-data` or PostgreSQL directly.

## Local run (default — host-run services)

Ensure `torget-core` is running on port 5000 before starting the web app.

```powershell
cd torget-web
npm install
npm run dev
```

Default listen URL: `http://localhost:3000`

The dev server defaults to `http://localhost:5000` as the API base when `NEXT_PUBLIC_TORGET_API_URL` is not set. Set it explicitly if your `torget-core` instance is on a different URL:

```powershell
# .env.local (not committed)
NEXT_PUBLIC_TORGET_API_URL=http://localhost:5000
```

## Local run (optional — Podman Compose)

See `torget-dev/README.md` for the optional Compose path that runs the full stack in containers.

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TORGET_API_URL` | Base URL of `torget-core`. Defaults to `http://localhost:5000` in development. Required in staging and production. |
| `NEXTAUTH_SECRET` | Required for NextAuth session signing in production. |
| `NEXTAUTH_URL` | Canonical URL of the web app. Required in production. |

## Run type checks

```powershell
npx tsc --noEmit
```

## Default URLs

| Page | URL |
|------|-----|
| Public site | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| Admin login | http://localhost:3000/admin/login |

## Environment strategy

See [torget-docs/architecture/environment-strategy.md](../torget-docs/architecture/environment-strategy.md) for the authoritative model covering local, staging, and production environments.
