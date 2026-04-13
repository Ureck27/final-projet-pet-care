const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, authorizeRole('owner', 'caregiver', 'trainer', 'admin'), getTasks)
  .post(protect, authorizeRole('owner', 'admin'), createTask);

router
  .route('/:id')
  .get(protect, authorizeRole('owner', 'caregiver', 'trainer', 'admin'), getTaskById)
  .put(protect, authorizeRole('owner', 'caregiver', 'trainer', 'admin'), updateTask)
  .delete(protect, authorizeRole('owner', 'admin'), deleteTask);

module.exports = router;
