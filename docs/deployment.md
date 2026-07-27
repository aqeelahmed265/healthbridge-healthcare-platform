# Deployment & Infrastructure Guide

## Docker Environment

Start background PostgreSQL 16, Redis 7, and MinIO S3 object store:

```bash
docker compose up -d
```

## Production Build

```bash
npx pnpm build
```

The output artifacts are located in:
- `apps/api/dist/main.js` (NestJS production server)
- `apps/web/.next` (Next.js production web server)
