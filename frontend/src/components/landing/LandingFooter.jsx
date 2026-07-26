import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Github, ExternalLink } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <span className="text-lg font-bold font-outfit text-[var(--text-primary)]">
                Enterprise<span className="text-indigo-500">HMS</span>
              </span>
            </Link>

            <p className="text-xs text-[var(--text-secondary)] font-jakarta leading-relaxed max-w-sm">
              Enterprise Hospital Management System built with MERN stack, Vite, Tailwind CSS, Framer Motion, and Three.js. Tailored for scalable clinical workflows and data integrity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-[var(--text-primary)] mb-4">
              System Modules
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-jakarta">
              <li><a href="#portals" className="hover:text-indigo-500 transition-colors">Role Dashboards</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">Appointments & Queues</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">QR Prescriptions</a></li>
              <li><a href="#security" className="hover:text-indigo-500 transition-colors">Multi-Factor Security</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-jakarta">
              <li>Node.js / Express 4</li>
              <li>MongoDB / Mongoose 8</li>
              <li>React 18 + Vite 5</li>
              <li>Tailwind CSS + Three.js</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)] font-jakarta">
          <div className="flex items-center gap-1">
            <span>Enterprise HMS &copy; {new Date().getFullYear()} — Built with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500 inline" />
            <span>for Healthcare Excellence</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              System Status: Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
