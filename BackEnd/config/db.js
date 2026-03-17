const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('✗ MongoDB connection error:', error.message);
    });

    return conn;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure:');
    console.error('  1. MONGO_URI is correctly set in .env');
    console.error('  2. Replace <db_password> with your actual MongoDB Atlas password');
    console.error('  3. Your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('  4. Your MongoDB cluster is running');
    process.exit(1);
  }
};

module.exports = connectDB;
