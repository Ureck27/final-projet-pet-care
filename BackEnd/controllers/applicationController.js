const Application = require('../models/Application');

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const { name, email, role, message } = req.body;
    const userId = req.user ? req.user._id : undefined;

    const application = new Application({
      userId,
      name,
      email,
      role,
      message,
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitApplication,
};
