const Project = require('../models/Project');
const ProjectMessage = require('../models/ProjectMessage');
const mongoose = require('mongoose');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const {
      status,
      petId,
      trainerId,
      search,
      sortBy = 'createdAt',
      sortDir = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { ownerId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (petId) {
      query.petId = petId;
    }

    if (trainerId) {
      query.trainerId = trainerId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortDir === 'desc' ? -1 : 1;

    // Execute query with pagination
    const projects = await Project.find(query)
      .populate('petId', 'name type photo')
      .populate('trainerId', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Project.countDocuments(query);

    // Calculate stats
    const stats = await Project.aggregate([
      { $match: { ownerId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'inProgress'] }, 1, 0] } },
          upcoming: { $sum: { $cond: [{ $eq: ['$status', 'upcoming'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          paused: { $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      projects,
      stats: stats[0] || {
        total: 0,
        inProgress: 0,
        upcoming: 0,
        completed: 0,
        paused: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    })
      .populate('petId', 'name type photo breed age')
      .populate('trainerId', 'name email bio')
      .populate('ownerId', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      ownerId: req.user._id,
      order: await Project.countDocuments({ ownerId: req.user._id })
    };

    const project = new Project(projectData);
    await project.save();

    // Populate references for response
    await project.populate('petId', 'name type photo');
    await project.populate('trainerId', 'name email');

    // Create initial message if provided
    if (req.body.initialMessage) {
      const message = new ProjectMessage({
        projectId: project._id,
        senderId: req.user._id,
        senderName: req.user.name || req.user.fullName,
        senderAvatar: req.user.avatar || '',
        text: req.body.initialMessage,
        messageType: 'info'
      });
      await message.save();
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'id' && key !== '_id' && key !== 'ownerId') {
        project[key] = req.body[key];
      }
    });

    await project.save();

    // Populate references for response
    await project.populate('petId', 'name type photo');
    await project.populate('trainerId', 'name email');

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated messages
    await ProjectMessage.deleteMany({ projectId: project._id });

    // Delete project
    await Project.deleteOne({ _id: project._id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private
exports.reorderProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ message: 'Project IDs must be an array' });
    }

    // Update order for each project
    const bulkOps = projectIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, ownerId: req.user._id },
        update: { order: index }
      }
    }));

    await Project.bulkWrite(bulkOps);

    // Return updated projects
    const projects = await Project.find({ ownerId: req.user._id })
      .populate('petId', 'name type photo')
      .populate('trainerId', 'name email')
      .sort({ order: 1 });

    res.json(projects);
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({ message: 'Failed to reorder projects', error: error.message });
  }
};

// @desc    Get project messages
// @route   GET /api/projects/:id/messages
// @access  Private
exports.getProjectMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Verify project ownership
    const project = await Project.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const messages = await ProjectMessage.find({ projectId: project._id })
      .populate('senderId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ProjectMessage.countDocuments({ projectId: project._id });

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// @desc    Add message to project
// @route   POST /api/projects/:id/messages
// @access  Private
exports.addProjectMessage = async (req, res) => {
  try {
    const { text, messageType = 'info', priority = 'medium' } = req.body;

    // Verify project ownership
    const project = await Project.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const message = new ProjectMessage({
      projectId: project._id,
      senderId: req.user._id,
      senderName: req.user.name || req.user.fullName,
      senderAvatar: req.user.avatar || '',
      text,
      messageType,
      priority
    });

    await message.save();
    await message.populate('senderId', 'name email avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Add project message error:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
};

// @desc    Toggle message star
// @route   PUT /api/projects/:projectId/messages/:messageId/star
// @access  Private
exports.toggleMessageStar = async (req, res) => {
  try {
    // Verify project ownership
    const project = await Project.findOne({
      _id: req.params.projectId,
      ownerId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const message = await ProjectMessage.findOne({
      _id: req.params.messageId,
      projectId: project._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.starred = !message.starred;
    await message.save();

    res.json({ starred: message.starred });
  } catch (error) {
    console.error('Toggle message star error:', error);
    res.status(500).json({ message: 'Failed to toggle star', error: error.message });
  }
};
