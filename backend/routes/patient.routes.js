import express from 'express';
import { registerPatient, getPatientProfile, getMyProfile, addVitals, getAllPatients } from '../controllers/patient.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('Admin', 'Nurse', 'Doctor'), registerPatient);
router.get('/', authorizeRoles('Admin', 'Doctor', 'Nurse'), getAllPatients);
router.get('/me', authorizeRoles('Patient'), getMyProfile);
router.get('/:id', authorizeRoles('Admin', 'Doctor', 'Nurse'), getPatientProfile);
router.put('/:id/vitals', authorizeRoles('Admin', 'Doctor', 'Nurse'), addVitals);

export default router;
