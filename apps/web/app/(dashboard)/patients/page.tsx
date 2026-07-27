'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { Search, UserPlus, FileText, ArrowRight, User } from 'lucide-react';
import { PatientSummaryDto, PaginatedResponse } from '@healthbridge/contracts';

export default function PatientsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery<PaginatedResponse<PatientSummaryDto>>({
    queryKey: ['patients-list', search, page],
    queryFn: () => apiRequest(`/patients?search=${encodeURIComponent(search)}&page=${page}&limit=10`),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Patient Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Search medical record numbers (MRN), demographics, and clinical timelines
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, MRN, or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading patient records...</div>
        ) : !response?.data || response.data.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No patient records found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting search parameters</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">MRN</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Gender / DOB</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {response.data.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-teal-400">
                    {patient.mrn}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {patient.gender} | {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    <div>{patient.email}</div>
                    <div className="text-slate-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold border border-teal-500/20 transition-all"
                    >
                      <span>Timeline & Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
