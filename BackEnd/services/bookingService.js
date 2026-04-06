const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');

const createBookingService = async (bookingData) => {
  const { petId, trainerId, ownerId, service, date, time, notes, packageType } = bookingData;

  // Convert incoming "HH:MM" to minutes for easier comparison
  const [startHour, startMin] = time.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  
  // Assuming a default 1-hour duration for all bookings
  const endMinutes = startMinutes + 60; 

  // Get all bookings for the same trainer on the same date that are not cancelled
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const existingBookings = await Booking.find({
    trainerId,
    date: { $gte: startOfDay, $lt: endOfDay },
    status: { $ne: 'cancelled' }
  });

  // Check for time overlap
  for (const b of existingBookings) {
    const [bStartHour, bStartMin] = b.time.split(':').map(Number);
    const bStartMinutes = bStartHour * 60 + bStartMin;
    const bEndMinutes = bStartMinutes + 60; // 1-hour default

    // overlap condition: start < existingEnd AND end > existingStart
    if (startMinutes < bEndMinutes && endMinutes > bStartMinutes) {
      throw new ApiError(409, 'Conflict: The caregiver is already booked for this time slot.');
    }
  }

  // Create booking
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

  return booking;
};

module.exports = {
  createBookingService
};
