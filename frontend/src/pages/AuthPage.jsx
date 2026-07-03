import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Shield, Eye, EyeOff, KeyRound, Mail, UserPlus, LogIn, Sun, Moon, Zap, Activity } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Admin',        email: 'admin@hospital.com',      password: 'admin123',      color: '#7c3aed', bg: 'rgba(124,58,237,0.12)'  },
  { role: 'Doctor',       email: 'doctor@hospital.com',     password: 'doctor123',     color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)'  },
  { role: 'Receptionist', email: 'reception@hospital.com',  password: 'reception123',  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'   },
  { role: 'Patient',      email: 'patient@hospital.com',    password: 'patient123',    color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  { role: 'Nurse',        email: 'nurse@hospital.com',      password: 'nurse123',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { role: 'Pharmacist',   email: 'pharmacy@hospital.com',   password: 'pharmacy123',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
];

const AuthPage = () => {
  const { login, verifyMfaCode } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showSuccess, showError, showInfo } = useToast();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setIsRegistering(false);
    showInfo(`Auto-filled ${account.role} credentials!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mfaRequired) {
        await verifyMfaCode(mfaUserId, mfaCode);
        showSuccess('MFA Verification Successful!');
      } else if (isRegistering) {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        setIsRegistering(false);
        setPassword('');
        showSuccess('Registration successful! Please login to continue.');
      } else {
        const result = await login(email, password);
        if (result && result.requireMfa) {
          setMfaRequired(true);
          setMfaUserId(result.userId);
          showInfo('MFA enabled. Demo code: 123456');
        } else {
          showSuccess('Welcome back! Logging in...');
        }
      }
    } catch (err) {
      showError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle */}
      <button onClick={toggleTheme} style={styles.themeToggle} title="Toggle Dark/Light Mode">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="glass animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Activity size={32} color="#ffffff" />
          </div>
          <h2 style={styles.title}>Enterprise HMS</h2>
          <p style={styles.subtitle}>Smart Healthcare Management System</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mfaRequired ? (
            <>
              <div style={styles.mfaInstruction}>
                <p>Multi-Factor Authentication Required</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-warning)', marginTop: '4px' }}>
                  Enter code: 123456
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">One-Time Security Code</label>
                <div style={styles.inputWrapper}>
                  <KeyRound size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter 6-digit code"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {isRegistering && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={styles.inputWrapper}>
                    <UserPlus size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dr. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={styles.inputWrapper}>
                  <KeyRound size={18} style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegistering && (
                <div className="form-group">
                  <label className="form-label">Account Role Type</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Patient">Patient (Portal Access)</option>
                    <option value="Admin">Administrator</option>
                    <option value="Doctor">Medical Doctor</option>
                    <option value="Nurse">Clinic Nurse</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="LabTechnician">Laboratory Technician</option>
                    <option value="Accountant">Hospital Accountant</option>
                  </select>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              'Authenticating...'
            ) : mfaRequired ? (
              <>
                <LogIn size={18} /> Verify Code
              </>
            ) : isRegistering ? (
              <>
                <UserPlus size={18} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={18} /> Access Portal
              </>
            )}
          </button>
        </form>

        {!mfaRequired && (
          <div style={styles.footer}>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              style={styles.toggleBtn}
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
            </button>
          </div>
        )}

        {!mfaRequired && !isRegistering && (
          <div style={styles.demoPanel}>
            <div style={styles.demoDivider}>
              <span style={styles.demoDividerLine} />
              <span style={styles.demoDividerText}>
                <Zap size={13} style={{ marginRight: '5px' }} />
                Instant Demo Portals
              </span>
              <span style={styles.demoDividerLine} />
            </div>
            <div style={styles.demoGrid}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  style={{
                    ...styles.demoBtn,
                    borderColor: acc.color,
                    backgroundColor: acc.bg,
                    color: acc.color,
                  }}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: 'var(--bg-primary)',
    position: 'relative',
  },
  themeToggle: {
    position: 'absolute',
    top: '28px',
    right: '28px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    boxShadow: 'var(--box-shadow-sm)',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    padding: '40px 36px',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--box-shadow-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-tertiary)',
  },
  input: {
    width: '100%',
    paddingLeft: '48px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  submitBtn: {
    marginTop: '12px',
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  mfaInstruction: {
    textAlign: 'center',
    marginBottom: '20px',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  demoPanel: {
    marginTop: '24px',
    paddingTop: '20px',
  },
  demoDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  demoDividerLine: {
    flexGrow: 1,
    height: '1px',
    backgroundColor: 'var(--border-color)',
  },
  demoDividerText: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
  },
  demoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  demoBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1.5px solid',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.2s',
  },
};

export default AuthPage;
