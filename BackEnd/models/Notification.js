const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['task-reminder', 'task-overdue', 'activity-update', 'emotion-alert', 'health-alert', 'booking-update', 'message', 'review', 'platform-update'],
    default: 'activity-update'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    required: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ sentAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
