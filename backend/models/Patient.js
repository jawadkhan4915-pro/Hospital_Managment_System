import mongoose from 'mongoose';

const vitalSchema = new mongoose.Schema({
  weight: Number, // kg
  height: Number, // cm
  bloodPressure: String, // e.g. "120/80"
  temperature: Number, // Celsius
  pulse: Number, // bpm
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    cnic: {
      type: String,
      trim: true,
      sparse: true,
      default: function () {
        return `CNIC-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
      },
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalHistory: {
      allergies: [String],
      chronicIllnesses: [String],
      pastSurgeries: [String],
    },
    insurance: {
      provider: String,
      policyNumber: String,
      coverageDetails: String,
    },
    vitals: [vitalSchema],
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

patientSchema.index({ cnic: 1 });
patientSchema.index({ patientId: 1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
