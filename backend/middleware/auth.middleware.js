import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'enterprise_hms_jwt_secret_key_2026_secure';
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    
    // Verify user is still active in DB and not deleted
    if (decoded && decoded.id) {
      const user = await User.findById(decoded.id).select('status isDeleted role');
      if (!user || user.isDeleted || user.status !== 'Active') {
        logger.warn(`Rejected token for inactive/deleted user: ${decoded.id}`);
        return res.status(401).json({ success: false, message: 'User account suspended or deleted' });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Failed authentication attempt: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`RBAC Access Denied: User ${req.user?.id} (${req.user?.role}) attempted accessing ${req.originalUrl}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions',
      });
    }
    next();
  };
};

