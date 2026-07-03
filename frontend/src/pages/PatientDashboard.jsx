import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import { CalendarDays, FileText, CreditCard, HeartPulse, User, CheckCircle2, Calendar } from 'lucide-react';

const PatientDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

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

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const profRes = await fetchWithAuth('/api/v1/patients/me');
      const profData = await profRes.json();

      if (profRes.ok && profData.data) {
        setProfile(profData.data);

        const [apptsRes, recordsRes, billsRes] = await Promise.all([
          fetchWithAuth('/api/v1/appointments'),
          fetchWithAuth(`/api/v1/records/patient/${profData.data._id}`),
          fetchWithAuth('/api/v1/billing'),
        ]);

        const [apptsData, recordsData, billsData] = await Promise.all([
          apptsRes.json(),
          recordsRes.json(),
          billsRes.json(),
        ]);

        setAppointments(apptsData.data || []);
        setRecords(recordsData.data || []);
        setInvoices(billsData.data || []);
      }

      const docsRes = await fetchWithAuth('/api/v1/staff/doctors');
      const docsData = await docsRes.json();
      setDoctors(docsData.data || []);
    } catch (e) {
      showError('Failed to load patient record profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
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
      if (!res.ok) throw new Error(data.message || 'Failed to create patient profile');

      showSuccess('Medical file profile registered successfully!');
      loadPatientData();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !apptDate) {
      showError('Please select a doctor and date');
      return;
    }
    setBooking(true);

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
      if (!res.ok) throw new Error(data.message || 'Failed to book appointment');

      showSuccess('Appointment slot reserved successfully!');
      setSelectedDoctor('');
      setApptDate('');
      setApptReason('');
      loadPatientData();
    } catch (err) {
      showError(err.message);
    } finally {
      setBooking(false);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      const res = await fetchWithAuth(`/api/v1/billing/${invoiceId}/pay`, {
        method: 'PUT',
        body: JSON.stringify({ paymentMethod: 'Wallet' }),
      });
      if (res.ok) {
        showSuccess('Invoice paid & settled!');
        loadPatientData();
      }
    } catch (err) {
      showError('Failed to process billing settlement');
    }
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Patient Health Portal</h2>
        <SkeletonCard count={3} />
        <SkeletonTable rows={4} cols={5} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="animate-fade-in" style={styles.container}>
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', padding: '36px' }}>
          <h3 style={styles.panelTitle}>
            <User size={24} color="var(--color-primary)" /> Initialize Patient Demographic File
          </h3>
          <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Please complete your demographic file to enable online appointment scheduling and health history tracking.
          </p>
          <form onSubmit={handleCreateProfile} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input type="text" name="name" className="form-control" placeholder="Johnathan Doe" required />
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
                <label className="form-label">Contact Phone</label>
                <input type="tel" name="phone" className="form-control" placeholder="+1 555-0192" required />
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
              <label className="form-label">Residential Address</label>
              <input type="text" name="address" className="form-control" placeholder="123 Health Ave, Suite 40" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Create Medical Registry Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>Patient Portal: {profile.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Personal Health Management & Appointments
          </p>
        </div>
        <span className="badge badge-primary" style={styles.patientIdBadge}>
          Patient ID: {profile.patientId}
        </span>
      </div>

      <div style={styles.layoutGrid}>
        {/* Book Appointment Panel */}
        <div className="card">
          <h3 style={styles.panelTitle}>
            <CalendarDays size={20} color="var(--color-primary)" /> Reserve Specialist Session
          </h3>
          <form onSubmit={handleBookAppointment} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Medical Specialist</label>
              <select
                className="form-control"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Choose Physician --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.userId?.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Consultation Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Time Slot</label>
                <select
                  className="form-control"
                  value={apptSlot}
                  onChange={(e) => setApptSlot(e.target.value)}
                >
                  <option value="09:00 - 09:30">09:00 - 09:30 AM</option>
                  <option value="10:00 - 10:30">10:00 - 10:30 AM</option>
                  <option value="11:00 - 11:30">11:00 - 11:30 AM</option>
                  <option value="14:00 - 14:30">02:00 - 02:30 PM</option>
                  <option value="15:00 - 15:30">03:00 - 03:30 PM</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Symptoms / Reason</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Describe your symptoms or visit reason..."
                value={apptReason}
                onChange={(e) => setApptReason(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={booking}>
              <Calendar size={18} /> {booking ? 'Reserving...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>

        {/* Appointment Schedule Status */}
        <div className="card">
          <h3 style={styles.panelTitle}>
            <CalendarDays size={20} color="var(--color-success)" /> Consultation Tracker
          </h3>
          <div style={styles.list}>
            {appointments.length === 0 ? (
              <div className="empty-state">
                <Calendar size={36} className="empty-state-icon" />
                <p>No active appointments scheduled.</p>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} style={styles.listItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 700 }}>Dr. {appt.doctorId?.userId?.name || 'Practitioner'}</span>
                    <span style={styles.dateLabel}>{new Date(appt.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ ...styles.itemRow, marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Slot: {appt.timeSlot} (Queue: #{appt.queueNumber})
                    </span>
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
      <div className="card">
        <h3 style={styles.panelTitle}>
          <HeartPulse size={20} color="var(--color-danger)" /> Recorded Vital Readings
        </h3>
        <div className="table-container" style={{ marginTop: '16px' }}>
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
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No vitals logged yet.
                  </td>
                </tr>
              ) : (
                profile.vitals.slice().reverse().map((vit) => (
                  <tr key={vit._id}>
                    <td>{new Date(vit.recordedAt).toLocaleString()}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{vit.bloodPressure}</span></td>
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

      {/* Medical EMR Reports & Invoices */}
      <div style={styles.layoutGrid2}>
        <div className="card">
          <h3 style={styles.panelTitle}>
            <FileText size={20} color="var(--color-primary)" /> EMR Clinical Reports
          </h3>
          <div style={styles.list}>
            {records.length === 0 ? (
              <div className="empty-state">
                <FileText size={36} className="empty-state-icon" />
                <p>No consultation records on file.</p>
              </div>
            ) : (
              records.map((rec) => (
                <div key={rec._id} style={styles.emrItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 700 }}>{rec.diagnosis}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={styles.emrText}><strong>Clinical Impression:</strong> {rec.soapNotes?.assessment || rec.diagnosis}</p>
                  <p style={styles.emrText}><strong>Plan & Guidance:</strong> {rec.soapNotes?.plan}</p>
                  {rec.prescription?.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                      <strong>Prescribed:</strong> {rec.prescription.map(p => `${p.medicineName} (${p.dosage})`).join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={styles.panelTitle}>
            <CreditCard size={20} color="var(--color-warning)" /> Billing & Invoices
          </h3>
          <div style={styles.list}>
            {invoices.length === 0 ? (
              <div className="empty-state">
                <CreditCard size={36} className="empty-state-icon" />
                <p>No billing statements generated.</p>
              </div>
            ) : (
              invoices.map((inv) => (
                <div key={inv._id} style={styles.invoiceItem}>
                  <div style={styles.itemRow}>
                    <span style={{ fontWeight: 700 }}>{inv.invoiceNumber}</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>${inv.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ ...styles.itemRow, marginTop: '10px' }}>
                    <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {inv.status}
                    </span>
                    {inv.status === 'Unpaid' && (
                      <button
                        onClick={() => handlePayInvoice(inv._id)}
                        className="btn btn-success btn-sm"
                      >
                        <CheckCircle2 size={14} /> Settle Invoice
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
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  patientIdBadge: {
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '24px',
  },
  layoutGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  panelTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    color: 'var(--text-tertiary)',
  },
  emrItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
  },
  emrText: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  invoiceItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
  },
};

export default PatientDashboard;
