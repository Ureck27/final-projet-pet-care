const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPets)
  .post(protect, createPet);

router.route('/:id')
  .get(protect, getPetById)
  .put(protect, updatePet)
  .delete(protect, deletePet);

module.exports = router;
