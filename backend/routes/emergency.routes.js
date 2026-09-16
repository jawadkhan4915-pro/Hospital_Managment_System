import express from 'express';
import {
  triggerEmergency,
  getActiveEmergencies,
  respondToEmergency,
  resolveEmergency,
  getEmergencyHistory,
} from '../controllers/emergency.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

// Get active emergencies (available to all hospital clinical roles)
router.get('/active', authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist'), getActiveEmergencies);

// Trigger emergency broadcast
router.post('/trigger', authorizeRoles('Admin', 'Doctor', 'Nurse', 'Receptionist'), triggerEmergency);

// Respond to an emergency
router.post('/:id/respond', validateMongoObjectId('id'), authorizeRoles('Admin', 'Doctor', 'Nurse'), respondToEmergency);

// Resolve emergency
router.put('/:id/resolve', validateMongoObjectId('id'), authorizeRoles('Admin', 'Doctor', 'Nurse'), resolveEmergency);

// Incident History
router.get('/history', authorizeRoles('Admin', 'Doctor', 'Nurse'), getEmergencyHistory);

export default router;
