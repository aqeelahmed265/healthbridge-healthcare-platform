# HealthBridge Healthcare Management Platform

![HealthBridge Architecture](https://img.shields.io/badge/Architecture-Monorepo%20pnpm%20%2B%20Turborepo-0d9488)
![Stack](https://img.shields.io/badge/Stack-NestJS%20%7C%20Next.js%20%7C%20Prisma%20%7C%20PostgreSQL-14b8a6)
![Security](https://img.shields.io/badge/Security-Argon2%20%7C%20JWT%20Rotation%20%7C%20RBAC-0f766e)

HealthBridge is a full-stack, enterprise-grade healthcare management platform designed for multi-tenant clinic operations, patient record management, availability reconciliation, clinical encounters, care plans, prescriptions, laboratory workflows, medical document management, decimal-precise billing, and security audit logging.

---

## Key Features & Modules

- **Multi-Tenant Clinic Isolation**: Structural organization scoping across database queries, repositories, and context guards (`TenantGuard`).
- **Role-Based Access Control (RBAC)**: Centralized 8-role permission matrix (`Super Admin`, `Clinic Admin`, `Doctor`, `Nurse`, `Receptionist`, `Billing Officer`, `Lab Technician`, `Patient`).
- **Authentication Engine**: Argon2id password hashing, 15-minute JWT access tokens, 7-day refresh token rotation, failed login lockout (5 attempts), and DB session revocation.
- **Patient Directory & Timeline**: Auto-assigned Medical Record Numbers (`PAT-YYYYMMDD-XXXX`), demographics, insurance, allergies, chronic conditions, and consolidated chronological medical timeline.
- **Provider Availability Engine**: Reconciles clinic working hours, weekly provider schedules, approved time-off, and booking duration buffers to prevent double-booking race conditions.
- **Clinical Encounters & SOAP Notes**: Chief complaints, symptoms, vital signs tracking (systolic/diastolic, HR, Temp, SpO2, auto-calculated BMI), and ICD-10 diagnostic coding.
- **Care Plans & Milestones**: Clinical condition tracking, milestone progress percentage calculation, overdue alert evaluations, and task management.
- **Prescriptions & Allergy Warnings**: Medication catalog ordering with real-time cross-referencing against documented patient drug allergies.
- **Laboratory Module**: Lab test catalog, ordering, specimen collection, lab technician result entry, abnormal flags (`NORMAL`, `HIGH`, `LOW`, `CRITICAL`), and reference ranges.
- **Medical Document Management**: MinIO presigned upload/download S3 URLs with MIME-type validation, 15MB size limits, and download audit logging.
- **Financial Ledger & Billing**: Subtotal, tax, discount, partial payments, and refund calculations using exact `Decimal.js` arithmetic.
- **Role-Tailored Dashboards**: Real aggregate backend API metrics for all 8 system roles.
- **Security Audit Logs**: Immutable audit trails recording actor email, resource target, IP address, and timestamp.

---

## Technology Stack

- **Monorepo**: `pnpm` workspaces + `Turborepo` + TypeScript strict mode.
- **Backend API**: NestJS, Prisma ORM, Passport JWT, Argon2, BullMQ, Swagger/OpenAPI.
- **Frontend App**: Next.js 14 (App Router), React, Tailwind CSS, TanStack Query, React Hook Form, Zod, Zustand, Lucide Icons.
- **Database & Services**: PostgreSQL 16, Redis 7, MinIO S3 Object Store.
- **Testing & CI**: Jest, Supertest, Playwright, GitHub Actions.

---

## Repository Structure

```
healthbridge/
├── apps/
│   ├── web/                     # Next.js 14 App Router Frontend
│   │   ├── app/                 # Public & Dashboard pages
│   │   ├── components/          # Dashboard layout & widgets
│   │   ├── lib/                 # API client wrapper
│   │   ├── providers/           # QueryProvider
│   │   └── stores font/         # Zustand auth store
│   └── api/                     # NestJS Backend REST API
│       ├── src/
│       │   ├── common/          # Guards, Filters, Interceptors, Decorators
│       │   ├── database/        # PrismaService & Module
│       │   ├── infrastructure/  # Storage (MinIO) & Background Queues
│       │   └── modules/         # Auth, Patients, Appointments, Encounters, etc.
│       └── test/                # Unit & Integration test specifications
├── packages/
│   ├── contracts/               # Shared API contracts & DTO types
│   ├── shared/                  # Domain enums, roles, permissions, error codes
│   ├── ui/                      # Shared accessible UI components
│   ├── eslint-config/           # Monorepo ESLint configurations
│   └── typescript-config/       # Shared tsconfig definitions
├── prisma/
│   ├── schema.prisma            # Normalized database schema (38+ entities)
│   └── seed.ts                  # Deterministic database seed script
├── docs/                        # Architectural documentation & ERDs
├── docker-compose.yml           # Postgres 16, Redis 7, MinIO local environment
├── pnpm-workspace.yaml          # Workspace configuration
├── turbo.json                   # Pipeline configuration
└── README.md
```

---

## Local Development Quickstart

### Prerequisites
- Node.js >= 18.0.0
- Docker & Docker Compose
- pnpm (`npm install -g pnpm` or `npx pnpm`)

### 1. Start Infrastructure Services
```bash
docker compose up -d
```

### 2. Install Monorepo Dependencies
```bash
npx pnpm install
```

### 3. Run Database Migrations & Deterministic Seed
```bash
npx pnpm db:migrate
npx pnpm db:seed
```

### 4. Start Monorepo Applications
```bash
npx pnpm dev
```
- **Next.js Web Application**: http://localhost:3000
---

## Demo Accounts

All demo accounts use the standard development password: `HealthBridge123!`

| Role | Email Address | Description |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@healthbridge.io` | Full platform administrative access |
| **Clinic Admin** | `admin@metrohealth.org` | Metropolitan Health System administrator |
| **Doctor** | `doctor@metrohealth.org` | Dr. Sarah Jenkins (Cardiology) |
| **Nurse** | `nurse@metrohealth.org` | Nurse Elena Rostova |
| **Receptionist** | `receptionist@metrohealth.org` | Marcus Vance (Check-ins & Registration) |
| **Billing Officer** | `billing@metrohealth.org` | Rachel Green (Invoices & Refunds) |
| **Lab Technician** | `lab@metrohealth.org` | David Chen (Sample processing) |
| **Patient** | `patient@metrohealth.org` | John Doe (Patient portal access) |

---

## Verification & Automated Testing

Execute full automated verification commands:

```bash
# Run Type Checking across monorepo
npx pnpm typecheck

# Run ESLint across monorepo
npx pnpm lint

# Run Unit Tests
npx pnpm test:unit

# Run Production Builds
npx pnpm build
```

---

## Security & HIPAA Statement

> [!IMPORTANT]
> **HealthBridge demonstrates HIPAA-conscious technical controls (Access Control, Audit Controls, Integrity Controls, and Transmission Security), but requires formal legal, operational, cloud infrastructure, privacy, and security compliance auditing before processing real Protected Health Information (PHI).**
