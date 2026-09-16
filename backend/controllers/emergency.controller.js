import EmergencyAlert from '../models/EmergencyAlert.js';
import User from '../models/User.js';
import logger from '../config/logger.js';

/**
 * Broadcast an Emergency Code
 * POST /api/v1/emergency/trigger
 */
export const triggerEmergency = async (req, res, next) => {
  try {
    const { codeType, location, details, patientName, severity } = req.body;

    if (!codeType || !location || !location.floor || !location.room) {
      return res.status(400).json({
        success: false,
        message: 'Code type, floor, and room location are required',
      });
    }

    const user = await User.findById(req.user.id);
    const initiatedBy = {
      userId: req.user.id,
      name: user ? user.name : 'Clinical Staff',
      role: req.user.role,
    };

    const alert = await EmergencyAlert.create({
      codeType,
      location,
      details: details || '',
      patientName: patientName || 'Unassigned / Floor Event',
      severity: severity || 'Immediate Life Threat',
      status: 'ACTIVE',
      initiatedBy,
      responders: [],
    });

    logger.warn(`[EMERGENCY BROADCAST] ${codeType} triggered at Floor ${location.floor}, Room ${location.room} by ${initiatedBy.name}`);

    res.status(201).json({
      success: true,
      message: `${codeType} broadcast initiated successfully`,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active and responding emergencies
 * GET /api/v1/emergency/active
 */
export const getActiveEmergencies = async (req, res, next) => {
  try {
    const alerts = await EmergencyAlert.find({
      status: { $in: ['ACTIVE', 'RESPONDING'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clinical Staff responds to emergency
 * POST /api/v1/emergency/:id/respond
 */
export const respondToEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const alert = await EmergencyAlert.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Emergency alert not found' });
    }

    if (alert.status === 'RESOLVED' || alert.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Alert is already resolved or cancelled' });
    }

    const user = await User.findById(req.user.id);
    const responderName = user ? user.name : 'Medical Staff';

    // Check if already responded
    const alreadyResponded = alert.responders.some(
      (r) => r.userId && r.userId.toString() === req.user.id
    );

    if (!alreadyResponded) {
      alert.responders.push({
        userId: req.user.id,
        name: responderName,
        role: req.user.role,
        respondedAt: new Date(),
        notes: notes || 'En route to location',
      });
      alert.status = 'RESPONDING';
      await alert.save();
    }

    res.status(200).json({
      success: true,
      message: 'Response registered successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resolve emergency code
 * PUT /api/v1/emergency/:id/resolve
 */
export const resolveEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const alert = await EmergencyAlert.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Emergency alert not found' });
    }

    const user = await User.findById(req.user.id);

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    alert.resolvedBy = {
      userId: req.user.id,
      name: user ? user.name : 'Authorized Staff',
    };
    alert.resolutionNotes = resolutionNotes || 'Incident stabilized and resolved';

    await alert.save();

    logger.info(`[EMERGENCY RESOLVED] ${alert.codeType} at Floor ${alert.location.floor}, Room ${alert.location.room} resolved by ${alert.resolvedBy.name}`);

    res.status(200).json({
      success: true,
      message: `${alert.codeType} resolved successfully`,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get incident audit history
 * GET /api/v1/emergency/history
 */
export const getEmergencyHistory = async (req, res, next) => {
  try {
    const history = await EmergencyAlert.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
