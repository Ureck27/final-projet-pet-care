const mongoose = require('mongoose');

const petUpdateSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    type: {
      type: String,
      enum: ['photo', 'video', 'note'],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.type !== 'note';
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    mood: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
petUpdateSchema.index({ petId: 1, createdAt: -1 });
petUpdateSchema.index({ trainerId: 1 });

const PetUpdate = mongoose.model('PetUpdate', petUpdateSchema);
module.exports = PetUpdate;
