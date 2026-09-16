import mongoose from 'mongoose';

const testParameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '',
  },
  referenceRange: {
    type: String,
    default: '',
  },
  flag: {
    type: String,
    enum: ['NORMAL', 'HIGH', 'LOW', 'CRITICAL_HIGH', 'CRITICAL_LOW', 'INDETERMINATE'],
    default: 'NORMAL',
  },
});

const diagnosticOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `DX-${Math.floor(100000 + Math.random() * 900000)}`;
      },
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    testCategory: {
      type: String,
      enum: ['Hematology', 'Biochemistry', 'Pathology', 'Radiology', 'Cardiology', 'Microbiology'],
      default: 'Hematology',
    },
    testName: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Routine', 'Urgent', 'STAT (Emergency)'],
      default: 'Routine',
    },
    status: {
      type: String,
      enum: ['Ordered', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'],
      default: 'Ordered',
    },
    specimen: {
      type: String,
      default: 'Venous Blood',
    },
    parameters: [testParameterSchema],
    clinicalImpression: {
      type: String,
      default: '',
    },
    radiologyImageUrl: {
      type: String,
      default: '',
    },
    technicianName: {
      type: String,
      default: '',
    },
    technicianNotes: {
      type: String,
      default: '',
    },
    reportedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DiagnosticOrder = mongoose.model('DiagnosticOrder', diagnosticOrderSchema);
export default DiagnosticOrder;
