import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import { UserPlus, Heart, Calendar, Eye, Search } from 'lucide-react';

const StaffDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New Patient Form
  const [patientForm, setPatientForm] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    phone: '',
    address: '',
    blood: 'O+',
  });

  // Vitals Form
  const [vitalsForm, setVitalsForm] = useState({
    weight: '',
    height: '',
    bp: '',
    temp: '',
    pulse: '',
  });

  // Walk-in Appointment Form
  const [apptForm, setApptForm] = useState({
    doctorId: '',
    date: '',
    slot: '09:00 - 09:30',
    type: 'Walk-In',
    reason: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      const [patientRes, docsRes] = await Promise.all([
        fetchWithAuth('/api/v1/patients'),
        fetchWithAuth('/api/v1/staff/doctors'),
      ]);

      const [patientData, docsData] = await Promise.all([
        patientRes.json(),
        docsRes.json(),
      ]);

      setPatients(patientData.data || []);
      setDoctors(docsData.data || []);
    } catch (e) {
      showError('Failed to load triage registry');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/v1/patients', {
        method: 'POST',
        body: JSON.stringify({
          name: patientForm.name,
          dateOfBirth: patientForm.dob,
          gender: patientForm.gender,
          phone: patientForm.phone,
          address: patientForm.address,
          bloodGroup: patientForm.blood,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register patient');

      showSuccess(`Walk-in patient ${patientForm.name} registered!`);
      setPatientForm({ name: '', dob: '', gender: 'Male', phone: '', address: '', blood: 'O+' });
      loadStaffData();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVitals = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const res = await fetchWithAuth(`/api/v1/patients/${selectedPatient._id}/vitals`, {
        method: 'PUT',
        body: JSON.stringify({
          weight: parseFloat(vitalsForm.weight),
          height: parseFloat(vitalsForm.height),
          bloodPressure: vitalsForm.bp,
          temperature: parseFloat(vitalsForm.temp),
          pulse: parseInt(vitalsForm.pulse),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update vitals');

      showSuccess(`Vitals recorded for ${selectedPatient.name}`);
      setVitalsForm({ weight: '', height: '', bp: '', temp: '', pulse: '' });
      setSelectedPatient(null);
      loadStaffData();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBookWalkIn = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !apptForm.doctorId || !apptForm.date) {
      showError('Select a doctor and date for appointment');
      return;
    }

    try {
      const res = await fetchWithAuth('/api/v1/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatient._id,
          doctorId: apptForm.doctorId,
          date: apptForm.date,
          timeSlot: apptForm.slot,
          type: apptForm.type,
          reason: apptForm.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book appointment');

      showSuccess(`Appointment reserved for ${selectedPatient.name}`);
      setApptForm({ doctorId: '', date: '', slot: '09:00 - 09:30', type: 'Walk-In', reason: '' });
      setSelectedPatient(null);
      loadStaffData();
    } catch (err) {
      showError(err.message);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      return pat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [patients, searchQuery]);

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Nurse & Receptionist Hub</h2>
        <SkeletonCard count={3} />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div>
        <h2>Nurse & Triage Desk</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Walk-In Intake, Vital Signs Recording & Queue Assignment
        </p>
      </div>

      <div style={styles.contentGrid}>
        {/* Register Patient Profile */}
        <div className="card">
          <h3 style={styles.cardTitle}>
            <UserPlus size={20} color="var(--color-primary)" /> Register Walk-in Patient
          </h3>
          <form onSubmit={handleRegisterPatient} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Jane Smith"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                required
              />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={patientForm.dob}
                  onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 555-0188"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Blood Group</label>
                <select
                  className="form-control"
                  value={patientForm.blood}
                  onChange={(e) => setPatientForm({ ...patientForm, blood: e.target.value })}
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="456 Medical Blvd"
                value={patientForm.address}
                onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Create Patient Registry'}
            </button>
          </form>
        </div>

        {/* Dynamic Vitals & Appointments Panel */}
        <div className="card">
          {selectedPatient ? (
            <div>
              <div style={styles.selectedHeader}>
                <h3 style={styles.cardTitle}>Selected: {selectedPatient.name}</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPatient(null)}>
                  Cancel
                </button>
              </div>

              {/* Record Vitals form */}
              <form onSubmit={handleAddVitals} style={{ ...styles.form, marginBottom: '24px' }}>
                <h4 style={styles.sectionHeader}>
                  <Heart size={16} color="var(--color-danger)" /> Capture Vitals
                </h4>
                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">BP (mmHg)</label>
                    <input type="text" className="form-control" placeholder="120/80" value={vitalsForm.bp} onChange={(e) => setVitalsForm({ ...vitalsForm, bp: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Pulse (bpm)</label>
                    <input type="number" className="form-control" placeholder="72" value={vitalsForm.pulse} onChange={(e) => setVitalsForm({ ...vitalsForm, pulse: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Temp (°C)</label>
                    <input type="number" step="0.1" className="form-control" placeholder="36.5" value={vitalsForm.temp} onChange={(e) => setVitalsForm({ ...vitalsForm, temp: e.target.value })} required />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" step="0.1" className="form-control" placeholder="70" value={vitalsForm.weight} onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Height (cm)</label>
                    <input type="number" step="0.1" className="form-control" placeholder="175" value={vitalsForm.height} onChange={(e) => setVitalsForm({ ...vitalsForm, height: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Record Vitals</button>
              </form>

              {/* Book Appointment form */}
              <form onSubmit={handleBookWalkIn} style={styles.form}>
                <h4 style={styles.sectionHeader}>
                  <Calendar size={16} color="var(--color-primary)" /> Assign Doctor Session
                </h4>
                <div className="form-group">
                  <label className="form-label">Assign Doctor</label>
                  <select
                    className="form-control"
                    value={apptForm.doctorId}
                    onChange={(e) => setApptForm({ ...apptForm, doctorId: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>Dr. {d.userId?.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={apptForm.date} onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Slot</label>
                    <select
                      className="form-control"
                      value={apptForm.slot}
                      onChange={(e) => setApptForm({ ...apptForm, slot: e.target.value })}
                    >
                      <option value="09:00 - 09:30">09:00 - 09:30</option>
                      <option value="10:00 - 10:30">10:00 - 10:30</option>
                      <option value="11:00 - 11:30">11:00 - 11:30</option>
                      <option value="14:00 - 14:30">14:00 - 14:30</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Book Consultation Session</button>
              </form>
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={44} className="empty-state-icon" />
              <h4>Select a Patient Below</h4>
              <p style={{ fontSize: '0.875rem' }}>Choose any patient from the registry below to log vitals or assign a consultation doctor queue.</p>
            </div>
          )}
        </div>
      </div>

      {/* Patients List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={styles.cardTitle}>Hospital Patient Directory</h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Gender / Age</th>
                <th>Latest Vitals Snapshot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No patients matched your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => {
                  const latestVitals = pat.vitals && pat.vitals.length > 0 ? pat.vitals[pat.vitals.length - 1] : null;
                  return (
                    <tr key={pat._id}>
                      <td><span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{pat.patientId}</span></td>
                      <td style={{ fontWeight: 600 }}>{pat.name}</td>
                      <td>{pat.phone}</td>
                      <td>{pat.gender} ({new Date().getFullYear() - new Date(pat.dateOfBirth).getFullYear()} y/o)</td>
                      <td>
                        {latestVitals ? (
                          <span style={{ fontSize: '0.85rem' }}>
                            BP: <strong>{latestVitals.bloodPressure}</strong> | Temp: <strong>{latestVitals.temperature}°C</strong> | Pulse: <strong>{latestVitals.pulse} bpm</strong>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No vitals recorded</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedPatient(pat);
                            showInfo(`Managing ${pat.name}`);
                          }}
                        >
                          <Eye size={14} /> Manage Patient
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '24px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionHeader: {
    fontSize: '0.925rem',
    fontWeight: '700',
    marginBottom: '14px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  selectedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  formRow: {
    display: 'flex',
    gap: '14px',
  },
};

export default StaffDashboard;
