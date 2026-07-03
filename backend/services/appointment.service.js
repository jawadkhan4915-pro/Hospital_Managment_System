import appointmentRepository from '../repositories/appointment.repository.js';
import staffRepository from '../repositories/staff.repository.js';
import logger from '../config/logger.js';

class AppointmentService {
  async bookAppointment(patientId, doctorId, dateString, timeSlot, type, reason, roomNumber = 'Room 101') {
    // Validate doctor exists and is active
    const doctor = await staffRepository.findById(doctorId);
    if (!doctor || doctor.status !== 'Active') {
      throw new Error('Selected doctor is not active or not found');
    }

    const date = new Date(dateString);
    
    // Check existing appointments on this date to compute queue number
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const activeAppointmentsCount = await appointmentRepository.count({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const queueNumber = activeAppointmentsCount + 1;

    const appointment = await appointmentRepository.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      type,
      reason,
      queueNumber,
      roomNumber: roomNumber || 'Room 101',
    });

    logger.info(`Appointment booked: Patient ${patientId} with Doctor ${doctorId}. Queue: ${queueNumber}`);
    return appointment;
  }

  async getPatientAppointments(patientId) {
    return appointmentRepository.find({ patientId }, { populate: [{ path: 'doctorId', populate: { path: 'userId' } }] });
  }

  async getDoctorAppointments(doctorId) {
    return appointmentRepository.find({ doctorId }, { populate: 'patientId' });
  }

  async getAllAppointments() {
    return appointmentRepository.find({}, { populate: ['patientId', { path: 'doctorId', populate: { path: 'userId' } }] });
  }

  async updateStatus(appointmentId, status) {
    const appointment = await appointmentRepository.update(appointmentId, { status });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    logger.info(`Appointment ${appointmentId} status updated to ${status}`);
    return appointment;
  }
}

export default new AppointmentService();
