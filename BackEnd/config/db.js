const mongoose = require('mongoose');

// Global connection state to prevent multiple connections
let isConnected = false;

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts (default: 5)
 * @param {number} delay - Delay between retries in ms (default: 5000)
 */
const connectDB = async (retries = 5, delay = 5000) => {
  // Prevent multiple connections
  if (isConnected) {
    console.log('ℹ MongoDB already connected. Skipping duplicate connection.');
    return;
  }

  // ── Step 1: Verify MONGO_URI is loaded ───────────────────────
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('✗ MONGO_URI is not set in your .env file.');
    console.error('  Make sure dotenv.config() is called BEFORE connectDB().');
    process.exit(1);
  }

  // ── Step 2: Detect common placeholder / formatting errors ────────────
  if (uri.includes('<db_password>')) {
    console.error('✗ MONGO_URI still contains the literal placeholder <db_password>.');
    console.error('  Replace <db_password> with your real MongoDB Atlas password in .env');
    process.exit(1);
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('✗ MONGO_URI format is invalid. It must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }

  // ── Step 3: Log a sanitised version of URI for debugging ─────────
  const sanitisedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`ℹ Attempting to connect to MongoDB...`);
  console.log(`ℹ URI (password hidden): ${sanitisedUri}`);

  // ── Step 4: Connection loop with retires ──────────────────────────
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // 5s timeout per attempt
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
      });

      isConnected = true;
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      console.log(`✓ Database        : ${conn.connection.name}`);

      // Setup event listeners
      setupEventListeners();
      return conn;
    } catch (error) {
      retries -= 1;
      console.error(`✗ MongoDB connection FAILED. Retries left: ${retries}`);
      console.error(`  Message: ${error.message}`);

      if (retries === 0) {
        handleFinalError(error);
        process.exit(1);
      }

      console.log(`  Waiting ${delay / 1000}s before next attempt...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

/**
 * Setup Mongoose event listeners for stability
 */
function setupEventListeners() {
  mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connection established.');
    isConnected = true;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected.');
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✓ MongoDB reconnected.');
    isConnected = true;
  });

  mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB connection error:', err.message);
    isConnected = false;
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nℹ SIGINT received. Closing MongoDB connection...');
    try {
      await mongoose.connection.close();
      console.log('✓ MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('✗ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
}

/**
 * Provide detailed troubleshooting based on error type
 */
function handleFinalError(error) {
  console.error('\n' + '='.repeat(50));
  console.error('FATAL: MongoDB Connection Could Not Be Established');
  console.error('='.repeat(50));

  if (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('Server selection timed out')
  ) {
    console.error('\n  ► Root cause  : Local MongoDB service is NOT responding.');
    console.error('  ► Solution    : Run "sudo systemctl start mongod" in your terminal.');
  } else if (error.message.includes('ENOTFOUND')) {
    console.error('\n  ► Root cause  : DNS issues - cannot reach MongoDB Atlas.');
    console.error('  ► Solution    : Check internet or whitelist your current IP in Atlas.');
  } else if (error.message.includes('Authentication failed')) {
    console.error('\n  ► Root cause  : Wrong database password.');
    console.error('  ► Solution    : Verify credentials in your .env file.');
  }

  console.error('\n' + '='.repeat(50));
}

module.exports = { connectDB, getConnectionStatus: () => isConnected };
