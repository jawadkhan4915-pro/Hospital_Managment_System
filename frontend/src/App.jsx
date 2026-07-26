import React, { useContext, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SkeletonCard } from './components/SkeletonLoader.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { Activity } from 'lucide-react';

// Lazy loading pages & dashboard modules for optimal code splitting
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard.jsx'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard.jsx'));
const StaffDashboard = lazy(() => import('./pages/StaffDashboard.jsx'));
const PharmacistDashboard = lazy(() => import('./pages/PharmacistDashboard.jsx'));
const ReceptionistDashboard = lazy(() => import('./pages/ReceptionistDashboard.jsx'));

const DashboardHub = () => {
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
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
          <div className="card p-8">
            <h3 className="text-xl font-bold font-outfit">HMS Portal Access Granted</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Welcome back, <strong>{user.name}</strong>. You are currently operating with role: <strong>{user.role}</strong>.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex transition-colors duration-300">
      {/* Extracted Sidebar */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Workspace Layout */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Extracted Topbar */}
        <Topbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Dashboard Main View Container with Framer Motion transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={user.role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<SkeletonCard count={3} />}>
                {renderDashboardContent()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const AuthWrapper = () => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Activity className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <AuthPage />
    </Suspense>
  );
};

const LandingWrapper = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Activity className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <LandingPage />
    </Suspense>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingWrapper />} />
      <Route path="/auth" element={<AuthWrapper />} />
      <Route path="/dashboard" element={<DashboardHub />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <ToastProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </ToastProvider>
);

export default App;
