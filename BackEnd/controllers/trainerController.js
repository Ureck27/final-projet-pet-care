const Trainer = require('../models/Trainer');

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
      price
    });
    
    res.status(201).json(trainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  createTrainer
};
