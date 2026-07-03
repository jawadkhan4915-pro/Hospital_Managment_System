import mongoose from 'mongoose';
import logger from './logger.js';
import dns from 'dns';

const dropObsoleteIndexes = async (conn) => {
  try {
    const patientCollection = conn.connection.collection('patients');
    const indexes = await patientCollection.indexes();
    if (indexes.some((idx) => idx.name === 'medicalRecordNumber_1')) {
      await patientCollection.dropIndex('medicalRecordNumber_1');
      logger.info('Dropped legacy medicalRecordNumber_1 index from patients collection.');
    }
  } catch (idxErr) {
    // Ignore if collection doesn't exist yet
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms';
  try {
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await dropObsoleteIndexes(conn);
  } catch (error) {
    if (mongoURI.startsWith('mongodb+srv://') && (error.message.includes('ESERVFAIL') || error.message.includes('ENOTFOUND') || error.message.includes('ETIMEOUT'))) {
      logger.warn(`DNS resolution failed with "${error.message}". Retrying connection with Google and Cloudflare DNS fallback...`);
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(mongoURI, {
          autoIndex: true,
        });
        logger.info(`MongoDB Connected after DNS bypass: ${conn.connection.host}`);
        await dropObsoleteIndexes(conn);
        return;
      } catch (retryError) {
        logger.error(`Error connecting to MongoDB after DNS fallback: ${retryError.message}`);
      }
    } else {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;

