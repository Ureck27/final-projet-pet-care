const User = require('../models/User');
const Pet = require('../models/Pet');
const Trainer = require('../models/Trainer');
const TrainerRequest = require('../models/TrainerRequest');
const { sendAdminNotification } = require('../services/emailService');

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

// @desc    Get all trainers
// @route   GET /api/admin/trainers
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).populate('userId', 'name email');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const petCount = await Pet.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const pendingRequestsCount = await TrainerRequest.countDocuments({ status: 'pending' });

    const stats = {
      totalUsers: userCount,
      totalPets: petCount,
      totalTrainers: trainerCount,
      pendingTrainerRequests: pendingRequestsCount
    };

    res.json(stats);
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
      const user = await User.findById(request.userId);
      if (user) {
        user.role = 'trainer';
        await user.save();
      }

      // Send admin notification
      await sendAdminNotification(
        'Trainer Request Accepted',
        `
        <p><strong>Trainer request has been accepted:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${request.name}</li>
          <li><strong>Email:</strong> ${request.email}</li>
          <li><strong>Experience:</strong> ${request.experience}</li>
          <li><strong>Acceptance Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        `
      );

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

      // Send admin notification
      await sendAdminNotification(
        'Trainer Request Rejected',
        `
        <p><strong>Trainer request has been rejected:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${request.name}</li>
          <li><strong>Email:</strong> ${request.email}</li>
          <li><strong>Experience:</strong> ${request.experience}</li>
          <li><strong>Rejection Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        `
      );

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
  getAllTrainers,
  getDashboardStats,
  acceptTrainerRequest,
  rejectTrainerRequest
};
