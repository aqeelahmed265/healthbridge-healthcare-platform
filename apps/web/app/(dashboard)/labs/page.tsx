'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { FlaskConical, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LabsPage() {
  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ['lab-orders-list'],
    queryFn: () => apiRequest('/labs/orders'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Laboratory Workflows & Orders</h1>
        <p className="text-sm text-slate-400 mt-1">
          Sample processing, technician result entry, reference ranges, and abnormal flags
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading lab orders...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <FlaskConical className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No laboratory orders recorded</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Patient: {order.patient?.firstName} {order.patient?.lastName} ({order.patient?.mrn})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ordered By: Dr. {order.provider?.user?.lastName} | Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold uppercase">
                  {order.status}
                </span>
              </div>

              {/* Lab Order Items */}
              <div className="space-y-2">
                {order.items?.map((item: any) => {
                  const res = item.result;
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.labTest?.name}</p>
                        <p className="text-xs text-slate-400">Specimen: {item.labTest?.specimenType} | Ref Range: {item.labTest?.referenceRange}</p>
                      </div>

                      {res ? (
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="font-mono text-sm font-bold text-teal-300">{res.resultValue} {res.unit}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              res.flag === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {res.flag}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">Performed by {res.performedBy}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Awaiting lab result entry</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
