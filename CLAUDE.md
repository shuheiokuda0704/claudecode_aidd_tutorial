# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack TODO application with production-ready features built as a monorepo with:
- **Backend**: Express + TypeScript + PostgreSQL + Drizzle ORM
- **Frontend**: Nuxt 4 + Vue 3 Composition API
- **Infrastructure**: Docker Compose orchestration

## Architecture

### Monorepo Structure
- `backend/` - Express REST API server
- `frontend/` - Nuxt 4 SSR application
- Root `package.json` - Monorepo scripts coordinating both projects
- Shared tools: pnpm workspace, husky pre-commit hooks, GitHub Actions CI

### Backend Architecture (Express)
- **Entry Point**: `src/index.ts` starts the HTTP server
- **App Configuration**: `src/app.ts` configures Express middleware stack
- **Database Layer**:
  - Schema defined in `src/db/schema.ts` using Drizzle ORM
  - Single `todos` table with UUID primary keys
  - Connection managed in `src/db/index.ts`
- **Request Flow**: Request → CORS → Helmet → Rate Limiting → Logger → Routes → Error Handler → Response
- **Validation**: Zod schemas in `src/lib/validation.ts` validate all request bodies
- **Logging**: Pino structured JSON logger configured in `src/lib/logger.ts`
- **Error Handling**: Centralized error middleware in `src/middleware/errorHandler.ts`

### Frontend Architecture (Nuxt 4)
- **Component-Based**: Uses composition API with composables pattern
- **State Management**: `composables/useTodos.ts` manages all TODO state and API calls
- **Components**:
  - `app.vue` - Main application layout
  - `components/TodoInput.vue` - Add new TODOs
  - `components/TodoItem.vue` - Individual TODO with edit/delete
  - `components/TodoList.vue` - Container for TODO items
  - `components/TodoFilters.vue` - Filter by status
  - `components/ErrorMessage.vue` - Error display
- **API Integration**: Direct fetch calls to backend at `http://localhost:3001/api/todos`
- **ESLint Integration**: Must have `@nuxt/eslint` in `modules` array for `.nuxt/eslint.config.mjs` generation

## Database Management

### Drizzle ORM Workflow
```bash
# 1. Modify schema in backend/src/db/schema.ts
# 2. Generate migration files
cd backend && pnpm run db:generate

# 3. Apply migrations to database
pnpm run db:migrate
```

**Critical**:
- Always use `drizzle-kit generate` to create migrations (NOT manual SQL)
- Always use `drizzle-kit migrate` to apply migrations (NOT custom scripts)
- Migration files are in `backend/drizzle/` directory
- Configuration in `backend/drizzle.config.ts`

## Development Commands

### Starting Services (Docker)
```bash
# Start all services (Postgres + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f [backend|frontend|db]

# Stop services
docker-compose down

# Rebuild images after dependency changes
docker-compose up -d --build
```

### Backend Development
```bash
cd backend

# Run development server with hot reload
pnpm run dev

# Run tests (requires PostgreSQL at DATABASE_URL)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm run typecheck

# Linting and formatting
pnpm run lint
pnpm run format:check
```

### Frontend Development
```bash
cd frontend

# Run development server
pnpm run dev

# **CRITICAL**: After `pnpm install`, MUST run `nuxt prepare` to generate .nuxt/eslint.config.mjs
pnpm exec nuxt prepare

# Type checking
pnpm run typecheck

# Linting and formatting
pnpm run lint
pnpm run format:check
```

### Monorepo Root Commands
```bash
# Run lint across both projects
pnpm run lint

# Run type checks across both projects
pnpm run typecheck

# Run all backend tests
pnpm run test
```

## Pre-commit Hooks (Husky)

Configured in `.husky/pre-commit` and automatically runs on every commit:
1. **lint-staged** - Auto-fix and format changed files
2. **Backend typecheck** - TSC type checking
3. **Frontend typecheck** - Nuxt typecheck
4. **Backend tests** - Full test suite with Vitest

**Important**: Commits will be rejected if any check fails.

## CI/CD (GitHub Actions)

Workflow defined in `.github/workflows/ci.yml` with 4 jobs:

### backend-test
1. Start PostgreSQL service container
2. Install dependencies
3. **Run `pnpm run db:migrate`** - CRITICAL for creating tables
4. Run tests
5. Build TypeScript

### backend-lint
1. ESLint
2. Prettier format check
3. TypeScript type check

### frontend-lint
1. Install dependencies
2. **Run `pnpm exec nuxt prepare`** - CRITICAL for generating `.nuxt/eslint.config.mjs`
3. ESLint
4. Prettier format check
5. TypeScript type check

### frontend-build
- Verifies production build succeeds

### docker-build
- Validates Docker images build correctly

## Critical Configuration Requirements

### Frontend ESLint Setup
The frontend MUST have these configurations or ESLint will fail:

**In `frontend/nuxt.config.ts`:**
```typescript
modules: ['@nuxt/eslint']  // REQUIRED
```

**In CI/CD before running lint:**
```bash
pnpm exec nuxt prepare  // Generates .nuxt/eslint.config.mjs
```

**Reason**: Nuxt 4's ESLint config imports from `.nuxt/eslint.config.mjs` which is only generated when:
1. The `@nuxt/eslint` module is registered in nuxt.config.ts
2. `nuxt prepare` or `postinstall` has been run

### Database Migration in CI
Backend tests MUST run migrations before tests:
```yaml
- name: Run database migrations
  run: pnpm run db:migrate
  env:
    DATABASE_URL: postgres://postgres:postgres@localhost:5432/todo_db_test
```

This creates the `todos` table required by tests.

### Prettier Formatting
Drizzle-generated JSON files in `backend/drizzle/meta/` must have trailing newlines or CI `format:check` will fail. Run `pnpm run format` in backend after generating migrations.

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/todo_db
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```bash
NUXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## Testing

### Backend Tests (`backend/src/routes/todos.test.ts`)
- Uses Vitest + Supertest
- Tests against actual PostgreSQL database (not mocked)
- Requires migrations to be run before tests
- Covers:
  - CRUD operations (GET, POST, PUT, DELETE)
  - Validation errors (missing fields, invalid UUIDs, text length)
  - 404 handling
  - Health check endpoint

### Running Individual Tests
```bash
cd backend

# Run specific test file
pnpm test src/routes/todos.test.ts

# Run tests matching pattern
pnpm test --grep "should create"

# UI mode for debugging
pnpm test:ui
```

## Common Pitfalls

1. **Frontend lint fails in CI**: Forgot to add `@nuxt/eslint` to modules or run `nuxt prepare`
2. **Backend tests fail in CI**: Forgot migration step before running tests
3. **Format check fails**: Drizzle meta JSON files missing trailing newlines
4. **Pre-commit fails**: Fix issues rather than bypassing with `--no-verify`
5. **Docker build fails**: Likely missing `pnpm install` or changed dependencies - rebuild with `--no-cache`

## API Documentation

Swagger UI available at `http://localhost:3001/api-docs` when backend is running.

OpenAPI 3.0 specification defined in `backend/src/openapi.ts`.

## Package Manager

This project uses **pnpm** exclusively. Commands use `pnpm` not `npm` or `yarn`.

Node.js version: 22 (specified in GitHub Actions and Dockerfiles)
