const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create upload directories
ensureDirectoryExists(path.join(__dirname, '../uploads'));
ensureDirectoryExists(path.join(__dirname, '../uploads/pets'));
ensureDirectoryExists(path.join(__dirname, '../uploads/trainers'));
ensureDirectoryExists(path.join(__dirname, '../uploads/certificates'));

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '../uploads/';
    
    // Determine upload path based on field name or file type
    if (file.fieldname === 'petImage' || req.path.includes('/pets')) {
      uploadPath = '../uploads/pets/';
    } else if (file.fieldname === 'certificateImage' || file.fieldname === 'certificates') {
      uploadPath = '../uploads/certificates/';
    } else if (file.fieldname === 'profileImage' || req.path.includes('/trainers')) {
      uploadPath = '../uploads/trainers/';
    } else {
      // Default to general uploads
      uploadPath = '../uploads/';
    }
    
    const fullPath = path.join(__dirname, uploadPath);
    ensureDirectoryExists(fullPath);
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3 // Maximum 3 files per request
  }
});

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 3) => {
  return upload.array(fieldName, maxCount);
};

// Mixed upload middleware for different field types
const uploadTrainerFiles = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'certificateImage', maxCount: 3 }
]);

const uploadPetFiles = upload.fields([
  { name: 'petImage', maxCount: 1 }
]);

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
    return res.status(400).json({ message: 'File upload error: ' + error.message });
  }
  
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
};

// Helper function to get file URL
const getFileUrl = (filename, type = 'general') => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  let path = '/uploads/';
  
  if (type === 'pet') {
    path = '/uploads/pets/';
  } else if (type === 'trainer') {
    path = '/uploads/trainers/';
  } else if (type === 'certificate') {
    path = '/uploads/certificates/';
  }
  
  return `${baseUrl}${path}${filename}`;
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadTrainerFiles,
  uploadPetFiles,
  handleUploadError,
  getFileUrl,
  deleteFile,
  ensureDirectoryExists
};
