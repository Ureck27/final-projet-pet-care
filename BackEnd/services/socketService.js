const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Simple in-memory rate limiter for socket events to prevent spam
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 events
  duration: 1, // per 1 second
});

const CHAT_EVENTS = {
  JOIN_CONVERSATION: 'join_conversation',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  START_TYPING: 'start_typing',
  STOP_TYPING: 'stop_typing',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  MESSAGE_READ: 'message_read',
  MESSAGE_READ_RECEIPT: 'message_read_receipt',
  SYNC_UNREAD: 'sync_unread',
  ERROR: 'socket_error',
};

const handleSocketConnection = (io, socket) => {
  // Extract userId from auth payload if available
  const userId = socket.handshake.auth?.userId;

  if (userId) {
    // Join a personal room for horizontal scaling routing
    socket.join(`user_${userId}`);
    console.log(`User ${userId} (Socket: ${socket.id}) connected to chat.`);

    // Fetch and deliver unread messages immediately
    deliverUnreadMessages(io, socket, userId);
  } else {
    console.log('Socket user connected without explicit userId auth:', socket.id);
  }

  // Helper function to validate rate limiting
  const isRateLimited = async () => {
    try {
      await rateLimiter.consume(socket.id);
      return false;
    } catch (_rejRes) {
      socket.emit(CHAT_EVENTS.ERROR, { message: 'Too many requests' });
      return true;
    }
  };

  /**
   * Listen for joining a specific conversation room
   * Useful if you still want room-based broadcasting
   */
  socket.on(CHAT_EVENTS.JOIN_CONVERSATION, async (conversationId) => {
    if (await isRateLimited()) return;
    socket.join(conversationId);
    console.log(`User ${userId || socket.id} joined conversation: ${conversationId}`);
  });

  /**
   * Listen for sending a message
   * Enforces DB write BEFORE broadcast to ensure persistence
   */
  socket.on(CHAT_EVENTS.SEND_MESSAGE, async (data, callback) => {
    if (await isRateLimited()) return;

    try {
      // Create message in DB
      const newMessage = await Message.create({
        ...data,
        isRead: false,
      });

      // Update Conversation's last message
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: newMessage._id,
      });

      // Prepare populated message if needed
      // (Depends on frontend expectations, sometimes sender info is needed)
      // For now, we emit what was saved plus sender data mapping

      // Emit to everyone in the room
      io.to(data.conversationId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, newMessage);

      // If callback acknowledgement function exists, call it (success)
      if (typeof callback === 'function') {
        callback({ success: true, message: newMessage });
      }
    } catch (error) {
      console.error('Socket send_message error:', error);
      if (typeof callback === 'function') {
        callback({ success: false, error: 'Database save failed' });
      } else {
        socket.emit(CHAT_EVENTS.ERROR, { message: 'Failed to send message' });
      }
    }
  });

  /**
   * Listen for Typing Indicator
   */
  socket.on(CHAT_EVENTS.START_TYPING, async (data) => {
    // Limit typing spam silently
    try {
      await rateLimiter.consume(socket.id + '_typing', 2);
    } catch (_e) {
      return;
    }

    // Broadcast to others in the conversation room
    socket.to(data.conversationId).emit(CHAT_EVENTS.USER_TYPING, {
      userId: data.senderId,
      conversationId: data.conversationId,
    });
  });

  socket.on(CHAT_EVENTS.STOP_TYPING, (data) => {
    socket.to(data.conversationId).emit(CHAT_EVENTS.USER_STOP_TYPING, {
      userId: data.senderId,
      conversationId: data.conversationId,
    });
  });

  /**
   * Read Receipts System
   * User signals they have read a message (or conversation)
   */
  socket.on(CHAT_EVENTS.MESSAGE_READ, async (data, callback) => {
    try {
      // If conversationId is provided, we can mark all unread in it as read
      if (data.conversationId && data.userId) {
        await Message.updateMany(
          {
            conversationId: data.conversationId,
            senderId: { $ne: data.userId },
            isRead: false,
          },
          {
            $set: { isRead: true, readAt: new Date() },
          },
        );

        // Notify the conversation room about read receipt
        io.to(data.conversationId).emit(CHAT_EVENTS.MESSAGE_READ_RECEIPT, {
          conversationId: data.conversationId,
          readBy: data.userId,
          time: new Date(),
        });

        if (typeof callback === 'function') callback({ success: true });
      }
    } catch (error) {
      console.error('Socket message_read error:', error);
      if (typeof callback === 'function') callback({ success: false });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId || socket.id} disconnected from chat.`);
  });
};

/**
 * Deliver unread messages on reconnect
 * Ensures no drop in messages during offline states
 */
const deliverUnreadMessages = async (io, socket, userId) => {
  try {
    // Note: Depends on logic where senderId matches participant structure.
    // We want messages sent TO this user. Typically requires querying conversations
    // where user is a participant, then finding unread messages.
    // For simplicity, we find conversations this user is part of:
    const userConversations = await Conversation.find({
      $or: [{ userId }, { trainerId: userId }],
    }).select('_id');

    const conversationIds = userConversations.map((c) => c._id);

    const unreadMessages = await Message.find({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userId },
      isRead: false,
      deliveredAt: { $exists: false },
    }).sort({ createdAt: 1 });

    if (unreadMessages.length > 0) {
      socket.emit(CHAT_EVENTS.SYNC_UNREAD, unreadMessages);

      // Mark delivered
      const unreadIds = unreadMessages.map((m) => m._id);
      await Message.updateMany({ _id: { $in: unreadIds } }, { $set: { deliveredAt: new Date() } });
    }
  } catch (error) {
    console.error('Failed to sync unread messages for user', userId, error);
  }
};

module.exports = {
  handleSocketConnection,
  CHAT_EVENTS,
};
