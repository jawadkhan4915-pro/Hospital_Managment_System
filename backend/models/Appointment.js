import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff', // Refers to the doctor's Staff entry
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true, // e.g. "09:00 - 09:30"
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['Walk-In', 'Online', 'Follow-Up'],
      default: 'Online',
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    queueNumber: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: String,
      default: 'Room 101',
      trim: true,
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

appointmentSchema.index({ patientId: 1, isDeleted: 1 });
appointmentSchema.index({ doctorId: 1, isDeleted: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
