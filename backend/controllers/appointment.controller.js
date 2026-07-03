import appointmentService from '../services/appointment.service.js';
import patientService from '../services/patient.service.js';
import staffService from '../services/staff.service.js';

export const bookAppointment = async (req, res, next) => {
  try {
    let { patientId, doctorId, date, timeSlot, type, reason, roomNumber } = req.body;

    // If client is a Patient, map their userId to patientId
    if (req.user.role === 'Patient') {
      const patient = await patientService.getPatientByUserId(req.user.id);
      if (!patient) {
        res.status(400);
        throw new Error('Patient profile must be created before booking an appointment');
      }
      patientId = patient._id;
    }

    if (!patientId || !doctorId || !date || !timeSlot) {
      res.status(400);
      throw new Error('patientId, doctorId, date, and timeSlot are required fields');
    }

    const appointment = await appointmentService.bookAppointment(
      patientId,
      doctorId,
      date,
      timeSlot,
      type,
      reason,
      roomNumber
    );

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    if (req.user.role === 'Patient') {
      const patient = await patientService.getPatientByUserId(req.user.id);
      if (!patient) {
        return res.status(200).json({ success: true, data: [] });
      }
      const appointments = await appointmentService.getPatientAppointments(patient._id);
      return res.status(200).json({ success: true, data: appointments });
    }

    if (req.user.role === 'Doctor') {
      const doctor = await staffService.getStaffByUserId(req.user.id);
      if (!doctor) {
        return res.status(200).json({ success: true, data: [] });
      }
      const appointments = await appointmentService.getDoctorAppointments(doctor._id);
      return res.status(200).json({ success: true, data: appointments });
    }

    // Admins and other staff see all appointments
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await appointmentService.updateStatus(req.params.id, status);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
