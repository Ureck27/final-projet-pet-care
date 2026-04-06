const Pet = require('../models/Pet');
const { getFileUrl } = require('../middleware/uploadMiddleware');

const createPet = async (req, res) => {
  try {
    const { name, type, age, description } = req.body;
    let image = req.body.image;

    if (req.file) {
      image = getFileUrl(req.file.filename, 'pet');
    }

    if (!name || !type || age === undefined) {
      return res.status(400).json({ message: 'Please provide name, type, and age' });
    }

    const pet = new Pet({
      name,
      type,
      age,
      description,
      image: image || '/placeholder.svg',
      userId: req.user._id,
      status: 'pending'
    });

    const savedPet = await pet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ message: 'Server error while creating pet' });
  }
};

// Get all pets (admin only, or filtered for user)
const getAllPets = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id;
    }
    const pets = await Pet.find(filter).populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    res.status(500).json({ message: 'Server error while fetching pets' });
  }
};

// Get pets by userId (admin and users for their own)
const getPetsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId || req.query.ownerId;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId or ownerId is required' });
    }

    // Security check: Standard users can only fetch their own pets
    if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to fetch pets for this userId' });
    }

    const pets = await Pet.find({ userId }).populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets by userId:', error);
    res.status(500).json({ message: 'Server error while fetching pets' });
  }
};

// Get current user's pets
const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user._id });
    res.json(pets);
  } catch (error) {
    console.error('Error fetching user pets:', error);
    res.status(500).json({ message: 'Server error while fetching pets' });
  }
};

// Get pets assigned to trainer
const getTrainerPets = async (req, res) => {
  try {
    const Trainer = require('../models/Trainer');
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' });
    }
    const pets = await Pet.find({ trainerId: trainer._id }).populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching trainer pets:', error);
    res.status(500).json({ message: 'Server error while fetching trainer pets' });
  }
};

// Update pet status (admin only)
const updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
    }

    const pet = await Pet.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error updating pet status:', error);
    res.status(500).json({ message: 'Server error while updating pet status' });
  }
};

// Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate('userId', 'name email');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Security check: Only owner, trainer, or admin can fetch this pet
    if (req.user.role !== 'admin' && req.user.role !== 'trainer' && pet.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this pet' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet by ID:', error);
    res.status(500).json({ message: 'Server error while fetching pet details' });
  }
};

// Update pet details
const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, age, description } = req.body;

    const pet = await Pet.findOne({ _id: id, userId: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found or unauthorized' });

    if (name) pet.name = name;
    if (type) pet.type = type;
    if (age !== undefined) pet.age = age;
    if (description !== undefined) pet.description = description;

    if (req.file) {
      pet.image = getFileUrl(req.file.filename, 'pet');
    } else if (req.body.image) {
      pet.image = req.body.image;
    }

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Server error while updating pet' });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getPetsByUserId,
  getUserPets,
  getTrainerPets,
  getPetById,
  updatePetStatus,
  updatePet
};
