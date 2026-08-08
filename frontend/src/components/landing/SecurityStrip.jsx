import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Lock, FileLock, UserCheck, CheckCircle2 } from 'lucide-react';

const HIGHLIGHTS = [
  {
    title: 'Two-Factor OTP Enforcement',
    desc: 'Session security is protected with 6-digit MFA verification tokens.',
    icon: KeyRound,
  },
  {
    title: 'Strict RBAC Middleware',
    desc: 'Role-Based Access Control validates request headers on every endpoint.',
    icon: UserCheck,
  },
  {
    title: 'Bcrypt Password Hashing',
    desc: 'Credentials stored with salt-round hashing algorithms in MongoDB.',
    icon: Lock,
  },
  {
    title: 'Audit Logging & Rate Limiting',
    desc: 'Express-rate-limit & winston logging prevent brute-force attacks.',
    icon: FileLock,
  },
];

export default function SecurityStrip() {
  return (
    <section id="security" className="py-20 relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Box */}
        <div className="rounded-2xl p-8 sm:p-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-success-light)] border border-[var(--color-success)]/20 text-[var(--color-success)] text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck size={16} />
                <span>Enterprise Clinical Data Protection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                Hospital-Grade Protection for Patient Health Records
              </h2>

              <p className="text-base text-[var(--text-secondary)] font-normal leading-relaxed mb-6">
                Built from the ground up with defensive security practices, protecting patient confidentiality and fulfilling clinical compliance standards.
              </p>

              <div className="space-y-3">
                {['Zero plain-text password storage', 'JWT stateless token authentication', 'Automated CORS & Helmet headers'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                    <CheckCircle2 size={18} className="text-[var(--color-success)] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Grid Items */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HIGHLIGHTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

