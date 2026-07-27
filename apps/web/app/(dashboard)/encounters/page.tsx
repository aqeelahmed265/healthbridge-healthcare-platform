'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { Stethoscope, Activity, FileText, CheckCircle } from 'lucide-react';

export default function EncountersPage() {
  const { data: encounters, isLoading } = useQuery<any[]>({
    queryKey: ['encounters-list'],
    queryFn: () => apiRequest('/encounters'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clinical Encounters & Notes</h1>
          <p className="text-sm text-slate-400 mt-1">
            SOAP visit notes, vital signs readings, and ICD-10 diagnostic coding
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading encounters...</div>
        ) : !encounters || encounters.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <Stethoscope className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No clinical encounters recorded</p>
          </div>
        ) : (
          encounters.map((enc) => {
            const vitals = enc.vitals?.[0];
            return (
              <div
                key={enc.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-white">
                      Patient: {enc.patient?.firstName} {enc.patient?.lastName} ({enc.patient?.mrn})
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        enc.status === 'COMPLETED' || enc.status === 'SIGNED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {enc.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(enc.encounterDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chief Complaint</h4>
                  <p className="text-sm text-slate-200 mt-0.5">{enc.chiefComplaint}</p>
                </div>

                {vitals && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block font-semibold">BP</span>
                      <span className="text-teal-300 font-mono">{vitals.systolicBp}/{vitals.diastolicBp} mmHg</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Pulse</span>
                      <span className="text-teal-300 font-mono">{vitals.heartRate} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Temp</span>
                      <span className="text-teal-300 font-mono">{vitals.tempCelsius}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">SpO2</span>
                      <span className="text-teal-300 font-mono">{vitals.spo2Percent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">BMI</span>
                      <span className="text-teal-300 font-mono">{vitals.bmi} kg/m²</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
