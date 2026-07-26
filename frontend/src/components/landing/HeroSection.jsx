import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, Activity, Zap, Play } from 'lucide-react';
import Hero3DScene from './Hero3DScene.jsx';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Radial Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Next-Gen Hospital Management System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[var(--text-tertiary)]">Enterprise v2.4</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6"
            >
              Unified Clinical Control for{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Modern Healthcare
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--text-secondary)] font-jakarta leading-relaxed mb-8 max-w-2xl"
            >
              Seamless real-time synchronization between Admin, Doctors, Nurses, Receptionists, Pharmacists, and Patients. Featuring bank-grade MFA, instant QR prescription slips, and automated billing workflows.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate('/auth')}
                className="btn btn-primary btn-lg shadow-xl shadow-indigo-500/25 flex items-center gap-3 w-full sm:w-auto group"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('portals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-lg flex items-center gap-2.5 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 text-cyan-500 fill-cyan-500" />
                <span>Explore 6 Role Portals</span>
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 pt-8 border-t border-[var(--border-color)] grid grid-cols-3 gap-6 w-full max-w-lg"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-[var(--text-primary)]">6</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">Role Dashboards</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-indigo-500">100%</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">MFA Protected</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-cyan-500">&lt;50ms</div>
                <div className="text-xs text-[var(--text-tertiary)] font-medium">Real-Time Sync</div>
              </div>
            </motion.div>
          </div>

          {/* Right 3D Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent border border-[var(--border-color)] shadow-2xl backdrop-blur-xl">
              <div className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)]/80 relative">
                <Hero3DScene />
                
                {/* Floating Overlay Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">Zero-Trust Security</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">JWT Session Tokens & OTP Verification</div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
