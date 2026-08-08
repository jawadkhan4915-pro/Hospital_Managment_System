import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';

export default function CtaBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-2xl p-10 sm:p-14 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white shadow-xl overflow-hidden border border-slate-700/50">
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6 shadow"
            >
              <Building2 className="w-7 h-7 text-sky-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4"
            >
              Ready to Upgrade Your Clinical Management Capabilities?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-sm sm:text-base text-slate-300 font-normal max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Log in to access role-specific workspaces for Doctors, Nurses, Receptionists, Pharmacists, Patients, and Administrators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate('/auth')}
                className="px-7 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm shadow-lg hover:bg-sky-500 transition-all flex items-center gap-3 cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>Launch HMS System Demo</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

