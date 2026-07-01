import BaseRepository from './base.repository.js';
import Appointment from '../models/Appointment.js';

class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  async findByDoctorAndDate(doctorId, dateString) {
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }

  async findByPatientId(patientId) {
    return this.find({ patientId }, { populate: 'doctorId' });
  }
}

export default new AppointmentRepository();
