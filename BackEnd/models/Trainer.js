const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  bio: { type: String, required: true },
  experience: { type: Number, required: true }, // years
  certifications: [String],
  profileImage: { type: String },
  certificateImages: [String],
  services: [{ type: mongoose.Schema.Types.Mixed }], // Can contain old connection string or new object { serviceName, price, priceType, isActive, _id }
  pricing: { type: Number }, // optional now
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
