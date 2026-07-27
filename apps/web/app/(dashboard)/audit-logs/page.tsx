'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { PaginatedResponse } from '@healthbridge/contracts';

export default function AuditLogsPage() {
  const { data: response, isLoading } = useQuery<PaginatedResponse<any>>({
    queryKey: ['audit-logs-list'],
    queryFn: () => apiRequest('/audit-logs?limit=25'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Access Audit Logs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Immutable audit records of medical record views, prescription creations, and payment operations
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading security logs...</div>
        ) : !response?.data || response.data.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No audit logs recorded</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User / Actor</th>
                <th className="px-6 py-4">Action Executed</th>
                <th className="px-6 py-4">Resource Target</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {response.data.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-teal-300 font-semibold">{log.userEmail || 'System'}</td>
                  <td className="px-6 py-4 text-white font-medium">{log.action}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {log.resourceType} ({log.resourceId})
                  </td>
                  <td className="px-6 py-4 text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
