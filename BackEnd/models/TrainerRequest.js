const mongoose = require('mongoose');

const trainerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    certifications: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    certificateImages: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt
  },
);

// Index for faster queries
trainerRequestSchema.index({ status: 1 });
trainerRequestSchema.index({ userId: 1 });

const TrainerRequest = mongoose.model('TrainerRequest', trainerRequestSchema);
module.exports = TrainerRequest;
