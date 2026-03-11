const Pet = require('../models/Pet');
const PetProfile = require('../models/PetProfile');
const { sendAdminNotification } = require('../services/emailService');

// @desc    Get all pets
// @route   GET /api/pets
const getPets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ownerId) {
      filter.ownerId = req.query.ownerId;
    }
    const pets = await Pet.find(filter).populate('ownerId', 'fullName email');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pet by ID with its profile
// @route   GET /api/pets/:id
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('ownerId', 'fullName email');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Security check: Only owner, admin, or assigned trainer can view pet
    const isOwner = pet.ownerId._id.toString() === req.user._id.toString();
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new pet
// @route   POST /api/pets
const createPet = async (req, res) => {
  try {
    const { ownerId, name, fullName, type, breed, age, gender, weight, color, medicalNotes, photo } = req.body;
    
    const pet = await Pet.create({
      ownerId,
      name,
      fullName,
      type,
      breed,
      age,
      gender,
      weight,
      color,
      medicalNotes,
      photo
    });

    // Send admin notification
    await sendAdminNotification(
      'New Pet Added',
      `
      <p><strong>A new pet has been added to the system:</strong></p>
      <ul>
        <li><strong>Pet Name:</strong> ${name}</li>
        <li><strong>Type:</strong> ${type}</li>
        <li><strong>Breed:</strong> ${breed || 'Not specified'}</li>
        <li><strong>Age:</strong> ${age || 'Not specified'}</li>
        <li><strong>Gender:</strong> ${gender || 'Not specified'}</li>
        <li><strong>Owner ID:</strong> ${ownerId}</li>
        <li><strong>Added Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      `
    );

    res.status(201).json(pet);
  } catch (error) {
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
    const isOwner = pet.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    pet.name = req.body.name ?? pet.name;
    pet.type = req.body.type ?? pet.type;
    pet.breed = req.body.breed ?? pet.breed;
    pet.age = req.body.age ?? pet.age;
    pet.gender = req.body.gender ?? pet.gender;
    pet.weight = req.body.weight ?? pet.weight;
    pet.color = req.body.color ?? pet.color;
    pet.medicalNotes = req.body.medicalNotes ?? pet.medicalNotes;
    pet.photo = req.body.photo ?? pet.photo;

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
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
    const isOwner = pet.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    // Also delete the pet profile
    await PetProfile.deleteOne({ petId: pet._id });
    await Pet.deleteOne({ _id: pet._id });
    res.json({ message: 'Pet and associated profile removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
