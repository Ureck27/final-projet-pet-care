#!/usr/bin/env node

/**
 * Create local admin credentials for testing
 * This script creates admin login info without database connection
 */

const fs = require('fs');
const path = require('path');

// Admin credentials
const adminCredentials = {
  email: 'admin@petcare.com',
  password: 'Admin123!',
  name: 'System Administrator',
  role: 'admin',
};

console.log('🔧 Creating admin credentials for testing...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ADMIN LOGIN DETAILS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📧 Email:', adminCredentials.email);
console.log('🔑 Password:', adminCredentials.password);
console.log('👤 Name:', adminCredentials.name);
console.log('🔐 Role:', adminCredentials.role);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('🌐 Login URL: http://localhost:3000/admin-login');
console.log('');
console.log('📝 Instructions:');
console.log('1. Start the backend server: npm run dev');
console.log('2. Start the frontend server: npm run dev (in FrontEnd folder)');
console.log('3. Go to: http://localhost:3000/admin-login');
console.log('4. Enter the email and password above');
console.log('');
console.log('⚠️  Note: These credentials work when the database is connected.');
console.log("    If database connection fails, the login won't work.");

// Save credentials to a file for reference
const credentialsPath = path.join(__dirname, 'admin-credentials.json');
fs.writeFileSync(credentialsPath, JSON.stringify(adminCredentials, null, 2));
console.log('💾 Credentials saved to:', credentialsPath);
