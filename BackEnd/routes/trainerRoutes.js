const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerServices,
  addTrainerService,
  updateTrainerService,
  deleteTrainerService
} = require('../controllers/trainerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTrainers) // Protected - only authenticated users can view trainers
  .post(protect, authorizeRole('admin'), createTrainer); // Only admin can create trainers

router.route('/:id')
  .get(protect, getTrainerById)
  .put(protect, authorizeRole('trainer', 'admin'), updateTrainer)
  .delete(protect, authorizeRole('trainer', 'admin'), deleteTrainer);

router.route('/:id/services')
  .get(getTrainerServices)
  .post(protect, authorizeRole('trainer', 'admin'), addTrainerService);

router.route('/:id/services/:serviceId')
  .put(protect, authorizeRole('trainer', 'admin'), updateTrainerService)
  .delete(protect, authorizeRole('trainer', 'admin'), deleteTrainerService);

module.exports = router;
