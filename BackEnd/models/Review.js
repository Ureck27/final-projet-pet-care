const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Avoid duplicate reviews from the same user to the same trainer
reviewSchema.index({ userId: 1, trainerId: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
