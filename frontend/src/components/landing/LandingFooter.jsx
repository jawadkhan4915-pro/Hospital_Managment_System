import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <span className="text-lg font-extrabold text-[var(--text-primary)]">
                Enterprise<span className="text-[var(--color-primary)]">HMS</span>
              </span>
            </Link>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mb-4 font-normal">
              Enterprise Hospital Management System built with MERN stack, Vite, Tailwind CSS, and Framer Motion. Tailored for scalable clinical workflows, real-time patient queue management, and data security.
            </p>
          </div>

          {/* Developer Contact Card */}
          <div className="md:col-span-2 rounded-xl p-5 bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 flex items-center gap-2">
              <User size={15} />
              <span>Developer Information</span>
            </h4>
            
            <div className="space-y-2 text-xs text-[var(--text-primary)] font-medium">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-tertiary)]">Developer:</span>
                <span className="font-bold text-[var(--text-primary)]">M.jawad khan</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="tel:03044707155" className="hover:underline text-[var(--text-secondary)]">03044707155</a>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="mailto:jawad.khan4915@gmail.com" className="hover:underline text-[var(--text-secondary)]">jawad.khan4915@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
          <div className="flex items-center gap-1 font-medium">
            <span>Enterprise HMS — Developed by <strong className="text-[var(--text-primary)]">M.jawad khan</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              System Status: Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

