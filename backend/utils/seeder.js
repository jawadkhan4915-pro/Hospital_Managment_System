import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Billing from '../models/Billing.js';
import Inventory from '../models/Inventory.js';
import logger from '../config/logger.js';

dotenv.config();

const seedData = async () => {
  try {
    logger.info('Starting database seed sequence...');

    // Clear existing collections
    await User.deleteMany();
    await Patient.deleteMany();
    await Staff.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Billing.deleteMany();
    await Inventory.deleteMany();

    logger.info('Database cleared.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Dr. Sarah Connor (Admin)',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'Admin',
      status: 'Active',
    });

    const doctorUser = await User.create({
      name: 'Dr. Gregory House',
      email: 'doctor@hospital.com',
      password: 'doctor123',
      role: 'Doctor',
      status: 'Active',
    });

    const pharmacistUser = await User.create({
      name: 'Robert Chase',
      email: 'pharmacy@hospital.com',
      password: 'pharmacy123',
      role: 'Pharmacist',
      status: 'Active',
    });

    const nurseUser = await User.create({
      name: 'Clara Oswald',
      email: 'nurse@hospital.com',
      password: 'nurse123',
      role: 'Nurse',
      status: 'Active',
    });

    const receptionistUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'reception@hospital.com',
      password: 'reception123',
      role: 'Receptionist',
      status: 'Active',
    });

    const patientUser = await User.create({
      name: 'John Watson',
      email: 'patient@hospital.com',
      password: 'patient123',
      role: 'Patient',
      status: 'Active',
    });

    logger.info('Core user accounts seeded.');

    // 2. Create Staff profiles
    const doctorStaff = await Staff.create({
      userId: doctorUser._id,
      staffId: 'DOC-1001',
      department: 'Cardiology',
      specialization: 'Cardiologist',
      qualification: 'MD, FACC',
      salary: 15000,
      schedule: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00' },
      ],
      status: 'Active',
    });

    const pharmacistStaff = await Staff.create({
      userId: pharmacistUser._id,
      staffId: 'STF-1001',
      department: 'Pharmacy',
      qualification: 'B.Pharm',
      salary: 6000,
      status: 'Active',
    });

    const nurseStaff = await Staff.create({
      userId: nurseUser._id,
      staffId: 'STF-1002',
      department: 'General Medicine',
      qualification: 'BSN',
      salary: 5000,
      status: 'Active',
    });

    logger.info('Hospital staff profiles generated.');

    // 3. Create Patient profile
    const patientProfile = await Patient.create({
      userId: patientUser._id,
      patientId: 'PAT-1001',
      name: 'John Watson',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'Male',
      phone: '+1-555-0199',
      address: '221B Baker Street, London',
      bloodGroup: 'AB+',
      emergencyContact: {
        name: 'Sherlock Holmes',
        relationship: 'Friend',
        phone: '+1-555-0100',
      },
      medicalHistory: {
        allergies: ['Penicillin'],
        chronicIllnesses: ['Hypertension'],
        pastSurgeries: ['Appendectomy'],
      },
      vitals: [
        {
          weight: 78,
          height: 178,
          bloodPressure: '128/82',
          temperature: 36.8,
          pulse: 74,
          recordedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        },
        {
          weight: 77.5,
          height: 178,
          bloodPressure: '124/80',
          temperature: 36.6,
          pulse: 70,
          recordedAt: new Date(), // today
        },
      ],
    });

    logger.info('Patient profile registered.');

    // 4. Create Appointments
    const appointment = await Appointment.create({
      patientId: patientProfile._id,
      doctorId: doctorStaff._id,
      date: new Date(),
      timeSlot: '10:00 - 10:30',
      status: 'Pending',
      type: 'Online',
      reason: 'Routine checkup for hypertension management',
      queueNumber: 1,
    });

    logger.info('Sample appointments booked.');

    // 5. Create Inventory items
    await Inventory.create([
      {
        itemName: 'Paracetamol 500mg',
        category: 'Medicines',
        quantity: 500,
        reorderLevel: 50,
        expiryDate: new Date('2028-12-31'),
        supplier: 'MediPharma Inc.',
        price: 5.0,
      },
      {
        itemName: 'Amoxicillin 250mg',
        category: 'Medicines',
        quantity: 12, // triggers low stock warning
        reorderLevel: 25,
        expiryDate: new Date('2027-06-30'),
        supplier: 'PharmaSupply Co.',
        price: 18.5,
      },
      {
        itemName: 'Syringes 5ml',
        category: 'Supplies',
        quantity: 1000,
        reorderLevel: 100,
        expiryDate: null,
        supplier: 'GlobalMed Ltd.',
        price: 0.8,
      },
    ]);

    logger.info('Pharmacy store inventory items populated.');
    logger.info('Database seeding sequence completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

// Execute if run directly
if (process.argv[1].endsWith('seeder.js')) {
  connectDB().then(seedData);
}

export default seedData;
