const Trainer = require('../models/Trainer');
const { delPattern } = require('../services/cacheService');

// @desc    Get all trainers (admin only)
// @route   GET /api/trainers
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new trainer (admin only)
// @route   POST /api/trainers
const createTrainer = async (req, res) => {
  try {
    const { name, email, services, price } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email' });
    }

    const trainer = await Trainer.create({
      name,
      email,
      services: services || [],
      price,
    });

    // Invalidate trainer cache
    await delPattern('trainers:*');

    res.status(201).json(trainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current trainer profile
// @route   GET /api/trainers/profile
const getTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' });
    }
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  getTrainerProfile,
  createTrainer,
};
