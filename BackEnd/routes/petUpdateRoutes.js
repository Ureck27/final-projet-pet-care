const express = require('express');
const router = express.Router();
const { 
  createPetUpdate, 
  getPetUpdates, 
  getTrainerUpdates,
  deletePetUpdate 
} = require('../controllers/petUpdateController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { uploadPetMedia, handleUploadError } = require('../middleware/uploadMiddleware');

// Routes
router.post('/', protect, authorizeRole('trainer'), uploadPetMedia, handleUploadError, createPetUpdate);
router.get('/:petId', getPetUpdates); // Public - anyone can view pet updates
router.get('/trainer/:trainerId', protect, authorizeRole('trainer'), getTrainerUpdates);
router.delete('/:id', protect, authorizeRole('trainer'), deletePetUpdate);

module.exports = router;
