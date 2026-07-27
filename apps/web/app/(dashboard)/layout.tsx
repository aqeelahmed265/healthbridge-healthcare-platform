'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/auth-store';
import {
  Activity,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  FlaskConical,
  CreditCard,
  FolderLock,
  ShieldCheck,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  HeartPulse,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Encounters', href: '/encounters', icon: Stethoscope },
  { name: 'Care Plans', href: '/care-plans', icon: HeartPulse },
  { name: 'Prescriptions', href: '/prescriptions', icon: FileText },
  { name: 'Lab Orders', href: '/labs', icon: FlaskConical },
  { name: 'Documents', href: '/documents', icon: FolderLock },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Audit Logs', href: '/audit-logs', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/dashboard';
  const { user, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-4 shrink-0">
        <div className="flex items-center space-x-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">HealthBridge</span>
            <span className="block text-[10px] text-teal-400 font-semibold tracking-wider uppercase">
              Clinical Platform
            </span>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-teal-400 font-medium uppercase tracking-wider truncate">
                  {user?.roles?.[0] || 'STAFF'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-wider">
                Metropolitan Health System
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/notifications"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900">{children}</main>
      </div>
    </div>
  );
}
