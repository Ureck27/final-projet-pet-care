const Trainer = require('../models/Trainer');

// @desc    Get all trainers
// @route   GET /api/trainers
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('userId', 'name fullName email phone');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('userId', 'name fullName email phone');
    if (trainer) {
      res.json(trainer);
    } else {
      res.status(404).json({ message: 'Trainer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new trainer profile
// @route   POST /api/trainers
const createTrainer = async (req, res) => {
  try {
    const { bio, experience, certifications, services, pricing, availability } = req.body;
    
    // check if user already has a trainer profile
    const existing = await Trainer.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Trainer profile already exists for this user' });
    }

    const trainer = await Trainer.create({
      userId: req.user._id,
      bio,
      experience,
      certifications,
      services,
      pricing,
      availability
    });

    res.status(201).json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update trainer profile
// @route   PUT /api/trainers/:id
const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (trainer) {
      // Ensure only the owning user or an admin can update
      if (trainer.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this trainer profile' });
      }

      trainer.bio = req.body.bio !== undefined ? req.body.bio : trainer.bio;
      trainer.experience = req.body.experience !== undefined ? req.body.experience : trainer.experience;
      trainer.certifications = req.body.certifications !== undefined ? req.body.certifications : trainer.certifications;
      trainer.services = req.body.services !== undefined ? req.body.services : trainer.services;
      trainer.pricing = req.body.pricing !== undefined ? req.body.pricing : trainer.pricing;
      trainer.availability = req.body.availability !== undefined ? req.body.availability : trainer.availability;

      const updatedTrainer = await trainer.save();
      res.json(updatedTrainer);
    } else {
      res.status(404).json({ message: 'Trainer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete trainer profile
// @route   DELETE /api/trainers/:id
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (trainer) {
      if (trainer.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      await Trainer.deleteOne({ _id: trainer._id });
      res.json({ message: 'Trainer removed' });
    } else {
      res.status(404).json({ message: 'Trainer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer
};
