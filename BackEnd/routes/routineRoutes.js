const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Routine = require('../models/Routine');
const RoutineLog = require('../models/RoutineLog');
const aiPetAnalyzer = require('../services/aiPetAnalyzer');
const notificationService = require('../services/notificationService');

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

// POST /api/routine/upload
router.post('/upload', upload.single('photo'), (req, res) => {
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

// POST /api/routine/complete
router.post('/complete', upload.single('photo'), async (req, res) => {
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

module.exports = router;
