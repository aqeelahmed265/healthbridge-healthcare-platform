# Changelog

All notable changes to the HealthBridge platform will be documented in this file.

## [1.0.0] - 2026-07-27

### Added
- **Monorepo Architecture**: Integrated `pnpm` workspaces, `Turborepo`, TypeScript strict mode, NestJS API app, Next.js web app, and shared packages (`@healthbridge/contracts`, `@healthbridge/shared`, `@healthbridge/ui`).
- **Prisma Schema**: 38+ normalized entities with multi-tenant organization scoping, indexes, foreign keys, and decimal fields.
- **Authentication**: JWT access tokens, refresh token rotation with HTTP-only cookies, Argon2 password hashing, lockout after 5 failed attempts, and session revocation.
- **RBAC & Multi-Tenancy**: Centralized 8-role permission matrix, `PermissionsGuard`, and structural `TenantGuard`.
- **Clinical Modules**: Patient records with auto-generated MRN, Availability Reconciliation Engine, Appointment conflict detection, Encounters with vitals & ICD-10 diagnoses, Care Plans with milestone progress calculation, Prescriptions with real-time allergy warnings, and Laboratory workflows with abnormal result flags.
- **MinIO Object Store**: Presigned upload/download URLs with audit logging, 15MB file size limits, and MIME-type validation.
- **Decimal Billing Ledger**: Subtotal/tax/discount/payment/refund calculations using `Decimal.js`.
- **Dashboards**: Real backend aggregate endpoints for all 8 user roles.
- **Notifications & Audit Logs**: Immutable audit log viewer and in-app notification center.
- **CI/CD & Documentation**: GitHub Actions pipeline and complete documentation under `docs/`.
