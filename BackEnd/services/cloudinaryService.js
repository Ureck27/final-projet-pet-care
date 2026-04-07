const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Handle direct upload to Cloudinary (for non-Multer usage if needed)
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<object>} Upload result
 */
const uploadToCloudinary = async (filePath, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `petcare/${folder}`,
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

/**
 * Delete a file from Cloudinary using its public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Create Multer storage for Cloudinary
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {CloudinaryStorage}
 */
const getCloudinaryStorage = (folder = 'general') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `petcare/${folder}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'pdf'],
      resource_type: 'auto',
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return `${file.fieldname}-${uniqueSuffix}`;
      },
    },
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryStorage,
};
