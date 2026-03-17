const mongoose = require('mongoose');

const caregiverApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  petTypes: [{
    type: String,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other']
  }],
  certifications: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  idDocument: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
caregiverApplicationSchema.index({ status: 1 });
caregiverApplicationSchema.index({ email: 1 });

const CaregiverApplication = mongoose.model('CaregiverApplication', caregiverApplicationSchema);

module.exports = CaregiverApplication;
