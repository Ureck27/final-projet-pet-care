const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

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

module.exports = router;
