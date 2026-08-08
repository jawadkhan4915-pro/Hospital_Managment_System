import express from 'express';
import { createInvoice, getInvoices, payInvoice } from '../controllers/billing.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/invoice', authorizeRoles('Admin', 'Accountant', 'Doctor', 'Receptionist'), createInvoice);
router.get('/', authorizeRoles('Admin', 'Accountant', 'Doctor', 'Receptionist', 'Patient'), getInvoices);
router.put('/:id/pay', validateMongoObjectId('id'), authorizeRoles('Admin', 'Accountant', 'Patient', 'Receptionist'), payInvoice);

export default router;

