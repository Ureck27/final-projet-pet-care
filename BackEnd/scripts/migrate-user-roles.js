const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('../config/db-ipv4');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateRoles = async () => {
  try {
    console.log('--- Starting Role Migration ---');

    // 1. Connect to DB
    await connectDB();
    console.log('Connected to database.');

    // 2. Find users with 'user' role
    const usersToUpdate = await User.find({ role: 'user' });
    console.log(`Found ${usersToUpdate.length} users with role 'user'.`);

    if (usersToUpdate.length === 0) {
      console.log("No users found with role 'user'. Migration not required or already completed.");
      process.exit(0);
    }

    // 3. Update them to 'owner'
    const result = await User.updateMany({ role: 'user' }, { $set: { role: 'owner' } });

    console.log(`Migration successful! Updated ${result.modifiedCount} users.`);

    // 4. Verify
    const remaining = await User.countDocuments({ role: 'user' });
    console.log(`Remaining users with role 'user': ${remaining}`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateRoles();
