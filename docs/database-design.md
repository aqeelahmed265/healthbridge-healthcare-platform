# Database Design & Prisma ERD

## Core Data Entities

The HealthBridge database contains 38+ entities organized around multi-tenant organization scoping:

- **Organization Scoping**: All primary tables (`User`, `Patient`, `Appointment`, `ClinicalEncounter`, `CarePlan`, `Prescription`, `LabOrder`, `MedicalDocument`, `Invoice`, `AuditLog`) maintain indexed `organizationId` foreign key relations.
- **Audit Trails**: Changes to sensitive clinical records and payments are tracked in `AuditLog` records.
- **Financial Precision**: Money attributes use PostgreSQL `DECIMAL(12, 2)` mapped through `Decimal.js` to ensure exact calculations without IEEE 754 floating-point inaccuracies.

## ERD Mermaid Diagram

```mermaid
erDiagram
    ORGANIZATION ||--o{ CLINIC_LOCATION : operates
    ORGANIZATION ||--o{ USER : employs
    ORGANIZATION ||--o{ PATIENT : registers
    USER ||--o{ USER_ROLE : assigned
    ROLE ||--o{ USER_ROLE : defines
    USER ||--o| PROVIDER_PROFILE : maintains

    PATIENT ||--o{ APPOINTMENT : books
    PATIENT ||--o{ CLINICAL_ENCOUNTER : attends
    PATIENT ||--o{ CARE_PLAN : follows
    PATIENT ||--o{ PRESCRIPTION : receives
    PATIENT ||--o{ LAB_ORDER : undergoes
    PATIENT ||--o{ INVOICE : billed

    PROVIDER_PROFILE ||--o{ PROVIDER_SCHEDULE : publishes
    PROVIDER_PROFILE ||--o{ APPOINTMENT : conducts
    PROVIDER_PROFILE ||--o{ CLINICAL_ENCOUNTER : records

    CLINICAL_ENCOUNTER ||--o{ VITAL_READING : captures
    CLINICAL_ENCOUNTER ||--o{ DIAGNOSIS : codes

    INVOICE ||--o{ INVOICE_ITEM : itemizes
    INVOICE ||--o{ PAYMENT : collects
    INVOICE ||--o{ REFUND : credits
```
