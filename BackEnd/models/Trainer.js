const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  services: [{
    type: String
  }],
  price: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
