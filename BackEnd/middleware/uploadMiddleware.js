const multer = require('multer');
const { getCloudinaryStorage } = require('../services/cloudinaryService');

/**
 * Determine upload folder on Cloudinary based on field name or path
 * @param {express.Request} req 
 * @param {express.Multer.File} file 
 * @returns {string} Folder name
 */
const getFolder = (req, file) => {
  if (file.fieldname === 'petImage' || req.path.includes('/pets')) {
    return 'pets';
  } else if (file.fieldname === 'petVideo' || req.path.includes('/videos')) {
    return 'videos';
  } else if (file.fieldname === 'certificateImage' || file.fieldname === 'certificates') {
    return 'certificates';
  } else if (file.fieldname === 'profileImage' || req.path.includes('/trainers')) {
    return 'trainers';
  } else if (req.path.includes('/pet-updates')) {
    return 'pet-updates';
  }
  return 'general';
};

// Multer configuration using Cloudinary
const upload = multer({
  storage: getCloudinaryStorage('general'), // Default, but overridden by field specific middleware if needed
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image, video, and PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 5
  }
});

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const folder = fieldName === 'image' ? 'general' : fieldName;
    const storage = getCloudinaryStorage(folder);
    const uploader = multer({ storage }).single(fieldName);
    uploader(req, res, next);
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 3) => {
  return (req, res, next) => {
    const storage = getCloudinaryStorage(fieldName);
    const uploader = multer({ storage }).array(fieldName, maxCount);
    uploader(req, res, next);
  };
};

// Mixed upload middleware for different field types
const uploadTrainerFiles = (req, res, next) => {
  const storage = getCloudinaryStorage('trainers');
  const uploader = multer({ storage }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 3 }
  ]);
  uploader(req, res, next);
};

const uploadPetFiles = (req, res, next) => {
  const storage = getCloudinaryStorage('pets');
  const uploader = multer({ storage }).fields([
    { name: 'petImage', maxCount: 1 },
    { name: 'petVideo', maxCount: 1 }
  ]);
  uploader(req, res, next);
};

const uploadPetMedia = (req, res, next) => {
  const storage = getCloudinaryStorage('pet-updates');
  const uploader = multer({ storage }).single('media');
  uploader(req, res, next);
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 20MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field: ' + error.field });
    }
    return res.status(400).json({ message: 'File upload error: ' + error.message });
  }
  
  if (error.message.includes('Only image, video, and PDF files are allowed')) {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
};

/**
 * Helper function to delete file from Cloudinary
 * @param {string} secureUrl - Secure URL of the file
 * @returns {Promise<boolean>}
 */
const deleteFile = async (secureUrl) => {
  try {
    if (!secureUrl || !secureUrl.includes('cloudinary.com')) return false;
    
    // Extract public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/petcare/folder/public_id.jpg
    const parts = secureUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return false;

    const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExt.split('.')[0];
    
    const { deleteFromCloudinary } = require('../services/cloudinaryService');
    await deleteFromCloudinary(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadTrainerFiles,
  uploadPetFiles,
  uploadPetMedia,
  handleUploadError,
  deleteFile
};
