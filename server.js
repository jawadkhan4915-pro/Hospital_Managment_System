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

import { sanitizeNoSqlInjection, sanitizeXssInput } from './backend/middleware/security.middleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy headers (Render, Vercel, Nginx, Cloudflare)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// 1. HTTP Security Headers Hardening (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year HSTS
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY (Anti-Clickjacking)
    noSniff: true, // X-Content-Type-Options: nosniff
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

// 2. Strict CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(compression());

// 3. Request Payload Size Capping (Anti-DoS)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 4. Global Input Sanitization (Anti-NoSQL Injection & XSS)
app.use('/api/', sanitizeNoSqlInjection);
app.use('/api/', sanitizeXssInput);

// Log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Global Rate Limiter for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
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
