const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Validation helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character (@$!%*?&)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  };

  res.status(statusCode).cookie('token', token, options).json({
    _id: user._id,
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    // Keep sending token in JSON for backward compatibility until frontend switch is fully live, or remove after frontend switch.
    // We'll remove it entirely to enforce security
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
        message:
          'Password must be at least 8 characters long and contain: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
      });
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating user with data:', { name, email: normalizedEmail, password: '***' });
    const user = await User.create({
      name,
      email: normalizedEmail,
      password, // Pre-save hook will hash this
      role: 'user', // Force role to 'user' for registration
    });
    console.log('User created successfully:', user);

    if (user) {
      sendTokenResponse(user, 201, res);
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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password', type: 'validation' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Login attempt for email:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log('Login failed: User not found in DB');
      return res
        .status(401)
        .json({ message: 'User not found. Please check your email.', type: 'auth' });
    }

    console.log('User found in DB:', user._id);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid password. Please try again.', type: 'auth' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
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
      resetPasswordExpiry: { $gt: Date.now() },
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
      return res.status(400).json({
        message: 'Please provide email and password',
        type: 'validation',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        type: 'validation',
      });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Admin login attempt for email:', normalizedEmail);

    // Find user and verify it's an admin
    const user = await User.findOne({ email: normalizedEmail, role: 'admin' }).select('+password');

    if (!user) {
      console.log('Admin login failed: Admin user not found in DB');
      return res.status(401).json({
        message: 'Admin user not found',
        type: 'auth',
      });
    }

    console.log('Admin user found in DB:', user._id);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Admin login failed: Invalid admin password');
      return res.status(401).json({
        message: 'Invalid admin password',
        type: 'auth',
      });
    }

    const token = generateToken(user._id, user.role);

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    };

    res.status(200).cookie('token', token, options).json({
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      redirect: '/admin-dashboard',
    });
  } catch (error) {
    console.error('Admin login error:', error);

    // Handle rate limiting errors specifically
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Too many admin login attempts. Please try again later.',
        type: 'rate_limit',
        retryAfter: '15 minutes',
      });
    }

    res.status(500).json({
      error: 'Internal server error during admin login',
      type: 'server',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
};
