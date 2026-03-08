const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require('../controllers/trainerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTrainers) // Public or protected depending on design, make it protected to be consistent
  .post(protect, authorizeRole('trainer', 'admin'), createTrainer);

router.route('/:id')
  .get(protect, getTrainerById)
  .put(protect, authorizeRole('trainer', 'admin'), updateTrainer)
  .delete(protect, authorizeRole('trainer', 'admin'), deleteTrainer);

module.exports = router;
