const express = require('express');
const router = express.Router();
const {
  createPet,
  getAllPets,
  getPetsByUserId,
  getUserPets,
  getTrainerPets,
  updatePetStatus,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createPetSchema, updatePetSchema } = require('../validators/petSchema');

// POST /api/pets - Create pet (owner or admin)
router.post(
  '/',
  protect,
  authorizeRole('owner', 'admin'),
  uploadSingle('image'),
  validate(createPetSchema),
  createPet,
);

// GET /api/pets - Get all pets (admin) or user's pets (owner)
router.get(
  '/',
  protect,
  authorizeRole('admin', 'owner'),
  (req, res, next) => {
    if (req.query.userId || req.query.ownerId) {
      return getPetsByUserId(req, res, next);
    }
    next();
  },
  getAllPets,
);

// GET /api/pets/user - Get logged-in user pets
router.get('/user', protect, authorizeRole('owner', 'admin'), getUserPets);

// GET /api/pets/trainer/assigned - Get pets assigned to trainer/caregiver
router.get(
  '/trainer/assigned',
  protect,
  authorizeRole('trainer', 'caregiver', 'admin'),
  getTrainerPets,
);

// GET /api/pets/:id - Get pet by ID
router.get(
  '/:id',
  protect,
  authorizeRole('owner', 'trainer', 'caregiver', 'admin'),
  (req, res, next) => {
    const { getPetById } = require('../controllers/petController');
    return getPetById(req, res, next);
  },
);

// PATCH /api/pets/:id - Update pet status (admin only)
router.patch('/:id', protect, authorizeRole('admin'), updatePetStatus);

// PUT /api/pets/:id - Update pet details (owner or admin)
router.put(
  '/:id',
  protect,
  authorizeRole('owner', 'admin'),
  uploadSingle('image'),
  validate(updatePetSchema),
  (req, res, next) => {
    const { updatePet } = require('../controllers/petController');
    return updatePet(req, res, next);
  },
);

// DELETE /api/pets/:id - Soft delete pet (owner or admin only)
router.delete('/:id', protect, authorizeRole('owner', 'admin'), (req, res, next) => {
  const { deletePet } = require('../controllers/petController');
  return deletePet(req, res, next);
});

module.exports = router;
