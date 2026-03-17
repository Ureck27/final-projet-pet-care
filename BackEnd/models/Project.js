const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['inProgress', 'upcoming', 'completed', 'paused'],
    default: 'inProgress'
  },
  accentColor: {
    type: String,
    default: '#6366f1'
  },
  bgColorClass: {
    type: String,
    default: 'bg-white dark:bg-slate-800'
  },
  participants: [{
    type: String // URLs to participant avatars
  }],
  daysLeft: {
    type: mongoose.Schema.Types.Mixed // Can be number or string
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ ownerId: 1, status: 1 });
projectSchema.index({ ownerId: 1, createdAt: -1 });
projectSchema.index({ petId: 1 });

// Virtual for calculating days left
projectSchema.virtual('daysLeftCalculated').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Pre-save middleware to set completedAt when status changes to completed
projectSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.progress = 100;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
