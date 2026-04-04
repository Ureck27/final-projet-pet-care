const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: false
  },
  breed: {
    type: String,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  age: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
petSchema.index({ userId: 1 });
petSchema.index({ type: 1 });

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
