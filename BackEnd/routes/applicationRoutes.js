const express = require('express');
const router = express.Router();
const { submitApplication } = require('../controllers/applicationController');

// We use an optional protect middleware if we want to capture userId, but we can just leave it public
router.post('/', submitApplication);

module.exports = router;
