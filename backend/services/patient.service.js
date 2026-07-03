import patientRepository from '../repositories/patient.repository.js';
import appointmentRepository from '../repositories/appointment.repository.js';
import medicalRecordRepository from '../repositories/medicalRecord.repository.js';
import logger from '../config/logger.js';

class PatientService {
  async registerPatient(patientData) {
    const count = await patientRepository.count();
    const patientId = `PAT-${1000 + count + 1}`;

    const patient = await patientRepository.create({
      ...patientData,
      patientId,
    });

    logger.info(`Patient record created: ${patientId}`);
    return patient;
  }

  async getPatientProfile(patientId) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  async getPatientByUserId(userId) {
    const patient = await patientRepository.findByUserId(userId);
    return patient;
  }

  async getPatientHistoryByCnic(cnic) {
    const patient = await patientRepository.findByCnic(cnic);
    if (!patient) {
      return null;
    }
    const appointments = await appointmentRepository.findByPatientId(patient._id);
    const medicalRecords = await medicalRecordRepository.findByPatientId(patient._id);
    return {
      patient,
      appointments,
      medicalRecords,
    };
  }

  async addVitals(patientId, vitalsData) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.vitals.push(vitalsData);
    await patient.save();

    logger.info(`Vitals updated for patient: ${patient.patientId}`);
    return patient;
  }

  async getAllPatients() {
    return patientRepository.find();
  }
}

export default new PatientService();
