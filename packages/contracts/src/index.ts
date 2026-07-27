import { UserRole, Permission, ErrorCode } from '@healthbridge/shared';

// API Standard Response Formats
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
  requestId: string;
}

export interface ApiErrorDetail {
  code: ErrorCode | string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
  requestId: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
  requestId: string;
}

// User & Auth Contracts
export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  permissions: Permission[];
  organizationId: string;
  patientId?: string;
  providerId?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserPayload;
}

// Patient Contracts
export interface PatientSummaryDto {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  organizationId: string;
  createdAt: string;
}

// Appointment Slot Contracts
export interface TimeSlotDto {
  startTime: string; // ISO String
  endTime: string; // ISO String
  available: boolean;
  providerId: string;
  locationId: string;
}

// Allergy Warning Output Contract
export interface AllergyWarningDto {
  hasWarning: boolean;
  allergen: string;
  severity: string;
  reaction: string;
  medicationName: string;
  recommendation: string;
}

// Dashboard Summary Contracts
export interface AdminDashboardMetricsDto {
  totalPatients: number;
  appointmentsToday: number;
  monthlyRevenue: number;
  outstandingInvoicesCount: number;
  providerUtilizationPercentage: number;
  patientGrowthPercentage: number;
}

export interface DoctorDashboardMetricsDto {
  appointmentsToday: number;
  pendingEncounterNotes: number;
  activeCarePlans: number;
  labResultsToReview: number;
  pendingTasks: number;
}

export interface PatientDashboardMetricsDto {
  upcomingAppointmentsCount: number;
  activePrescriptionsCount: number;
  carePlanProgressPercentage: number;
  pendingTasksCount: number;
  outstandingBalance: number;
}
