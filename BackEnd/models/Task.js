const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'walk',
        'play',
        'meal',
        'training',
        'medication',
        'rest',
        'grooming',
        'vet-check',
        'custom',
      ],
      required: true,
    },
    description: String,
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'overdue', 'cancelled'],
      default: 'pending',
    },
    dueDate: { type: Date, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'one-time'] },
    recurrencePattern: String,
    timeWindow: { start: String, end: String },
    assignedTo: { type: String, enum: ['owner', 'caregiver', 'trainer', 'both'], required: true },
    completionPhoto: String,
    completionNotes: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;
