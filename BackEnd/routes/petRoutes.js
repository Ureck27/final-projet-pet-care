const express = require('express');
const router = express.Router();
const {
  createPet,
  getAllPets,
  getPetsByUserId,
  getUserPets,
  getTrainerPets,
  updatePetStatus
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// POST /api/pets - Create pet (user only)
router.post('/', protect, authorizeRole('user'), uploadSingle('image'), createPet);

// GET /api/pets?userId= - Get pets by userId (admin and users)
router.get('/', protect, authorizeRole('admin', 'user'), (req, res, next) => {
  if (req.query.userId) {
    return getPetsByUserId(req, res, next);
  }
  next();
}, getAllPets);

// GET /api/pets/user - Get logged-in user pets
router.get('/user', protect, getUserPets);

// GET /api/pets/trainer/assigned - Get pets assigned to trainer
router.get('/trainer/assigned', protect, authorizeRole('trainer'), getTrainerPets);

// GET /api/pets/:id - Get pet by ID (protected)
router.get('/:id', protect, (req, res, next) => {
  const { getPetById } = require('../controllers/petController');
  return getPetById(req, res, next);
});

// PATCH /api/pets/:id - Update pet status (admin only)
router.patch('/:id', protect, authorizeRole('admin'), updatePetStatus);

// PUT /api/pets/:id - Update pet details (owner only)
router.put('/:id', protect, authorizeRole('user'), uploadSingle('image'), (req, res, next) => {
  const { updatePet } = require('../controllers/petController');
  return updatePet(req, res, next);
});

module.exports = router;
