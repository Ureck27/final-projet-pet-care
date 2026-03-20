const express = require('express');
const router = express.Router();
const {
  createPet,
  getAllPets,
  getPetsByUserId,
  getUserPets,
  updatePetStatus
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authMiddleware');

// POST /api/pets - Create pet (user only)
router.post('/', protect, authorizeRole('user'), createPet);

// GET /api/pets?userId= - Get pets by userId (admin only)
router.get('/', protect, authorizeRole('admin'), (req, res, next) => {
  if (req.query.userId) {
    return getPetsByUserId(req, res, next);
  }
  next();
}, getAllPets);

// GET /api/pets/user - Get logged-in user pets
router.get('/user', protect, getUserPets);

// PATCH /api/pets/:id - Update pet status (admin only)
router.patch('/:id', protect, authorizeRole('admin'), updatePetStatus);

module.exports = router;
