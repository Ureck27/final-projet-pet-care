const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'worker', 'caregiver', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending' // Users start as pending until admin approval
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Method to check if entered password matches hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Bonus: Add method to compare password as requested
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  console.log('--- Hashing Password ---');
  console.log('Original Password:', this.password);

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Hashed Password:', this.password);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw error;
  }
});

// Ensure password is not selected by default in queries
userSchema.pre(/^find/, function () {
  if (this.options._recursed) {
    return;
  }
  this.select('-password');
});

const User = mongoose.model('User', userSchema);
module.exports = User;
