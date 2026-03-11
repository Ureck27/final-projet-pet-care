const TrainerRequest = require('../models/TrainerRequest');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const { sendAdminNotification } = require('../services/emailService');

// @desc    Submit a trainer request
// @route   POST /api/trainer-requests
const createTrainerRequest = async (req, res) => {
  try {
    const { experience, message } = req.body;

    const trainerRequest = await TrainerRequest.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      experience,
      message
    });

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'New Trainer Request',
    //   `
    //   <p><strong>New trainer application submitted:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${req.user.name}</li>
    //     <li><strong>Email:</strong> ${req.user.email}</li>
    //     <li><strong>Experience:</strong> ${experience}</li>
    //     <li><strong>Message:</strong> ${message}</li>
    //     <li><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   <p>Please review this application in the admin dashboard.</p>
    //   `
    // );

    res.status(201).json(trainerRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all trainer requests (admin only)
// @route   GET /api/trainer-requests
const getTrainerRequests = async (req, res) => {
  try {
    const requests = await TrainerRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
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

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'Trainer Request Approved',
    //   `
    //   <p><strong>Trainer request has been approved:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${request.name}</li>
    //     <li><strong>Email:</strong> ${request.email}</li>
    //     <li><strong>Experience:</strong> ${request.experience}</li>
    //     <li><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   `
    // );

    res.json({ message: 'Trainer request approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject trainer request
// @route   PUT /api/trainer-requests/:id/reject
const rejectTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    // Send admin notification (commented out due to email config)
    // await sendAdminNotification(
    //   'Trainer Request Rejected',
    //   `
    //   <p><strong>Trainer request has been rejected:</strong></p>
    //   <ul>
    //     <li><strong>Name:</strong> ${request.name}</li>
    //     <li><strong>Email:</strong> ${request.email}</li>
    //     <li><strong>Experience:</strong> ${request.experience}</li>
    //     <li><strong>Rejection Date:</strong> ${new Date().toLocaleDateString()}</li>
    //   </ul>
    //   `
    // );

    res.json({ message: 'Trainer request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createTrainerRequest, 
  getTrainerRequests, 
  approveTrainerRequest, 
  rejectTrainerRequest 
};
