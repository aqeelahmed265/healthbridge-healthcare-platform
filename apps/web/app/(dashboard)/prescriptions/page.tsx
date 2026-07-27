'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { FileText, AlertTriangle, Pill, ShieldAlert } from 'lucide-react';

export default function PrescriptionsPage() {
  const { data: prescriptions, isLoading } = useQuery<any[]>({
    queryKey: ['prescriptions-list'],
    queryFn: () => apiRequest('/prescriptions'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prescriptions & Medication Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Active medication prescriptions and safety cross-referencing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading prescriptions...</div>
        ) : !prescriptions || prescriptions.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <Pill className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No medication orders found</p>
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Patient: {rx.patient?.firstName} {rx.patient?.lastName} ({rx.patient?.mrn})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Prescriber: Dr. {rx.provider?.user?.lastName} | Start Date: {new Date(rx.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase">
                  {rx.status}
                </span>
              </div>

              {/* Medication Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rx.items?.map((item: any) => (
                  <div key={item.id} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-3">
                    <Pill className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.medicationName}</p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Dosage: {item.dosage} | Frequency: {item.frequency} | Route: {item.route}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic">Instructions: {item.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
