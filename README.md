# torget-web

Public marketplace and admin UI for Torget — **Next.js App Router**, React 19, Tailwind CSS v4, shadcn/ui, next-themes, and tenant-aware semantic tokens.

## Architecture

```
Browser  →  torget-web (Next.js)  →  torget-core (HTTP API)
```

`torget-web` calls `torget-core` only. It never communicates with `torget-data` or PostgreSQL directly.

## Frontend architecture baseline

- **UI foundation:** Tailwind CSS v4 + shadcn/ui component patterns. MUI is not used as the primary UI layer.
- **Mode support:** `next-themes` controls light/dark/system mode via the `class` attribute on `<html>`.
- **Token-first theming:** semantic CSS variables (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--card`, `--accent`, `--radius`, etc.) drive all shared styling.
- **Theme layers:** `src/theme/tokens/base.css`, `light.css`, `dark.css`, and tenant override files under `src/theme/tokens/tenants/`.
- **Tenant-aware scaffolding:** `src/lib/tenant/` resolves tenant intent (host/path/preference fallback). Theme attributes are applied at the root so component code stays tenant-agnostic.
- **Incremental migration note:** runtime routes/components remain in existing `app/` and `components/` folders for stability; `src/` contains the new architecture layers and contracts.

## Migration status

Current state is intentionally incremental:

- **Migrated foundation:** token files in `src/theme/tokens`, tenant resolver scaffolding in `src/lib/tenant`, and baseline marketplace layer under `src/components/marketplace`.
- **Still unmigrated by design:** full `src/app` move and broad relocation of legacy runtime components from root `components/*`.

This keeps production behavior stable while enforcing token-first and tenant-aware patterns for all new frontend work.

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
