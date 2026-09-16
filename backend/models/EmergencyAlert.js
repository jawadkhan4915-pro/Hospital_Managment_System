import mongoose from 'mongoose';

const responderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  respondedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
});

const emergencyAlertSchema = new mongoose.Schema(
  {
    codeType: {
      type: String,
      enum: ['Code Blue', 'Code Red', 'Code Trauma', 'Code Stroke', 'Code Sepsis', 'Code Pink'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['Immediate Life Threat', 'High Priority', 'Evacuation', 'Critical Surge'],
      default: 'Immediate Life Threat',
    },
    location: {
      floor: { type: String, required: true },
      wing: { type: String, default: 'Main Wing' },
      room: { type: String, required: true },
    },
    details: {
      type: String,
      default: '',
    },
    patientName: {
      type: String,
      default: 'Unassigned / Room Event',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'RESPONDING', 'RESOLVED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    initiatedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: { type: String, required: true },
      role: { type: String, required: true },
    },
    responders: [responderSchema],
    resolvedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);
export default EmergencyAlert;
