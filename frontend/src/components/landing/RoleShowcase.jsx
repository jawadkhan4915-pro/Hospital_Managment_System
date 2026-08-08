import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Stethoscope, ClipboardList, Heart, Pill, UserCheck, ArrowRight, Building2 } from 'lucide-react';

const ROLES = [
  {
    role: 'Admin',
    icon: ShieldCheck,
    color: '#0369a1',
    bg: 'rgba(3, 105, 161, 0.08)',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    desc: 'System oversight, staff credentialing, audit trail tracking, security protocols, and operational reports.',
    features: ['User Management', 'Audit Trail', 'System Metrics']
  },
  {
    role: 'Doctor',
    icon: Stethoscope,
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.08)',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    desc: 'Patient consultation queues, digital medical record entry, e-prescriptions, and laboratory diagnostic orders.',
    features: ['Patient Queue', 'E-Prescriptions', 'Medical History']
  },
  {
    role: 'Receptionist',
    icon: ClipboardList,
    color: '#0d9488',
    bg: 'rgba(13, 148, 136, 0.08)',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    desc: 'Patient check-in counter, appointment scheduling, doctor availability calendars, and registration desk.',
    features: ['Check-In Desk', 'Schedule Booking', 'Patient Onboarding']
  },
  {
    role: 'Patient',
    icon: Heart,
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    desc: 'Personal health portal, online appointment booking, active QR prescription slips, and digital bill statements.',
    features: ['My Appointments', 'QR Prescriptions', 'Billing Portal']
  },
  {
    role: 'Nurse',
    icon: UserCheck,
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    desc: 'Ward and bed allocations, patient vital sign telemetry, medication execution logs, and triage updates.',
    features: ['Bed Allocations', 'Vitals Logging', 'Triage Status']
  },
  {
    role: 'Pharmacist',
    icon: Pill,
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80',
    desc: 'Medication inventory management, QR code prescription slip scanner, dispense logs, and low-stock alerts.',
    features: ['QR Verification', 'Medicine Stock', 'Dispense Logs']
  },
];

export default function RoleShowcase() {
  const navigate = useNavigate();

  return (
    <section id="portals" className="py-20 bg-[var(--bg-primary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-light)] px-3.5 py-1 rounded-full border border-[var(--color-primary)]/20 inline-block mb-3">
            Multi-Role Clinical Workspaces
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            6 Specialized Workspaces Built for Every Role
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] font-normal">
            Tailored dashboards with strict Role-Based Access Control (RBAC), ensuring each hospital team member operates with clarity and speed.
          </p>
        </div>

        {/* 6 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROLES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Image Header */}
                  <div className="relative h-36 overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.role}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                    
                    {/* Role Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow text-slate-900 font-bold"
                        style={{ color: item.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide">
                        {item.role} Workspace
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                      {item.desc}
                    </p>

                    {/* Features Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.features.map((feat) => (
                        <span 
                          key={feat}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent text-xs font-bold text-[var(--text-primary)] transition-all flex items-center justify-between group-button cursor-pointer"
                  >
                    <span>Launch {item.role} Portal</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

