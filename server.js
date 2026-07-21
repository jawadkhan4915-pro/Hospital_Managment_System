import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import connectDB from './backend/config/database.js';
import logger from './backend/config/logger.js';
import errorHandler from './backend/middleware/error.middleware.js';

// Route Imports
import authRoutes from './backend/routes/auth.routes.js';
import patientRoutes from './backend/routes/patient.routes.js';
import staffRoutes from './backend/routes/staff.routes.js';
import appointmentRoutes from './backend/routes/appointment.routes.js';
import medicalRecordRoutes from './backend/routes/medicalRecord.routes.js';
import billingRoutes from './backend/routes/billing.routes.js';
import inventoryRoutes from './backend/routes/inventory.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for dev simplicity, or configure appropriately
}));
// Production: restrict to the deployed frontend URL. Dev: allow all origins.
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/records', medicalRecordRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HMS Server is healthy' });
});

// Serve static assets in production
const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  // If request is not API, serve React App
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
