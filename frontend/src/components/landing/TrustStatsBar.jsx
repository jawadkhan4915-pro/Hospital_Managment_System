import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, QrCode, Clock, Server, FileCheck } from 'lucide-react';

const STATS = [
  {
    icon: Users,
    value: '6 Portals',
    label: 'Admin, Doctor, Patient, Nurse, Receptionist, Pharmacist',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: ShieldAlert,
    value: '2FA / MFA',
    label: 'Time-based One-Time Passcode Security',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: QrCode,
    value: 'QR Dispensary',
    label: 'Instant Digital Prescription QR Slips',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Clock,
    value: 'Real-Time',
    label: 'Live Appointment Queues & Bed Tracking',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export default function TrustStatsBar() {
  return (
    <section className="py-12 border-y border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold font-outfit text-[var(--text-primary)] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-medium leading-snug mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
