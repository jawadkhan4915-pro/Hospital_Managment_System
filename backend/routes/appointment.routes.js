import express from 'express';
import { bookAppointment, getMyAppointments, updateStatus } from '../controllers/appointment.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('Admin', 'Patient', 'Receptionist', 'Doctor'), bookAppointment);
router.get('/', authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient', 'Pharmacist'), getMyAppointments);
router.put('/:id/status', validateMongoObjectId('id'), authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist'), updateStatus);

export default router;

