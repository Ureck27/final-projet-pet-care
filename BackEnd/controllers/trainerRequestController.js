const TrainerRequest = require('../models/TrainerRequest');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const { getFileUrl } = require('../middleware/uploadMiddleware');
const { sendAdminNotification } = require('../services/emailService');

// @desc    Submit a trainer request with images
// @route   POST /api/trainer-requests
const createTrainerRequest = async (req, res) => {
  try {
    const { experience, message, phone, certifications } = req.body;
    
    // Process uploaded files
    let profileImageUrl = null;
    let certificateImageUrls = [];
    
    // Handle profile image
    if (req.files && req.files.profileImage && req.files.profileImage.length > 0) {
      profileImageUrl = getFileUrl(req.files.profileImage[0].filename, 'trainer');
    }
    
    // Handle certificate images
    if (req.files && req.files.certificateImage && req.files.certificateImage.length > 0) {
      certificateImageUrls = req.files.certificateImage.map(file => 
        getFileUrl(file.filename, 'certificate')
      );
    }

    const trainerRequest = await TrainerRequest.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone,
      experience,
      certifications,
      message,
      profileImage: profileImageUrl,
      certificateImages: certificateImageUrls
    });

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'New Trainer Request',
    //   `
    //   <p><strong>New trainer application submitted:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${req.user.name}</li>
    //     <li><strong>Email:</strong> ${req.user.email}</li>
    //     <li><strong>Phone:</strong> ${phone}</li>
    //     <li><strong>Experience:</strong> ${experience}</li>
    //     <li><strong>Certifications:</strong> ${certifications}</li>
    //     <li><strong>Message:</strong> ${message}</li>
    //     <li><strong>Profile Image:</strong> ${profileImageUrl ? 'Uploaded' : 'Not uploaded'}</li>
    //     <li><strong>Certificates:</strong> ${certificateImageUrls.length} uploaded</li>
    //     <li><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   <p>Please review this application in the admin dashboard.</p>
    //   `
    // );

    res.status(201).json(trainerRequest);
  } catch (error) {
    console.error('Error creating trainer request:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all trainer requests (admin only)
// @route   GET /api/trainer-requests
const getTrainerRequests = async (req, res) => {
  try {
    const requests = await TrainerRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching trainer requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer request by ID (admin only)
// @route   GET /api/trainer-requests/:id
const getTrainerRequestById = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching trainer request:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve trainer request
// @route   PUT /api/trainer-requests/:id/approve
const approveTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Update user role to trainer
    await User.findByIdAndUpdate(request.userId, { role: 'trainer' });

    // Create trainer profile if it doesn't exist
    const existingTrainer = await Trainer.findOne({ userId: request.userId });
    if (!existingTrainer) {
      await Trainer.create({
        userId: request.userId,
        name: request.name,
        email: request.email,
        phone: request.phone,
        experience: request.experience,
        certifications: request.certifications,
        bio: request.message,
        profileImage: request.profileImage,
        certificateImages: request.certificateImages,
        services: ['Basic Training', 'Behavioral Training'], // Default services
        pricing: 50, // Default pricing
        availability: ['Weekdays', 'Weekends'], // Default availability
        status: 'accepted'
      });
    } else {
      // Update existing trainer if needed
      existingTrainer.status = 'accepted';
      existingTrainer.phone = request.phone;
      existingTrainer.profileImage = request.profileImage;
      existingTrainer.certificateImages = request.certificateImages;
      await existingTrainer.save();
    }

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'Trainer Request Approved',
    //   `
    //   <p><strong>Trainer request has been approved:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${request.name}</li>
    //     <li><strong>Email:</strong> ${request.email}</li>
    //     <li><strong>Phone:</strong> ${request.phone}</li>
    //     <li><strong>Experience:</strong> ${request.experience}</li>
    //     <li><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   `
    // );

    res.json({ message: 'Trainer request approved successfully', request });
  } catch (error) {
    console.error('Error approving trainer request:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject trainer request
// @route   PUT /api/trainer-requests/:id/reject
const rejectTrainerRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const request = await TrainerRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'rejected';
    request.rejectionReason = rejectionReason || 'Application does not meet requirements';
    await request.save();

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'Trainer Request Rejected',
    //   `
    //   <p><strong>Trainer request has been rejected:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${request.name}</li>
    //     <li><strong>Email:</strong> ${request.email}</li>
    //     <li><strong>Phone:</strong> ${request.phone}</li>
    //     <li><strong>Experience:</strong> ${request.experience}</li>
    //     <li><strong>Rejection Reason:</strong> ${request.rejectionReason}</li>
    //     <li><strong>Rejection Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   `
    // );

    res.json({ message: 'Trainer request rejected successfully', request });
  } catch (error) {
    console.error('Error rejecting trainer request:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete trainer request (admin only)
// @route   DELETE /api/trainer-requests/:id
const deleteTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Delete associated images from file system
    const { deleteFile } = require('../middleware/uploadMiddleware');
    
    if (request.profileImage) {
      const filename = request.profileImage.split('/').pop();
      deleteFile(`uploads/trainers/${filename}`);
    }
    
    if (request.certificateImages && request.certificateImages.length > 0) {
      request.certificateImages.forEach(imageUrl => {
        const filename = imageUrl.split('/').pop();
        deleteFile(`uploads/certificates/${filename}`);
      });
    }

    await TrainerRequest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Trainer request deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer request:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createTrainerRequest, 
  getTrainerRequests, 
  getTrainerRequestById,
  approveTrainerRequest, 
  rejectTrainerRequest,
  deleteTrainerRequest
};
