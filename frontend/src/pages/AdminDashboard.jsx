import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import { Users, UserCheck, CalendarDays, AlertCircle, Plus, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState({
    staffCount: 0,
    patientCount: 0,
    appointmentCount: 0,
    lowStockCount: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const [newStaffUser, setNewStaffUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor',
    department: 'General Medicine',
    specialization: '',
    qualification: '',
    salary: 5000,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsRes, doctorsRes, apptsRes, stockRes] = await Promise.all([
        fetchWithAuth('/api/v1/patients'),
        fetchWithAuth('/api/v1/staff/doctors'),
        fetchWithAuth('/api/v1/appointments'),
        fetchWithAuth('/api/v1/inventory/low-stock'),
      ]);

      const [patientsData, doctorsData, apptsData, stockData] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        apptsRes.json(),
        stockRes.json(),
      ]);

      setDoctors(doctorsData.data || []);
      setStats({
        staffCount: (doctorsData.data || []).length + 2,
        patientCount: (patientsData.data || []).length,
        appointmentCount: (apptsData.data || []).length,
        lowStockCount: (stockData.data || []).length,
      });
    } catch (e) {
      showError('Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    try {
      const userRes = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffUser.name,
          email: newStaffUser.email,
          password: newStaffUser.password,
          role: newStaffUser.role,
        }),
      });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData.message || 'Failed to create user');

      const staffRes = await fetchWithAuth('/api/v1/staff', {
        method: 'POST',
        body: JSON.stringify({
          userId: userData.data.id,
          department: newStaffUser.department,
          specialization: newStaffUser.role === 'Doctor' ? newStaffUser.specialization : undefined,
          qualification: newStaffUser.qualification,
          salary: newStaffUser.salary,
          schedule: [
            { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          ],
        }),
      });
      const staffData = await staffRes.json();
      if (!staffRes.ok) throw new Error(staffData.message || 'Failed to create staff profile');

      showSuccess(`Staff profile for ${newStaffUser.name} created successfully!`);
      setNewStaffUser({
        name: '',
        email: '',
        password: '',
        role: 'Doctor',
        department: 'General Medicine',
        specialization: '',
        qualification: '',
        salary: 5000,
      });
      loadDashboardData();
    } catch (error) {
      showError(error.message);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const name = doc.userId?.name || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.staffId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'All' || doc.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [doctors, searchQuery, departmentFilter]);

  const departmentsList = useMemo(() => {
    const depts = new Set(doctors.map((d) => d.department).filter(Boolean));
    return ['All', ...Array.from(depts)];
  }, [doctors]);

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Administrative Command Center</h2>
        <SkeletonCard count={4} />
        <div style={{ marginTop: '24px' }}>
          <SkeletonTable rows={4} cols={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2>Administrative Command Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            System Analytics & Personnel Governance
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div className="stat-card">
          <div>
            <div style={styles.metricValue}>{stats.patientCount}</div>
            <div style={styles.metricLabel}>Registered Patients</div>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={styles.metricValue}>{stats.staffCount}</div>
            <div style={styles.metricLabel}>Active Personnel</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={styles.metricValue}>{stats.appointmentCount}</div>
            <div style={styles.metricLabel}>Scheduled Consultations</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <CalendarDays size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={styles.metricValue}>{stats.lowStockCount}</div>
            <div style={styles.metricLabel}>Inventory Alerts</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Register Staff Form */}
        <div className="card">
          <h3 style={styles.cardTitle}>Provision Hospital Staff</h3>
          <form onSubmit={handleRegisterStaff} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Dr. Alexander Fleming"
                value={newStaffUser.name}
                onChange={(e) => setNewStaffUser({ ...newStaffUser, name: e.target.value })}
                required
              />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="alexander@hospital.com"
                  value={newStaffUser.email}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={newStaffUser.password}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Staff Role</label>
                <select
                  className="form-control"
                  value={newStaffUser.role}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, role: e.target.value })}
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="LabTechnician">Lab Technician</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cardiology"
                  value={newStaffUser.department}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, department: e.target.value })}
                  required
                />
              </div>
            </div>

            {newStaffUser.role === 'Doctor' && (
              <div className="form-group">
                <label className="form-label">Medical Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cardiovascular Surgery"
                  value={newStaffUser.specialization}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, specialization: e.target.value })}
                  required
                />
              </div>
            )}

            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MBBS, MD"
                  value={newStaffUser.qualification}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, qualification: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Base Salary ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStaffUser.salary}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, salary: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <Plus size={18} /> Provision Account Profile
            </button>
          </form>
        </div>

        {/* Doctors Directory Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={styles.cardTitle}>Medical Specialists Directory</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search doctor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px', height: '38px', fontSize: '0.875rem' }}
                />
              </div>
              <select
                className="form-control"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ height: '38px', fontSize: '0.875rem' }}
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No doctor records matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doc) => (
                    <tr key={doc._id}>
                      <td><span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{doc.staffId}</span></td>
                      <td style={{ fontWeight: 600 }}>{doc.userId?.name || 'Dr. Practitioner'}</td>
                      <td>{doc.department}</td>
                      <td>{doc.specialization || 'General'}</td>
                      <td>
                        <span className={`badge ${doc.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {doc.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  headerRow: {
    marginBottom: '8px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  metricValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
    gap: '24px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    gap: '14px',
  },
};

export default AdminDashboard;
