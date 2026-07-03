import BaseRepository from './base.repository.js';
import Patient from '../models/Patient.js';

class PatientRepository extends BaseRepository {
  constructor() {
    super(Patient);
  }

  async findByPatientId(patientId) {
    return this.findOne({ patientId });
  }

  async findByUserId(userId) {
    return this.findOne({ userId });
  }

  async findByCnic(cnic) {
    return this.findOne({ cnic: cnic.trim() });
  }
}

export default new PatientRepository();
