const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  packageType: { type: String },
  customInstructions: String,
  meetAndGreetScheduled: Date,
  meetAndGreetCompleted: Boolean,
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Soft delete query middleware
bookingSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
