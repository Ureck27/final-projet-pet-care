const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, authorizeRole('admin'), getUsers)
  .post(protect, authorizeRole('admin'), createUser);

router.route('/profile').get(protect, getUserById);

router
  .route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, authorizeRole('admin'), deleteUser);

module.exports = router;
