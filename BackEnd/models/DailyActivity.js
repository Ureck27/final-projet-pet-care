const mongoose = require('mongoose');

const dailyActivitySchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: ['walk', 'play', 'meal', 'training', 'rest', 'medication', 'other'],
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    duration: Number, // in minutes
    startTime: { type: Date, required: true },
    endTime: Date,
    photo: String,
    videoUrl: String,
    emotion: {
      type: String,
      enum: [
        'happy',
        'sad',
        'anxious',
        'stressed',
        'calm',
        'playful',
        'neutral',
        'distressed',
        'content',
      ],
    },
    emotionConfidence: Number,
    caregiverNotes: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    aiVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);
module.exports = DailyActivity;
