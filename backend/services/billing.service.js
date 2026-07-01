import billingRepository from '../repositories/billing.repository.js';
import patientRepository from '../repositories/patient.repository.js';
import logger from '../config/logger.js';

class BillingService {
  async createInvoice(patientId, appointmentId, items, taxPercent = 0, discountVal = 0, insuranceClaim = null) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Generate unique invoice number
    const count = await billingRepository.count();
    const invoiceNumber = `INV-${10000 + count + 1}`;

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * (taxPercent / 100) * 100) / 100;
    const discount = discountVal;
    const totalAmount = Math.max(0, subtotal + tax - discount);

    const billing = await billingRepository.create({
      patientId,
      appointmentId,
      invoiceNumber,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: 'Unpaid',
      insuranceClaim: insuranceClaim || { status: 'None', provider: '', claimNumber: '', coverageAmount: 0 },
    });

    logger.info(`Invoice generated: ${invoiceNumber} for patient: ${patient.patientId}`);
    return billing;
  }

  async getPatientInvoices(patientId) {
    return billingRepository.findByPatientId(patientId);
  }

  async getInvoiceByNumber(invoiceNumber) {
    return billingRepository.findByInvoiceNumber(invoiceNumber);
  }

  async payInvoice(invoiceId, paymentMethod) {
    const invoice = await billingRepository.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = 'Paid';
    invoice.paymentMethod = paymentMethod;
    await invoice.save();

    logger.info(`Invoice ${invoice.invoiceNumber} paid via ${paymentMethod}`);
    return invoice;
  }

  async getAllInvoices() {
    return billingRepository.find({}, { populate: 'patientId' });
  }
}

export default new BillingService();
