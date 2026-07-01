import express from 'express';
import { createInvoice, getInvoices, payInvoice } from '../controllers/billing.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/invoice', authorizeRoles('Admin', 'Accountant'), createInvoice);
router.get('/', getInvoices);
router.put('/:id/pay', payInvoice);

export default router;
