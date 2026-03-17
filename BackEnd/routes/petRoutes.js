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
const { upload, handleSizeLimits } = require('../middleware/upload');

router.route('/')
  .get(protect, getPets)
  .post(protect, upload.single('image'), handleSizeLimits, createPet);

router.route('/user/:userId')
  .get(protect, getPetsByUserId);

router.route('/:id')
  .get(protect, getPetById)
  .put(protect, upload.single('image'), handleSizeLimits, updatePet)
  .delete(protect, deletePet);

module.exports = router;
