const express = require('express');
const router = express.Router();
const { 
  createTrainerRequest, 
  getTrainerRequests, 
  approveTrainerRequest, 
  rejectTrainerRequest 
} = require('../controllers/trainerRequestController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', protect, createTrainerRequest);
router.get('/', protect, authorizeRole('admin'), getTrainerRequests);
router.put('/:id/approve', protect, authorizeRole('admin'), approveTrainerRequest);
router.put('/:id/reject', protect, authorizeRole('admin'), rejectTrainerRequest);

module.exports = router;
