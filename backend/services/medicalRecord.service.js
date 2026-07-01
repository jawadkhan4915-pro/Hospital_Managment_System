import medicalRecordRepository from '../repositories/medicalRecord.repository.js';
import patientRepository from '../repositories/patient.repository.js';
import logger from '../config/logger.js';

class MedicalRecordService {
  async addRecord(patientId, doctorId, appointmentId, diagnosis, soapNotes, prescription, labRequests, radiologyRequests, digitalSignature) {
    // Validate patient
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const record = await medicalRecordRepository.create({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      soapNotes,
      prescription,
      labRequests,
      radiologyRequests,
      digitalSignature,
    });

    logger.info(`EMR created for Patient ${patient.patientId} by Doctor ${doctorId}`);
    return record;
  }

  async getPatientHistory(patientId) {
    return medicalRecordRepository.find({ patientId }, { populate: [{ path: 'doctorId', populate: { path: 'userId' } }] });
  }

  async getRecordDetails(recordId) {
    return medicalRecordRepository.findById(recordId, { populate: ['patientId', { path: 'doctorId', populate: { path: 'userId' } }] });
  }

  async getAllRecords() {
    return medicalRecordRepository.find({}, { populate: ['patientId', { path: 'doctorId', populate: { path: 'userId' } }] });
  }
}

export default new MedicalRecordService();
