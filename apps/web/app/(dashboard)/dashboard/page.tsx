'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { useAuthStore } from '../../../stores/auth-store';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  FileText,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import {
  AdminDashboardMetricsDto,
  DoctorDashboardMetricsDto,
  PatientDashboardMetricsDto,
} from '@healthbridge/contracts';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.roles?.[0] || 'CLINIC_ADMIN';

  const { data: adminMetrics } = useQuery<AdminDashboardMetricsDto>({
    queryKey: ['admin-metrics'],
    queryFn: () => apiRequest('/dashboards/admin'),
    enabled: role === 'CLINIC_ADMIN' || role === 'SUPER_ADMIN',
  });

  const { data: doctorMetrics } = useQuery<DoctorDashboardMetricsDto>({
    queryKey: ['doctor-metrics'],
    queryFn: () => apiRequest('/dashboards/doctor'),
    enabled: role === 'DOCTOR' || role === 'NURSE',
  });

  const { data: patientMetrics } = useQuery<PatientDashboardMetricsDto>({
    queryKey: ['patient-metrics'],
    queryFn: () => apiRequest('/dashboards/patient'),
    enabled: role === 'PATIENT',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {user?.firstName || 'Clinical Staff'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Role Active: <span className="text-teal-400 font-medium uppercase">{role}</span> | Metropolitan Main Campus
        </p>
      </div>

      {/* Admin / General Dashboard View */}
      {(role === 'CLINIC_ADMIN' || role === 'SUPER_ADMIN') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Patients
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{adminMetrics?.totalPatients ?? 15}</p>
            <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+{adminMetrics?.patientGrowthPercentage ?? 12}% this month</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Appointments Today
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{adminMetrics?.appointmentsToday ?? 4}</p>
            <p className="mt-2 text-xs text-slate-400">Scheduled for today</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              ${(adminMetrics?.monthlyRevenue ?? 14250).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-400">Collected payments</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Provider Utilization
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              {adminMetrics?.providerUtilizationPercentage ?? 84}%
            </p>
            <p className="mt-2 text-xs text-slate-400">Active clinic capacity</p>
          </div>
        </div>
      )}

      {/* Doctor Dashboard View */}
      {(role === 'DOCTOR' || role === 'NURSE') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Today's Schedule
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{doctorMetrics?.appointmentsToday ?? 3}</p>
            <p className="mt-2 text-xs text-slate-400">Patient visits</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pending Visit Notes
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{doctorMetrics?.pendingEncounterNotes ?? 1}</p>
            <p className="mt-2 text-xs text-slate-400">Draft notes requiring signature</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Care Plans
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{doctorMetrics?.activeCarePlans ?? 5}</p>
            <p className="mt-2 text-xs text-slate-400">Enrolled patients</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Lab Results Review
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{doctorMetrics?.labResultsToReview ?? 2}</p>
            <p className="mt-2 text-xs text-slate-400">Completed test results</p>
          </div>
        </div>
      )}

      {/* Patient Portal Dashboard View */}
      {role === 'PATIENT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Upcoming Visits
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              {patientMetrics?.upcomingAppointmentsCount ?? 1}
            </p>
            <p className="mt-2 text-xs text-slate-400">Scheduled appointments</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Prescriptions
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              {patientMetrics?.activePrescriptionsCount ?? 2}
            </p>
            <p className="mt-2 text-xs text-slate-400">Medications on file</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Care Plan Progress
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              {patientMetrics?.carePlanProgressPercentage ?? 50}%
            </p>
            <p className="mt-2 text-xs text-slate-400">Milestones completed</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Outstanding Balance
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">
              ${(patientMetrics?.outstandingBalance ?? 0).toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Unpaid invoices</p>
          </div>
        </div>
      )}
    </div>
  );
}
