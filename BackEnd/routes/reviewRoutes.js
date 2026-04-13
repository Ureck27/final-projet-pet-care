const express = require('express');
const router = express.Router();
const {
  createReview,
  getTrainerReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/reviews - Add review
router.post('/', protect, authorizeRole('owner'), createReview);

// GET /api/reviews/trainer/:trainerId - Get reviews for trainer
router.get('/trainer/:trainerId', getTrainerReviews);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', protect, deleteReview);

module.exports = router;
