# Product Requirements Document (PRD)

## Executive Overview
HealthBridge is an enterprise full-stack healthcare management platform built for clinic networks and hospital systems.

## Core Functional Modules
1. **Multi-Tenancy**: Organization boundary isolation for all patient records, encounters, prescriptions, and financial ledgers.
2. **Staff & Provider Management**: Profiles, department assignments, weekly availability schedules, time-off overrides.
3. **Patient Management & Clinical Timeline**: Patient onboarding, Medical Record Number generation (`PAT-YYYYMMDD-XXXX`), demographics, insurance policies, allergies, chronic conditions, and consolidated timeline.
4. **Appointment Availability Engine**: Slot reconciliation considering provider working hours, time-off, buffer times, and double-booking conflict prevention.
5. **Clinical Encounters & Notes**: Chief complaints, vitals tracking (systolic/diastolic, HR, Temp, SpO2, BMI), ICD-10 diagnoses, and signing status.
6. **Care Plans**: Condition management, goals, milestones, progress percentage calculations, overdue alerts, and task updates.
7. **Prescriptions**: Medication ordering with real-time patient drug allergy cross-referencing.
8. **Laboratory Module**: Lab catalog, specimen tracking, lab result entry, reference ranges, and abnormal result flags (`NORMAL`, `HIGH`, `LOW`, `CRITICAL`).
9. **Medical Documents**: MinIO presigned S3 upload/download URLs, 15MB file size limits, MIME type filtering, and access audit logging.
10. **Billing & Financial Ledger**: Decimal-precise subtotal/tax/discount/payment/refund logic.
11. **Dashboards**: Role-specific backend metric aggregation.
12. **Audit Logs**: Immutable audit recording of sensitive events.
