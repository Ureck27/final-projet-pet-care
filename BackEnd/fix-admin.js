const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const { connectDB } = require('./config/db-ipv4');

async function fixAdmin() {
  try {
    await connectDB();
    const email = 'admin@petcare.com';
    let user = await User.findOne({ email });
    if (user) {
      console.log('User exists. Updating password and role...');
      user.password = 'admin123';
      user.role = 'admin';
      user.name = 'Admin User';
      // Mongoose save() will trigger the pre('save') hook to hash 'admin123'
      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('User does not exist. Creating...');
      user = new User({
        name: 'Admin User',
        email,
        password: 'admin123',
        role: 'admin',
        status: 'accepted'
      });
      await user.save();
      console.log('Admin user created successfully');
    }

    // Verify it actually works
    const savedUser = await User.findOne({ email }).select('+password');
    const isMatch = await savedUser.matchPassword('admin123');
    console.log('Password match test:', isMatch);

  } catch(error) {
    console.error(error);
  } finally {
    process.exit();
  }
}
fixAdmin();
