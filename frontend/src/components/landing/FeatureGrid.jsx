import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, QrCode, FileText, CreditCard, Lock, LayoutDashboard, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Smart Appointment Engine',
    desc: 'Automated queue management, doctor time-slot allocation, and real-time status updates from Scheduled to In-Progress or Completed.',
    tag: 'appointment.controller.js',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: QrCode,
    title: 'QR Prescription Slips',
    desc: 'Instant QR code generation for digital prescriptions. Pharmacists scan the QR to securely verify dosage, instructions, and dispense status.',
    tag: 'prescription.controller.js',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: FileText,
    title: 'Electronic Health Records (EHR)',
    desc: 'Comprehensive patient timeline covering diagnosis notes, vital trends, past consultations, attached lab reports, and treatment plans.',
    tag: 'patient.controller.js',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: CreditCard,
    title: 'Billing & Pharmacy Inventory',
    desc: 'Integrated invoice generation for patient consultations, paired with real-time medicine inventory tracking and automatic stock alerts.',
    tag: 'billing.controller.js',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Lock,
    title: 'Multi-Factor Authentication (MFA)',
    desc: 'Time-based OTP security layer. Protect sensitive medical data and prevent unauthorized administrative credential access.',
    tag: 'auth.middleware.js',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Live Analytical Dashboards',
    desc: 'Role-customized chart analytics powered by Recharts. Real-time patient volume metrics, revenue trends, and staff workload insights.',
    tag: 'admin.controller.js',
    gradient: 'from-violet-500 to-indigo-500',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[var(--bg-secondary)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} />
            <span>Full-Stack Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-[var(--text-primary)] tracking-tight">
            Engineered for Precision & Operational Speed
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] font-jakarta">
            Directly mapped to robust REST APIs, MongoDB data models, and enterprise security protocols.
          </p>
        </div>

        {/* 3D Tilt Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{
                  scale: 1.02,
                  rotateX: 3,
                  rotateY: -3,
                  transition: { duration: 0.2 }
                }}
                className="rounded-3xl p-7 bg-[var(--glass-bg)] border border-[var(--border-color)] hover:border-indigo-500/40 backdrop-blur-xl shadow-xl transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle Gradient Line Top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient} opacity-80`} />

                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)] mb-3 group-hover:text-indigo-500 transition-colors">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] font-jakarta leading-relaxed mb-6">
                  {feat.desc}
                </p>

                {/* System Tag */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
                    {feat.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-500 group-hover:underline">
                    Production Ready
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
