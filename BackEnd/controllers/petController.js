const Pet = require('../models/Pet');
const PetProfile = require('../models/PetProfile');
const { getFileUrl, deleteFile } = require('../middleware/uploadMiddleware');
const { sendAdminNotification } = require('../services/emailService');

// @desc    Get all pets
// @route   GET /api/pets
const getPets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const pets = await Pet.find(filter).populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pet by ID with its profile
// @route   GET /api/pets/:id
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('userId', 'name email');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Security check: Only owner, admin, or assigned trainer can view pet
    const isOwner = pet.userId._id.toString() === req.user._id.toString();
    const isAssignedTrainer = pet.trainerId && pet.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAssignedTrainer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this pet' });
    }
    
    // Also fetch the pet profile if it exists
    const petProfile = await PetProfile.findOne({ petId: pet._id });
    
    res.json({
      pet,
      profile: petProfile || null
    });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new pet with image upload
// @route   POST /api/pets
const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, description, weight, color, medicalNotes } = req.body;
    
    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/pets/${req.file.filename}`;
    }

    const pet = await Pet.create({
      userId: req.user._id,
      name,
      type,
      breed,
      age,
      description,
      image: imageUrl,
      weight,
      color,
      medicalNotes,
      photo: imageUrl // Keep for backward compatibility
    });

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'New Pet Added',
    //   `
    //   <p><strong>A new pet has been added to the system:</strong></p>
    //   <ul>
    //     <li><strong>Pet Name:</strong> ${name}</li>
    //     <li><strong>Type:</strong> ${type}</li>
    //     <li><strong>Breed:</strong> ${breed || 'N/A'}</li>
    //     <li><strong>Age:</strong> ${age || 'N/A'}</li>
    //     <li><strong>Owner:</strong> ${req.user.name}</li>
    //     <li><strong>Added Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   `
    // );

    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Security check: Only owner or admin can update pet
    const isOwner = pet.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    const { name, type, breed, age, description, weight, color, medicalNotes } = req.body;

    // Handle image update
    let imageUrl = pet.image || pet.photo;
    if (req.file) {
      // (Optional cleanup old file here if required, though skipped for simplicity)
      imageUrl = `/uploads/pets/${req.file.filename}`;
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        breed,
        age,
        description,
        image: imageUrl,
        photo: imageUrl, // Keep for backward compatibility
        weight,
        color,
        medicalNotes
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    res.json(updatedPet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Security check: Only owner or admin can delete pet
    const isOwner = pet.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    // Delete pet image if exists
    if (pet.image || pet.photo) {
      const imageUrl = pet.image || pet.photo;
      const filename = imageUrl.split('/').pop();
      deleteFile(`uploads/pets/${filename}`);
    }

    // Delete pet profile if exists
    await PetProfile.deleteOne({ petId: pet._id });

    await Pet.findByIdAndDelete(req.params.id);

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pets by user ID
// @route   GET /api/pets/user/:userId
const getPetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Security check: Only the user themselves or admin can view their pets
    const isOwner = userId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these pets' });
    }

    const pets = await Pet.find({ userId }).populate('userId', 'name email');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets by user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetsByUserId
};
