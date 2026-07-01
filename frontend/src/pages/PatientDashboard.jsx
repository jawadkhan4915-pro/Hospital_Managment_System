import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CalendarDays, FileText, CreditCard, Activity, HeartPulse, User } from 'lucide-react';

const PatientDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Appointment Form
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptSlot, setApptSlot] = useState('09:00 - 09:30');
  const [apptType, setApptType] = useState('Online');
  const [apptReason, setApptReason] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      // 1. Fetch own patient profile
      const profRes = await fetchWithAuth('/api/v1/patients/me');
      const profData = await profRes.json();
      
      if (profRes.ok && profData.data) {
        setProfile(profData.data);
        
        // Load dependencies if profile exists
        const apptsRes = await fetchWithAuth('/api/v1/appointments');
        const apptsData = await apptsRes.json();
        setAppointments(apptsData.data || []);

        const recordsRes = await fetchWithAuth(`/api/v1/records/patient/${profData.data._id}`);
        const recordsData = await recordsRes.json();
        setRecords(recordsData.data || []);

        const billsRes = await fetchWithAuth('/api/v1/billing');
        const billsData = await billsRes.json();
        setInvoices(billsData.data || []);
      }

      // Load Doctor list for bookings dropdown
      const docsRes = await fetchWithAuth('/api/v1/staff/doctors');
      const docsData = await docsRes.json();
      setDoctors(docsData.data || []);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const form = e.target;
      const formData = {
        name: form.name.value,
        dateOfBirth: form.dob.value,
        gender: form.gender.value,
        phone: form.phone.value,
        address: form.address.value,
        bloodGroup: form.blood.value,
      };

      const res = await fetchWithAuth('/api/v1/patients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create patient profile');
      }

      setMessage('Medical profile generated successfully!');
      loadPatientData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedDoctor || !apptDate) return;

    try {
      const res = await fetchWithAuth('/api/v1/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: apptDate,
          timeSlot: apptSlot,
          type: apptType,
          reason: apptReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      setMessage('Appointment booked successfully!');
      setSelectedDoctor('');
      setApptDate('');
      setApptReason('');
      loadPatientData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      const res = await fetchWithAuth(`/api/v1/billing/${invoiceId}/pay`, {
        method: 'PUT',
        body: JSON.stringify({ paymentMethod: 'Wallet' }),
      });
      if (res.ok) {
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading patient portal...</div>;

  // Case: User hasn't registered their patient profile details yet
  if (!profile) {
    return (
      <div style={styles.container}>
        <div className="glass" style={{ ...styles.panel, maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={styles.panelTitle}><User size={24} color="var(--color-primary)" /> Initialize Medical Registry</h3>
          <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Please fill out your core demographics to proceed with bookings and EMR file tracking.</p>
          {message && <div style={styles.errorBox}>{message}</div>}
          <form onSubmit={handleCreateProfile} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" required />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dob" className="form-control" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" className="form-control" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Blood Group</label>
                <select name="blood" className="form-control">
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
              <label className="form-label">Permanent Address</label>
              <input type="text" name="address" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Create Registry File</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Patient Portal: {profile.name}</h2>
        <span style={styles.patientIdBadge}>ID: {profile.patientId}</span>
      </div>

      {message && (
        <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
          {message}
        </div>
      )}

      <div style={styles.layoutGrid}>
        {/* Book Appointment Panel */}
        <div className="glass" style={styles.panel}>
          <h3 style={styles.panelTitle}><CalendarDays size={20} color="var(--color-primary)" /> Book Doctor Consultation</h3>
          <form onSubmit={handleBookAppointment} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Medical Specialist</label>
              <select
                className="form-control"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.userId?.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Timeslot</label>
                <select
                  className="form-control"
                  value={apptSlot}
                  onChange={(e) => setApptSlot(e.target.value)}
                >
                  <option value="09:00 - 09:30">09:00 - 09:30</option>
                  <option value="10:00 - 10:30">10:00 - 10:30</option>
                  <option value="11:00 - 11:30">11:00 - 11:30</option>
                  <option value="14:00 - 14:30">14:00 - 14:30</option>
                  <option value="15:00 - 15:30">15:00 - 15:30</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Reason</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Briefly state symptoms"
                value={apptReason}
                onChange={(e) => setApptReason(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Book Appointment Slot</button>
          </form>
        </div>

        {/* Appointment Status Tracker */}
        <div className="glass" style={styles.panel}>
          <h3 style={styles.panelTitle}><CalendarDays size={20} color="var(--color-success)" /> Schedule Log</h3>
          <div style={styles.list}>
            {appointments.length === 0 ? (
              <div style={styles.empty}>No appointments booked.</div>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} style={styles.listItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 600 }}>Dr. {appt.doctorId?.userId?.name}</span>
                    <span style={styles.dateLabel}>{new Date(appt.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.itemRow}>
                    <span style={{ fontSize: '0.85rem' }}>Slot: {appt.timeSlot} (Queue: #{appt.queueNumber})</span>
                    <span className={`badge ${appt.status === 'Completed' ? 'badge-success' : appt.status === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vitals History */}
      <div className="glass" style={{ ...styles.panel, marginTop: '30px' }}>
        <h3 style={styles.panelTitle}><HeartPulse size={20} color="var(--color-danger)" /> Clinical Vitals Record</h3>
        <div className="table-container" style={{ marginTop: '15px' }}>
          <table>
            <thead>
              <tr>
                <th>Recorded Date</th>
                <th>Blood Pressure</th>
                <th>Heart Pulse (bpm)</th>
                <th>Body Temp (°C)</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
              </tr>
            </thead>
            <tbody>
              {profile.vitals?.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No vital readings recorded yet.</td>
                </tr>
              ) : (
                profile.vitals.slice().reverse().map((vit) => (
                  <tr key={vit._id}>
                    <td>{new Date(vit.recordedAt).toLocaleString()}</td>
                    <td><span style={{ fontWeight: 600 }}>{vit.bloodPressure}</span></td>
                    <td>{vit.pulse}</td>
                    <td>{vit.temperature}</td>
                    <td>{vit.weight}</td>
                    <td>{vit.height}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical EMR Reports */}
      <div style={styles.layoutGrid2}>
        <div className="glass" style={styles.panel}>
          <h3 style={styles.panelTitle}><FileText size={20} color="var(--color-primary)" /> EMR Summaries</h3>
          <div style={styles.list}>
            {records.length === 0 ? (
              <div style={styles.empty}>No clinical consultation files available.</div>
            ) : (
              records.map((rec) => (
                <div key={rec._id} style={styles.emrItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 600 }}>{rec.diagnosis}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={styles.emrText}><strong>Symptoms (Subjective):</strong> {rec.soapNotes?.subjective}</p>
                  <p style={styles.emrText}><strong>Treatment:</strong> {rec.soapNotes?.plan}</p>
                  {rec.prescription?.length > 0 && (
                    <div style={{ marginTop: '5px', fontSize: '0.85rem' }}>
                      <strong>Prescription:</strong> {rec.prescription.map(p => `${p.medicineName} (${p.dosage})`).join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoice Payments panel */}
        <div className="glass" style={styles.panel}>
          <h3 style={styles.panelTitle}><CreditCard size={20} color="var(--color-warning)" /> Invoices & Settlement</h3>
          <div style={styles.list}>
            {invoices.length === 0 ? (
              <div style={styles.empty}>No invoices generated.</div>
            ) : (
              invoices.map((inv) => (
                <div key={inv._id} style={styles.invoiceItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 600 }}>{inv.invoiceNumber}</span>
                    <span style={{ fontWeight: 700 }}>${inv.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ ...styles.itemRow, marginTop: '8px' }}>
                    <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {inv.status}
                    </span>
                    {inv.status === 'Unpaid' && (
                      <button
                        onClick={() => handlePayInvoice(inv._id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Settle Bill
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
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
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  patientIdBadge: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    padding: '4px 12px',
    borderRadius: 'var(--border-radius-sm)',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  layoutGrid2: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    marginTop: '30px',
  },
  panel: {
    padding: '30px',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--box-shadow-md)',
  },
  panelTitle: {
    fontSize: '1.25rem',
    marginBottom: '20px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  listItem: {
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    padding: '20px 0',
  },
  emrItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
  },
  emrText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
  },
  invoiceItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
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

export default PatientDashboard;
