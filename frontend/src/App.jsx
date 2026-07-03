import React, { useContext, useState, lazy, Suspense } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SkeletonCard } from './components/SkeletonLoader.jsx';
import {
  Sun,
  Moon,
  LogOut,
  ShieldAlert,
  Heart,
  ClipboardList,
  BookOpen,
  Pill,
  LayoutDashboard,
  Menu,
  X,
  Activity
} from 'lucide-react';

// Lazy loading dashboard modules for optimal chunking & faster initial page load
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard.jsx'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard.jsx'));
const StaffDashboard = lazy(() => import('./pages/StaffDashboard.jsx'));
const PharmacistDashboard = lazy(() => import('./pages/PharmacistDashboard.jsx'));
const ReceptionistDashboard = lazy(() => import('./pages/ReceptionistDashboard.jsx'));

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return (
      <Suspense fallback={<div style={styles.centerLoading}><Activity className="toast-icon info" size={40} /></div>}>
        <AuthPage />
      </Suspense>
    );
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Patient':
        return <PatientDashboard />;
      case 'Receptionist':
        return <ReceptionistDashboard />;
      case 'Nurse':
      case 'LabTechnician':
        return <StaffDashboard />;
      case 'Pharmacist':
        return <PharmacistDashboard />;
      default:
        return (
          <div className="card" style={{ padding: '40px' }}>
            <h3>HMS Portal Access Granted</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Welcome back, <strong>{user.name}</strong>. You are currently operating with role: <strong>{user.role}</strong>.
            </p>
          </div>
        );
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'Admin': return <ShieldAlert size={18} />;
      case 'Doctor': return <ClipboardList size={18} />;
      case 'Patient': return <Heart size={18} />;
      case 'Pharmacist': return <Pill size={18} />;
      case 'Receptionist': return <BookOpen size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div style={styles.appShell}>
      {/* Sidebar Layout */}
      <aside className={`glass ${mobileMenuOpen ? 'mobile-active' : ''}`} style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <div style={styles.logoText}>Enterprise HMS</div>
            <div style={styles.logoSubtext}>Healthcare Intelligence</div>
          </div>
        </div>

        {/* User Card */}
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || user?.email || 'User'}</div>
            <div className="badge badge-primary" style={styles.roleBadge}>
              {getRoleIcon()}
              <span>{user?.role || 'Guest'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, ...styles.navItemActive }}>
            <LayoutDashboard size={20} />
            <span>Dashboard Hub</span>
          </div>
        </nav>

        {/* Logout Button */}
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Exit System</span>
        </button>
      </aside>

      {/* Main Workspace */}
      <div style={styles.workspace}>
        {/* Workspace Top Header */}
        <header className="glass" style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={styles.mobileToggleBtn}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 style={styles.headerTitle}>Enterprise Hospital Management System</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block', boxShadow: '0 0 8px var(--color-success)' }}></span>
              System Operational
            </div>
            <button onClick={toggleTheme} style={styles.themeBtn} title="Toggle Theme Mode">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main style={styles.mainContent}>
          <Suspense fallback={<SkeletonCard count={3} />}>
            {renderDashboardContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

const styles = {
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  sidebar: {
    width: '280px',
    borderRight: '1px solid var(--border-color)',
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  logoText: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  logoSubtext: {
    fontSize: '0.725rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--bg-tertiary)',
    marginBottom: '28px',
    border: '1px solid var(--border-color)',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflow: 'hidden',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.925rem',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  navItemActive: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: '600',
    borderLeft: '3px solid var(--color-primary)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--color-danger)',
    background: 'transparent',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: '0.925rem',
    fontWeight: '600',
    width: '100%',
    transition: 'all var(--transition-fast)',
  },
  workspace: {
    flexGrow: 1,
    marginLeft: '280px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: 'calc(100% - 280px)',
  },
  header: {
    height: '76px',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  mobileToggleBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  themeBtn: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  mainContent: {
    flexGrow: 1,
    padding: '28px 32px 48px',
  },
  centerLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
};

export default App;
