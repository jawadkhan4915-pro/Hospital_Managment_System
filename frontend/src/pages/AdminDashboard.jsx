import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Users, UserCheck, CalendarDays, DollarSign, AlertCircle, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    staffCount: 0,
    patientCount: 0,
    appointmentCount: 0,
    lowStockCount: 0,
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Register Staff Form state
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

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Fetch Patients
      const patientsRes = await fetchWithAuth('/api/v1/patients');
      const patientsData = await patientsRes.json();
      
      // 2. Fetch Doctors
      const doctorsRes = await fetchWithAuth('/api/v1/staff/doctors');
      const doctorsData = await doctorsRes.json();

      // 3. Fetch Appointments
      const apptsRes = await fetchWithAuth('/api/v1/appointments');
      const apptsData = await apptsRes.json();

      // 4. Fetch Low Stock
      const stockRes = await fetchWithAuth('/api/v1/inventory/low-stock');
      const stockData = await stockRes.json();

      setDoctors(doctorsData.data || []);
      setStats({
        staffCount: (doctorsData.data || []).length + 2, // adding sample administrative counts
        patientCount: (patientsData.data || []).length,
        appointmentCount: (apptsData.data || []).length,
        lowStockCount: (stockData.data || []).length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Step A: Create User Account
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
      if (!userRes.ok) {
        throw new Error(userData.message || 'Failed to register staff account');
      }

      // Step B: Create Staff profile
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
      if (!staffRes.ok) {
        throw new Error(staffData.message || 'Failed to initialize staff profile');
      }

      setMessage('Staff member successfully registered!');
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
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading administrative hub...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '24px' }}>Administrative Command Center</h2>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div className="glass" style={styles.metricCard}>
          <div style={styles.iconBox}><Users size={24} color="var(--color-primary)" /></div>
          <div>
            <div style={styles.metricValue}>{stats.patientCount}</div>
            <div style={styles.metricLabel}>Total Patients</div>
          </div>
        </div>

        <div className="glass" style={styles.metricCard}>
          <div style={styles.iconBox}><UserCheck size={24} color="var(--color-success)" /></div>
          <div>
            <div style={styles.metricValue}>{stats.staffCount}</div>
            <div style={styles.metricLabel}>Active Staff</div>
          </div>
        </div>

        <div className="glass" style={styles.metricCard}>
          <div style={styles.iconBox}><CalendarDays size={24} color="var(--color-warning)" /></div>
          <div>
            <div style={styles.metricValue}>{stats.appointmentCount}</div>
            <div style={styles.metricLabel}>Booked Sessions</div>
          </div>
        </div>

        <div className="glass" style={styles.metricCard}>
          <div style={styles.iconBox}><AlertCircle size={24} color="var(--color-danger)" /></div>
          <div>
            <div style={styles.metricValue}>{stats.lowStockCount}</div>
            <div style={styles.metricLabel}>Low Stock Items</div>
          </div>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Register Staff Card */}
        <div className="glass" style={styles.card}>
          <h3 style={styles.cardTitle}>Register New Hospital Personnel</h3>
          {message && (
            <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
              {message}
            </div>
          )}
          <form onSubmit={handleRegisterStaff} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={newStaffUser.name}
                onChange={(e) => setNewStaffUser({ ...newStaffUser, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={newStaffUser.email}
                onChange={(e) => setNewStaffUser({ ...newStaffUser, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={newStaffUser.password}
                onChange={(e) => setNewStaffUser({ ...newStaffUser, password: e.target.value })}
                required
              />
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
                  placeholder="e.g. Pediatric Surgeon"
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={18} /> Provision Profile
            </button>
          </form>
        </div>

        {/* Staff Directories List */}
        <div className="glass" style={styles.card}>
          <h3 style={styles.cardTitle}>Registered Medical Doctors</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No doctor records registered.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr key={doc._id}>
                      <td><span style={{ fontWeight: 600 }}>{doc.staffId}</span></td>
                      <td>{doc.userId?.name || 'Registered User'}</td>
                      <td>{doc.department}</td>
                      <td>{doc.specialization}</td>
                      <td>
                        <span className={`badge ${doc.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {doc.status}
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
    padding: '30px',
    animation: 'fadeIn 0.5s ease-out',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    padding: '24px',
    borderRadius: 'var(--border-radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: 'var(--box-shadow-sm)',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '30px',
  },
  card: {
    padding: '30px',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--box-shadow-md)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '20px',
    color: 'var(--text-primary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--color-success)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--color-danger)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
};

export default AdminDashboard;
