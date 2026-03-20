const Pet = require('../models/Pet');

// Create a new pet
const createPet = async (req, res) => {
  try {
    const { name, type, age, description, image } = req.body;

    if (!name || !type || age === undefined || !image) {
      return res.status(400).json({ message: 'Please provide name, type, age, and image' });
    }

    const pet = new Pet({
      name,
      type,
      age,
      description,
      image,
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

// Get all pets (admin only)
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    res.status(500).json({ message: 'Server error while fetching pets' });
  }
};

// Get pets by userId (admin only)
const getPetsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
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

module.exports = {
  createPet,
  getAllPets,
  getPetsByUserId,
  getUserPets,
  updatePetStatus
};
