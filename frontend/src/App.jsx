import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import PharmacistDashboard from './pages/PharmacistDashboard.jsx';
import { Sun, Moon, LogOut, ShieldAlert, Heart, ClipboardList, BookOpen, Pill, LayoutDashboard } from 'lucide-react';

const App = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (!user) {
    return <AuthPage />;
  }

  // Choose the dashboard view to render based on the user's role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Patient':
        return <PatientDashboard />;
      case 'Nurse':
        return <StaffDashboard />;
      case 'Pharmacist':
        return <PharmacistDashboard />;
      case 'LabTechnician':
        return <StaffDashboard />; // nurse/lab tech share walk-in/vital desks
      default:
        return (
          <div style={{ padding: '40px', color: 'var(--text-primary)' }}>
            <h3>HMS Portal Access Allowed</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}. You are logged in with role: <strong>{user.role}</strong>.</p>
          </div>
        );
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'Admin': return <ShieldAlert size={20} />;
      case 'Doctor': return <ClipboardList size={20} />;
      case 'Patient': return <Heart size={20} />;
      case 'Pharmacist': return <Pill size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <div style={styles.appShell}>
      {/* Sidebar Layout */}
      <aside className="glass" style={styles.sidebar}>
        <div style={styles.logoBox}>
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🏥</span>
          <span style={styles.logoText}>Enterprise HMS</span>
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
          <LogOut size={20} />
          <span>Exit System</span>
        </button>
      </aside>

      {/* Main Workspace */}
      <div style={styles.workspace}>
        {/* Workspace Top Header */}
        <header className="glass" style={styles.header}>
          <h1 style={styles.headerTitle}>Enterprise Healthcare Management System</h1>
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        {/* Workspace Body */}
        <main style={styles.mainContent}>
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'all 0.3s',
  },
  sidebar: {
    width: '280px',
    borderRight: '1px solid var(--border-color)',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '16px',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--bg-tertiary)',
    marginBottom: '30px',
    border: '1px solid var(--border-color)',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 8px',
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
    padding: '14px 16px',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  navItemActive: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--color-danger)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: '0.95rem',
    width: '100%',
    textAlign: 'left',
    transition: 'opacity 0.3s',
  },
  workspace: {
    flexGrow: 1,
    marginLeft: '280px', // make room for fixed sidebar
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    height: '80px',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 9,
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
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
  },
  mainContent: {
    flexGrow: 1,
    padding: '10px 10px 40px',
  },
};

export default App;
