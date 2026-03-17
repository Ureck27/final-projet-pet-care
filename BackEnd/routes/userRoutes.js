const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage
} = require('../controllers/userController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { upload, handleSizeLimits } = require('../middleware/upload');

router.route('/profile-image')
  .put(protect, upload.single('image'), handleSizeLimits, uploadProfileImage);

router.route('/')
  .get(protect, authorizeRole('admin'), getUsers)
  .post(protect, authorizeRole('admin'), createUser);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, authorizeRole('admin'), deleteUser);

module.exports = router;
