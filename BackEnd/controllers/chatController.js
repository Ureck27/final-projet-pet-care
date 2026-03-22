const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user conversations
// @route   GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find conversations where user is either userId or trainerId
    // Assuming req.user.role determines if they are fetching as User or Trainer
    
    let query = {};
    if (req.user.role === 'trainer') {
      // If role trainer, they find by trainerId. Note: req.user._id is the User id.
      // Wait, Trainer is a separate model but logged in user might be tied to Trainer.
      // Assuming we need to find the Trainer object first for this user.
      const Trainer = require('../models/Trainer');
      const trainer = await Trainer.findOne({ userId: req.user._id });
      if (!trainer) return res.status(404).json({ message: 'Trainer profile not found' });
      query = { trainerId: trainer._id };
    } else {
      query = { userId: req.user._id };
    }

    const conversations = await Conversation.find(query)
      .populate('userId', 'name image role')
      .populate('trainerId', 'name image')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new conversation or get existing
// @route   POST /api/chat/conversation
const initiateConversation = async (req, res) => {
  try {
    const { userId, trainerId } = req.body;
    
    let conversation = await Conversation.findOne({ userId, trainerId });
    if (!conversation) {
      conversation = await Conversation.create({ userId, trainerId });
    }
    
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  initiateConversation
};
