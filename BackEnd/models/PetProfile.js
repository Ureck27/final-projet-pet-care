const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Health & Medical
  dateOfBirth: Date,
  weight: Number,
  color: String,
  microchipId: String,
  veterinarian: {
    name: String,
    clinic: String,
    phone: String,
    email: String
  },
  medicalHistory: [{
    date: Date,
    condition: String,
    treatment: String,
    notes: String
  }],
  allergies: [String],

  // Dietary
  dietaryRequirements: String,
  foodBrand: String,
  mealsPerDay: Number,
  mealTimes: [String],
  restrictions: [String],
  treats: [String],
  waterIntakeGoal: Number,

  // Medications
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    instructions: String,
    purpose: String
  }],
  supplements: [{
    name: String,
    dosage: String,
    frequency: String,
    purpose: String
  }],

  // Behavior
  temperament: [String],
  knownBehaviors: [String],
  fears: [String],
  triggers: [String],
  positiveBehaviors: [String],
  trainingStatus: String,

  // Emergency
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  insuranceProvider: String,
  insurancePolicyNumber: String,

  // Preferences
  preferredActivities: [String],
  exerciseNeeds: { type: String, enum: ['low', 'moderate', 'high', 'very-high'] },
  sleepSchedule: { bedtime: String, wakeTime: String },
  grooming: {
    frequency: String,
    groomer: String,
    lastGrooming: Date
  },

  // Medical Records
  vaccinations: [{
    name: String,
    date: Date,
    expiryDate: Date,
    vetName: String
  }],

  specialInstructions: String
}, {
  timestamps: true
});

const PetProfile = mongoose.model('PetProfile', petProfileSchema);
module.exports = PetProfile;
