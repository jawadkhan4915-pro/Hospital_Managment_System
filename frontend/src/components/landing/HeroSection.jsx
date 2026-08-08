import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Users, FileText, Building2, CheckCircle, Clock } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('facility');

  const VISUALS = {
    facility: {
      url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
      title: 'St. Jude International Medical Center',
      subtitle: '24/7 Tertiary Care & Emergency Operation Wing',
    },
    doctors: {
      url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80',
      title: 'Specialist Consultation & EHR Platform',
      subtitle: 'Real-time electronic prescriptions and queue synchronization',
    },
    icu: {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      title: 'Advanced Diagnostic & Ward Intelligence',
      subtitle: 'Instant vital signs tracking & bed management system',
    },
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-[var(--bg-tertiary)]/40 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs sm:text-sm font-semibold mb-6 shadow-sm"
            >
              <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Enterprise Clinical Management Solution</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              <span className="text-[var(--text-tertiary)] font-normal">v2.4 Certified</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15] mb-6"
            >
              Unified Clinical Control for{' '}
              <span className="text-[var(--color-primary)] font-extrabold border-b-4 border-[var(--color-primary)]/30">
                Modern Hospitals & Clinics
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xl font-normal"
            >
              Seamless real-time operational coordination between Doctors, Nurses, Receptionists, Pharmacists, Patients, and Administrators. Featuring automated QR prescriptions, bank-grade authentication, and digital EHR workflows.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10"
            >
              <button
                onClick={() => navigate('/auth')}
                className="btn btn-primary btn-lg shadow-md flex items-center gap-3 w-full sm:w-auto font-semibold"
              >
                <span>Access Hospital System Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('portals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-lg flex items-center gap-2.5 w-full sm:w-auto font-semibold"
              >
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                <span>View 6 Workspace Portals</span>
              </button>
            </motion.div>

            {/* Key Clinical Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="w-full pt-6 border-t border-[var(--border-color)] grid grid-cols-3 gap-4"
            >
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">6 Roles</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">RBAC Workspaces</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="text-xl sm:text-2xl font-bold text-[var(--color-success)]">100%</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">OTP Secured</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">&lt;50ms</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">Live Queue Sync</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hospital Photography & Live Virtual Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            {/* Card Frame */}
            <div className="rounded-2xl p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl relative overflow-hidden">
              
              {/* Photo Selector Switcher */}
              <div className="flex items-center justify-between gap-1 p-1.5 mb-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('facility')}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
                    activeTab === 'facility'
                      ? 'bg-[var(--bg-secondary)] text-[var(--color-primary)] shadow-sm font-bold'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Medical Center
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
                    activeTab === 'doctors'
                      ? 'bg-[var(--bg-secondary)] text-[var(--color-primary)] shadow-sm font-bold'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Doctor Consultation
                </button>
                <button
                  onClick={() => setActiveTab('icu')}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
                    activeTab === 'icu'
                      ? 'bg-[var(--bg-secondary)] text-[var(--color-primary)] shadow-sm font-bold'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Clinical Ward
                </button>
              </div>

              {/* Main Photo Visual */}
              <div className="relative h-[340px] sm:h-[400px] rounded-xl overflow-hidden group">
                <img
                  src={VISUALS[activeTab].url}
                  alt={VISUALS[activeTab].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Dark Gradient Overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Caption Bar */}
                <div className="absolute bottom-16 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-[var(--color-primary)] px-2 py-0.5 rounded text-white inline-block mb-1">
                    Live Hospital Visual
                  </span>
                  <h3 className="text-lg font-bold leading-tight">{VISUALS[activeTab].title}</h3>
                  <p className="text-xs text-slate-300 font-normal">{VISUALS[activeTab].subtitle}</p>
                </div>

                {/* Top-Right Active Status Badge */}
                <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-slate-700/60 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-400">Emergency Desk Online</span>
                </div>
              </div>

              {/* Live Virtual Medical Dashboard Card Overlay */}
              <div className="mt-3 p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">Strict Patient Data Protection</div>
                    <div className="text-[11px] text-[var(--text-tertiary)]">Encrypted database records & MFA login check</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)]">
                  <CheckCircle size={15} />
                  <span>HIPAA Grade</span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

