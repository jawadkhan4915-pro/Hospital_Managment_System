import express from 'express';
import { register, login, verifyMfa, enableMfa } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/mfa/verify', verifyMfa);
router.post('/mfa/enable', authenticate, enableMfa);

export default router;
