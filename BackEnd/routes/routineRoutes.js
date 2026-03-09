const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Routine = require('../models/Routine');
const RoutineLog = require('../models/RoutineLog');
const aiPetAnalyzer = require('../services/aiPetAnalyzer');
const notificationService = require('../services/notificationService');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /api/routine/upload - Only trainers can upload photos
router.post('/upload', protect, authorizeRole('trainer', 'admin'), upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      photoUrl: photoUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error uploading image', 
      error: error.message 
    });
  }
});

// POST /api/routine/complete - Only trainers can complete routines
router.post('/complete', protect, authorizeRole('trainer', 'admin'), upload.single('photo'), async (req, res) => {
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

    // Security check: Only assigned trainer or admin can complete the routine
    if (req.user.role === 'trainer' && routine.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You are not authorized to complete this routine. Only the assigned trainer can complete it.' 
      });
    }

    // Upload photo and get URL
    const photoUrl = `/uploads/${req.file.filename}`;

    // Analyze photo with AI
    const aiAnalysis = await aiPetAnalyzer.analyzePetImage(photoUrl);
    
    if (!aiAnalysis.success) {
      return res.status(500).json({ 
        message: 'AI analysis failed', 
        error: aiAnalysis.error 
      });
    }

    // Create routine log
    const routineLog = new RoutineLog({
      routineId: routine._id,
      petId: routine.petId,
      trainerId: routine.trainerId,
      photoUrl: photoUrl,
      aiStatus: aiAnalysis.status,
      aiMessage: aiAnalysis.message
    });

    await routineLog.save();

    // Mark routine as completed
    routine.status = 'completed';
    await routine.save();

    // Send notifications if AI detected urgent status
    let notificationResult = null;
    if (aiPetAnalyzer.requiresImmediateAttention(aiAnalysis.status)) {
      notificationResult = await notificationService.sendUrgentAlert(routineLog._id);
      console.log('Notification result:', notificationResult);
    }

    res.status(200).json({
      success: true,
      message: 'Routine completed successfully',
      data: {
        routine: routine,
        routineLog: routineLog,
        aiAnalysis: aiAnalysis,
        notifications: notificationResult
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error completing routine', 
      error: error.message 
    });
  }
});

// GET /api/routine/my-routines - Get routines for current trainer
router.get('/my-routines', protect, authorizeRole('trainer'), async (req, res) => {
  try {
    const routines = await Routine.find({ trainerId: req.user._id })
      .populate('petId', 'name type breed age photo')
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      count: routines.length,
      data: routines
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching routines', 
      error: error.message 
    });
  }
});

// GET /api/routine/pet/:petId/logs - Get routine logs for a specific pet
router.get('/pet/:petId/logs', protect, async (req, res) => {
  try {
    const { petId } = req.params;
    
    // Find pet to check ownership
    const petModel = require('../models/Pet');
    const pet = await petModel.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Security check: Only owner, assigned trainer, or admin can view logs
    const isOwner = pet.ownerId.toString() === req.user._id.toString();
    const isAssignedTrainer = pet.trainerId && pet.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignedTrainer && !isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to view this pet\'s routine logs' 
      });
    }

    // Get routine logs
    const logs = await RoutineLog.find({ petId })
      .populate('routineId', 'taskName description scheduledTime')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching routine logs', 
      error: error.message 
    });
  }
});

// GET /api/routine/admin/all - Admin only: Get all routines and logs
router.get('/admin/all', protect, authorizeRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, petId } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (petId) filter.petId = petId;

    // Get routines with pagination
    const routines = await Routine.find(filter)
      .populate('petId', 'name type breed')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get routine logs
    const logs = await RoutineLog.find({})
      .populate('petId', 'name type')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      routines: {
        count: routines.length,
        data: routines
      },
      logs: {
        count: logs.length,
        data: logs
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching admin data', 
      error: error.message 
    });
  }
});

module.exports = router;
