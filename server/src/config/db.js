import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isMongoConnected = true;
    console.log(`🚀 MongoDB Connected to Host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection unavailable (${error.message}). Running on high-performance built-in persistent DBStore engine.`);
    isMongoConnected = false;
  }
};

export const getDbStatus = () => ({
  mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Built-in Persistent DBStore',
  isMongoConnected
});
