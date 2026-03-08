const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');

router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/:id')
  .get(getPetById)
  .put(updatePet)
  .delete(deletePet);

module.exports = router;
