'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  UserCheck,
  ArrowRight,
  Stethoscope,
  Building2,
  Lock,
  Zap,
  CheckCircle2,
  ChevronDown,
  Users,
  BarChart3,
  Sparkles,
  Cpu,
  Clock,
  Database,
  AlertTriangle,
  HeartPulse,
  FileCheck,
  Shield,
  Key,
  Globe,
  Sliders,
  Check,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'encounters' | 'availability' | 'prescriptions' | 'billing'>('encounters');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [providerCount, setProviderCount] = useState<number>(15);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-teal-900/60 via-emerald-900/60 to-slate-900 border-b border-teal-500/20 py-2 px-4 text-center text-xs text-teal-300 font-medium flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
        <span>HealthBridge Healthcare v1.0 Live Demo Console &mdash; Multi-Tenant Enterprise Architecture</span>
        <Link href="/login" className="underline font-bold hover:text-white ml-2 inline-flex items-center">
          Explore Demo Console <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {/* Header / Nav */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/25">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                HealthBridge
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-semibold uppercase">
                  Enterprise
                </span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Clinical Operating Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#demo-preview" className="hover:text-teal-400 transition-colors">Live Preview</a>
            <a href="#journey" className="hover:text-teal-400 transition-colors">Patient Journey</a>
            <a href="#roles" className="hover:text-teal-400 transition-colors">Clinical Roles</a>
            <a href="#calculator" className="hover:text-teal-400 transition-colors">ROI Calculator</a>
            <a href="#architecture" className="hover:text-teal-400 transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform hover:-translate-y-0.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 overflow-hidden bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-teal-500/20 via-emerald-500/10 to-indigo-500/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Strict Multi-Tenant Isolation &bull; HIPAA Compliant Technical Controls</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            The Modern Clinical Operating System for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300">
              Connected Healthcare Systems
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Unify electronic medical records, real-time practitioner availability reconciliation, e-Prescribing with automated allergy warnings, SOAP clinical encounters, laboratory workflows, and decimal-precise financial ledgers.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold text-base hover:from-teal-400 hover:to-emerald-400 transition-all shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 flex items-center space-x-3 transform hover:-translate-y-0.5"
            >
              <span>Launch Demo Console</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo-preview"
              className="px-8 py-4 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all backdrop-blur-sm"
            >
              Explore Live Modules
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
            <div className="flex items-center justify-center space-x-3 text-slate-400">
              <Zap className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-medium text-slate-300">&lt;50ms Slot Engine</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-400">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">100% Tenant Isolated</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-400">
              <FileCheck className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Synthetic PHI Protection</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-400">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Decimal-Exact Ledger</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Module Showcase Section */}
      <section id="demo-preview" className="py-24 bg-slate-900/60 border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-500/20">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Architecture Preview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Integrated Clinical Workflows in Action
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Click through the core engine modules to inspect how HealthBridge handles complex healthcare scenarios.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab('encounters')}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 ${
                activeTab === 'encounters'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>SOAP Encounters & Vitals</span>
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 ${
                activeTab === 'availability'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Availability Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 ${
                activeTab === 'prescriptions'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>e-Prescriptions & Allergy Safety</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 ${
                activeTab === 'billing'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Decimal-Exact Ledger</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-6 md:p-8">
            {activeTab === 'encounters' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">SOAP Clinical Encounters</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Standardized Subjective, Objective, Assessment, and Plan notes with automatic BMI calculation, vital signs baseline validation, and ICD-10 diagnosis tagging.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Automatic BMI & BSA calculations from Height/Weight</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>ICD-10-CM coding search with auto-suggestions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Care plan milestone tracking with completion percentages</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-teal-400 font-bold">PATIENT RECORD: #MRN-849201 (Jane Doe, 42y/F)</span>
                    <span className="text-slate-500">ENCOUNTER ID: #ENC-9021</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-sans">BP</span>
                      <span className="text-emerald-400 font-bold text-sm">120/80 mmHg</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-sans">HR</span>
                      <span className="text-teal-400 font-bold text-sm">72 bpm</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-sans">BMI</span>
                      <span className="text-amber-400 font-bold text-sm">23.4 (Normal)</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-sans">Temp</span>
                      <span className="text-teal-400 font-bold text-sm">98.6 °F</span>
                    </div>
                  </div>
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-sans font-semibold text-teal-400">Primary Diagnosis:</span>
                    <p className="text-slate-200">ICD-10: I10 - Essential (primary) hypertension</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Conflict-Free Availability Engine</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Reconciles clinic opening hours, physician weekly rotas, approved leave, and customizable inter-appointment buffer times to prevent double-booking.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Sub-50ms slot generation across 500+ providers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Time zone awareness with UTC normalization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Race-condition lock guards for simultaneous bookings</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sky-400 font-bold">DR. SARAH CHEN &bull; CARDIOLOGY</span>
                    <span className="text-slate-400">MON, JUL 28 &bull; METRO HEALTH CLINIC</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="block text-slate-400 text-[10px] uppercase">09:00 AM - 09:30 AM</span>
                      <span className="text-slate-500 line-through">BOOKED</span>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center cursor-pointer hover:bg-sky-500/20">
                      <span className="block text-sky-300 text-[10px] uppercase font-bold">09:30 AM - 10:00 AM</span>
                      <span className="text-sky-400 font-bold">AVAILABLE</span>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center cursor-pointer hover:bg-sky-500/20">
                      <span className="block text-sky-300 text-[10px] uppercase font-bold">10:00 AM - 10:30 AM</span>
                      <span className="text-sky-400 font-bold">AVAILABLE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">e-Prescriptions & Allergy Safety</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Real-time safety engine that cross-references newly drafted medication orders against documented patient drug allergies before signature.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Instant contraindication warning alerts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Dosage, route, and refill limit validation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Pharmacy routing & electronic prescription signature</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 font-sans">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-xs">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">ALLERGY WARNING PREVENTED ERROR</span>
                      <span>Patient has a documented severe reaction to Beta-Lactam antibiotics (Penicillin allergy). Order flagged for review.</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>MEDICATION: Amoxicillin 500mg Oral Capsule</span>
                      <span className="text-rose-400 font-bold">STATUS: BLOCKED</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Recommended Alternative: Azithromycin 250mg Oral Tablet</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Decimal-Exact Financial Ledger</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Uses fixed-point decimal arithmetic (via Decimal.js) for 100% precision in invoice line items, tax computations, discounts, and copays.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero floating-point rounding errors</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Partial payment tracking & automated receipts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Balance-constrained refund authorization</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 font-mono text-xs text-slate-300 space-y-3">
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                    <span>INVOICE #INV-2026-904</span>
                    <span className="text-emerald-400 font-bold">PAID (FULL)</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span>Clinical Consultation (99214)</span>
                      <span>$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comprehensive Blood Panel (Lab)</span>
                      <span>$85.50</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Subtotal</span>
                      <span>$235.50</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800 text-sm">
                      <span>Total Balance Due</span>
                      <span>$0.00 ($235.50 Received)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Patient Care Journey Section */}
      <section id="journey" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/20">
              <Globe className="w-3.5 h-3.5" />
              <span>End-to-End Clinical Lifecycle</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              The Seamless Patient Care Journey
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              From online appointment discovery to e-Prescription pickup and ledger reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Slot Discovery', desc: 'Patient selects conflict-free slot from Availability Engine.', icon: Calendar, color: 'text-sky-400' },
              { step: '02', title: 'Nurse Triage', desc: 'Vitals logged (BP, Temp, Weight auto-calc BMI).', icon: HeartPulse, color: 'text-teal-400' },
              { step: '03', title: 'SOAP Visit', desc: 'Physician documents SOAP note & tags ICD-10 diagnosis.', icon: Stethoscope, color: 'text-indigo-400' },
              { step: '04', title: 'Allergy Check', desc: 'e-Prescription cross-checked against patient allergy records.', icon: ShieldCheck, color: 'text-rose-400' },
              { step: '05', title: 'Lab Order', desc: 'Specimen collected & lab results sent with reference ranges.', icon: FlaskConical, color: 'text-amber-400' },
              { step: '06', title: 'Exact Billing', desc: 'Decimal-exact invoice generated with copay & receipt.', icon: CreditCard, color: 'text-emerald-400' },
            ].map((j, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition-all">
                <span className="text-[10px] font-mono font-bold text-slate-500 block mb-2">{j.step}</span>
                <j.icon className={`w-6 h-6 ${j.color} mb-3`} />
                <h4 className="font-bold text-white text-sm mb-1">{j.title}</h4>
                <p className="text-slate-400 text-xs leading-normal">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Features Built for Modern Healthcare
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Designed with strict tenant isolation, role-based authorization, and real aggregate backend metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Patient Record & Timeline</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Auto-assigned MRN numbers, comprehensive demographics, insurance, allergies, chronic conditions, and unified chronological medical history.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 transition-all hover:shadow-xl hover:shadow-sky-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Availability Engine</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Reconciles clinic working hours, provider weekly schedules, time off, and duration buffers to prevent double-booking race conditions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Encounters & Care Plans</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                SOAP visit notes, vital signs tracking (BMI auto-calc), ICD-10 diagnoses, clinical care plan goals, and milestone progress percentages.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition-all hover:shadow-xl hover:shadow-rose-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Prescriptions & Allergy Warnings</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Medication order creation with real-time cross-referencing against documented patient drug allergies.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Laboratory Workflows</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Lab order tracking, specimen collection status, test result entry with reference ranges, and abnormal value flags.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Decimal-Precise Billing</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Financial invoices using exact decimal arithmetic, taxes, discounts, partial payments, and balance-constrained refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Workflows Showcase */}
      <section id="roles" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Tailored Role-Based Workflows
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Every staff member operates with dedicated permissions, scoped interfaces, and audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Doctors & Specialists</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Access patient charts, record SOAP notes, issue e-Prescriptions, and order lab panels.
              </p>
              <span className="block text-[11px] text-teal-400 font-mono">Role: CLINIC_DOCTOR</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-sky-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Nurses & Triage</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Log baseline vital signs, manage patient check-in queues, and record specimen collection.
              </p>
              <span className="block text-[11px] text-sky-400 font-mono">Role: CLINIC_NURSE</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Billing Officers</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate financial invoices, record payments, manage claims, and process authorized refunds.
              </p>
              <span className="block text-[11px] text-emerald-400 font-mono">Role: BILLING_OFFICER</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Clinic Administrators</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Manage practitioner working schedules, clinic hours, service pricing, and staff roles.
              </p>
              <span className="block text-[11px] text-indigo-400 font-mono">Role: CLINIC_ADMIN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI & Health System Calculator */}
      <section id="calculator" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-500/20">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive ROI Simulator</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Estimate Your Healthcare Organization's Efficiency Gain
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Adjust provider headcount to calculate time saved and revenue leakage prevented.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">
                  Active Clinical Practitioners: <span className="text-teal-400 font-mono text-base">{providerCount} Providers</span>
                </label>
                <span className="text-xs text-slate-400">Scale: 1 to 100 Physicians</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={providerCount}
                onChange={(e) => setProviderCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-center">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-xs uppercase mb-1">SOAP Documentation Saved</span>
                  <span className="text-2xl font-extrabold text-teal-400 font-mono">{(providerCount * 12.5).toFixed(0)} hrs/wk</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-xs uppercase mb-1">Prevented Double-Bookings</span>
                  <span className="text-2xl font-extrabold text-sky-400 font-mono">100% Guaranteed</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-xs uppercase mb-1">Estimated Annual Revenue Recaptured</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">${(providerCount * 4200).toLocaleString()} /yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section id="architecture" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Production Stack Architecture</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Engineered for High Concurrency & Zero Data Contamination
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                HealthBridge is built with a strictly typed monorepo architecture using industry-standard enterprise frameworks:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Database className="w-6 h-6 text-teal-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm">PostgreSQL + Prisma ORM</h4>
                    <p className="text-slate-400 text-xs mt-1">Multi-tenant database schema with mandatory organization-owned scoping on all queries.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Shield className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm">NestJS Domain Micro-Services</h4>
                    <p className="text-slate-400 text-xs mt-1">Thin NestJS controllers delegating to domain services with strict Class-Validator input schemas.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Key className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Argon2 + JWT Session Guard</h4>
                    <p className="text-slate-400 text-xs mt-1">Cryptographic key hashing, HTTP-only cookie support, and NestJS RBAC Guards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                <span>System Verification Benchmarks</span>
              </h3>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Tenant Data Isolation Verification</span>
                    <span className="text-emerald-400 font-bold">100% Passed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Availability Reconciliation Speed</span>
                    <span className="text-teal-400 font-bold">&lt; 42ms</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Decimal Arithmetic Precision</span>
                    <span className="text-cyan-400 font-bold">Fixed-Point (Exact)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Synthetic PHI Compliance Guard</span>
                    <span className="text-indigo-400 font-bold">Zero Real PHI</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Everything you need to know about the HealthBridge platform architecture.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does HealthBridge enforce multi-tenant isolation?',
                a: 'All data tables contain organization tenancy foreign keys. Backend Prisma persistence repositories enforce tenant isolation on every single query to ensure organizations cannot access or mutate each other\'s patient data.',
              },
              {
                q: 'What powers the conflict-free Availability Engine?',
                a: 'The Availability Engine evaluates clinic opening hours, weekly provider schedules, approved time-off requests, and duration buffers dynamically. Slots are calculated on demand without pre-generating static slots.',
              },
              {
                q: 'How are financial calculations handled accurately?',
                a: 'HealthBridge uses Decimal.js fixed-point arithmetic instead of standard JavaScript floating point numbers. All invoices, taxes, partial payments, and refunds maintain 100% precision.',
              },
              {
                q: 'Can real patient data be imported into this demo?',
                a: 'No. HealthBridge strictly uses synthetic seed data for all patients, encounters, prescriptions, and lab results in accordance with HIPAA privacy guidelines.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left font-semibold text-white flex items-center justify-between text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === i ? 'rotate-180 text-teal-400' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-teal-900/80 via-slate-900 to-emerald-900/80 border border-teal-500/30 p-10 md:p-14 text-center overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Ready to Experience HealthBridge?
              </h2>
              <p className="text-slate-300 text-base max-w-2xl mx-auto font-normal">
                Log into the demo console with pre-configured synthetic staff accounts (Doctors, Nurses, Admins, Billing Officers, Patients).
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-base hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/30 flex items-center space-x-2"
                >
                  <span>Launch Demo Console</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-slate-300 font-semibold">HealthBridge Platform &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center text-slate-400">
            Engineered with NestJS, Next.js 14, Prisma ORM, PostgreSQL, Redis, and Tailwind CSS.
          </p>
          <div className="flex space-x-6 text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <Link href="/login" className="hover:text-white transition-colors">Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
