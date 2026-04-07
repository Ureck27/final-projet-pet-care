const express = require('express');
const router = express.Router();
const { createTrainer, getTrainers, getTrainerById } = require('../controllers/trainerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../services/cacheService');

// POST /api/trainers - Create trainer (admin only)
router.post('/', protect, authorizeRole('admin'), createTrainer);

// GET /api/trainers - Get all trainers (admin and user)
router.get(
  '/',
  protect,
  authorizeRole('admin', 'user'),
  cacheMiddleware('trainers', 3600),
  getTrainers,
);

// GET /api/trainers/:id - Get trainer by ID (admin and user)
router.get(
  '/:id',
  protect,
  authorizeRole('admin', 'user'),
  cacheMiddleware('trainer-profile', 3600),
  getTrainerById,
);

module.exports = router;
