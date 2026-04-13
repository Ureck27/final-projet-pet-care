const express = require('express');
const router = express.Router();
const {
  uploadPhoto,
  completeRoutine,
  getMyRoutines,
  getPetRoutineLogs,
  getAllRoutinesAdmin,
} = require('../controllers/routineController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { uploadSingle, handleUploadError } = require('../middleware/uploadMiddleware');

// POST /api/routine/upload - Care staff (trainer/worker) or admin can upload
router.post(
  '/upload',
  protect,
  authorizeRole('trainer', 'caregiver', 'admin'),
  uploadSingle('photo'),
  handleUploadError,
  uploadPhoto,
);

// POST /api/routine/complete - Care staff (trainer/worker) or admin can complete routines
router.post(
  '/complete',
  protect,
  authorizeRole('trainer', 'caregiver', 'admin'),
  uploadSingle('photo'),
  handleUploadError,
  completeRoutine,
);

// GET /api/routine/my-routines - Get routines for current caregiver
router.get('/my-routines', protect, authorizeRole('trainer', 'caregiver'), getMyRoutines);

// GET /api/routine/pet/:petId/logs - Get routine logs for a specific pet
router.get('/pet/:petId/logs', protect, getPetRoutineLogs);

// GET /api/routine/admin/all - Admin only: Get all routines and logs
router.get('/admin/all', protect, authorizeRole('admin'), getAllRoutinesAdmin);

module.exports = router;
