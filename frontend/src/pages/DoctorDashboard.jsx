import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import PrescriptionSlipModal from '../components/PrescriptionSlipModal.jsx';
import PatientHistoryModal from '../components/PatientHistoryModal.jsx';
import { Calendar, FileText, CheckCircle, FilePlus, Activity, Plus, Trash2, Clock, Search, History, IdCard } from 'lucide-react';

const DoctorDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // CNIC Lifetime History Lookup
  const [cnicSearch, setCnicSearch] = useState('');
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [searchingCnic, setSearchingCnic] = useState(false);

  // Active Prescription Slip Modal
  const [createdPrescriptionRecord, setCreatedPrescriptionRecord] = useState(null);

  // SOAP Notes and Clinical Form states
  const [diagnosis, setDiagnosis] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [signature, setSignature] = useState('');
  
  // Prescription List
  const [prescription, setPrescription] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDur, setMedDur] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      const [apptRes, recordRes] = await Promise.all([
        fetchWithAuth('/api/v1/appointments'),
        fetchWithAuth('/api/v1/records'),
      ]);

      const [apptData, recordData] = await Promise.all([
        apptRes.json(),
        recordRes.json(),
      ]);

      setAppointments(apptData.data || []);
      setMedicalRecords(recordData.data || []);
    } catch (e) {
      showError('Failed to load clinical schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAppointment = (appt) => {
    setSelectedAppointment(appt);
    setDiagnosis('');
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setPrescription([]);
    showInfo(`Selected consultation: ${appt.patientId?.name}`);
  };

  const handleCnicSearch = async (e) => {
    e.preventDefault();
    if (!cnicSearch.trim()) return;

    setSearchingCnic(true);
    try {
      const res = await fetchWithAuth(`/api/v1/patients/cnic/${encodeURIComponent(cnicSearch.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.data) {
        showError(`No patient history found for CNIC: ${cnicSearch}`);
        return;
      }
      setSelectedHistory(data.data);
      showSuccess(`Loaded history for ${data.data.patient.name}`);
    } catch (err) {
      showError('Error searching patient history');
    } finally {
      setSearchingCnic(false);
    }
  };

  const handleAddMedication = () => {
    if (!medName || !medDosage || !medFreq || !medDur) {
      showError('Please complete all medication details');
      return;
    }
    setPrescription([...prescription, {
      medicineName: medName,
      dosage: medDosage,
      frequency: medFreq,
      duration: medDur,
    }]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedDur('');
  };

  const handleRemoveMedication = (index) => {
    setPrescription(prescription.filter((_, idx) => idx !== index));
  };

  const handleSubmitEMR = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setSubmitting(true);

    try {
      const recordRes = await fetchWithAuth('/api/v1/records', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedAppointment.patientId._id,
          appointmentId: selectedAppointment._id,
          diagnosis,
          soapNotes: { subjective, objective, assessment, plan },
          prescription,
          digitalSignature: signature || 'Signed Digitally',
        }),
      });
      const recordData = await recordRes.json();
      if (!recordRes.ok) throw new Error(recordData.message || 'Failed to submit medical record');

      await fetchWithAuth(`/api/v1/appointments/${selectedAppointment._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Completed' }),
      });

      const billingItems = [
        { description: 'Physician Consultation Fee', quantity: 1, price: 150 },
      ];
      prescription.forEach((med) => {
        billingItems.push({ description: `Prescription: ${med.medicineName}`, quantity: 1, price: 30 });
      });

      await fetchWithAuth('/api/v1/billing/invoice', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedAppointment.patientId._id,
          appointmentId: selectedAppointment._id,
          items: billingItems,
          taxPercent: 5,
          discount: 0,
        }),
      });

      showSuccess(`EMR & Invoice generated for ${selectedAppointment.patientId?.name}`);
      setCreatedPrescriptionRecord(recordData.data);
      setSelectedAppointment(null);
      loadDoctorData();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeQueue = useMemo(() => {
    return appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
  }, [appointments]);

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Clinical Dashboard</h2>
        <SkeletonCard count={3} />
        <SkeletonTable rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div>
        <h2>Clinical Practice Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Electronic Health Records (EMR), CNIC Patient History Lookup & QR Prescription Issuance
        </p>
      </div>

      {/* CNIC Lookup Banner for Doctors */}
      <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <IdCard size={22} color="var(--color-primary)" />
          <div>
            <h4 style={{ margin: 0 }}>Patient CNIC History Lookup</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Search patient by CNIC to view lifetime disease records, vitals trends & past prescriptions
            </p>
          </div>
        </div>
        <form onSubmit={handleCnicSearch} style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Enter Patient CNIC"
              value={cnicSearch}
              onChange={(e) => setCnicSearch(e.target.value)}
              style={{ paddingLeft: '40px', height: '38px', fontSize: '0.875rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={searchingCnic}>
            <History size={16} /> {searchingCnic ? 'Fetching...' : 'View Lifetime EMR'}
          </button>
        </form>
      </div>

      <div style={styles.dashboardGrid}>
        {/* Appointment Queue */}
        <div className="card">
          <h3 style={styles.panelTitle}>
            <Calendar size={20} color="var(--color-primary)" /> Today's Patient Queue ({activeQueue.length})
          </h3>
          <div style={styles.list}>
            {activeQueue.length === 0 ? (
              <div className="empty-state">
                <Clock size={36} className="empty-state-icon" />
                <p>No pending appointments in queue.</p>
              </div>
            ) : (
              activeQueue.map((appt) => (
                <div
                  key={appt._id}
                  style={{
                    ...styles.listItem,
                    borderColor: selectedAppointment?._id === appt._id ? 'var(--color-primary)' : 'var(--border-color)',
                    background: selectedAppointment?._id === appt._id ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                  }}
                  onClick={() => handleSelectAppointment(appt)}
                >
                  <div style={styles.apptInfo}>
                    <span style={{ fontWeight: 700 }}>Queue #{appt.queueNumber} - {appt.patientId?.name || 'Patient'}</span>
                    <span style={styles.timeLabel}>{appt.timeSlot}</span>
                  </div>
                  <div style={styles.apptDetails}>
                    <span>CNIC: {appt.patientId?.cnic || 'N/A'}</span>
                    <span className="badge badge-warning">{appt.roomNumber || 'Room 101'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EMR SOAP form */}
        <div className="card">
          {selectedAppointment ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={styles.panelTitle}>
                  <FilePlus size={20} color="var(--color-success)" /> Consultation: {selectedAppointment.patientId?.name}
                </h3>
                {selectedAppointment.patientId?.cnic && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={async () => {
                      const res = await fetchWithAuth(`/api/v1/patients/cnic/${encodeURIComponent(selectedAppointment.patientId.cnic)}`);
                      const d = await res.json();
                      if (d.data) setSelectedHistory(d.data);
                    }}
                  >
                    <History size={14} /> Full History
                  </button>
                )}
              </div>
              
              {selectedAppointment.patientId?.vitals?.length > 0 && (
                <div style={styles.vitalsRef}>
                  <h4 style={{ fontSize: '0.825rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Latest Patient Vitals:</h4>
                  {(() => {
                    const latest = selectedAppointment.patientId.vitals[selectedAppointment.patientId.vitals.length - 1];
                    return (
                      <div style={styles.vitalsGrid}>
                        <span>BP: <strong>{latest.bloodPressure}</strong></span>
                        <span>Temp: <strong>{latest.temperature}°C</strong></span>
                        <span>Pulse: <strong>{latest.pulse} bpm</strong></span>
                        <span>Weight: <strong>{latest.weight} kg</strong></span>
                      </div>
                    );
                  })()}
                </div>
              )}

              <form onSubmit={handleSubmitEMR} style={styles.form}>
                <div className="form-group">
                  <label className="form-label">Diagnosis / Impression</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acute Upper Respiratory Infection"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.soapSection}>
                  <div className="form-group">
                    <label className="form-label">Subjective (Symptoms)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Patient reports fever and throat irritation..."
                      value={subjective}
                      onChange={(e) => setSubjective(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Objective (Clinical Examination)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Pharyngeal erythema observed..."
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assessment</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Mild viral infection..."
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Treatment Plan</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Hydration, rest, 5-day medication course..."
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.prescriptionSection}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', fontWeight: '700' }}>Prescribe Medications (Embedded into QR Code)</h4>
                  <div style={styles.prescriptionFields}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Medicine"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dosage (500mg)"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Freq (1-0-1)"
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Duration"
                      value={medDur}
                      onChange={(e) => setMedDur(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={handleAddMedication} className="btn btn-secondary">
                      <Plus size={16} /> Add
                    </button>
                  </div>

                  {prescription.length > 0 && (
                    <div style={styles.prescriptionList}>
                      {prescription.map((med, idx) => (
                        <div key={idx} style={styles.prescItem}>
                          <span><strong>{med.medicineName}</strong> - {med.dosage} ({med.frequency}) for {med.duration}</span>
                          <button type="button" onClick={() => handleRemoveMedication(idx)} style={styles.delBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label className="form-label">Digital Signature</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Sign your full name digitally"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                  <CheckCircle size={18} /> {submitting ? 'Submitting EMR...' : 'Issue EMR & Printable QR Prescription'}
                </button>
              </form>
            </div>
          ) : (
            <div className="empty-state">
              <Activity size={48} className="empty-state-icon" />
              <h4>Select a Patient from Queue</h4>
              <p style={{ fontSize: '0.875rem' }}>Click on any patient card in the queue to begin recording consultation notes and prescriptions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="card">
        <h3 style={styles.panelTitle}>
          <FileText size={20} color="var(--color-primary)" /> Clinical EMR History Log
        </h3>
        <div className="table-container" style={{ marginTop: '16px' }}>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Diagnosis</th>
                <th>Prescribed Medications</th>
                <th>Digital Signature</th>
                <th>Consult Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No consultation records found.
                  </td>
                </tr>
              ) : (
                medicalRecords.map((rec) => (
                  <tr key={rec._id}>
                    <td style={{ fontWeight: 600 }}>{rec.patientId?.name || 'Patient'}</td>
                    <td><span className="badge badge-primary">{rec.diagnosis}</span></td>
                    <td>
                      {rec.prescription?.map(p => `${p.medicineName} (${p.dosage})`).join(', ') || 'None'}
                    </td>
                    <td>{rec.digitalSignature}</td>
                    <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCreatedPrescriptionRecord(rec)}
                      >
                        <FileText size={14} /> View QR Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Slip Modal with QR Code */}
      {createdPrescriptionRecord && (
        <PrescriptionSlipModal
          record={createdPrescriptionRecord}
          onClose={() => setCreatedPrescriptionRecord(null)}
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
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  apptInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  timeLabel: {
    fontSize: '0.85rem',
    color: 'var(--color-primary)',
    fontWeight: '700',
  },
  apptDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  vitalsRef: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '14px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    borderLeft: '4px solid var(--color-primary)',
  },
  vitalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    fontSize: '0.85rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  soapSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  prescriptionSection: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  prescriptionFields: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  },
  prescriptionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  prescItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '8px 14px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.875rem',
  },
  delBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-danger)',
    cursor: 'pointer',
  },
};

export default DoctorDashboard;
