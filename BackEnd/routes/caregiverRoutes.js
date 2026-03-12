const express = require('express');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
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
router.get('/pending', protect, authorizeRole('admin'), getCaregiverApplications);
router.get('/stats', protect, authorizeRole('admin'), getCaregiverStats);
router.put('/approve/:id', protect, authorizeRole('admin'), approveCaregiverApplication);
router.put('/reject/:id', protect, authorizeRole('admin'), rejectCaregiverApplication);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteCaregiverApplication);

module.exports = router;
