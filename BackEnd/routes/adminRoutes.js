const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllPets,
  getTrainerRequests,
  getAllTrainers,
  getDashboardStats,
  acceptTrainerRequest,
  rejectTrainerRequest,
  updateUserRole,
  updateUserStatus,
  updatePetStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// All routes here are protected and restricted to admin
router.use(protect, authorizeRole('admin'));

router.get('/users', getAllUsers);
router.get('/pets', getAllPets);
router.get('/trainer-requests', getTrainerRequests);
router.get('/trainers', getAllTrainers);
router.get('/dashboard', getDashboardStats);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.put('/pets/:id/status', updatePetStatus);
router.put('/trainer-requests/:id/accept', acceptTrainerRequest);
router.put('/trainer-requests/:id/reject', rejectTrainerRequest);

module.exports = router;
