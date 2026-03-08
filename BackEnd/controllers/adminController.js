const User = require('../models/User');
const Pet = require('../models/Pet');
const TrainerRequest = require('../models/TrainerRequest');
const sendEmail = require('../config/emailService');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pets
// @route   GET /api/admin/pets
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({}).populate('ownerId', 'name email');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all trainer requests
// @route   GET /api/admin/trainer-requests
const getTrainerRequests = async (req, res) => {
  try {
    const requests = await TrainerRequest.find({});
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept trainer request
// @route   PUT /api/admin/trainer-requests/:id/accept
const acceptTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);

    if (request) {
      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is already processed' });
      }

      request.status = 'accepted';
      await request.save();

      // Update user role
      const user = await User.findOne({ email: request.email });
      if (user) {
        user.role = 'trainer';
        await user.save();
      }

      // Send email
      try {
        await sendEmail({
          email: request.email,
          subject: 'Trainer Request Accepted',
          message: `Congratulations ${request.name}! Your request to become a trainer has been accepted.`
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      res.json({ message: 'Trainer request accepted', request });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject trainer request
// @route   PUT /api/admin/trainer-requests/:id/reject
const rejectTrainerRequest = async (req, res) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);

    if (request) {
      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is already processed' });
      }

      request.status = 'rejected';
      await request.save();

      // Send email
      try {
        await sendEmail({
          email: request.email,
          subject: 'Trainer Request Rejected',
          message: `Hello ${request.name}. Unfortunately, your request to become a trainer has been rejected at this time.`
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      res.json({ message: 'Trainer request rejected', request });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllPets,
  getTrainerRequests,
  acceptTrainerRequest,
  rejectTrainerRequest
};
