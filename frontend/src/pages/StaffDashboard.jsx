import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { UserPlus, Heart, Calendar, Plus, Eye } from 'lucide-react';

const StaffDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      const patientRes = await fetchWithAuth('/api/v1/patients');
      const patientData = await patientRes.json();
      setPatients(patientData.data || []);

      const docsRes = await fetchWithAuth('/api/v1/staff/doctors');
      const docsData = await docsRes.json();
      setDoctors(docsData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setMessage('');
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
      if (!res.ok) {
        throw new Error(data.message || 'Failed to register patient profile');
      }

      setMessage('Walk-in patient registered successfully!');
      setPatientForm({ name: '', dob: '', gender: 'Male', phone: '', address: '', blood: 'O+' });
      loadStaffData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleAddVitals = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setMessage('');

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
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update vitals');
      }

      setMessage(`Vitals recorded for patient ${selectedPatient.name}`);
      setVitalsForm({ weight: '', height: '', bp: '', temp: '', pulse: '' });
      setSelectedPatient(null);
      loadStaffData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleBookWalkIn = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !apptForm.doctorId || !apptForm.date) return;
    setMessage('');

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
      if (!res.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      setMessage(`Appointment scheduled successfully for ${selectedPatient.name}`);
      setApptForm({ doctorId: '', date: '', slot: '09:00 - 09:30', type: 'Walk-In', reason: '' });
      setSelectedPatient(null);
      loadStaffData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading registry desk...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '24px' }}>Nurse & Receptionist Hub</h2>
      
      {message && (
        <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
          {message}
        </div>
      )}

      <div style={styles.contentGrid}>
        {/* Register Patient Profile */}
        <div className="glass" style={styles.card}>
          <h3 style={styles.cardTitle}><UserPlus size={20} color="var(--color-primary)" /> Register Walk-in Patient</h3>
          <form onSubmit={handleRegisterPatient} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
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
                value={patientForm.address}
                onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Patient Registry</button>
          </form>
        </div>

        {/* Dynamic Vitals & Appointments Panel */}
        <div className="glass" style={styles.card}>
          {selectedPatient ? (
            <div>
              <div style={styles.selectedHeader}>
                <h3 style={styles.cardTitle}>Selected: {selectedPatient.name}</h3>
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setSelectedPatient(null)}>Cancel</button>
              </div>

              {/* Record Vitals form */}
              <form onSubmit={handleAddVitals} style={{ ...styles.form, marginBottom: '30px' }}>
                <h4 style={styles.sectionHeader}><Heart size={16} color="var(--color-danger)" /> Capture Vitals</h4>
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
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-success)' }}>Record Vitals</button>
              </form>

              {/* Book Appointment form */}
              <form onSubmit={handleBookWalkIn} style={styles.form}>
                <h4 style={styles.sectionHeader}><Calendar size={16} color="var(--color-primary)" /> Assign Doctor Session</h4>
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
            <div style={styles.emptyAction}>
              <Heart size={44} color="var(--text-tertiary)" />
              <p>Select a patient from the listing to assign vitals or book doctor queues</p>
            </div>
          )}
        </div>
      </div>

      {/* Patients List */}
      <div className="glass" style={{ ...styles.card, marginTop: '30px' }}>
        <h3 style={styles.cardTitle}>Hospital Medical Registries</h3>
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
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No patients found.</td>
                </tr>
              ) : (
                patients.map((pat) => {
                  const latestVitals = pat.vitals && pat.vitals.length > 0 ? pat.vitals[pat.vitals.length - 1] : null;
                  return (
                    <tr key={pat._id}>
                      <td><span style={{ fontWeight: 600 }}>{pat.patientId}</span></td>
                      <td>{pat.name}</td>
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
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => setSelectedPatient(pat)}
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
    padding: '30px',
    animation: 'fadeIn 0.5s ease-out',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionHeader: {
    fontSize: '0.95rem',
    marginBottom: '15px',
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
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  emptyAction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
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

export default StaffDashboard;
