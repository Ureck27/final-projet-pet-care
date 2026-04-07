const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');

const createReviewService = async (userId, trainerId, rating, comment) => {
  // Fraud Prevention: Check if user has a completed booking with this trainer
  const completedBooking = await Booking.findOne({
    ownerId: userId,
    trainerId: trainerId,
    status: 'completed',
    isDeleted: { $ne: true },
  });

  if (!completedBooking) {
    throw new ApiError(
      403,
      'Forbidden: You can only review caregivers you have completed a booking with.',
    );
  }

  // Optional: check if they already reviewed
  const existingReview = await Review.findOne({ userId, trainerId, isDeleted: { $ne: true } });
  if (existingReview) {
    throw new ApiError(400, 'Bad Request: You have already reviewed this caregiver.');
  }

  const review = await Review.create({
    userId,
    trainerId,
    rating,
    comment,
  });

  return review;
};

module.exports = {
  createReviewService,
};
