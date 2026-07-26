import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Menu, Sun, Moon, ShieldCheck, Activity } from 'lucide-react';

export default function Topbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[var(--glass-header)] backdrop-blur-xl border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between transition-colors duration-300">
      
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-indigo-500 transition-all cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center lg:hidden">
            <Activity size={16} />
          </div>
          <h1 className="text-sm sm:text-base font-bold font-outfit text-[var(--text-primary)] tracking-tight truncate">
            Enterprise Hospital Management System
          </h1>
        </div>
      </div>

      {/* Right: Operational Badge & Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* System Operational Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>System Operational</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-500 transition-all cursor-pointer"
          title="Toggle Theme Mode"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

    </header>
  );
}
