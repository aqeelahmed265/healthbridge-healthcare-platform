'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';
import { FolderLock, Download, File, Lock, Upload } from 'lucide-react';

export default function DocumentsPage() {
  const { data: documents, isLoading } = useQuery<any[]>({
    queryKey: ['documents-list'],
    queryFn: () => apiRequest('/documents'),
  });

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const res = await apiRequest<{ downloadUrl: string }>(`/documents/${docId}/download-url`);
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      }
    } catch (err: any) {
      alert(`Failed to fetch secure download link: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Medical Document Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Time-limited signed MinIO access links with download audit logging
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading medical documents...</div>
        ) : !documents || documents.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
            <FolderLock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No medical documents uploaded</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{doc.fileName}</h3>
                  <p className="text-xs text-slate-400">
                    Category: <span className="text-slate-200 font-medium">{doc.category}</span> | Size: {(doc.fileSize / 1024).toFixed(1)} KB | Uploaded by: {doc.uploadedBy}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc.id, doc.fileName)}
                className="px-3.5 py-2 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 text-xs font-semibold flex items-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Signed Download</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
