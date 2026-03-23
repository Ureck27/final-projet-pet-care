const express = require('express');
const router = express.Router();
const { 
  createTrainerRequest, 
  getTrainerRequests, 
  getTrainerRequestById,
  getUserTrainerRequest,
  approveTrainerRequest, 
  rejectTrainerRequest,
  deleteTrainerRequest
} = require('../controllers/trainerRequestController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { uploadTrainerFiles, handleUploadError } = require('../middleware/uploadMiddleware');

// Apply upload middleware to the create route
router.post('/', protect, uploadTrainerFiles, handleUploadError, createTrainerRequest);
router.get('/my-request', protect, getUserTrainerRequest); // User can check their own request
router.get('/', protect, authorizeRole('admin'), getTrainerRequests);
router.get('/:id', protect, authorizeRole('admin'), getTrainerRequestById);
router.put('/:id/approve', protect, authorizeRole('admin'), approveTrainerRequest);
router.put('/:id/reject', protect, authorizeRole('admin'), rejectTrainerRequest);
router.delete('/:id', protect, authorizeRole('admin'), deleteTrainerRequest);

module.exports = router;
