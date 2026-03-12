const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  submitCaregiverApplication,
  getCaregiverApplications,
  approveCaregiverApplication,
  rejectCaregiverApplication,
  deleteCaregiverApplication,
  getCaregiverStats
} = require('../controllers/caregiverApplicationController');

const router = express.Router();

// Public route - submit application
router.post('/apply', protect, submitCaregiverApplication);

// Admin only routes
router.get('/pending', protect, authorize('admin'), getCaregiverApplications);
router.get('/stats', protect, authorize('admin'), getCaregiverStats);
router.put('/approve/:id', protect, authorize('admin'), approveCaregiverApplication);
router.put('/reject/:id', protect, authorize('admin'), rejectCaregiverApplication);
router.delete('/delete/:id', protect, authorize('admin'), deleteCaregiverApplication);

module.exports = router;
