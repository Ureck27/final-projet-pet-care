const express = require('express');
const router = express.Router();
const { createTrainerRequest } = require('../controllers/trainerRequestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTrainerRequest);

module.exports = router;
