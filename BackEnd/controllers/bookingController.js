const Booking = require('../models/Booking');

// @desc    Get all bookings (cursor-based pagination)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { cursor, limit = 10, ownerId } = req.query;
    const filter = { isDeleted: { $ne: true } };
    
    // If not admin, restrict to owner's or trainer's bookings
    if (req.user.role === 'user') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'trainer') {
      const Trainer = require('../models/Trainer');
      const trainer = await Trainer.findOne({ userId: req.user._id });
      if (trainer) {
        filter.trainerId = trainer._id;
      } else {
        return res.json({ success: true, data: [], pagination: { hasNextPage: false } });
      }
    } else if (req.user.role === 'admin' && ownerId) {
      filter.ownerId = ownerId;
    }

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    const bookings = await Booking.find(filter)
      .populate('petId', 'name type breed')
      .populate('trainerId')
      .populate('ownerId', 'fullName email')
      .sort({ _id: -1 })
      .limit(Number(limit) + 1);

    const hasNextPage = bookings.length > limit;
    const results = hasNextPage ? bookings.slice(0, -1) : bookings;
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('petId', 'name type breed')
      .populate('trainerId')
      .populate('ownerId', 'fullName email');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Security check: Only owner, assigned trainer, or admin can view booking
    const isOwner = booking.ownerId._id.toString() === req.user._id.toString();
    const isTrainer = booking.trainerId && booking.trainerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isTrainer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { petId, trainerId, service, date, time, notes, packageType } = req.body;
    const { createBookingService } = require('../services/bookingService');
    
    const booking = await createBookingService({
      petId,
      trainerId,
      ownerId: req.user._id,
      service,
      date,
      time,
      notes,
      packageType
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Security check: Only owner, assigned trainer, or admin can update booking
    const isOwner = booking.ownerId.toString() === req.user._id.toString();
    const isTrainer = booking.trainerId && booking.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isTrainer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = req.body.status ?? booking.status;
    booking.paymentStatus = req.body.paymentStatus ?? booking.paymentStatus;
    booking.notes = req.body.notes ?? booking.notes;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Security check: Only owner or admin can delete booking
    const isOwner = booking.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    booking.isDeleted = true;
    await booking.save();
    res.status(200).json({ success: true, data: null, message: 'Booking removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
