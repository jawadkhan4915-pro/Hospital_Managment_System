import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import AppointmentSlipModal from '../components/AppointmentSlipModal.jsx';
import PatientHistoryModal from '../components/PatientHistoryModal.jsx';
import {
  UserPlus,
  Search,
  Calendar,
  DoorOpen,
  Printer,
  History,
  Users,
  CheckCircle,
  Clock,
  CreditCard,
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // CNIC Search & History State
  const [cnicSearch, setCnicSearch] = useState('');
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Active Selected Patient for Booking
  const [selectedPatient, setSelectedPatient] = useState(null);

  // New Patient Form
  const [patientForm, setPatientForm] = useState({
    name: '',
    cnic: '',
    dob: '',
    gender: 'Male',
    phone: '',
    address: '',
    blood: 'O+',
  });

  // Appointment Booking Form
  const [apptForm, setApptForm] = useState({
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    slot: '09:00 - 09:30',
    type: 'Walk-In',
    reason: '',
    roomNumber: 'Room 101',
  });

  // Slip Modal State
  const [activeSlipAppointment, setActiveSlipAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchingCnic, setSearchingCnic] = useState(false);

  useEffect(() => {
    loadReceptionistData();
  }, []);

  const loadReceptionistData = async () => {
    try {
      setLoading(true);
      const [patientRes, docsRes, apptRes] = await Promise.all([
        fetchWithAuth('/api/v1/patients'),
        fetchWithAuth('/api/v1/staff/doctors'),
        fetchWithAuth('/api/v1/appointments'),
      ]);

      const [patientData, docsData, apptData] = await Promise.all([
        patientRes.json(),
        docsRes.json(),
        apptRes.json(),
      ]);

      setPatients(patientData.data || []);
      setDoctors(docsData.data || []);
      setAppointments(apptData.data || []);
    } catch (e) {
      showError('Failed to load reception desk data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!patientForm.cnic) {
      showError('Patient CNIC is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/v1/patients', {
        method: 'POST',
        body: JSON.stringify({
          name: patientForm.name,
          cnic: patientForm.cnic,
          dateOfBirth: patientForm.dob,
          gender: patientForm.gender,
          phone: patientForm.phone,
          address: patientForm.address,
          bloodGroup: patientForm.blood,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register patient');

      showSuccess(`Patient ${patientForm.name} (CNIC: ${patientForm.cnic}) registered!`);
      setPatientForm({ name: '', cnic: '', dob: '', gender: 'Male', phone: '', address: '', blood: 'O+' });
      loadReceptionistData();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !apptForm.doctorId || !apptForm.date) {
      showError('Please select a patient, doctor, and date');
      return;
    }

    setSubmitting(true);
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
          roomNumber: apptForm.roomNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book appointment');

      showSuccess(`Appointment reserved! Queue #${data.data.queueNumber} assigned.`);
      setActiveSlipAppointment(data.data);
      setSelectedPatient(null);
      loadReceptionistData();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCnicSearch = async (e) => {
    e.preventDefault();
    if (!cnicSearch.trim()) return;

    setSearchingCnic(true);
    try {
      const res = await fetchWithAuth(`/api/v1/patients/cnic/${encodeURIComponent(cnicSearch.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.data) {
        showError(`No patient found with CNIC: ${cnicSearch}`);
        return;
      }
      setSelectedHistory(data.data);
      showSuccess(`Loaded history for ${data.data.patient.name}`);
    } catch (err) {
      showError('Error retrieving patient CNIC record');
    } finally {
      setSearchingCnic(false);
    }
  };

  const filteredPatientsList = useMemo(() => {
    return patients.filter((pat) => {
      const q = cnicSearch.toLowerCase();
      return (
        pat.name?.toLowerCase().includes(q) ||
        pat.cnic?.toLowerCase().includes(q) ||
        pat.phone?.toLowerCase().includes(q) ||
        pat.patientId?.toLowerCase().includes(q)
      );
    });
  }, [patients, cnicSearch]);

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Reception & OPD Scheduling Desk</h2>
        <SkeletonCard count={3} />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2>Reception & OPD Scheduling Desk</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Patient Intake, CNIC Lifetime Medical Lookup, Token Issuance & QR Slips
          </p>
        </div>
      </div>

      {/* CNIC Lookup Banner */}
      <div className="card" style={styles.lookupCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <CreditCard size={24} color="var(--color-primary)" />
          <div>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Patient CNIC Search & Medical Archive</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Enter CNIC to pull lifetime consultation files, diagnoses, past medicines & vitals history
            </p>
          </div>
        </div>
        <form onSubmit={handleCnicSearch} style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Enter CNIC (e.g., 35202-1234567-1)"
              value={cnicSearch}
              onChange={(e) => setCnicSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={searchingCnic}>
            <History size={16} /> {searchingCnic ? 'Searching...' : 'Fetch Lifetime Record'}
          </button>
        </form>
      </div>

      <div style={styles.contentGrid}>
        {/* Register Walk-In Patient */}
        <div className="card">
          <h3 style={styles.cardTitle}>
            <UserPlus size={20} color="var(--color-primary)" /> Register New Patient File
          </h3>
          <form onSubmit={handleRegisterPatient} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Muhammad Ali"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                required
              />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CNIC Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="35202-1234567-1"
                  value={patientForm.cnic}
                  onChange={(e) => setPatientForm({ ...patientForm, cnic: e.target.value })}
                  required
                />
              </div>
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
            </div>
            <div style={styles.formRow}>
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
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+92 300 1234567"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={styles.formRow}>
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
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Main Boulevard, Lahore"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Patient & Assign CNIC'}
            </button>
          </form>
        </div>

        {/* Book Appointment & Issue QR Slip */}
        <div className="card">
          {selectedPatient ? (
            <div>
              <div style={styles.selectedHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Book Session: {selectedPatient.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CNIC: {selectedPatient.cnic}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPatient(null)}>Change</button>
              </div>

              <form onSubmit={handleBookAppointment} style={styles.form}>
                <div className="form-group">
                  <label className="form-label">Select Medical Specialist</label>
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
                    <label className="form-label">Consultation Room</label>
                    <select
                      className="form-control"
                      value={apptForm.roomNumber}
                      onChange={(e) => setApptForm({ ...apptForm, roomNumber: e.target.value })}
                    >
                      <option value="Room 101">Room 101 - OPD General</option>
                      <option value="Room 102">Room 102 - Cardiology</option>
                      <option value="Room 103">Room 103 - Pediatrics</option>
                      <option value="Room 104">Room 104 - Orthopedics</option>
                      <option value="Room 105">Room 105 - Neurology</option>
                      <option value="Room 201">Room 201 - Executive Desk</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={apptForm.date}
                      onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Time Slot</label>
                    <select
                      className="form-control"
                      value={apptForm.slot}
                      onChange={(e) => setApptForm({ ...apptForm, slot: e.target.value })}
                    >
                      <option value="09:00 - 09:30">09:00 - 09:30 AM</option>
                      <option value="10:00 - 10:30">10:00 - 10:30 AM</option>
                      <option value="11:00 - 11:30">11:00 - 11:30 AM</option>
                      <option value="14:00 - 14:30">02:00 - 02:30 PM</option>
                      <option value="15:00 - 15:30">03:00 - 03:30 PM</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Consultation Type</label>
                    <select
                      className="form-control"
                      value={apptForm.type}
                      onChange={(e) => setApptForm({ ...apptForm, type: e.target.value })}
                    >
                      <option value="Walk-In">Walk-In OPD</option>
                      <option value="Online">Online Appointment</option>
                      <option value="Follow-Up">Follow-Up Visit</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Visit Symptoms / Remarks</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Routine checkup, headache, fever..."
                    value={apptForm.reason}
                    onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Printer size={18} /> {submitting ? 'Processing...' : 'Reserve Session & Issue QR Slip'}
                </button>
              </form>
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={44} className="empty-state-icon" />
              <h4>Select a Patient Below to Issue Token Slip</h4>
              <p style={{ fontSize: '0.875rem' }}>Choose any patient from the directory table below to book an OPD consultation and generate a QR slip.</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={styles.cardTitle}>Hospital Patient Registry ({filteredPatientsList.length})</h3>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>National CNIC</th>
                <th>Phone</th>
                <th>Gender / Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatientsList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No patient records matched criteria.
                  </td>
                </tr>
              ) : (
                filteredPatientsList.map((pat) => (
                  <tr key={pat._id}>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{pat.patientId}</span></td>
                    <td style={{ fontWeight: 600 }}>{pat.name}</td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{pat.cnic || 'N/A'}</span></td>
                    <td>{pat.phone}</td>
                    <td>{pat.gender} ({new Date().getFullYear() - new Date(pat.dateOfBirth).getFullYear()} y/o)</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedPatient(pat);
                            showInfo(`Selected ${pat.name} for appointment token`);
                          }}
                        >
                          <Calendar size={14} /> Book & Issue Slip
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={async () => {
                            if (pat.cnic) {
                              setCnicSearch(pat.cnic);
                              const res = await fetchWithAuth(`/api/v1/patients/cnic/${encodeURIComponent(pat.cnic)}`);
                              const d = await res.json();
                              if (d.data) setSelectedHistory(d.data);
                            }
                          }}
                        >
                          <History size={14} /> View History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Slip Modal */}
      {activeSlipAppointment && (
        <AppointmentSlipModal
          appointment={activeSlipAppointment}
          onClose={() => setActiveSlipAppointment(null)}
        />
      )}

      {/* Patient History Modal */}
      {selectedHistory && (
        <PatientHistoryModal
          historyData={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
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
    marginBottom: '4px',
  },
  lookupCard: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid rgba(37, 99, 235, 0.25)',
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

export default ReceptionistDashboard;
