const User = require('../models/User');

// @desc    Get all users (admin only - cursor-based pagination)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { cursor, limit = 20, role } = req.query;
    const filter = { isDeleted: { $ne: true } };
    
    if (role) {
      filter.role = role;
    }

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ _id: -1 })
      .limit(Number(limit) + 1);

    const hasNextPage = users.length > limit;
    const results = hasNextPage ? users.slice(0, -1) : users;
    const nextCursor = hasNextPage ? results[results.length - 1]._id : null;

    res.json({
      success: true,
      data: results,
      pagination: {
        nextCursor,
        hasNextPage,
        count: results.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, fullName, email, password, role, phone, avatar } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Require password for manual creation
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.create({
      name,
      fullName: fullName || name,
      email,
      password,
      role: role || 'user',
      phone,
      avatar
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.avatar = req.body.avatar || user.avatar;
      if (req.body.role) user.role = req.body.role;


      const updatedUser = await user.save();
    
    // Return user without password
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
    
    res.json(userResponse);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isDeleted = true;
      await user.save();
      res.status(200).json({ success: true, data: null, message: 'User removed' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
