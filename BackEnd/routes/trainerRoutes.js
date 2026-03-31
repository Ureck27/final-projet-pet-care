const express = require('express');
const router = express.Router();
const {
  createTrainer,
  getTrainers
} = require('../controllers/trainerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/trainers - Create trainer (admin only)
router.post('/', protect, authorizeRole('admin'), createTrainer);

// GET /api/trainers - Get all trainers (admin and user)
router.get('/', protect, authorizeRole('admin', 'user'), getTrainers);

module.exports = router;
