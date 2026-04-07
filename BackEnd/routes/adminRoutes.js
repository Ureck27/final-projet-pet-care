const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingPets,
  getTrainerRequests,
  getAllTrainers,
  getDashboardStats,
  updateUserRole,
  updateUserStatus,
  approvePet,
  rejectPet,
  deleteUser,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
} = require('../controllers/adminController');
const {
  approveTrainerRequest,
  rejectTrainerRequest,
} = require('../controllers/trainerRequestController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// All routes here are protected and restricted to admin
router.use(protect, authorizeRole('admin'));

router.get('/users', getAllUsers);
router.get('/pets', getPendingPets);
router.get('/trainer-requests', getTrainerRequests);
router.get('/trainers', getAllTrainers);
router.get('/dashboard', getDashboardStats);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.patch('/pets/:id/approve', approvePet);
router.patch('/pets/:id/reject', rejectPet);
router.put('/trainer-requests/:id/accept', approveTrainerRequest);
router.put('/trainer-requests/:id/reject', rejectTrainerRequest);

router.get('/requests', getPendingRequests);
router.patch('/accept/:type/:id', acceptRequest);
router.patch('/reject/:type/:id', rejectRequest);

module.exports = router;
