const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  species: {
    type: String
  },
  breed: { type: String },
  age: { type: Number },
  weight: { type: Number },
  color: { type: String },
  medicalNotes: { type: String },
  photo: { type: String }
}, {
  timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
