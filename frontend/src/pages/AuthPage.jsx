import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getApiUrl } from '../config/api.js';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Mail, 
  UserPlus, 
  LogIn, 
  Sun, 
  Moon, 
  Zap, 
  Activity, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Lock,
  Loader2
} from 'lucide-react';

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
        const res = await fetch(getApiUrl('/api/v1/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        const resText = await res.text();
        let data;
        try {
          data = JSON.parse(resText);
        } catch {
          throw new Error(!res.ok ? `Server Error (${res.status})` : 'Invalid response from server');
        }
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
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between relative z-20 max-w-7xl w-full mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-indigo-500 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
          title="Toggle Light/Dark Mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl w-full mx-auto my-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[640px]">
          
          {/* Left Panel: Animated Branding & Feature Highlight */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-gradient-to-br from-indigo-900/90 via-indigo-950/95 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
            {/* Ambient Animated Mesh Background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <Activity size={26} className="text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold font-outfit tracking-tight text-white">
                    Enterprise<span className="text-cyan-400 ml-1">HMS</span>
                  </h1>
                  <span className="text-[11px] font-semibold tracking-widest text-indigo-300 uppercase">
                    Clinical Intelligence Platform
                  </span>
                </div>
              </div>

              {/* Title & Copy */}
              <h2 className="text-3xl font-extrabold font-outfit leading-tight mb-4 text-white">
                Secure Access to Hospital Workspaces
              </h2>
              <p className="text-sm text-indigo-200/80 font-jakarta leading-relaxed mb-8">
                Log in to your authenticated role portal or quickly test the platform with built-in instant demo accounts.
              </p>

              {/* Feature Bullets */}
              <div className="space-y-4">
                {[
                  { title: 'Time-Based MFA Enforced', desc: 'Secure OTP validation before session initialization' },
                  { title: '6 Specialized Role Interfaces', desc: 'Custom tailored workspace views for every staff member' },
                  { title: 'Instant QR Dispensary', desc: 'Prescription verification via mobile & web scanners' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white font-outfit">{feat.title}</div>
                      <div className="text-[11px] text-indigo-200/70 font-jakarta mt-0.5">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Security Badge */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-emerald-400" />
                <span>256-Bit SSL Encrypted Session</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                v2.4 Active
              </span>
            </div>
          </div>

          {/* Right Panel: Auth Form & Demo Accounts */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[var(--bg-secondary)]/50">
            <div>
              
              {/* Form Title */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-[var(--text-primary)] tracking-tight">
                  {mfaRequired ? 'Multi-Factor Verification' : isRegistering ? 'Create Patient Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-jakarta mt-1">
                  {mfaRequired 
                    ? 'Enter the 6-digit passcode sent to your device' 
                    : isRegistering 
                    ? 'Sign up to manage appointments & digital medical records' 
                    : 'Enter your credentials to access your clinical dashboard'}
                </p>
              </div>

              {/* Form with Framer Motion AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mfaRequired ? 'mfa' : isRegistering ? 'register' : 'login'}
                  initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {mfaRequired ? (
                    <>
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium leading-relaxed mb-4">
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          <Shield size={16} /> Multi-Factor Security Triggered
                        </div>
                        For testing purposes, enter the demo code below:
                        <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1 bg-[var(--bg-tertiary)] px-3 py-1.5 rounded border border-[var(--border-color)] inline-block">
                          Code: 123456
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">One-Time Security Code</label>
                        <div className="relative flex items-center">
                          <KeyRound size={18} className="absolute left-3.5 text-[var(--text-tertiary)]" />
                          <input
                            type="text"
                            className="form-control w-full pl-11 font-mono tracking-widest text-center text-lg font-bold"
                            placeholder="123456"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {isRegistering && (
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <div className="relative flex items-center">
                            <UserPlus size={18} className="absolute left-3.5 text-[var(--text-tertiary)]" />
                            <input
                              type="text"
                              className="form-control w-full pl-11"
                              placeholder="e.g. Dr. Sarah Connor"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="relative flex items-center">
                          <Mail size={18} className="absolute left-3.5 text-[var(--text-tertiary)]" />
                          <input
                            type="email"
                            className="form-control w-full pl-11"
                            placeholder="name@hospital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="relative flex items-center">
                          <KeyRound size={18} className="absolute left-3.5 text-[var(--text-tertiary)]" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control w-full pl-11 pr-11"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {isRegistering && (
                        <div className="form-group">
                          <label className="form-label">Account Role Type</label>
                          <select
                            className="form-control w-full cursor-pointer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : mfaRequired ? (
                      <>
                        <LogIn size={18} /> Verify Security Code
                      </>
                    ) : isRegistering ? (
                      <>
                        <UserPlus size={18} /> Complete Registration
                      </>
                    ) : (
                      <>
                        <LogIn size={18} /> Access Dashboard Hub
                      </>
                    )}
                  </button>
                </motion.form>
              </AnimatePresence>

              {/* Mode Toggle Button */}
              {!mfaRequired && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-xs sm:text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {isRegistering
                      ? 'Already registered? Sign in to existing account'
                      : "Don't have an account? Register new patient account"}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Demo Pill Buttons Panel */}
            {!mfaRequired && !isRegistering && (
              <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-xs font-bold font-outfit uppercase tracking-wider text-[var(--text-secondary)]">
                    One-Click Quick Fill Demo Accounts
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <motion.button
                      key={acc.role}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => fillDemo(acc)}
                      className="p-2.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between text-left transition-all hover:shadow-md cursor-pointer group"
                      style={{ backgroundColor: acc.bg }}
                    >
                      <div>
                        <div className="text-xs font-bold font-outfit" style={{ color: acc.color }}>
                          {acc.role}
                        </div>
                        <div className="text-[10px] text-[var(--text-tertiary)] truncate max-w-[100px]">
                          {acc.email}
                        </div>
                      </div>
                      <Sparkles size={13} style={{ color: acc.color }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="p-4 text-center text-[11px] text-[var(--text-tertiary)] font-jakarta relative z-10">
        Enterprise Hospital Management System &bull; Secure Multi-Tenant Architecture &bull; 2026
      </footer>

    </div>
  );
};

export default AuthPage;
