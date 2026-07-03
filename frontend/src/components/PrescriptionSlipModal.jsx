import React from 'react';
import QRCodeGenerator from './QRCodeGenerator.jsx';
import { Printer, X, Pill, FileText, CheckCircle2 } from 'lucide-react';

const PrescriptionSlipModal = ({ record, onClose }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const patientName = record.patientId?.name || 'Patient';
  const patientCnic = record.patientId?.cnic || 'N/A';
  const doctorName = record.doctorId?.userId?.name || record.digitalSignature || 'Practitioner';

  const qrPayload = JSON.stringify({
    type: 'PRESCRIPTION_SLIP',
    recordId: record._id,
    patientName,
    cnic: patientCnic,
    diagnosis: record.diagnosis,
    prescription: record.prescription || [],
    signature: record.digitalSignature || 'Signed Digitally',
    date: record.createdAt,
  });

  return (
    <div style={styles.overlay}>
      <div className="card animate-fade-in" style={styles.modalCard}>
        <div style={styles.topBar}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Official Medical Prescription Slip</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> Print Prescription
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Slip Container */}
        <div id="printable-prescription" style={styles.slipContainer}>
          <div style={styles.slipHeader}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '2px' }}>ENTERPRISE HMS CLINICAL Rx</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Medical Prescription & Dispensary Order</p>
          </div>

          <div style={styles.patientBar}>
            <div>
              <span style={styles.label}>Patient Name:</span> <strong>{patientName}</strong>
            </div>
            <div>
              <span style={styles.label}>CNIC:</span> <strong>{patientCnic}</strong>
            </div>
            <div>
              <span style={styles.label}>Date:</span> <strong>{new Date(record.createdAt || Date.now()).toLocaleDateString()}</strong>
            </div>
          </div>

          <div style={styles.diagnosisBox}>
            <span style={styles.label}>Diagnosis / Impression:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
              {record.diagnosis}
            </div>
          </div>

          <div style={styles.rxSection}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Pill size={18} color="var(--color-success)" /> Prescribed Medications
            </h4>
            {(!record.prescription || record.prescription.length === 0) ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No medications prescribed.</p>
            ) : (
              <div style={styles.medList}>
                {record.prescription.map((med, idx) => (
                  <div key={idx} style={styles.medItem}>
                    <div style={{ fontWeight: 700 }}>{idx + 1}. {med.medicineName} ({med.dosage})</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      Instructions: {med.frequency} for {med.duration}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.footerRow}>
            <div style={styles.signatureBlock}>
              <span style={styles.label}>Signed Digitally By:</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, marginTop: '2px' }}>{doctorName}</div>
            </div>
            <div style={styles.qrBlock}>
              <QRCodeGenerator value={qrPayload} size={130} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                Scan to Dispense at Pharmacy
              </span>
            </div>
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    width: '100%',
    maxWidth: '560px',
    padding: '24px',
    borderRadius: 'var(--border-radius-lg)',
    backgroundColor: 'var(--bg-secondary)',
    boxShadow: 'var(--box-shadow-lg)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  slipContainer: {
    border: '2px solid var(--color-success)',
    borderRadius: '16px',
    padding: '24px',
    background: 'var(--bg-primary)',
  },
  slipHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  patientBar: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  diagnosisBox: {
    marginBottom: '18px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-primary-light)',
    borderRadius: '10px',
  },
  rxSection: {
    marginBottom: '20px',
  },
  medList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  medItem: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    borderTop: '1px solid var(--border-color)',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  qrBlock: {
    textAlign: 'center',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '0.775rem',
  },
};

export default PrescriptionSlipModal;
