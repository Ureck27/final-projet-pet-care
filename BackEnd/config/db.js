const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ── Step 1: Verify MONGO_URI is loaded ───────────────────────────────
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

    // ── Step 3: Log a sanitised version of the URI for debugging ─────────
    const sanitisedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`ℹ Connecting to MongoDB...`);
    console.log(`ℹ URI (password hidden): ${sanitisedUri}`);

    // ── Step 4: Connect ───────────────────────────────────────────────────
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s – give DNS time to resolve
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database        : ${conn.connection.name}`);

    // ── Step 5: Ongoing event listeners ──────────────────────────────────
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected. Reconnection will be attempted automatically.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ MongoDB reconnected.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('✗ MongoDB runtime error:', err.message);
    });

    return conn;
  } catch (error) {
    // ── Step 6: Friendly error messages by error code ────────────────────
    console.error('\n✗ MongoDB connection FAILED');
    console.error('  Message :', error.message);

    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('ENOTFOUND')) {
      console.error('\n  ► Root cause  : DNS cannot resolve the MongoDB Atlas SRV record.');
      console.error('  ► Most likely : The cluster hostname in MONGO_URI is wrong, OR');
      console.error('                 your network cannot reach MongoDB Atlas.');
      console.error('  ► Checklist');
      console.error('    1. In MongoDB Atlas → Clusters → Connect → copy the exact connection string.');
      console.error('    2. Make sure cluster name / hostname in .env matches exactly.');
      console.error('    3. Whitelist your IP (or 0.0.0.0/0) in Atlas → Network Access.');
      console.error('    4. Confirm the cluster is not paused (free-tier clusters auto-pause).');
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
    process.exit(1);
  }
};

module.exports = connectDB;
