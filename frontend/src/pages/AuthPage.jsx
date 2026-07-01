import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Shield, Eye, EyeOff, KeyRound, Mail, UserPlus, LogIn, Sun, Moon, Zap } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Admin',      email: 'admin@hospital.com',    password: 'admin123',    color: '#7c3aed', bg: 'rgba(124,58,237,0.12)'  },
  { role: 'Doctor',     email: 'doctor@hospital.com',   password: 'doctor123',   color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)'  },
  { role: 'Patient',    email: 'patient@hospital.com',  password: 'patient123',  color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  { role: 'Nurse',      email: 'nurse@hospital.com',    password: 'nurse123',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { role: 'Pharmacist', email: 'pharmacy@hospital.com', password: 'pharmacy123', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
];

const AuthPage = () => {
  const { login, verifyMfaCode } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login/Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient'); // default to patient for self-signups
  
  // MFA states
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const [mfaCode, setMfaCode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mfaInfo, setMfaInfo] = useState('');

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setIsRegistering(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mfaRequired) {
        await verifyMfaCode(mfaUserId, mfaCode);
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
        // Switch to login
        setIsRegistering(false);
        setPassword('');
        setError('Registration successful! Please login.');
      } else {
        const result = await login(email, password);
        if (result && result.requireMfa) {
          setMfaRequired(true);
          setMfaUserId(result.userId);
          setMfaInfo('For testing, simulated MFA is enabled. Enter: 123456');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="glass" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Shield size={32} color="var(--color-primary)" />
          </div>
          <h2 style={styles.title}>Enterprise HMS</h2>
          <p style={styles.subtitle}>Hospital Information & Administration System</p>
        </div>

        {error && (
          <div style={error.includes('successful') ? styles.successBox : styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {mfaRequired ? (
            <>
              <div style={styles.mfaInstruction}>
                <p>MFA is enabled on this account.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-warning)' }}>{mfaInfo}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Enter One-Time Password</label>
                <div style={styles.inputWrapper}>
                  <KeyRound size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Code"
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
                      placeholder="John Doe"
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
                    <option value="Patient">Patient (Self Portal)</option>
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
              'Processing...'
            ) : mfaRequired ? (
              <>
                <LogIn size={18} /> Verify & Log In
              </>
            ) : isRegistering ? (
              <>
                <UserPlus size={18} /> Register Account
              </>
            ) : (
              <>
                <LogIn size={18} /> Access System
              </>
            )}
          </button>
        </form>

        {!mfaRequired && (
          <div style={styles.footer}>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              style={styles.toggleBtn}
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}

        {/* Demo Accounts Panel */}
        {!mfaRequired && !isRegistering && (
          <div style={styles.demoPanel}>
            <div style={styles.demoDivider}>
              <span style={styles.demoDividerLine} />
              <span style={styles.demoDividerText}>
                <Zap size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Quick Demo Access
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
                  title={`Fill: ${acc.email} / ${acc.password}`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
            <p style={styles.demoHint}>Click a role to auto-fill credentials, then press <strong>Access System</strong></p>
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
    padding: '20px',
    backgroundColor: 'var(--bg-primary)',
    position: 'relative',
    transition: 'all 0.3s',
  },
  themeToggle: {
    position: 'absolute',
    top: '30px',
    right: '30px',
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
    transition: 'all 0.3s',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--box-shadow-lg)',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logoContainer: {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px',
  },
  title: {
    fontSize: '1.75rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '5px',
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
    marginTop: '10px',
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--color-danger)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--color-success)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  footer: {
    marginTop: '25px',
    textAlign: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
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
    marginBottom: '14px',
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
  },
  demoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '10px',
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
    letterSpacing: '0.02em',
  },
  demoHint: {
    textAlign: 'center',
    fontSize: '0.72rem',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
};

export default AuthPage;
