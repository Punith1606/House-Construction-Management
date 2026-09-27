const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set. Running in offline seed mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  MongoDB not available (${error.message.split(',')[0].trim()}). Running in offline seed mode — API still works with built-in data.`);
    return null;
  }
};

module.exports = connectDB;
