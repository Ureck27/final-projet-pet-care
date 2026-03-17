const mongoose = require('mongoose');

const projectMessageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  senderAvatar: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  starred: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['update', 'reminder', 'info', 'alert'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
projectMessageSchema.index({ projectId: 1, createdAt: -1 });
projectMessageSchema.index({ senderId: 1 });
projectMessageSchema.index({ starred: 1 });
projectMessageSchema.index({ read: 1 });

module.exports = mongoose.model('ProjectMessage', projectMessageSchema);
