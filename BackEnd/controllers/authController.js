const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendAdminNotification } = require('../services/emailService');

// Validation helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, number, and special character (@$!%*?&)' 
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating user with data:', { name, email, password: '***' });
    const user = await User.create({
      name,
      fullName: name,
      email,
      password, // Pre-save hook will hash this
      role: 'user' // Force role to 'user' for registration
    });
    console.log('User created successfully:', user);

    if (user) {
      // Send admin notification (commented out for now)
      // await sendAdminNotification(
      //   'New User Registration',
      //   `
      //   <p><strong>New user has registered:</strong></p>
      //   <ul>
      //     <li><strong>Name:</strong> ${user.name}</li>
      //     <li><strong>Email:</strong> ${user.email}</li>
      //     <li><strong>Role:</strong> ${user.role}</li>
      //     <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
      //   </ul>
      //   `
      // );

      res.status(201).json({
        _id: user._id,
        id: user._id.toString(),
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'pending') {
         return res.status(403).json({ message: 'Account is pending admin approval' });
      }
      if (user.status === 'suspended') {
         return res.status(403).json({ message: 'Account is suspended. Please contact support.' });
      }
      if (user.status === 'rejected') {
         return res.status(403).json({ message: 'Account application was rejected.' });
      }

      res.json({
        _id: user._id,
        id: user._id.toString(),
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();
    
    // Send reset email (in production, use actual email service)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log('Password reset link:', resetUrl); // For development
    
    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Find user and verify it's an admin
    const user = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check admin account status
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Admin account is suspended. Please contact system administrator.' });
    }

    res.json({
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
      redirect: '/admin-dashboard'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, adminLogin, forgotPassword, resetPassword };
