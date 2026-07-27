'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { Building2, MapPin, Layers, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { data: orgProfile } = useQuery<any>({
    queryKey: ['org-profile'],
    queryFn: () => apiRequest('/organizations/profile'),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Clinic Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Multi-tenant profile, clinic locations, and department structures
        </p>
      </div>

      {/* Organization Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{orgProfile?.name || 'Metropolitan Health System'}</h2>
            <p className="text-xs text-slate-400">Org Code: <span className="font-mono text-teal-400">{orgProfile?.code || 'ORG-METRO'}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Contact Email</span>
            <span className="text-slate-200 font-medium">{orgProfile?.email || 'contact@metrohealth.org'}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Phone</span>
            <span className="text-slate-200 font-medium">{orgProfile?.phone || '+1 (555) 019-2831'}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Headquarters</span>
            <span className="text-slate-200 font-medium">{orgProfile?.address || '100 Medical Center Way'}, {orgProfile?.city || 'New York'}</span>
          </div>
        </div>
      </div>

      {/* Clinic Locations */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-teal-400" />
          <span>Active Clinic Locations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgProfile?.locations?.map((loc: any) => (
            <div key={loc.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{loc.name}</h4>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase font-bold">
                  {loc.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">{loc.address}, {loc.city}, {loc.state} {loc.zipCode}</p>
              <p className="text-[10px] text-slate-500">Timezone: {loc.timeZone}</p>
            </div>
          )) || (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-xs">
              Metropolitan Main Campus, Metropolitan West Pavilion
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
