#!/usr/bin/env node

// Force IPv4 before any other imports
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Now load other modules
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
    console.log(`ℹ Connecting to MongoDB (IPv4 forced)...`);
    console.log(`ℹ URI (password hidden): ${sanitisedUri}`);

    // ── Step 4: Enhanced connection options for troubleshooting ───────────────────
    const conn = await mongoose.connect(uri, {
      // Connection options for stability and debugging
      serverSelectionTimeoutMS: 15000, // Increased to 15s for slower networks
      socketTimeoutMS: 60000, // 60s socket timeout
      connectTimeoutMS: 30000, // 30s initial connection timeout
      retryWrites: true,
      w: 'majority',
      // Pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      // Additional debugging options
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      // Family settings for IPv4 preference
      family: 4, // Force IPv4
    });

    // Mark as connected
    isConnected = true;

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database        : ${conn.connection.name}`);
    console.log(`✓ IPv4 Status     : Enforced`);

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
      
      // Enhanced error handling
      if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        console.error('  ► Network issue detected. Mongoose will attempt reconnection.');
        console.error('  ► Try these steps:');
        console.error('    1. Check internet connection');
        console.error('    2. Verify MongoDB Atlas cluster status');
        console.error('    3. Ensure IP is whitelisted in Atlas');
        console.error('    4. Try running: node -e "console.log(require(\'dns\').lookup(\'cluster0.okn4ami.mongodb.net\'))"');
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
    // ── Step 6: Enhanced error messages with troubleshooting steps ────────────────────
    console.error('\n✗ MongoDB connection FAILED');
    console.error('  Message :', error.message);
    console.error('  Error Code:', error.code || 'N/A');

    // Specific troubleshooting based on error type
    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('ENOTFOUND')) {
      console.error('\n  ► Root cause  : DNS cannot resolve MongoDB Atlas SRV record.');
      console.error('  ► Most likely : The cluster hostname in MONGO_URI is wrong, OR');
      console.error('                 your network cannot reach MongoDB Atlas.');
      console.error('  ► Troubleshooting steps:');
      console.error('    1. Test DNS resolution: node -e "require(\'dns\').lookup(\'cluster0.okn4ami.mongodb.net\', console.log)"');
      console.error('    2. Check internet connection: ping 8.8.8.8');
      console.error('    3. Try different DNS: echo "nameserver 8.8.8.8" > /etc/resolv.conf');
      console.error('    4. Verify cluster name in MongoDB Atlas');
      console.error('    5. Whitelist your IP (or 0.0.0.0/0) in Atlas → Network Access');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('\n  ► Root cause  : Connection timeout - network is too slow or blocked.');
      console.error('  ► Troubleshooting steps:');
      console.error('    1. Check if MongoDB Atlas cluster is paused (free tier auto-pauses)');
      console.error('    2. Test connectivity: curl -I https://cloud.mongodb.com');
      console.error('    3. Try from different network (mobile hotspot)');
      console.error('    4. Check firewall/antivirus blocking outbound connections');
      console.error('    5. Contact ISP if blocking MongoDB Atlas');
    } else if (error.message.includes('ENETUNREACH')) {
      console.error('\n  ► Root cause  : Network unreachable - routing or DNS issues.');
      console.error('  ► Troubleshooting steps:');
      console.error('    1. Restart your router/modem');
      console.error('    2. Flush DNS: sudo systemctl restart systemd-resolved');
      console.error('    3. Try IPv4-only connection (this script already forces it)');
      console.error('    4. Check if VPN is blocking connection');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n  ► Root cause  : Wrong database username or password.');
      console.error('  ► Fix         : In Atlas → Database Access, reset the password.');
    } else if (error.message.includes('IP')) {
      console.error('\n  ► Root cause  : Your IP is not whitelisted in MongoDB Atlas.');
      console.error('  ► Fix         : Atlas → Network Access → Add IP Address → 0.0.0.0/0');
    }

    console.error('\n  Quick tests to run:');
    console.error('    1. DNS test: node -e "console.log(require(\'dns\').lookup(\'cluster0.okn4ami.mongodb.net\'))"');
    console.error('    2. Internet test: ping 8.8.8.8');
    console.error('    3. MongoDB test: curl -I https://cloud.mongodb.com');
    console.error('    4. IP check: curl -s ifconfig.me');
    
    isConnected = false;
    process.exit(1);
  }
};

// Export connection status and disconnect function for testing
module.exports = { connectDB, getConnectionStatus: () => isConnected };
