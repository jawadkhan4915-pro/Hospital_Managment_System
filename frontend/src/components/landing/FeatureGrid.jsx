import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, QrCode, FileText, CreditCard, Lock, LayoutDashboard, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Smart Appointment Engine',
    desc: 'Automated queue management, doctor time-slot allocation, and real-time status tracking from Scheduled to Completed.',
    tag: 'appointment.controller.js',
    accent: '#0284c7',
  },
  {
    icon: QrCode,
    title: 'QR E-Prescription Slips',
    desc: 'Instant QR code generation for digital prescriptions. Pharmacists scan to securely verify dosage, instructions, and dispense status.',
    tag: 'prescription.controller.js',
    accent: '#0d9488',
  },
  {
    icon: FileText,
    title: 'Electronic Health Records (EHR)',
    desc: 'Comprehensive patient medical timeline covering consultation notes, vital trends, past visits, lab reports, and treatment history.',
    tag: 'patient.controller.js',
    accent: '#059669',
  },
  {
    icon: CreditCard,
    title: 'Billing & Pharmacy Inventory',
    desc: 'Integrated invoice generation for patient consultations paired with real-time medicine stock control and low-inventory alerts.',
    tag: 'billing.controller.js',
    accent: '#d97706',
  },
  {
    icon: Lock,
    title: 'Multi-Factor OTP Authentication',
    desc: 'Time-based 6-digit OTP security layer. Safeguards confidential health records and prevents unauthorized administrative access.',
    tag: 'auth.middleware.js',
    accent: '#0369a1',
  },
  {
    icon: LayoutDashboard,
    title: 'Live Analytical Dashboards',
    desc: 'Role-customized chart analytics. Real-time patient volume metrics, revenue trends, and staff workload distribution.',
    tag: 'admin.controller.js',
    accent: '#475569',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 relative overflow-hidden bg-[var(--bg-tertiary)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            <span>Clinical System Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Engineered for Precision & Patient Safety
          </h2>

          <p className="mt-3 text-base text-[var(--text-secondary)] font-normal">
            Directly backed by robust REST APIs, MongoDB data models, and enterprise security compliance.
          </p>
        </div>

        {/* Clean Clinical Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                    {feat.desc}
                  </p>
                </div>

                {/* System Tag */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
                    {feat.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--color-success)]">
                    Verified Engine
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

