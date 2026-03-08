const mongoose = require('mongoose');

const routineLogSchema = new mongoose.Schema({
  routineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Routine',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  aiStatus: {
    type: String,
    required: true
  },
  aiMessage: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const RoutineLog = mongoose.model('RoutineLog', routineLogSchema);
module.exports = RoutineLog;
