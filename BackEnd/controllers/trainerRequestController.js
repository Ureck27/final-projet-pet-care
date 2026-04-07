const TrainerRequest = require('../models/TrainerRequest');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

// @desc    Submit a trainer request with images
// @route   POST /api/trainer-requests
const createTrainerRequest = async (req, res) => {
  try {
    const { experience, message, phone, certifications } = req.body;

    // Validate required fields
    if (!experience || !message || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: experience, message, and phone are required',
      });
    }

    // Check if user already has a pending or approved request
    const existingRequest = await TrainerRequest.findOne({
      userId: req.user._id,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existingRequest.status} trainer request`,
      });
    }

    // Process uploaded files
    let profileImageUrl = null;
    let certificateImageUrls = [];

    // Handle profile image
    if (req.files && req.files.profileImage && req.files.profileImage.length > 0) {
      profileImageUrl = req.files.profileImage[0].path;
    }

    // Handle certificate images
    if (req.files && req.files.certificateImage && req.files.certificateImage.length > 0) {
      certificateImageUrls = req.files.certificateImage.map((file) => file.path);
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
      certificateImages: certificateImageUrls,
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

    console.log('Trainer request created successfully:', {
      id: trainerRequest._id,
      userId: trainerRequest.userId,
      status: trainerRequest.status,
    });

    res.status(201).json({
      success: true,
      message: 'Trainer application submitted successfully',
      data: trainerRequest,
    });
  } catch (error) {
    console.error('Error creating trainer request:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit trainer application',
    });
  }
};

// @desc    Get current user's trainer request
// @route   GET /api/trainer-requests/my-request
const getUserTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!request) {
      return res.json({
        success: true,
        data: null,
        message: 'No trainer request found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error fetching user trainer request:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    const request = await TrainerRequest.findById(req.params.id).populate('userId', 'name email');

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

    // Update user role and status to trainer
    await User.findByIdAndUpdate(request.userId, {
      role: 'trainer',
      status: 'accepted',
    });

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
        status: 'accepted',
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

    // Update user status to reflect rejection
    await User.findByIdAndUpdate(request.userId, {
      status: 'rejected',
    });

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
      await deleteFile(request.profileImage);
    }

    if (request.certificateImages && request.certificateImages.length > 0) {
      for (const imageUrl of request.certificateImages) {
        await deleteFile(imageUrl);
      }
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
  getUserTrainerRequest,
  approveTrainerRequest,
  rejectTrainerRequest,
  deleteTrainerRequest,
};
