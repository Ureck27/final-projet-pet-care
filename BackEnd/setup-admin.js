const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to database
require('./config/db-ipv4');

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking for existing admin users...');
    
    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in database');
      console.log('');
      console.log('📝 Creating default admin user...');
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@petcare.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        status: 'accepted'
      });
      
      const savedAdmin = await adminUser.save();
      
      console.log('✅ Default admin user created successfully!');
      console.log('');
      console.log('📧 **LOGIN CREDENTIALS:**');
      console.log('📧 Email: admin@petcare.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Name: Admin User');
      console.log('🔐 Role: admin');
      console.log('');
      console.log('🌐 Login URL: http://localhost:3000/admin-login');
      console.log('🔗 Or use frontend login page');
      
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email}) - Status: ${admin.status}`);
      });
      console.log('');
      console.log('📝 If you want to create a new admin, here are the credentials:');
      console.log('📧 Email: admin@petcare.com');
      console.log('🔑 Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminUsers();
