const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    services: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
