import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import logger from '../config/logger.js';

/**
 * Recursively sanitizes object KEYS only to prevent NoSQL injection.
 * String values (passwords, emails, etc.) are left untouched.
 * Only object keys starting with $ are removed (e.g. { $where: ... }).
 */
const sanitizeKeys = (data) => {
  if (data === null || data === undefined) return data;

  // Primitive values (string, number, boolean) — do NOT modify
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeKeys);
  }

  const sanitized = {};
  for (const key of Object.keys(data)) {
    // Drop keys that start with $ (NoSQL injection operator)
    if (key.startsWith('$')) {
      logger.warn(`Blocked NoSQL injection key: "${key}"`);
      continue;
    }
    sanitized[key] = sanitizeKeys(data[key]);
  }
  return sanitized;
};

/**
 * Express middleware to prevent NoSQL Query Injection attacks.
 * Sanitizes object keys in req.body, req.query, req.params only.
 */
export const sanitizeNoSqlInjection = (req, res, next) => {
  if (req.body && typeof req.body === 'object') req.body = sanitizeKeys(req.body);
  if (req.query && typeof req.query === 'object') req.query = sanitizeKeys(req.query);
  if (req.params && typeof req.params === 'object') req.params = sanitizeKeys(req.params);
  next();
};


/**
 * Express middleware to sanitize XSS HTML script injections
 */
const sanitizeXssString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const sanitizeXssDeep = (data) => {
  if (typeof data === 'string') return sanitizeXssString(data);
  if (Array.isArray(data)) return data.map(sanitizeXssDeep);
  if (data && typeof data === 'object') {
    const cleaned = {};
    for (const key of Object.keys(data)) {
      cleaned[key] = sanitizeXssDeep(data[key]);
    }
    return cleaned;
  }
  return data;
};

export const sanitizeXssInput = (req, res, next) => {
  if (req.body) req.body = sanitizeXssDeep(req.body);
  if (req.query) req.query = sanitizeXssDeep(req.query);
  if (req.params) req.params = sanitizeXssDeep(req.params);
  next();
};

/**
 * Validates Mongoose ObjectId format for path parameters
 */
export const validateMongoObjectId = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid Mongo ObjectId attempt on param [${paramName}]: ${id}`);
        return res.status(400).json({
          success: false,
          message: `Invalid resource ID format: ${paramName}`,
        });
      }
    }
    next();
  };
};

/**
 * Strict Rate Limiter for Authentication / Login / MFA endpoints
 * Limits IP to 5 login attempts per 15-minute window
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth Rate Limit Exceeded for IP: ${req.ip} on URL: ${req.originalUrl}`);
    res.status(429).json(options.message);
  },
});

