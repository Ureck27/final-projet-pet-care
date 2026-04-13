const express = require('express');
const router = express.Router();
const {
  createTrainer,
  getTrainers,
  getTrainerById,
  getTrainerProfile,
} = require('../controllers/trainerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../services/cacheService');

// POST /api/trainers - Create trainer (admin only)
router.post('/', protect, authorizeRole('admin'), createTrainer);

// GET /api/trainers/profile - Get current trainer's profile
router.get('/profile', protect, authorizeRole('trainer', 'admin'), getTrainerProfile);

// GET /api/trainers - Get all trainers (admin, owner, caregiver, trainer)
router.get(
  '/',
  protect,
  authorizeRole('admin', 'owner', 'caregiver', 'trainer'),
  cacheMiddleware('trainers', 3600),
  getTrainers,
);

// GET /api/trainers/:id - Get trainer by ID
router.get(
  '/:id',
  protect,
  authorizeRole('admin', 'owner', 'caregiver', 'trainer'),
  cacheMiddleware('trainer-profile', 3600),
  getTrainerById,
);

module.exports = router;
