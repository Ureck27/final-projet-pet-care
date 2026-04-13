const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const { connectDB } = require('../config/db');

const migrateUserRoles = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Starting migration...');

    // Find all users with the role 'user'
    const result = await User.updateMany({ role: 'user' }, { $set: { role: 'owner' } });

    console.log(
      `Migration complete. Modified ${result.modifiedCount} users from 'user' to 'owner'.`,
    );
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUserRoles();
