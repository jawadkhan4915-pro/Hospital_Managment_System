import mongoose from 'mongoose';

const prescriptionItemSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // e.g., "500mg"
    required: true,
  },
  frequency: {
    type: String, // e.g., "Twice daily"
    required: true,
  },
  duration: {
    type: String, // e.g., "7 days"
    required: true,
  },
});

const labRequestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  results: {
    type: String,
    default: '',
  },
  recordedAt: Date,
});

const radiologyRequestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  results: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  recordedAt: Date,
});

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    soapNotes: {
      subjective: { type: String, default: '' },
      objective: { type: String, default: '' },
      assessment: { type: String, default: '' },
      plan: { type: String, default: '' },
    },
    diagnosis: {
      type: String,
      required: true,
    },
    prescription: [prescriptionItemSchema],
    labRequests: [labRequestSchema],
    radiologyRequests: [radiologyRequestSchema],
    digitalSignature: {
      type: String, // doctor's electronic signing
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
