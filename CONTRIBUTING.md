# Contributing to HealthBridge

Thank you for your interest in contributing to HealthBridge!

## Monorepo Workflow

We use `pnpm` workspaces and `Turborepo`.

1. Install dependencies:
   ```bash
   npx pnpm install
   ```
2. Start PostgreSQL, Redis, and MinIO:
   ```bash
   docker compose up -d
   ```
3. Run database migrations & seed:
   ```bash
   npx pnpm db:migrate
   npx pnpm db:seed
   ```
4. Start development mode:
   ```bash
   npx pnpm dev
   ```
5. Ensure all checks pass before submitting a PR:
   ```bash
   npx pnpm typecheck
   npx pnpm lint
   npx pnpm test
   npx pnpm build
   ```
