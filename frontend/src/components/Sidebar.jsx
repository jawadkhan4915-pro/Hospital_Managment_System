import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
  Activity, 
  LogOut, 
  ShieldAlert, 
  Heart, 
  ClipboardList, 
  BookOpen, 
  Pill, 
  LayoutDashboard,
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user, logout } = useContext(AuthContext);

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'Admin': return <ShieldAlert size={16} />;
      case 'Doctor': return <ClipboardList size={16} />;
      case 'Patient': return <Heart size={16} />;
      case 'Pharmacist': return <Pill size={16} />;
      case 'Receptionist': return <BookOpen size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getRoleBadgeStyle = () => {
    switch (user?.role) {
      case 'Admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Doctor': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'Receptionist': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'Patient': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Nurse': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Pharmacist': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-6 bg-[var(--glass-bg)] backdrop-blur-2xl border-r border-[var(--border-color)]">
      <div>
        {/* Top Header: Logo + Close Btn for Mobile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <Activity size={22} />
            </div>
            <div>
              <div className="text-base font-extrabold font-outfit text-[var(--text-primary)] leading-tight tracking-tight">
                Enterprise<span className="text-indigo-500">HMS</span>
              </div>
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Clinical Workspace
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--gradient-primary)] text-white font-bold font-outfit flex items-center justify-center shadow-md text-base">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold font-outfit text-[var(--text-primary)] truncate">
              {user?.name || user?.email || 'User'}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold mt-1 ${getRoleBadgeStyle()}`}>
              {getRoleIcon()}
              <span>{user?.role || 'Guest'}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-sm border border-indigo-500/20 shadow-sm">
            <LayoutDashboard size={18} />
            <span>Dashboard Hub</span>
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer group"
      >
        <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Exit System</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 fixed top-0 bottom-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden"
            />
            {/* Slide Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
