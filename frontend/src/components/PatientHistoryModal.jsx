import React from 'react';
import { X, User, Calendar, HeartPulse, FileText, Pill, Shield } from 'lucide-react';

const PatientHistoryModal = ({ historyData, onClose }) => {
  if (!historyData || !historyData.patient) return null;

  const { patient, appointments = [], medicalRecords = [] } = historyData;

  return (
    <div style={styles.overlay}>
      <div className="card animate-fade-in" style={styles.modalCard}>
        <div style={styles.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={22} color="var(--color-primary)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Lifetime Medical File: {patient.name}</h3>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>National CNIC: {patient.cnic}</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.scrollContent}>
          {/* Demographic Bar */}
          <div style={styles.demoBar}>
            <div><span style={styles.label}>Patient ID:</span> <strong>{patient.patientId}</strong></div>
            <div><span style={styles.label}>Gender / DOB:</span> <strong>{patient.gender} ({new Date(patient.dateOfBirth).toLocaleDateString()})</strong></div>
            <div><span style={styles.label}>Phone:</span> <strong>{patient.phone}</strong></div>
            <div><span style={styles.label}>Blood Group:</span> <strong>{patient.bloodGroup || 'N/A'}</strong></div>
          </div>

          {/* Vitals Snapshot */}
          {patient.vitals?.length > 0 && (
            <div style={styles.sectionCard}>
              <h4 style={styles.sectionTitle}>
                <HeartPulse size={18} color="var(--color-danger)" /> Recorded Vitals History ({patient.vitals.length})
              </h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>BP</th>
                      <th>Pulse</th>
                      <th>Temp</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.vitals.slice().reverse().map((v, i) => (
                      <tr key={i}>
                        <td>{new Date(v.recordedAt).toLocaleString()}</td>
                        <td><strong>{v.bloodPressure}</strong></td>
                        <td>{v.pulse} bpm</td>
                        <td>{v.temperature}°C</td>
                        <td>{v.weight} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clinical EMR & Prescriptions History */}
          <div style={styles.sectionCard}>
            <h4 style={styles.sectionTitle}>
              <FileText size={18} color="var(--color-primary)" /> Past Diagnoses & Prescriptions ({medicalRecords.length})
            </h4>
            {medicalRecords.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>No historical EMR records logged.</p>
            ) : (
              <div style={styles.recordList}>
                {medicalRecords.map((rec) => (
                  <div key={rec._id} style={styles.recordItem}>
                    <div style={styles.itemHeader}>
                      <span className="badge badge-primary">{rec.diagnosis}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={styles.recText}><strong>Physician:</strong> {rec.doctorId?.userId?.name || rec.digitalSignature || 'Doctor'}</p>
                    <p style={styles.recText}><strong>Symptoms & Subjective:</strong> {rec.soapNotes?.subjective || 'N/A'}</p>
                    <p style={styles.recText}><strong>Treatment Plan:</strong> {rec.soapNotes?.plan || 'N/A'}</p>
                    {rec.prescription?.length > 0 && (
                      <div style={styles.rxBadgeList}>
                        <strong style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Prescribed:</strong>
                        {rec.prescription.map((p, idx) => (
                          <span key={idx} className="badge badge-success">
                            <Pill size={12} /> {p.medicineName} ({p.dosage} - {p.frequency})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointment Visits */}
          <div style={styles.sectionCard}>
            <h4 style={styles.sectionTitle}>
              <Calendar size={18} color="var(--color-success)" /> Visit History & Consultations ({appointments.length})
            </h4>
            {appointments.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>No visit records found.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Doctor</th>
                      <th>Queue # / Room</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id}>
                        <td>{new Date(a.date).toLocaleDateString()} ({a.timeSlot})</td>
                        <td>Dr. {a.doctorId?.userId?.name || 'Practitioner'}</td>
                        <td>Queue #{a.queueNumber} ({a.roomNumber || 'Room 101'})</td>
                        <td>
                          <span className={`badge ${a.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    width: '100%',
    maxWidth: '780px',
    maxHeight: '90vh',
    padding: '24px',
    borderRadius: 'var(--border-radius-lg)',
    backgroundColor: 'var(--bg-secondary)',
    boxShadow: 'var(--box-shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  scrollContent: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingRight: '6px',
  },
  demoBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '12px',
    fontSize: '0.85rem',
    flexWrap: 'wrap',
    gap: '10px',
  },
  sectionCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    padding: '18px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  recordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recordItem: {
    padding: '14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  recText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  rxBadgeList: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '0.775rem',
  },
};

export default PatientHistoryModal;
