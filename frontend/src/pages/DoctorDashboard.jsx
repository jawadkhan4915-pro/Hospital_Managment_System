import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Calendar, User, FileText, CheckCircle, FilePlus, Activity, Plus, Trash2 } from 'lucide-react';

const DoctorDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
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

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      const apptRes = await fetchWithAuth('/api/v1/appointments');
      const apptData = await apptRes.json();
      setAppointments(apptData.data || []);

      const recordRes = await fetchWithAuth('/api/v1/records');
      const recordData = await recordRes.json();
      setMedicalRecords(recordData.data || []);
    } catch (e) {
      console.error(e);
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
    setMessage('');
  };

  const handleAddMedication = () => {
    if (!medName || !medDosage || !medFreq || !medDur) return;
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
    setMessage('');

    try {
      // Create Medical Record
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
      if (!recordRes.ok) {
        throw new Error(recordData.message || 'Failed to submit medical record');
      }

      // Update Appointment status to Completed
      await fetchWithAuth(`/api/v1/appointments/${selectedAppointment._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Completed' }),
      });

      // Generate invoice for patient (Consultation Fee, Prescription medicines fee)
      const billingItems = [
        { description: 'Physician Consultation Fee', quantity: 1, price: 150 },
      ];
      prescription.forEach((med) => {
        billingItems.push({ description: `Prescription Medicine: ${med.medicineName}`, quantity: 1, price: 30 });
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

      setMessage('EMR submitted, appointment completed, and invoice generated successfully!');
      setSelectedAppointment(null);
      loadDoctorData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading clinical interface...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '24px' }}>Clinical Dashboard</h2>

      <div style={styles.dashboardGrid}>
        {/* Appointment Queue */}
        <div className="glass" style={styles.panel}>
          <h3 style={styles.panelTitle}><Calendar size={20} color="var(--color-primary)" /> Daily Appointment Queue</h3>
          <div style={styles.list}>
            {appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').length === 0 ? (
              <div style={styles.empty}>No pending appointments today.</div>
            ) : (
              appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').map((appt) => (
                <div
                  key={appt._id}
                  style={{
                    ...styles.listItem,
                    borderColor: selectedAppointment?._id === appt._id ? 'var(--color-primary)' : 'var(--border-color)',
                  }}
                  onClick={() => handleSelectAppointment(appt)}
                >
                  <div style={styles.apptInfo}>
                    <span style={{ fontWeight: 600 }}>Queue #{appt.queueNumber} - {appt.patientId?.name}</span>
                    <span style={styles.timeLabel}>{appt.timeSlot}</span>
                  </div>
                  <div style={styles.apptDetails}>
                    <span>Type: {appt.type}</span>
                    <span className="badge badge-warning">{appt.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EMR SOAP form */}
        <div className="glass" style={styles.panel}>
          {selectedAppointment ? (
            <div>
              <h3 style={styles.panelTitle}><FilePlus size={20} color="var(--color-success)" /> Consultation File: {selectedAppointment.patientId?.name}</h3>
              {message && (
                <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
                  {message}
                </div>
              )}
              
              {/* Quick vitals reference */}
              {selectedAppointment.patientId?.vitals?.length > 0 && (
                <div style={styles.vitalsRef}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Latest Patient Vitals:</h4>
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
                    placeholder="e.g. Acute Pharyngitis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.soapSection}>
                  <div className="form-group">
                    <label className="form-label">Subjective (Symptoms, patient story)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={subjective}
                      onChange={(e) => setSubjective(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Objective (Clinical tests, physical signs)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assessment (Analysis, differential diagnosis)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plan (Therapeutic, diagnostics, followup)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    />
                  </div>
                </div>

                {/* Prescription Editor */}
                <div style={styles.prescriptionSection}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Add Medications</h4>
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
                      placeholder="Dosage (e.g. 500mg)"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Freq (e.g. 1-0-1)"
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
                      <Plus size={16} />
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
                    placeholder="Type name to sign digitally"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  <CheckCircle size={18} /> Complete Session & Submit EMR
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.noApptSelected}>
              <Activity size={48} color="var(--text-tertiary)" />
              <p>Select a patient from the queue to start consult file</p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Records */}
      <div className="glass" style={{ ...styles.panel, marginTop: '30px' }}>
        <h3 style={styles.panelTitle}><FileText size={20} color="var(--color-primary)" /> Hospital Medical Consultation Log</h3>
        <div className="table-container" style={{ marginTop: '15px' }}>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Diagnosis</th>
                <th>Prescribed Items</th>
                <th>Signed By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No EMR history matches.</td>
                </tr>
              ) : (
                medicalRecords.map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.patientId?.name || 'Walk-In'}</td>
                    <td><span style={{ fontWeight: 600 }}>{rec.diagnosis}</span></td>
                    <td>
                      {rec.prescription.map(p => `${p.medicineName} (${p.dosage})`).join(', ') || 'None'}
                    </td>
                    <td>{rec.digitalSignature}</td>
                    <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
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
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '30px',
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
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  apptInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  timeLabel: {
    fontSize: '0.85rem',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  apptDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    padding: '30px 0',
  },
  noApptSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-tertiary)',
    gap: '15px',
  },
  vitalsRef: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '15px',
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
    gap: '15px',
  },
  soapSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  prescriptionSection: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '20px',
    marginTop: '10px',
  },
  prescriptionFields: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
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
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.9rem',
  },
  delBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-danger)',
    cursor: 'pointer',
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

export default DoctorDashboard;
