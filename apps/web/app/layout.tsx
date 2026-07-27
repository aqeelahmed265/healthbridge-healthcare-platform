import React from 'react';
import './globals.css';
import { QueryProvider } from '../providers/query-provider';

export const metadata = {
  title: 'HealthBridge | Full-Stack Multi-Tenant Healthcare Management Platform',
  description:
    'Comprehensive healthcare platform providing clinical encounters, appointment scheduling, patient timelines, care plans, prescriptions, labs, billing, and audit logs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
