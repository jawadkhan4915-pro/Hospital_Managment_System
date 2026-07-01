import BaseRepository from './base.repository.js';
import Billing from '../models/Billing.js';

class BillingRepository extends BaseRepository {
  constructor() {
    super(Billing);
  }

  async findByPatientId(patientId) {
    return this.find({ patientId }, { sort: { createdAt: -1 } });
  }

  async findByInvoiceNumber(invoiceNumber) {
    return this.findOne({ invoiceNumber });
  }
}

export default new BillingRepository();
