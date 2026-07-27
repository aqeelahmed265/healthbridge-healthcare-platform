'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../../lib/api-client';
import {
  User,
  Activity,
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export default function PatientProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery<any>({
    queryKey: ['patient-timeline', id],
    queryFn: () => apiRequest(`/patients/${id}/timeline`),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Assembling patient clinical timeline...</div>;
  }

  const patient = data?.patient;
  const timeline = data?.timeline || [];

  return (
    <div className="space-y-8">
      {/* Patient Header Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-2xl uppercase">
              {patient?.firstName?.[0]}
              {patient?.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">
                  {patient?.firstName} {patient?.lastName}
                </h1>
                <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-semibold">
                  {patient?.mrn}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {patient?.gender} | DOB: {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : ''} | Blood Type: {patient?.bloodType || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Demographics Summary */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Email</span>
            <span className="text-slate-200 font-medium">{patient?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Phone</span>
            <span className="text-slate-200 font-medium">{patient?.phone}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Address</span>
            <span className="text-slate-200 font-medium">{patient?.address}, {patient?.city}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Allergies</span>
            <span className="text-rose-400 font-semibold">
              {patient?.allergies?.map((a: any) => a.allergen).join(', ') || 'No Known Allergies'}
            </span>
          </div>
        </div>
      </div>

      {/* Chronological Medical Timeline */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <span>Consolidated Medical Timeline</span>
        </h2>

        {timeline.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-sm">
            No clinical events recorded for this patient.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {timeline.map((event: any) => {
              const dateStr = new Date(event.timestamp).toLocaleString();
              return (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-slate-900" />
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                        {event.category}
                      </span>
                      <span className="text-xs text-slate-500">{dateStr}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{event.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
