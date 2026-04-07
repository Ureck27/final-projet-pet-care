const Review = require('../models/Review');
const { createReviewService } = require('../services/reviewService');

// @desc    Create a new review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { trainerId, rating, comment } = req.body;

    const review = await createReviewService(req.user._id, trainerId, rating, comment);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific trainer
// @route   GET /api/reviews/trainer/:trainerId
const getTrainerReviews = async (req, res, next) => {
  try {
    const { trainerId } = req.params;
    const reviews = await Review.find({ trainerId }).populate('userId', 'name avatar');

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Security check: Only author or admin can delete
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    review.isDeleted = true;
    await review.save();

    res.status(200).json({ success: true, data: null, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getTrainerReviews,
  deleteReview,
};
