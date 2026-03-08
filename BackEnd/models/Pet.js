const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  species: {
    type: String,
    enum: ['dog', 'cat'],
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: String
  },
  color: {
    type: String
  },
  medicalNotes: {
    type: String
  },
  photo: {
    type: String
  }
}, {
  timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
