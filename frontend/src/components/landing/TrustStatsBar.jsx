import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, QrCode, Clock } from 'lucide-react';

const STATS = [
  {
    icon: Users,
    value: '6 Portals',
    label: 'Admin, Doctor, Patient, Nurse, Receptionist, Pharmacist',
  },
  {
    icon: ShieldCheck,
    value: '2FA / MFA',
    label: 'Time-based One-Time Passcode Security',
  },
  {
    icon: QrCode,
    value: 'QR Dispensary',
    label: 'Instant Digital Prescription QR Slips',
  },
  {
    icon: Clock,
    value: 'Real-Time',
    label: 'Live Appointment Queues & Bed Tracking',
  },
];

export default function TrustStatsBar() {
  return (
    <section className="py-10 border-y border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] shadow-sm"
              >
                <div className="w-11 h-11 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-normal leading-snug mt-0.5">
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

