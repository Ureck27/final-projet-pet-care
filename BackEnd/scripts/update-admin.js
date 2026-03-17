const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petcare');

const updateAdminRole = async () => {
  try {
    // Update admin user role
    const result = await User.updateOne(
      { email: 'admin@example.com' },
      { role: 'admin' }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const admin = await User.findOne({ email: 'admin@example.com' });
    console.log('Admin user:', admin);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdminRole();
