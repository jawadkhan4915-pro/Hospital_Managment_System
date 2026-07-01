import express from 'express';
import staffService from '../services/staff.service.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/doctors', async (req, res, next) => {
  try {
    const doctors = await staffService.getAllDoctors();
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const staff = await staffService.registerStaff(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/schedule', authorizeRoles('Admin', 'Doctor'), async (req, res, next) => {
  try {
    const staff = await staffService.updateSchedule(req.params.id, req.body);
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const staff = await staffService.getStaffProfile(req.params.id);
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
});

export default router;
