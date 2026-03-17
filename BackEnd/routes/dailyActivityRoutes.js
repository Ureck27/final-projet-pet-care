const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/dailyActivityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createActivity);

router.route('/pet/:petId')
  .get(protect, getActivities);

router.route('/:id')
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;
