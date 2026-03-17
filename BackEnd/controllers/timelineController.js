const Timeline = require('../models/Timeline');
const Pet = require('../models/Pet');
const fs = require('fs');
const path = require('path');

// @desc    Create a timeline post
// @route   POST /api/timeline
const createTimelinePost = async (req, res) => {
  try {
    const { petId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    // Verify Pet exists and user has access
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const isOwner = pet.userId.toString() === req.user._id.toString();
    const isTrainer = pet.trainerId && pet.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTrainer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to post to this timeline' });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const folder = mediaType === 'video' ? 'videos' : 'images';
    const mediaUrl = `/uploads/timeline/${folder}/${req.file.filename}`;

    const newPost = await Timeline.create({
      petId,
      userId: req.user._id,
      caption,
      mediaUrl,
      mediaType
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pet's timeline
// @route   GET /api/timeline/:petId
const getPetTimeline = async (req, res) => {
  try {
    const { petId } = req.params;
    
    // Verify Pet
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const isOwner = pet.userId.toString() === req.user._id.toString();
    const isTrainer = pet.trainerId && pet.trainerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTrainer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this timeline' });
    }

    const timeline = await Timeline.find({ petId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name profileImage role');

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete timeline post
// @route   DELETE /api/timeline/:id
const deleteTimelinePost = async (req, res) => {
  try {
    const post = await Timeline.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only post author or admin can delete
    const isAuthor = post.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Remove file from disk
    const filename = post.mediaUrl.split('/').pop();
    const folder = post.mediaType === 'video' ? 'videos' : 'images';
    const filePath = path.join(process.cwd(), `uploads/timeline/${folder}/${filename}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Timeline.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTimelinePost,
  getPetTimeline,
  deleteTimelinePost
};
