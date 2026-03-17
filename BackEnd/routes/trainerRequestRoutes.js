const express = require('express');
const router = express.Router();
const { 
  createTrainerRequest, 
  getTrainerRequests, 
  getTrainerRequestById,
  approveTrainerRequest, 
  rejectTrainerRequest,
  deleteTrainerRequest
} = require('../controllers/trainerRequestController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { upload, handleSizeLimits } = require('../middleware/upload');

// Apply upload middleware to the create route
router.post('/', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'idCardImage', maxCount: 1 },
  { name: 'certificateImage', maxCount: 5 }
]), handleSizeLimits, createTrainerRequest);
router.get('/', protect, authorizeRole('admin'), getTrainerRequests);
router.get('/:id', protect, authorizeRole('admin'), getTrainerRequestById);
router.put('/:id/approve', protect, authorizeRole('admin'), approveTrainerRequest);
router.put('/:id/reject', protect, authorizeRole('admin'), rejectTrainerRequest);
router.delete('/:id', protect, authorizeRole('admin'), deleteTrainerRequest);

module.exports = router;
