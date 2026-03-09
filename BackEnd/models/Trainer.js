const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, required: true },
  experience: { type: Number, required: true }, // years
  certifications: [String],
  services: [String],
  pricing: { type: Number, required: true }, // hourly rate or base price
  availability: [String],
  rating: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
