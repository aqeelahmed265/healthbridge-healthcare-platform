'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery<any[]>({
    queryKey: ['notifications-list'],
    queryFn: () => apiRequest('/notifications'),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiRequest('/notifications/read-all', { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Appointment reminders, lab result alerts, and milestone updates
          </p>
        </div>

        <button
          onClick={() => markAllReadMutation.mutate()}
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all"
        >
          <CheckCheck className="w-4 h-4 text-teal-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading notifications...</div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <Bell className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                notif.read
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                  : 'bg-slate-950 border-teal-500/30 text-white shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-900 text-slate-500' : 'bg-teal-500/10 text-teal-400'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
