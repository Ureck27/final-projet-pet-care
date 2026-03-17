#!/usr/bin/env node

/**
 * Script to create an admin user account
 * Usage: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      console.log('❌ Admin with this email already exists!');
      console.log('Email:', adminExists.email);
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      fullName: 'System Administrator',
      email: process.env.ADMIN_EMAIL,
      password: 'AdminPass123!', // Change this password!
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Details:');
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('  Status:', admin.status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the default password!');
    console.log('   Login at /api/auth/admin-login with:');
    console.log('   Email: ' + admin.email);
    console.log('   Password: AdminPass123!');
    console.log('\nThen update the password in your admin profile.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
