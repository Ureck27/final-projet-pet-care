const Booking = require('../models/Booking');

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('petId', 'name species breed')
      .populate('trainerId')
      .populate('ownerId', 'fullName email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('petId', 'name species breed')
      .populate('trainerId')
      .populate('ownerId', 'fullName email');
      
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { petId, trainerId, ownerId, service, date, time, notes, packageType } = req.body;
    
    const booking = await Booking.create({
      petId,
      trainerId,
      ownerId,
      service,
      date,
      time,
      notes,
      packageType,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
      booking.notes = req.body.notes || booking.notes;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      await Booking.deleteOne({ _id: booking._id });
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
