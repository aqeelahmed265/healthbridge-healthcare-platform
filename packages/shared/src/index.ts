// User Roles Definition
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLINIC_ADMIN = 'CLINIC_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  BILLING_OFFICER = 'BILLING_OFFICER',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PATIENT = 'PATIENT',
}

export { UserRole as UserRoleType };

// Domain Enums
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum EncounterStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SIGNED = 'SIGNED',
}

export enum CarePlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  EXPIRED = 'EXPIRED',
}

export enum LabOrderStatus {
  ORDERED = 'ORDERED',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  IN_ANALYSIS = 'IN_ANALYSIS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum LabResultFlag {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
  CRITICAL = 'CRITICAL',
}

export enum DocumentVisibility {
  CLINICAL_ONLY = 'CLINICAL_ONLY',
  STAFF_ONLY = 'STAFF_ONLY',
  PATIENT_ACCESSIBLE = 'PATIENT_ACCESSIBLE',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  VOID = 'VOID',
  OVERDUE = 'OVERDUE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  INSURANCE_CLAIM = 'INSURANCE_CLAIM',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  CAREPLAN_MILESTONE = 'CAREPLAN_MILESTONE',
  LAB_RESULT_READY = 'LAB_RESULT_READY',
  INVOICE_ISSUED = 'INVOICE_ISSUED',
  GENERAL_ALERT = 'GENERAL_ALERT',
}

// System Permission Registry
export enum Permission {
  // Organization & Settings
  ORG_MANAGE = 'org:manage',
  ORG_READ = 'org:read',

  // Staff & Providers
  STAFF_MANAGE = 'staff:manage',
  STAFF_READ = 'staff:read',
  PROVIDER_SCHEDULE_MANAGE = 'provider:schedule:manage',

  // Patients
  PATIENT_CREATE = 'patient:create',
  PATIENT_READ = 'patient:read',
  PATIENT_UPDATE = 'patient:update',
  PATIENT_DELETE = 'patient:delete',

  // Appointments
  APPOINTMENT_CREATE = 'appointment:create',
  APPOINTMENT_READ = 'appointment:read',
  APPOINTMENT_UPDATE = 'appointment:update',
  APPOINTMENT_CANCEL = 'appointment:cancel',

  // Encounters & Vitals
  ENCOUNTER_CREATE = 'encounter:create',
  ENCOUNTER_READ = 'encounter:read',
  ENCOUNTER_UPDATE = 'encounter:update',
  VITALS_RECORD = 'vitals:record',

  // Care Plans
  CAREPLAN_CREATE = 'careplan:create',
  CAREPLAN_READ = 'careplan:read',
  CAREPLAN_UPDATE = 'careplan:update',
  CAREPLAN_TASK_UPDATE = 'careplan:task:update',

  // Prescriptions
  PRESCRIPTION_CREATE = 'prescription:create',
  PRESCRIPTION_READ = 'prescription:read',
  PRESCRIPTION_DISCONTINUE = 'prescription:discontinue',

  // Laboratory
  LAB_ORDER_CREATE = 'lab:order:create',
  LAB_ORDER_READ = 'lab:order:read',
  LAB_RESULT_WRITE = 'lab:result:write',
  LAB_RESULT_VERIFY = 'lab:result:verify',

  // Medical Documents
  DOCUMENT_UPLOAD = 'document:upload',
  DOCUMENT_READ = 'document:read',
  DOCUMENT_DELETE = 'document:delete',

  // Billing & Invoices
  BILLING_MANAGE = 'billing:manage',
  BILLING_READ = 'billing:read',
  PAYMENT_RECORD = 'payment:record',

  // Audit Logs & Reports
  AUDIT_READ = 'audit:read',
  REPORTS_READ = 'reports:read',
}

// Role-to-Permissions Mapping Table
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  [UserRole.CLINIC_ADMIN]: [
    Permission.ORG_MANAGE,
    Permission.ORG_READ,
    Permission.STAFF_MANAGE,
    Permission.STAFF_READ,
    Permission.PROVIDER_SCHEDULE_MANAGE,
    Permission.PATIENT_READ,
    Permission.APPOINTMENT_READ,
    Permission.BILLING_READ,
    Permission.AUDIT_READ,
    Permission.REPORTS_READ,
  ],

  [UserRole.DOCTOR]: [
    Permission.ORG_READ,
    Permission.STAFF_READ,
    Permission.PROVIDER_SCHEDULE_MANAGE,
    Permission.PATIENT_READ,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_READ,
    Permission.APPOINTMENT_UPDATE,
    Permission.APPOINTMENT_CANCEL,
    Permission.ENCOUNTER_CREATE,
    Permission.ENCOUNTER_READ,
    Permission.ENCOUNTER_UPDATE,
    Permission.VITALS_RECORD,
    Permission.CAREPLAN_CREATE,
    Permission.CAREPLAN_READ,
    Permission.CAREPLAN_UPDATE,
    Permission.CAREPLAN_TASK_UPDATE,
    Permission.PRESCRIPTION_CREATE,
    Permission.PRESCRIPTION_READ,
    Permission.PRESCRIPTION_DISCONTINUE,
    Permission.LAB_ORDER_CREATE,
    Permission.LAB_ORDER_READ,
    Permission.LAB_RESULT_VERIFY,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_READ,
    Permission.REPORTS_READ,
  ],

  [UserRole.NURSE]: [
    Permission.ORG_READ,
    Permission.STAFF_READ,
    Permission.PATIENT_READ,
    Permission.APPOINTMENT_READ,
    Permission.ENCOUNTER_READ,
    Permission.VITALS_RECORD,
    Permission.CAREPLAN_READ,
    Permission.CAREPLAN_TASK_UPDATE,
    Permission.PRESCRIPTION_READ,
    Permission.LAB_ORDER_READ,
    Permission.DOCUMENT_READ,
  ],

  [UserRole.RECEPTIONIST]: [
    Permission.ORG_READ,
    Permission.STAFF_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_READ,
    Permission.APPOINTMENT_UPDATE,
    Permission.APPOINTMENT_CANCEL,
    Permission.BILLING_READ,
  ],

  [UserRole.BILLING_OFFICER]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.APPOINTMENT_READ,
    Permission.BILLING_MANAGE,
    Permission.BILLING_READ,
    Permission.PAYMENT_RECORD,
    Permission.REPORTS_READ,
  ],

  [UserRole.LAB_TECHNICIAN]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.LAB_ORDER_READ,
    Permission.LAB_RESULT_WRITE,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_READ,
  ],

  [UserRole.PATIENT]: [
    Permission.PATIENT_READ,
    Permission.APPOINTMENT_READ,
    Permission.CAREPLAN_READ,
    Permission.CAREPLAN_TASK_UPDATE,
    Permission.PRESCRIPTION_READ,
    Permission.LAB_ORDER_READ,
    Permission.DOCUMENT_READ,
    Permission.BILLING_READ,
  ],
};

// Domain Error Codes
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  TENANT_MISMATCH = 'TENANT_MISMATCH',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT = 'CONFLICT',
  APPOINTMENT_SLOT_UNAVAILABLE = 'APPOINTMENT_SLOT_UNAVAILABLE',
  ALLERGY_WARNING = 'ALLERGY_WARNING',
  CARE_PLAN_ARCHIVED = 'CARE_PLAN_ARCHIVED',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  REFUND_EXCEEDS_PAYMENT = 'REFUND_EXCEEDS_PAYMENT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

// Utility Domain Functions
export function formatMedicalRecordNumber(date: Date, seq: number): string {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const paddedSeq = seq.toString().padStart(4, '0');
  return `PAT-${yyyymmdd}-${paddedSeq}`;
}

export function formatInvoiceNumber(date: Date, seq: number): string {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const paddedSeq = seq.toString().padStart(4, '0');
  return `INV-${yyyymmdd}-${paddedSeq}`;
}
