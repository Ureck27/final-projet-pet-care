const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/dailyActivityController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.route('/').post(protect, authorizeRole('caregiver', 'trainer', 'admin'), createActivity);

router
  .route('/pet/:petId')
  .get(protect, authorizeRole('owner', 'caregiver', 'trainer', 'admin'), getActivities);

router
  .route('/:id')
  .put(protect, authorizeRole('caregiver', 'trainer', 'admin'), updateActivity)
  .delete(protect, authorizeRole('caregiver', 'trainer', 'admin'), deleteActivity);

module.exports = router;
