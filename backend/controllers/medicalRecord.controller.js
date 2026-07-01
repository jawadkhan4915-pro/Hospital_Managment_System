import medicalRecordService from '../services/medicalRecord.service.js';
import staffService from '../services/staff.service.js';
import patientService from '../services/patient.service.js';

export const addRecord = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, soapNotes, prescription, labRequests, radiologyRequests, digitalSignature } = req.body;

    const doctor = await staffService.getStaffByUserId(req.user.id);
    if (!doctor) {
      res.status(403);
      throw new Error('Only registered doctors can submit medical records');
    }

    const record = await medicalRecordService.addRecord(
      patientId,
      doctor._id,
      appointmentId,
      diagnosis,
      soapNotes,
      prescription,
      labRequests,
      radiologyRequests,
      digitalSignature
    );

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const getPatientHistory = async (req, res, next) => {
  try {
    let patientId = req.params.patientId;
    
    // If patient requesting their own EMR, find their patient profile
    if (req.user.role === 'Patient') {
      const patient = await patientService.getPatientByUserId(req.user.id);
      if (!patient) {
        return res.status(200).json({ success: true, data: [] });
      }
      patientId = patient._id;
    }

    const records = await medicalRecordService.getPatientHistory(patientId);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

export const getAllRecords = async (req, res, next) => {
  try {
    const records = await medicalRecordService.getAllRecords();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};
