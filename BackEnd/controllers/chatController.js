const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user conversations
// @route   GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const query = { participants: req.user._id };

    const conversations = await Conversation.find(query)
      .populate('participants', 'name email role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation (cursor-based pagination)
// @route   GET /api/chat/:conversationId
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { cursor, limit = 20 } = req.query;

    const query = { conversationId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Get newest first for pagination
      .limit(Number(limit) + 1); // Fetch one extra to check if there's a next page

    const hasNextPage = messages.length > limit;
    const results = hasNextPage ? messages.slice(0, -1) : messages;
    const nextCursor = hasNextPage ? results[results.length - 1].createdAt : null;

    res.json({
      success: true,
      data: results.reverse(), // Reverse back to chronological order
      pagination: {
        nextCursor,
        hasNextPage,
        count: results.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new conversation or get existing
// @route   POST /api/chat/conversation
const initiateConversation = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    const participants = [req.user._id, targetUserId];

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length },
    }).populate('participants', 'name email role');

    if (!conversation) {
      conversation = await Conversation.create({ participants });
      conversation = await conversation.populate('participants', 'name email role');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  initiateConversation,
};
