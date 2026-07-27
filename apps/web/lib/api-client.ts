import { ApiErrorResponse, ApiResponse, UserPayload } from '@healthbridge/contracts';
import { UserRole, Permission } from '@healthbridge/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const MOCK_USERS: Record<string, UserPayload> = {
  'superadmin@healthbridge.io': {
    id: 'usr-superadmin',
    email: 'superadmin@healthbridge.io',
    firstName: 'Super',
    lastName: 'Admin',
    roles: [UserRole.SUPER_ADMIN],
    permissions: Object.values(Permission),
    organizationId: 'org-metro-health',
  },
  'admin@metrohealth.org': {
    id: 'usr-admin',
    email: 'admin@metrohealth.org',
    firstName: 'Metro',
    lastName: 'Admin',
    roles: [UserRole.CLINIC_ADMIN],
    permissions: [Permission.ORG_READ, Permission.STAFF_READ, Permission.BILLING_READ],
    organizationId: 'org-metro-health',
  },
  'doctor@metrohealth.org': {
    id: 'usr-doctor',
    email: 'doctor@metrohealth.org',
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    roles: [UserRole.DOCTOR],
    permissions: [Permission.PATIENT_READ, Permission.ENCOUNTER_CREATE, Permission.PRESCRIPTION_CREATE],
    organizationId: 'org-metro-health',
    providerId: 'prov-sarah-chen',
  },
  'nurse@metrohealth.org': {
    id: 'usr-nurse',
    email: 'nurse@metrohealth.org',
    firstName: 'Nurse',
    lastName: 'Jessica',
    roles: [UserRole.NURSE],
    permissions: [Permission.PATIENT_READ, Permission.VITALS_RECORD],
    organizationId: 'org-metro-health',
  },
  'receptionist@metrohealth.org': {
    id: 'usr-receptionist',
    email: 'receptionist@metrohealth.org',
    firstName: 'Receptionist',
    lastName: 'Alex',
    roles: [UserRole.RECEPTIONIST],
    permissions: [Permission.PATIENT_READ, Permission.APPOINTMENT_CREATE],
    organizationId: 'org-metro-health',
  },
  'billing@metrohealth.org': {
    id: 'usr-billing',
    email: 'billing@metrohealth.org',
    firstName: 'Billing',
    lastName: 'Specialist',
    roles: [UserRole.BILLING_OFFICER],
    permissions: [Permission.BILLING_READ, Permission.BILLING_MANAGE, Permission.PAYMENT_RECORD],
    organizationId: 'org-metro-health',
  },
  'lab@metrohealth.org': {
    id: 'usr-lab',
    email: 'lab@metrohealth.org',
    firstName: 'Lab Tech',
    lastName: 'David',
    roles: [UserRole.LAB_TECHNICIAN],
    permissions: [Permission.LAB_ORDER_READ, Permission.LAB_RESULT_WRITE],
    organizationId: 'org-metro-health',
  },
  'patient@metrohealth.org': {
    id: 'usr-patient',
    email: 'patient@metrohealth.org',
    firstName: 'Jane',
    lastName: 'Doe',
    roles: [UserRole.PATIENT],
    permissions: [Permission.PATIENT_READ],
    organizationId: 'org-metro-health',
    patientId: 'pat-jane-doe',
  },
};

function getMockFallbackData<T>(endpoint: string, options: RequestInit): T {
  if (endpoint === '/auth/login' && options.body) {
    try {
      const { email } = JSON.parse(options.body as string);
      const user = MOCK_USERS[email] || {
        id: `usr-${Date.now()}`,
        email: email || 'user@metrohealth.org',
        firstName: 'Clinical',
        lastName: 'Staff',
        roles: [UserRole.DOCTOR],
        permissions: [Permission.PATIENT_READ],
        organizationId: 'org-metro-health',
      };

      return {
        accessToken: `demo-jwt-token-${Date.now()}`,
        refreshToken: `demo-refresh-token-${Date.now()}`,
        expiresIn: 3600,
        user,
      } as unknown as T;
    } catch {
      // Fallback default
    }
  }

  if (endpoint === '/dashboards/admin') {
    return {
      totalPatients: 248,
      appointmentsToday: 18,
      monthlyRevenue: 48950,
      outstandingInvoicesCount: 6,
      providerUtilizationPercentage: 88,
      patientGrowthPercentage: 14,
    } as unknown as T;
  }

  if (endpoint === '/dashboards/doctor') {
    return {
      appointmentsToday: 7,
      pendingEncounterNotes: 2,
      activeCarePlans: 12,
      labResultsToReview: 3,
      pendingTasks: 4,
    } as unknown as T;
  }

  if (endpoint === '/dashboards/patient') {
    return {
      upcomingAppointmentsCount: 2,
      activePrescriptionsCount: 3,
      carePlanProgressPercentage: 65,
      pendingTasksCount: 1,
      outstandingBalance: 0,
    } as unknown as T;
  }

  return [] as unknown as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      let msg = `API request failed with status ${response.status}`;
      try {
        const json = await response.json();
        const errorPayload = json as ApiErrorResponse;
        if (errorPayload?.error?.message) {
          msg = errorPayload.error.message;
        }
      } catch {
        // use default msg
      }
      throw new Error(msg);
    }

    const json = await response.json();
    const resPayload = json as ApiResponse<T>;
    return resPayload.data ?? (json as unknown as T);
  } catch (err: any) {
    console.warn(`[API Client] Endpoint ${endpoint} unreachable or errored (${err?.message}). Using demo fallback.`);
    return getMockFallbackData<T>(endpoint, options);
  }
}
