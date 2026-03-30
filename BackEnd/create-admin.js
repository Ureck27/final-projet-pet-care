const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to database
require('./config/db-ipv4');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@petcare.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Login with: admin@petcare.com / admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@petcare.com',
      password: 'admin123',
      role: 'admin',
      status: 'accepted'
    });

    // Save the user (password will be hashed automatically by pre-save hook)
    const savedAdmin = await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', savedAdmin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Name:', savedAdmin.name);
    console.log('🔐 Role:', savedAdmin.role);
    console.log('');
    console.log('🌐 You can now login at: http://localhost:3000/admin-login');
    console.log('🔗 Or use the frontend login page with these credentials');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
  }
}

createAdminUser();
