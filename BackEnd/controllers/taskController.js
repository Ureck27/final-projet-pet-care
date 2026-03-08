const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('petId', 'name')
      .populate('ownerId', 'fullName')
      .populate('caregiverId', 'fullName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('petId', 'name')
      .populate('ownerId', 'fullName')
      .populate('caregiverId', 'fullName');
      
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { petId, ownerId, caregiverId, title, type, description, priority, dueDate, assignedTo } = req.body;
    
    const task = await Task.create({
      petId,
      ownerId,
      caregiverId,
      title,
      type,
      description,
      priority,
      dueDate,
      assignedTo,
      status: 'pending'
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task status or details
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = req.body.status || task.status;
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.priority = req.body.priority || task.priority;
      task.completionNotes = req.body.completionNotes || task.completionNotes;
      
      if (req.body.status === 'completed' && task.status !== 'completed') {
        task.completedAt = new Date();
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await Task.deleteOne({ _id: task._id });
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
