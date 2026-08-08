import express from 'express';
import { addRecord, getPatientHistory, getAllRecords } from '../controllers/medicalRecord.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('Doctor', 'Admin'), addRecord);
router.get('/', authorizeRoles('Admin', 'Doctor', 'Nurse'), getAllRecords);
router.get('/patient/:patientId', validateMongoObjectId('patientId'), authorizeRoles('Admin', 'Doctor', 'Nurse', 'Patient'), getPatientHistory);

export default router;

