const cron = require('node-cron');
const Booking = require('../models/Booking');
const { emailQueue } = require('../config/queue');

// Run every hour at minute 0
const startReminderCron = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Checking for upcoming bookings...');
    try {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours from now

      // We look for bookings starting within the next 24 hours (and we add a buffer of 1 hour to catch them early)
      const upcomingBookings = await Booking.find({
        date: { $gte: startOfDay(now), $lte: endOfDay(in24Hours) }, // basic date filter first
        status: 'confirmed',
        reminderSent: false,
        isDeleted: { $ne: true },
      }).populate('ownerId');

      for (const booking of upcomingBookings) {
        // Precise time logic: booking.time is "HH:mm"
        const [hours, minutes] = booking.time.split(':').map(Number);

        const bookingDateTime = new Date(booking.date);
        bookingDateTime.setHours(hours, minutes, 0, 0);

        // If booking is within the next 24 hours but greater than now
        if (bookingDateTime > now && bookingDateTime <= in24Hours) {
          await emailQueue.add('send-reminder', {
            to: booking.ownerId.email,
            subject: 'Upcoming PetCare Booking Reminder',
            body: `Hello, this is a reminder for your upcoming booking on ${booking.date.toDateString()} at ${booking.time}.`,
          });

          // Mark as sent
          booking.reminderSent = true;
          await booking.save();
          console.log(`[Cron] Scheduled reminder for booking ${booking._id}`);
        }
      }
    } catch (error) {
      console.error('[Cron] Error running automated reminders:', error);
    }
  });

  console.log('[Cron] Automated reminders cron job started.');
};

// Utilities for start and end of days
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

module.exports = {
  startReminderCron,
};
