const TrainerRequest = require('../models/TrainerRequest');
const sendEmail = require('../config/emailService');

// @desc    Submit a trainer request
// @route   POST /api/trainer-requests
const createTrainerRequest = async (req, res) => {
  try {
    const { experience, message } = req.body;

    const trainerRequest = await TrainerRequest.create({
      name: req.user.name,
      email: req.user.email,
      experience,
      message
    });

    // Send email to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'New Trainer Request',
        message: `New trainer request submitted by ${req.user.name} (${req.user.email}).\nExperience: ${experience}\nMessage: ${message}`
      });
    } catch (emailError) {
      console.error('Email could not be sent', emailError);
    }

    res.status(201).json(trainerRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createTrainerRequest };
