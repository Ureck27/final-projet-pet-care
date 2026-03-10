const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getProjectMessages,
  addProjectMessage,
  toggleMessageStar
} = require('../controllers/projectController');

// Middleware to protect routes
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Project routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/reorder')
  .put(reorderProjects);

// Message routes
router.route('/:id/messages')
  .get(getProjectMessages)
  .post(addProjectMessage);

router.route('/:projectId/messages/:messageId/star')
  .put(toggleMessageStar);

module.exports = router;
