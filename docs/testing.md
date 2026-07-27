# Testing Strategy & Automated Suite

## Test Architecture

- **Unit Tests**: Test core domain logic (`AvailabilityEngine`, `PrescriptionsService` allergy warning checker, `TenantGuard`, `BillingService` decimal arithmetic).
- **Integration Tests**: Supertest HTTP endpoints with live or mock PostgreSQL database connections.
- **End-to-End Tests**: Playwright browser flows.

## Executing Tests

```bash
# Unit Tests
npx pnpm test:unit

# Type Check
npx pnpm typecheck

# Linting
npx pnpm lint
```
