const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// GET /api/bookings - Get bookings (filtered by role in controller)
router.get('/', protect, authorizeRole('owner', 'trainer', 'caregiver', 'admin'), getBookings);

// POST /api/bookings - Create a booking (owner or admin)
router.post('/', protect, authorizeRole('owner', 'admin'), createBooking);

router
  .route('/:id')
  // GET /api/bookings/:id - Get specific booking
  .get(protect, authorizeRole('owner', 'trainer', 'caregiver', 'admin'), getBookingById)
  // PUT /api/bookings/:id - Update booking (owner or admin)
  .put(protect, authorizeRole('owner', 'admin'), updateBooking)
  // DELETE /api/bookings/:id - Delete booking (admin only for security)
  .delete(protect, authorizeRole('admin'), deleteBooking);

module.exports = router;
