import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ClipboardList, Heart, Pill, BookOpen, UserCheck, ArrowUpRight } from 'lucide-react';

const ROLES = [
  {
    role: 'Admin',
    icon: ShieldAlert,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
    desc: 'System configuration, staff credentialing, global audit logs, rate limit rules, and infrastructure oversight.',
    features: ['User Management', 'Audit Trail', 'System Metrics']
  },
  {
    role: 'Doctor',
    icon: ClipboardList,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    desc: 'Patient consultation queues, digital medical record entry, instant prescription issuance, and lab orders.',
    features: ['Patient Queue', 'E-Prescriptions', 'Medical History']
  },
  {
    role: 'Receptionist',
    icon: BookOpen,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    desc: 'Patient check-in desk, appointment scheduling, doctor availability calendars, and registration counter.',
    features: ['Check-In Desk', 'Schedule Booking', 'Patient Onboarding']
  },
  {
    role: 'Patient',
    icon: Heart,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    desc: 'Personal health portal, appointment booking, active prescription QR slips, medical timeline, and bills.',
    features: ['My Appointments', 'QR Prescriptions', 'Billing Portal']
  },
  {
    role: 'Nurse',
    icon: UserCheck,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    desc: 'Ward & bed management, patient vital signs logging, treatment execution logs, and doctor coordination.',
    features: ['Bed Allocations', 'Vitals Logging', 'Triage Status']
  },
  {
    role: 'Pharmacist',
    icon: Pill,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    desc: 'Medication inventory, QR code slip scanner, prescription fulfillment tracking, and stock alert alerts.',
    features: ['QR Verification', 'Medicine Stock', 'Dispense Logs']
  },
];

export default function RoleShowcase() {
  const navigate = useNavigate();

  return (
    <section id="portals" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block mb-3">
            Multi-Tenant Role Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-[var(--text-primary)] tracking-tight">
            6 Specialized Workspaces built for Every Healthcare Role
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] font-jakarta">
            Tailored dashboards with role-based access control (RBAC), ensuring each team member sees exactly the tools they need.
          </p>
        </div>

        {/* 6 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROLES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-6 bg-[var(--glass-bg)] border border-[var(--border-color)] hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                {/* Glow Accent on Hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(400px circle at top left, ${item.color}15, transparent 80%)`
                  }}
                />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: item.bg, color: item.color }}
                    >
                      <Icon size={24} />
                    </div>

                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ color: item.color, backgroundColor: item.bg }}
                    >
                      {item.role} Portal
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)] mb-2 group-hover:text-indigo-500 transition-colors">
                    {item.role} Workspace
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] font-jakarta leading-relaxed mb-6">
                    {item.desc}
                  </p>

                  {/* Features Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.features.map((feat) => (
                      <span 
                        key={feat}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  <span>Test {item.role} Demo Account</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
