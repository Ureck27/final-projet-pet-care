const DailyActivity = require('../models/DailyActivity');

// @desc    Get daily activities for a pet
// @route   GET /api/daily-activities/pet/:petId
const getActivities = async (req, res) => {
  try {
    const activities = await DailyActivity.find({ petId: req.params.petId });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create daily activity
// @route   POST /api/daily-activities
const createActivity = async (req, res) => {
  try {
    const {
      petId,
      activityType,
      title,
      description,
      duration,
      startTime,
      endTime,
      photo,
      videoUrl,
      emotion,
      emotionConfidence,
      caregiverNotes,
      location,
    } = req.body;

    const activity = await DailyActivity.create({
      petId,
      caregiverId: req.user._id,
      activityType,
      title,
      description,
      duration,
      startTime: startTime || new Date(),
      endTime,
      photo,
      videoUrl,
      emotion,
      emotionConfidence,
      caregiverNotes,
      location,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update daily activity
// @route   PUT /api/daily-activities/:id
const updateActivity = async (req, res) => {
  try {
    const activity = await DailyActivity.findById(req.params.id);
    if (activity) {
      if (
        activity.caregiverId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatableFields = [
        'activityType',
        'title',
        'description',
        'duration',
        'startTime',
        'endTime',
        'photo',
        'videoUrl',
        'emotion',
        'caregiverNotes',
        'location',
      ];
      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          activity[field] = req.body[field];
        }
      });

      const updatedActivity = await activity.save();
      res.json(updatedActivity);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete daily activity
// @route   DELETE /api/daily-activities/:id
const deleteActivity = async (req, res) => {
  try {
    const activity = await DailyActivity.findById(req.params.id);
    if (activity) {
      if (
        activity.caregiverId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      await DailyActivity.deleteOne({ _id: activity._id });
      res.json({ message: 'Activity removed' });
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
