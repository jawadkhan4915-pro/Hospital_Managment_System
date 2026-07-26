import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import { Activity, Sun, Moon, ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function LandingNavbar() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--glass-bg)] border-b border-[var(--border-color)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit block leading-none">
              Enterprise<span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent ml-1.5">HMS</span>
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mt-1">
              Smart Health OS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <button 
            onClick={() => scrollToSection('features')} 
            className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('portals')} 
            className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            Role Portals
          </button>
          <button 
            onClick={() => scrollToSection('security')} 
            className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            Security & MFA
          </button>
          <button 
            onClick={() => scrollToSection('tech')} 
            className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            Architecture
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-all cursor-pointer"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary btn-md shadow-lg flex items-center gap-2 group"
            >
              <span>Dashboard Hub</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/auth')}
                className="btn btn-secondary text-xs sm:text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="btn btn-primary text-xs sm:text-sm hidden sm:inline-flex"
              >
                <Sparkles size={16} />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
