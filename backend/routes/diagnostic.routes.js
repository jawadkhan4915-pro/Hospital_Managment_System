import express from 'express';
import {
  orderDiagnosticTest,
  getPatientDiagnostics,
  getPendingDiagnostics,
  recordDiagnosticResults,
  getDiagnosticById,
} from '../controllers/diagnostic.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

// Order diagnostic test (Doctors and Admins)
router.post('/order', authorizeRoles('Doctor', 'Admin'), orderDiagnosticTest);

// Get pending diagnostics for lab queue
router.get('/pending', authorizeRoles('Doctor', 'Nurse', 'Admin'), getPendingDiagnostics);

// Get patient diagnostic history
router.get(
  '/patient/:patientId',
  validateMongoObjectId('patientId'),
  authorizeRoles('Doctor', 'Nurse', 'Admin', 'Patient'),
  getPatientDiagnostics
);

// Record results (Lab / Nurse / Doctor)
router.put(
  '/:id/results',
  validateMongoObjectId('id'),
  authorizeRoles('Doctor', 'Nurse', 'Admin'),
  recordDiagnosticResults
);

// Get single diagnostic order by ID
router.get(
  '/:id',
  validateMongoObjectId('id'),
  authorizeRoles('Doctor', 'Nurse', 'Admin', 'Patient'),
  getDiagnosticById
);

export default router;
