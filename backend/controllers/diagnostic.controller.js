import DiagnosticOrder from '../models/DiagnosticOrder.js';
import Patient from '../models/Patient.js';
import Staff from '../models/Staff.js';
import User from '../models/User.js';
import patientService from '../services/patient.service.js';
import logger from '../config/logger.js';

/**
 * Order a diagnostic test (Lab or Radiology)
 * POST /api/v1/diagnostics/order
 */
export const orderDiagnosticTest = async (req, res, next) => {
  try {
    const {
      patientId,
      testCategory,
      testName,
      priority,
      specimen,
      clinicalImpression,
      appointmentId,
      parameters,
    } = req.body;

    if (!patientId || !testName) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and Test Name are required',
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Find Doctor record
    const staff = await Staff.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    const doctorName = user ? user.name : 'Attending Physician';
    const doctorId = staff ? staff._id : req.user.id;

    const newOrder = await DiagnosticOrder.create({
      patientId: patient._id,
      patientName: patient.name,
      doctorId,
      doctorName,
      appointmentId: appointmentId || null,
      testCategory: testCategory || 'Hematology',
      testName,
      priority: priority || 'Routine',
      specimen: specimen || 'Venous Blood',
      clinicalImpression: clinicalImpression || '',
      status: 'Ordered',
      parameters: parameters || [],
    });

    logger.info(`[DIAGNOSTIC ORDER] ${testName} (${priority}) ordered for patient ${patient.name} by ${doctorName}`);

    res.status(201).json({
      success: true,
      message: 'Diagnostic test ordered successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get diagnostic test history for a patient
 * GET /api/v1/diagnostics/patient/:patientId
 */
export const getPatientDiagnostics = async (req, res, next) => {
  try {
    let patientId = req.params.patientId;

    if (req.user.role === 'Patient') {
      const patient = await patientService.getPatientByUserId(req.user.id);
      if (!patient) {
        return res.status(200).json({ success: true, data: [] });
      }
      patientId = patient._id;
    }

    const orders = await DiagnosticOrder.find({
      patientId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pending/active diagnostic orders
 * GET /api/v1/diagnostics/pending
 */
export const getPendingDiagnostics = async (req, res, next) => {
  try {
    const orders = await DiagnosticOrder.find({
      status: { $in: ['Ordered', 'Sample Collected', 'Processing'] },
      isDeleted: false,
    }).sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record/Update diagnostic test results
 * PUT /api/v1/diagnostics/:id/results
 */
export const recordDiagnosticResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { parameters, clinicalImpression, radiologyImageUrl, technicianNotes, status } = req.body;

    const order = await DiagnosticOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Diagnostic order not found' });
    }

    const user = await User.findById(req.user.id);

    if (parameters && Array.isArray(parameters)) {
      order.parameters = parameters;
    }

    if (clinicalImpression !== undefined) order.clinicalImpression = clinicalImpression;
    if (radiologyImageUrl !== undefined) order.radiologyImageUrl = radiologyImageUrl;
    if (technicianNotes !== undefined) order.technicianNotes = technicianNotes;

    order.technicianName = user ? user.name : 'Laboratory Specialist';
    order.status = status || 'Completed';
    if (order.status === 'Completed') {
      order.reportedAt = new Date();
    }

    await order.save();

    logger.info(`[DIAGNOSTIC RESULTS] Results recorded for Order ${order.orderNumber} (${order.testName})`);

    res.status(200).json({
      success: true,
      message: 'Diagnostic results recorded successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single diagnostic order by ID
 * GET /api/v1/diagnostics/:id
 */
export const getDiagnosticById = async (req, res, next) => {
  try {
    const order = await DiagnosticOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Diagnostic order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
