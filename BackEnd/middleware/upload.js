const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storageDirs = {
  users: 'uploads/users',
  pets: 'uploads/pets',
  trainers: 'uploads/trainers',
  timelineImages: 'uploads/timeline/images',
  timelineVideos: 'uploads/timeline/videos',
};

// Create all required directories on startup
Object.values(storageDirs).forEach(dir => createDir(path.join(process.cwd(), dir)));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destPath = 'uploads/'; // fallback
    
    // Determine destination based on endpoint or fieldname
    if (req.baseUrl.includes('/users')) {
      destPath = storageDirs.users;
    } else if (req.baseUrl.includes('/pets')) {
      destPath = storageDirs.pets;
    } else if (req.baseUrl.includes('/trainer-requests') || req.baseUrl.includes('/caregiver')) {
      destPath = storageDirs.trainers;
    } else if (req.baseUrl.includes('/timeline')) {
      // Differentiate timeline media by type
      if (file.mimetype.startsWith('image/')) {
        destPath = storageDirs.timelineImages;
      } else if (file.mimetype.startsWith('video/')) {
        destPath = storageDirs.timelineVideos;
      }
    }

    cb(null, path.join(process.cwd(), destPath));
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedVideoTypes = /mp4|mov|webm/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if timeline video upload
  if (req.baseUrl.includes('/timeline') && mimetype.startsWith('video/')) {
    if (allowedVideoTypes.test(extname) && allowedVideoTypes.test(mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Only mp4, mov, and webm video formats are allowed!'), false);
  }

  // All other generic image uploads
  if (allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Only jpeg, jpg, png, and webp image formats are allowed!'), false);
};

// Dynamic size limits depending on file type (multer supports global limits, but we can catch it later or set max here)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Set max 50MB globally, we validate images inside the controller
  }
});

// Helper middleware to strictly limit image sizes to 5MB, while permitting 50MB for videos
const handleSizeLimits = (req, res, next) => {
  if (req.file) {
    checkSingleFileSize(req.file, req, res, next);
  } else if (req.files) {
    // Check multiple files
    let hasError = false;
    
    // Handle array of files
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        if (fileError(file, req, res)) {
          hasError = true;
          break;
        }
      }
    } else {
      // Handle object of files (fields)
      for (const field in req.files) {
        for (const file of req.files[field]) {
          if (fileError(file, req, res)) {
            hasError = true;
            break;
          }
        }
        if (hasError) break;
      }
    }
    
    if (!hasError) next();
  } else {
    next();
  }
};

const checkSingleFileSize = (file, req, res, next) => {
  if (fileError(file, req, res)) return;
  next();
};

const fileError = (file, req, res) => {
  if (file.mimetype.startsWith('image/') && file.size > 5 * 1024 * 1024) {
    res.status(400).json({ message: 'Image size exceeds the 5MB limit.' });
    return true;
  }
  if (file.mimetype.startsWith('video/') && file.size > 50 * 1024 * 1024) {
    res.status(400).json({ message: 'Video size exceeds the 50MB limit.' });
    return true;
  }
  return false;
}


module.exports = {
  upload,
  handleSizeLimits
};
