# Permanent Engineering Rules for HealthBridge

1. Use TypeScript strict mode across all packages and applications.
2. Avoid `any` type usage. Use strict interfaces, generics, or `unknown` with type guards.
3. Never suppress TypeScript errors (`@ts-ignore`, `@ts-nocheck`) without a documented technical reason.
4. Keep NestJS controllers thin. Controllers only handle HTTP concerns, DTO mapping, and delegates to domain services.
5. Do not query Prisma directly from controllers; encapsulate database access in repositories or dedicated domain persistence services.
6. Keep database access inside repositories or dedicated persistence services.
7. Do not expose Prisma entities directly as API responses. Map entities to clean DTO response contracts.
8. Validate all external input using class-validator / Zod schemas.
9. Enforce role-based authorization on the backend using NestJS Guards.
10. Enforce tenant isolation for organization-owned data on all database queries.
11. Never use real patient data or real PHI. All seed and test data must be synthetic.
12. Never commit credentials, secrets, or API keys. Use environment variables.
13. Never report success without running the relevant verification commands (`pnpm test`, `pnpm build`, `pnpm lint`, `pnpm typecheck`).
14. Do not create placeholder implementations for core features.
15. Do not add fake API delays (`setTimeout`, arbitrary sleeps) in application logic.
16. Do not leave commented-out code in submitted pull requests or main branches.
17. Do not create huge monolithic service files (> 500 lines). Break down into domain sub-services.
18. Avoid generic helper files (`utils.ts`) containing unrelated functions. Group utilities by specific domains.
19. Use domain-specific operation names (`registerClinicPatient`, `scheduleClinicalVisit`, `issueMedicationOrder`).
20. Add meaningful unit and integration tests for all core business rules and edge cases.
21. Keep documentation synchronized with the implementation.
22. Do not fabricate command results, test results, users, customers, certifications, or production usage.
