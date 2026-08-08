import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import logger from '../config/logger.js';

/**
 * Sanitizes input data recursively to strip NoSQL injection operators ($ and .)
 */
const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;
  
  if (typeof value === 'string') {
    // Replace leading $ or . operators if found in keys/values
    return value.replace(/^\$|\./g, '');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(value)) {
      // Remove keys starting with $ or containing .
      const cleanKey = key.replace(/^\$|\./g, '');
      if (cleanKey) {
        sanitizedObj[cleanKey] = sanitizeValue(value[key]);
      }
    }
    return sanitizedObj;
  }

  return value;
};

/**
 * Express middleware to prevent NoSQL Query Injection attacks
 */
export const sanitizeNoSqlInjection = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
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
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth Rate Limit Exceeded for IP: ${req.ip} on URL: ${req.originalUrl}`);
    res.status(429).json(options.message);
  },
});
