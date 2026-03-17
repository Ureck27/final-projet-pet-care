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

const { upload, handleSizeLimits } = require('../middleware/upload');

const router = express.Router();

// Public route - submit application
router.post('/apply', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 }
]), handleSizeLimits, submitCaregiverApplication);

// Admin only routes
router.get('/pending', protect, authorizeRole('admin'), getCaregiverApplications);
router.get('/stats', protect, authorizeRole('admin'), getCaregiverStats);
router.put('/approve/:id', protect, authorizeRole('admin'), approveCaregiverApplication);
router.put('/reject/:id', protect, authorizeRole('admin'), rejectCaregiverApplication);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteCaregiverApplication);

module.exports = router;
