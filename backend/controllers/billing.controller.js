import billingService from '../services/billing.service.js';
import patientService from '../services/patient.service.js';

export const createInvoice = async (req, res, next) => {
  try {
    const { patientId, appointmentId, items, taxPercent, discount, insuranceClaim } = req.body;
    const invoice = await billingService.createInvoice(
      patientId,
      appointmentId,
      items,
      taxPercent,
      discount,
      insuranceClaim
    );
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    if (req.user.role === 'Patient') {
      const patient = await patientService.getPatientByUserId(req.user.id);
      if (!patient) {
        return res.status(200).json({ success: true, data: [] });
      }
      const invoices = await billingService.getPatientInvoices(patient._id);
      return res.status(200).json({ success: true, data: invoices });
    }

    const invoices = await billingService.getAllInvoices();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const payInvoice = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const invoice = await billingService.payInvoice(req.params.id, paymentMethod);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
