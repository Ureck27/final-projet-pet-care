const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllPets,
  getTrainerRequests,
  getAllTrainers,
  getDashboardStats,
  acceptTrainerRequest,
  rejectTrainerRequest
} = require('../controllers/adminController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// All routes here are protected and restricted to admin
router.use(protect, authorizeRole('admin'));

router.get('/users', getAllUsers);
router.get('/pets', getAllPets);
router.get('/trainer-requests', getTrainerRequests);
router.get('/trainers', getAllTrainers);
router.get('/dashboard', getDashboardStats);
router.put('/trainer-requests/:id/accept', acceptTrainerRequest);
router.put('/trainer-requests/:id/reject', rejectTrainerRequest);

module.exports = router;
