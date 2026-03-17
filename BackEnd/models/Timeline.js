const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: false
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries fetching timeline by pet
timelineSchema.index({ petId: 1, createdAt: -1 });

const Timeline = mongoose.model('Timeline', timelineSchema);
module.exports = Timeline;
