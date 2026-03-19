const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: { 
    type: String,
    required: false
  },
  age: { 
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  healthStatus: {
    type: String,
    enum: ['healthy', 'warning', 'critical'],
    default: 'healthy'
  },
  healthDescription: {
    type: String,
    required: false
  },
  recommendations: {
    type: String,
    required: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  weight: { 
    type: Number,
    required: false
  },
  color: { 
    type: String,
    required: false
  },
  medicalNotes: { 
    type: String,
    required: false
  },
  photo: { 
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Pets start as pending until admin approval
  }
}, {
  timestamps: true
});

// Index for faster queries
petSchema.index({ owner: 1 });
petSchema.index({ type: 1 });

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
