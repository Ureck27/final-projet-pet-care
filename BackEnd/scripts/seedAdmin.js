const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`Admin user ${adminEmail} not found. Creating...`);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user seeded successfully with properly hashed password.');
    } else {
      console.log(`Admin user ${adminEmail} already exists.`);
      // Test if password matches "admin123"
      const isMatch = await existingAdmin.matchPassword('admin123');
      if (!isMatch) {
        console.log(
          'Password does not match "admin123". Re-hashing the password to "admin123" to ensure it is correct...',
        );
        existingAdmin.password = 'admin123';
        await existingAdmin.save();
        console.log('Password reset successfully to "admin123".');
      } else {
        console.log('Password matches properly.');
      }
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
