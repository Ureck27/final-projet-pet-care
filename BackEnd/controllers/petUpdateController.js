const PetUpdate = require('../models/PetUpdate');
const Pet = require('../models/Pet');
const Trainer = require('../models/Trainer');
const { getFileUrl } = require('../middleware/uploadMiddleware');

// @desc    Create a new pet update with media
// @route   POST /api/pet-updates
const createPetUpdate = async (req, res) => {
  try {
    const { petId, type, description, location, mood } = req.body;
    
    // Validate required fields
    if (!petId || !type || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: petId, type, and description are required' 
      });
    }

    // Verify trainer exists and is assigned to this pet
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false,
        message: 'Only approved trainers can post updates' 
      });
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Handle file upload
    let mediaUrl = null;
    if (req.file) {
      mediaUrl = getFileUrl(req.file.filename, 'pet-updates');
    }

    const petUpdate = await PetUpdate.create({
      petId,
      trainerId: trainer._id,
      type,
      content: mediaUrl || '',
      description,
      location,
      mood,
      mediaUrl
    });

    console.log('Pet update created successfully:', {
      id: petUpdate._id,
      petId,
      trainerId: trainer._id,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Pet update created successfully',
      data: petUpdate
    });
  } catch (error) {
    console.error('Error creating pet update:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create pet update' 
    });
  }
};

// @desc    Get all updates for a specific pet
// @route   GET /api/pet-updates/:petId
const getPetUpdates = async (req, res) => {
  try {
    const { petId } = req.params;
    
    const updates = await PetUpdate.find({ petId })
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 updates

    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    console.error('Error fetching pet updates:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all updates by a trainer
// @route   GET /api/pet-updates/trainer/:trainerId
const getTrainerUpdates = async (req, res) => {
  try {
    const { trainerId } = req.params;
    
    const updates = await PetUpdate.find({ trainerId })
      .populate('petId', 'name type')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    console.error('Error fetching trainer updates:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete a pet update
// @route   DELETE /api/pet-updates/:id
const deletePetUpdate = async (req, res) => {
  try {
    const update = await PetUpdate.findById(req.params.id);
    
    if (!update) {
      return res.status(404).json({ 
        success: false,
        message: 'Update not found' 
      });
    }

    // Check if user owns this update (trainer who created it)
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer || update.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this update' 
      });
    }

    // Delete associated media file
    if (update.mediaUrl) {
      const { deleteFile } = require('../middleware/uploadMiddleware');
      const filename = update.mediaUrl.split('/').pop();
      deleteFile(`uploads/pet-updates/${filename}`);
    }

    await PetUpdate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pet update deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pet update:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  createPetUpdate,
  getPetUpdates,
  getTrainerUpdates,
  deletePetUpdate
};
