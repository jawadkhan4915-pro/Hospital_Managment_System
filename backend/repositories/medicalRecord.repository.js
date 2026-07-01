import BaseRepository from './base.repository.js';
import MedicalRecord from '../models/MedicalRecord.js';

class MedicalRecordRepository extends BaseRepository {
  constructor() {
    super(MedicalRecord);
  }

  async findByPatientId(patientId) {
    return this.find({ patientId }, { populate: 'doctorId', sort: { createdAt: -1 } });
  }
}

export default new MedicalRecordRepository();
