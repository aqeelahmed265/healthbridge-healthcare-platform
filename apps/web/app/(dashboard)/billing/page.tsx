'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { CreditCard, DollarSign, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  const { data: invoices, isLoading } = useQuery<any[]>({
    queryKey: ['invoices-list'],
    queryFn: () => apiRequest('/billing/invoices'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Financial Ledgers</h1>
          <p className="text-sm text-slate-400 mt-1">
            Decimal-precise invoices, payment recording, and balance reconciliation
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading billing records...</div>
        ) : !invoices || invoices.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <CreditCard className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No invoices issued</p>
          </div>
        ) : (
          invoices.map((inv) => {
            const total = parseFloat(inv.totalAmount);
            const paid = parseFloat(inv.paidAmount);
            const balance = total - paid;
            return (
              <div key={inv.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-semibold text-white">Invoice #{inv.invoiceNumber}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Patient: {inv.patient?.firstName} {inv.patient?.lastName} ({inv.patient?.mrn}) | Due Date: {new Date(inv.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-white">${total.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">
                      Paid: <span className="text-emerald-400 font-mono">${paid.toFixed(2)}</span> | Balance: <span className="text-amber-400 font-mono">${balance.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
                  {inv.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-slate-300">
                      <span>{item.description} (x{item.quantity})</span>
                      <span className="font-mono">${parseFloat(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
