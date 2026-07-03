import patientService from '../services/patient.service.js';

export const registerPatient = async (req, res, next) => {
  try {
    const patient = await patientService.registerPatient(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

export const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientProfile(req.params.id);
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

export const addVitals = async (req, res, next) => {
  try {
    const patient = await patientService.addVitals(req.params.id, req.body);
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

export const getPatientByCnic = async (req, res, next) => {
  try {
    const data = await patientService.getPatientHistoryByCnic(req.params.cnic);
    if (!data) {
      return res.status(404).json({ success: false, message: 'No patient record found with this CNIC' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};
