# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo with three independent applications:

- **`thorongil-app/`** — React 19 frontend (Vite, Tailwind, MUI, i18next)
- **`thorongil-api/`** — Node.js/Express 5 REST API (CommonJS, PostgreSQL, JWT)
- **`curriculum-vitae/`** — Personal portfolio site (React 18, TypeScript, Vite)
- **`database/`** — PostgreSQL Docker Compose setup

Each application has its own `package.json` and must be run independently from its own directory.

## Commands

### Frontend (`thorongil-app/`)
```bash
npm run dev       # Lint + start Vite dev server (port 5173)
npm run build     # Production build to dist/
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

### Backend (`thorongil-api/`)
```bash
npm run dev           # Lint + start with nodemon + .env (port 5000)
npm start             # Lint + start server
npm test              # Run tests with Node.js native test runner
npm run lint          # ESLint
npm run migrate:up    # Apply pending migrations
npm run migrate:down  # Rollback last migration
npm run migrate:create -- <name>  # Create new migration file
```

### Database
```bash
# From database/ directory
docker compose up -d   # Start PostgreSQL container
```

## Backend Architecture

**Pattern**: Routes → DAOs + Services — no ORM, raw SQL via `pg` Pool.

- `src/server.js` — Bootstrap: runs pending migrations on startup, configures graceful shutdown
- `src/app.js` — Express setup, CORS, middleware registration, route mounting
- `src/features/` — Core logic: `*_dao.js` files for DB access, `standings_service.js` for calculated standings
- `src/routes/` — Express routers grouped by domain; aggregated in `routes/index.js`
- `src/middleware/auth.middleware.js` — JWT verification + role-based authorization
- `migrations/` — node-pg-migrate schema files; run automatically on server start

Environment variables required: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PORT`, `JWT_SECRET`.

## Frontend Architecture

**Pattern**: React Context for auth, custom hooks for data fetching, i18next for EN/IT localization.

- `src/main.jsx` — Entry point; wraps app in `BrowserRouter` + `AuthProvider`
- `src/App.jsx` — Route definitions with `ProtectedRoute` (authenticated) and `AdminRoute` (admin-only) guards
- `src/context/AuthContext.jsx` — Global auth state; provides `useAuth()` hook
- `src/utils/api.js` — Centralized fetch wrapper; reads `VITE_SERVER_URL` from env
- `src/components/football-archive/` — Competition/edition/phase/match management with mobile+desktop layout variants
- `src/components/fantacalcion/` — Fantasy football feature with `FantacalcionContext` managing team state
- `src/locales/` — Translation files (`en/`, `it/`); Italian is the fallback language

Frontend `.env`: `VITE_SERVER_URL=http://localhost:5000`

## ESLint Rules (enforced in CI)

Both packages use ESLint 9 flat config with `sonarjs` plugin. Key limits:
- **Backend**: max complexity 10, max cognitive complexity 15, max lines per file 50, max params 4
- **Frontend**: max complexity 20, max cognitive complexity 25, max lines per file 80, max params 5

Lint runs automatically before `dev` and `start` in both packages — fix lint errors before running.

## Database Migrations

Migrations live in `thorongil-api/migrations/` and use `node-pg-migrate`. The server auto-applies pending migrations on startup. Always create new migrations rather than editing existing ones.

## Versioning

Both frontend and backend share the same version number (currently v0.0.61), bumped together via the `bump-patch.yaml` GitHub workflow on merges to `main`.
