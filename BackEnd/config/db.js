const mongoose = require('mongoose');

// Global connection state to prevent multiple connections
let isConnected = false;

const connectDB = async () => {
  // Prevent multiple connections
  if (isConnected) {
    console.log('ℹ MongoDB already connected. Skipping duplicate connection.');
    return;
  }

  try {
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
      console.error('  Example:');
      console.error('    MONGO_URI=mongodb+srv://aourik1122_db_user:YOUR_REAL_PASSWORD@projet001backend.ushit0a.mongodb.net/petcare?retryWrites=true&w=majority');
      process.exit(1);
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      console.error('✗ MONGO_URI format is invalid. It must start with mongodb:// or mongodb+srv://');
      process.exit(1);
    }

    // ── Step 3: Log a sanitised version of URI for debugging ─────────
    const sanitisedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`ℹ Connecting to MongoDB...`);
    console.log(`ℹ URI (password hidden): ${sanitisedUri}`);

    // ── Step 4: Connect with proper options for stability ───────────────────
    const conn = await mongoose.connect(uri, {
      // Connection options for stability
      serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
      socketTimeoutMS: 45000, // 45s socket timeout
      retryWrites: true,
      w: 'majority',
      // New Mongoose 6+ options (remove deprecated ones)
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5,  // Keep minimum 5 connections
      maxIdleTimeMS: 30000, // Close sockets after 30s of inactivity
      // Buffering
      bufferMaxEntries: 0, // Disable buffering for immediate writes
      bufferCommands: false,
    });

    // Mark as connected
    isConnected = true;

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database        : ${conn.connection.name}`);

    // ── Step 5: Proper event listeners with cleanup ──────────────────────────
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
      
      // Don't exit on connection errors, let Mongoose handle reconnection
      if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        console.error('  ► Network issue detected. Mongoose will attempt reconnection.');
      }
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

    return conn;

  } catch (error) {
    // ── Step 6: Friendly error messages by error type ────────────────────
    console.error('\n✗ MongoDB connection FAILED');
    console.error('  Message :', error.message);

    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('ENOTFOUND')) {
      console.error('\n  ► Root cause  : DNS cannot resolve MongoDB Atlas SRV record.');
      console.error('  ► Most likely : The cluster hostname in MONGO_URI is wrong, OR');
      console.error('                 your network cannot reach MongoDB Atlas.');
      console.error('  ► Checklist');
      console.error('    1. In MongoDB Atlas → Clusters → Connect → copy the exact connection string.');
      console.error('    2. Make sure cluster name / hostname in .env matches exactly.');
      console.error('    3. Whitelist your IP (or 0.0.0.0/0) in Atlas → Network Access.');
      console.error('    4. Confirm that cluster is not paused (free-tier clusters auto-pause).');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n  ► Root cause  : Wrong database username or password.');
      console.error('  ► Fix         : In Atlas → Database Access, reset the password.');
      console.error('    If the password contains special characters (@, :, #, %, etc.)');
      console.error('    URL-encode them. Example: @ → %40, # → %23');
    } else if (error.message.includes('IP')) {
      console.error('\n  ► Root cause  : Your IP is not whitelisted in MongoDB Atlas.');
      console.error('  ► Fix         : Atlas → Network Access → Add IP Address → 0.0.0.0/0 (allow all).');
    }

    console.error('\n  General .env check:');
    console.error('    MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority');
    
    isConnected = false;
    process.exit(1);
  }
};

// Export connection status and disconnect function for testing
module.exports = { connectDB, getConnectionStatus: () => isConnected };
