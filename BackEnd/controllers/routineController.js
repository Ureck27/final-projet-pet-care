const Routine = require('../models/Routine');
const RoutineLog = require('../models/RoutineLog');
const Pet = require('../models/Pet');
const aiPetAnalyzer = require('../services/aiPetAnalyzer');
const notificationService = require('../services/notificationService');

// @desc    Upload photo only
// @route   POST /api/routine/upload
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      photoUrl: photoUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
};

// @desc    Complete a routine
// @route   POST /api/routine/complete
const completeRoutine = async (req, res) => {
  try {
    const { routineId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    if (!routineId) {
      return res.status(400).json({ message: 'Routine ID is required' });
    }

    // Find the routine
    const routine = await Routine.findById(routineId);
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Security check: Only assigned caregiver (trainer/caregiver) or admin can complete the routine
    if (
      (req.user.role === 'trainer' || req.user.role === 'caregiver') &&
      routine.trainerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          'You are not authorized to complete this routine. Only the assigned trainer can complete it.',
      });
    }

    // Upload photo and get URL
    const photoUrl = `/uploads/${req.file.filename}`;

    // Analyze photo with AI (non-blocking)
    let aiAnalysis = { success: false, status: 'unknown', message: 'AI analysis unavailable' };
    try {
      aiAnalysis = await aiPetAnalyzer.analyzePetImage(photoUrl);
    } catch (error) {
      console.warn('AI analysis failed, continuing with routine completion:', error.message);
    }

    // Create routine log
    const routineLog = new RoutineLog({
      routineId: routine._id,
      petId: routine.petId,
      trainerId: routine.trainerId,
      photoUrl: photoUrl,
      aiStatus: aiAnalysis.status,
      aiMessage: aiAnalysis.message,
    });

    await routineLog.save();

    // Mark routine as completed
    routine.status = 'completed';
    await routine.save();

    // Send notifications if AI detected urgent status
    let notificationResult = null;
    if (aiPetAnalyzer.requiresImmediateAttention(aiAnalysis.status)) {
      notificationResult = await notificationService.sendUrgentAlert(routineLog._id);
    }

    res.status(200).json({
      success: true,
      message: 'Routine completed successfully',
      data: {
        routine,
        routineLog,
        aiAnalysis,
        notifications: notificationResult,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing routine',
      error: error.message,
    });
  }
};

// @desc    Get routines for current user
// @route   GET /api/routine/my-routines
const getMyRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ trainerId: req.user._id })
      .populate('petId', 'name type breed age photo')
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      count: routines.length,
      data: routines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routines',
      error: error.message,
    });
  }
};

// @desc    Get logs for a specific pet
// @route   GET /api/routine/pet/:petId/logs
const getPetRoutineLogs = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const isOwner = pet.userId.toString() === req.user._id.toString();
    const isAssignedTrainer = pet.trainerId && pet.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignedTrainer && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this pet's routine logs",
      });
    }

    const logs = await RoutineLog.find({ petId })
      .populate('routineId', 'taskName description scheduledTime')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routine logs',
      error: error.message,
    });
  }
};

// @desc    Admin: Get all routines and logs
// @route   GET /api/routine/admin/all
const getAllRoutinesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, petId } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (petId) filter.petId = petId;

    const routines = await Routine.find(filter)
      .populate('petId', 'name type breed')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const logs = await RoutineLog.find({})
      .populate('petId', 'name type')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    res.status(200).json({
      success: true,
      routines: { count: routines.length, data: routines },
      logs: { count: logs.length, data: logs },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin data',
      error: error.message,
    });
  }
};

module.exports = {
  uploadPhoto,
  completeRoutine,
  getMyRoutines,
  getPetRoutineLogs,
  getAllRoutinesAdmin,
};
