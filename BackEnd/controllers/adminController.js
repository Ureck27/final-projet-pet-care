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

// @desc    Get pending pets
// @route   GET /api/admin/pets
const getPendingPets = async (req, res) => {
  try {
    const pets = await Pet.find({ status: 'pending' }).populate('userId', 'name email');
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
    const trainers = await Trainer.find({});
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


// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'trainer', 'worker', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'active', 'suspended', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = status;
    await user.save();
    
    // If the user's role is trainer and status is suspended/rejected, we should probably update their Trainer object status too.
    if (user.role === 'trainer') {
      const trainer = await Trainer.findOne({ userId: user._id });
      if (trainer) {
        trainer.status = status === 'active' ? 'accepted' : status;
        await trainer.save();
      }
    }
    
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve pet
// @route   PATCH /api/admin/pets/:id/approve
const approvePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject pet
// @route   PATCH /api/admin/pets/:id/reject
const rejectPet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete associated pets and trainer objects
    await Pet.deleteMany({ userId: req.params.id });
    await Trainer.deleteOne({ userId: req.params.id });
    await TrainerRequest.deleteMany({ userId: req.params.id });
    
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getPendingPets,
  getTrainerRequests,
  getAllTrainers,
  getDashboardStats,
  updateUserRole,
  updateUserStatus,
  approvePet,
  rejectPet,
  deleteUser
};

