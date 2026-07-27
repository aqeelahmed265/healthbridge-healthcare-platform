# Security Architecture & Technical Controls

## Authentication Architecture
- **Argon2 Hashing**: User passwords are stored as Argon2id hashes.
- **JWT Access Tokens**: Short-lived (15 minutes) bearer tokens containing minimal claims (`sub`, `email`, `organizationId`, `roles`).
- **Refresh Token Rotation**: Long-lived (7 days) refresh tokens stored as SHA-256 hashes in `RefreshSession`. Old session is revoked on rotation.
- **Lockout Policy**: 5 failed login attempts lock account for 15 minutes.

## Authorization & Multi-Tenancy
- **Tenant Isolation**: Handled via `TenantGuard` and organization relation indexing in PostgreSQL.
- **RBAC**: Guarded via `@RequirePermissions(...)` and NestJS `PermissionsGuard`.

## Audit Control
- Every mutating request is logged into `AuditLog` table capturing user, action name, resource target, IP address, and timestamp.
