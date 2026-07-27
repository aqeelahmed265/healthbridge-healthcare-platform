'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { HeartPulse, CheckCircle2, Circle, Clock } from 'lucide-react';

export default function CarePlansPage() {
  const queryClient = useQueryClient();

  const { data: carePlans, isLoading } = useQuery<any[]>({
    queryKey: ['care-plans-list'],
    queryFn: () => apiRequest('/care-plans'),
  });

  const completeMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      apiRequest(`/care-plans/milestones/${milestoneId}/complete`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-plans-list'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Clinical Care Plans & Goals</h1>
        <p className="text-sm text-slate-400 mt-1">
          Patient disease management programs, milestone tracking, and progress calculations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading care plans...</div>
        ) : !carePlans || carePlans.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <HeartPulse className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No active care plans</p>
          </div>
        ) : (
          carePlans.map((plan) => (
            <div key={plan.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold uppercase">
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Condition: <span className="text-slate-200 font-medium">{plan.condition}</span> | Patient: {plan.patient?.firstName} {plan.patient?.lastName}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full md:w-48 bg-slate-900 rounded-full h-3.5 border border-slate-800 overflow-hidden relative">
                  <div
                    className="bg-teal-400 h-full transition-all duration-500"
                    style={{ width: `${plan.progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                    {plan.progress}% Complete
                  </span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestones & Action Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.milestones?.map((m: any) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => !m.completed && completeMilestoneMutation.mutate(m.id)}
                          disabled={m.completed}
                          className="text-slate-500 hover:text-teal-400 transition-colors"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                        <div>
                          <p className={`text-xs font-medium ${m.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Due: {new Date(m.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
