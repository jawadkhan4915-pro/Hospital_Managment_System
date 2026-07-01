import express from 'express';
import { bookAppointment, getMyAppointments, updateStatus } from '../controllers/appointment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', bookAppointment);
router.get('/', getMyAppointments);
router.put('/:id/status', updateStatus);

export default router;
