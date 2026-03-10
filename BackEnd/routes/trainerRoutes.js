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
  .get(protect, getTrainers) // Protected - only authenticated users can view trainers
  .post(protect, authorizeRole('admin'), createTrainer); // Only admin can create trainers

router.route('/:id')
  .get(protect, getTrainerById)
  .put(protect, authorizeRole('trainer', 'admin'), updateTrainer)
  .delete(protect, authorizeRole('trainer', 'admin'), deleteTrainer);

module.exports = router;
