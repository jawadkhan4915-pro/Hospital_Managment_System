import express from 'express';
import { addRecord, getPatientHistory, getAllRecords } from '../controllers/medicalRecord.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('Doctor'), addRecord);
router.get('/', authorizeRoles('Admin', 'Doctor', 'Nurse'), getAllRecords);
router.get('/patient/:patientId', getPatientHistory);

export default router;
