const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetsByUserId
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { uploadPetFiles, handleUploadError } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getPets)
  .post(protect, uploadPetFiles, handleUploadError, createPet);

router.route('/user/:userId')
  .get(protect, getPetsByUserId);

router.route('/:id')
  .get(protect, getPetById)
  .put(protect, uploadPetFiles, handleUploadError, updatePet)
  .delete(protect, deletePet);

module.exports = router;
