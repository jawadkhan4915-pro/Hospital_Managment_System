import express from 'express';
import { addItem, getItems, updateStock, getLowStock } from '../controllers/inventory.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateMongoObjectId } from '../middleware/security.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorizeRoles('Admin', 'Pharmacist', 'Doctor', 'Nurse'), getItems);
router.post('/', authorizeRoles('Admin', 'Pharmacist'), addItem);
router.put('/:id/stock', validateMongoObjectId('id'), authorizeRoles('Admin', 'Pharmacist'), updateStock);
router.get('/low-stock', authorizeRoles('Admin', 'Pharmacist', 'Nurse'), getLowStock);

export default router;

