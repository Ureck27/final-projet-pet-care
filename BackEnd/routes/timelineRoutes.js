const express = require('express');
const router = express.Router();
const {
  createTimelinePost,
  getPetTimeline,
  deleteTimelinePost
} = require('../controllers/timelineController');
const { protect } = require('../middleware/authMiddleware');
const { upload, handleSizeLimits } = require('../middleware/upload');

router.route('/')
  .post(protect, upload.single('media'), handleSizeLimits, createTimelinePost);

router.route('/:petId')
  .get(protect, getPetTimeline);

router.route('/:id')
  .delete(protect, deleteTimelinePost);

module.exports = router;
