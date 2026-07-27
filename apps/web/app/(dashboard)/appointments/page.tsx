'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { Calendar, Plus, Clock, User, CheckCircle2, XCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const { data: appointments, isLoading } = useQuery<any[]>({
    queryKey: ['appointments-list'],
    queryFn: () => apiRequest('/appointments'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Appointment Calendar & Schedule</h1>
          <p className="text-sm text-slate-400 mt-1">
            Clinical visit management with conflict prevention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading appointments...</div>
        ) : !appointments || appointments.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No scheduled appointments</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold text-white">{apt.type}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : apt.status === 'SCHEDULED'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Patient: <span className="text-slate-200 font-medium">{apt.patient?.firstName} {apt.patient?.lastName} ({apt.patient?.mrn})</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Provider: <span className="text-slate-200 font-medium">Dr. {apt.provider?.user?.lastName}</span> | Location: {apt.location?.name}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div className="font-mono text-sm text-teal-300 font-semibold">
                  {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>{new Date(apt.startTime).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
