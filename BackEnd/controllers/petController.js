const Pet = require('../models/Pet');

// @desc    Create new pet
// @route   POST /api/pets
const createPet = async (req, res) => {
  try {
    const { name, type, age, description, image } = req.body;
    
    // Validation
    if (!name || !type || !age || !image) {
      return res.status(400).json({ message: 'Please provide name, type, age, and image' });
    }

    // Set userId from authenticated user
    const petData = {
      name,
      type,
      age,
      description,
      image,
      userId: req.user._id
    };

    const pet = await Pet.create(petData);
    
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pets (admin only)
// @route   GET /api/pets
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user pets
// @route   GET /api/pets/user
const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (error) {
    console.error('Error fetching user pets:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pet status (admin only)
// @route   PATCH /api/pets/:id
const updatePetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validation
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
    }

    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.status = status;
    await pet.save();
    
    res.json(pet);
  } catch (error) {
    console.error('Error updating pet status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getUserPets,
  updatePetStatus
};
