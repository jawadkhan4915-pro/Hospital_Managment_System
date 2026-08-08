import express from 'express';
import { registerPatient, getPatientProfile, getMyProfile, addVitals, getAllPatients, getPatientByCnic } from '../controllers/patient.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('Admin', 'Nurse', 'Doctor', 'Receptionist'), registerPatient);
router.get('/', authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist'), getAllPatients);
router.get('/me', authorizeRoles('Patient'), getMyProfile);
router.get('/cnic/:cnic', authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist'), getPatientByCnic);
router.get('/:id', validateMongoObjectId('id'), authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'), getPatientProfile);
router.put('/:id/vitals', validateMongoObjectId('id'), authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist'), addVitals);

export default router;

