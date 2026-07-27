# Security Policy & HIPAA Technical Statement

## Technical Controls Implemented

HealthBridge implements modern security controls for multi-tenant clinical software:
- **Authentication**: JWT access tokens (15-min expiration) with Refresh Token rotation (7-day expiration) stored in HTTP-only secure cookies and database session revocation.
- **Password Hashing**: Argon2id algorithm with memory cost and parallelization defaults.
- **Tenant Isolation**: Structural organization-scoped foreign key indexing and `TenantGuard` context interceptors.
- **Role-Based Access Control (RBAC)**: Centralized permission registry mapped across 8 system roles.
- **Audit Logging**: Immutable audit log entries for all medical record access, prescriptions, payment operations, and document downloads without logging passwords, tokens, or financial secrets.
- **File Storage**: Time-limited presigned S3/MinIO upload/download URLs with MIME-type and 15MB file size validation.
- **Financial Math**: `Decimal.js` precision for all currency calculations.

## HIPAA Compliance Disclaimer

> [!IMPORTANT]
> **This project demonstrates HIPAA-conscious technical controls (Access Controls, Audit Controls, Integrity Controls, and Transmission Security), but requires formal legal, operational, cloud infrastructure, privacy, and security compliance auditing before processing real Protected Health Information (PHI).**

## Reporting Vulnerabilities

If you discover a security vulnerability, please send an email to `security@healthbridge.io`. Do not open public GitHub issues for security vulnerabilities.
