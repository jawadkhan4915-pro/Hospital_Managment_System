import React from 'react';
import QRCodeGenerator from './QRCodeGenerator.jsx';
import { Printer, X, Calendar, User, ShieldAlert, DoorOpen } from 'lucide-react';

const AppointmentSlipModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const patientName = appointment.patientId?.name || 'Patient';
  const patientCnic = appointment.patientId?.cnic || 'N/A';
  const doctorName = appointment.doctorId?.userId?.name || 'Doctor';
  const doctorDept = appointment.doctorId?.department || 'General';
  const doctorSpec = appointment.doctorId?.specialization || 'Consultant';
  const roomNumber = appointment.roomNumber || 'Room 101';

  const qrPayload = JSON.stringify({
    type: 'APPOINTMENT_SLIP',
    appointmentId: appointment._id,
    patientName,
    cnic: patientCnic,
    doctorName: `Dr. ${doctorName}`,
    department: doctorDept,
    room: roomNumber,
    queueNumber: appointment.queueNumber,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
  });

  return (
    <div style={styles.overlay}>
      <div className="card animate-fade-in" style={styles.modalCard}>
        <div style={styles.topBar}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Official Appointment Slip</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> Print Slip
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Slip Container */}
        <div id="printable-slip" style={styles.slipContainer}>
          <div style={styles.slipHeader}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '4px' }}>ENTERPRISE HMS</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OPD Consultation & Queue Token</p>
          </div>

          <div style={styles.tokenBox}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Token Queue Number</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>#{appointment.queueNumber}</div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoBlock}>
              <span style={styles.label}>Patient Name:</span>
              <strong style={styles.value}>{patientName}</strong>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.label}>National CNIC:</span>
              <strong style={styles.value}>{patientCnic}</strong>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.label}>Assigned Physician:</span>
              <strong style={styles.value}>Dr. {doctorName} ({doctorSpec})</strong>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.label}>Department:</span>
              <strong style={styles.value}>{doctorDept}</strong>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.label}>Consultation Room:</span>
              <strong style={{ ...styles.value, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                <DoorOpen size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {roomNumber}
              </strong>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.label}>Date & Timeslot:</span>
              <strong style={styles.value}>{new Date(appointment.date).toLocaleDateString()} ({appointment.timeSlot})</strong>
            </div>
          </div>

          <div style={styles.qrSection}>
            <QRCodeGenerator value={qrPayload} size={150} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
              Scan QR Code at Doctor OPD Desk / Pharmacy
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
    maxWidth: '520px',
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
    border: '2px dashed var(--color-primary)',
    borderRadius: '16px',
    padding: '24px',
    background: 'var(--bg-primary)',
  },
  slipHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  tokenBox: {
    textAlign: 'center',
    backgroundColor: 'var(--color-primary-light)',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid rgba(37, 99, 235, 0.2)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
    fontSize: '0.875rem',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '0.775rem',
  },
  value: {
    color: 'var(--text-primary)',
  },
  qrSection: {
    textAlign: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)',
  },
};

export default AppointmentSlipModal;
