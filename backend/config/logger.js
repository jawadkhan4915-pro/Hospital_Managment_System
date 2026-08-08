import winston from 'winston';
import path from 'path';

// Sensitive keys to mask in logs
const SENSITIVE_KEYS = ['password', 'token', 'mfaSecret', 'code', 'otp', 'creditCard'];

const maskSensitiveData = winston.format((info) => {
  if (typeof info.message === 'string') {
    info.message = info.message.replace(/(password|token|mfaSecret|code|otp)=\S+/gi, '$1=***MASKED***');
  }
  return info;
});

const logFormat = winston.format.combine(
  maskSensitiveData(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'hms-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        maskSensitiveData(),
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

