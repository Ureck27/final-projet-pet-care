const { Server } = require('socket.io');

let io;

/**
 * Initialize Socket.io on the given HTTP server
 * @param {http.Server} httpServer - The HTTP server instance
 * @returns {Server} - The socket.io server instance
 */
const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        // data expects: { conversationId, senderId, senderModel, text, image, voice, video }
        const Message = require('../models/Message');
        const Conversation = require('../models/Conversation');
        
        const newMessage = await Message.create(data);
        
        await Conversation.findByIdAndUpdate(data.conversationId, {
          lastMessage: newMessage._id
        });

        // Broadcast to everyone in the room (including sender)
        io.to(data.conversationId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });

  return io;
};

/**
 * Get the initialized Socket.io instance
 * @throws Error if socket not initialized
 * @returns {Server}
 */
const getIO = () => {
  if (!io) {
    // Return a dummy object or just warn if not initialized yet to avoid crashing 
    // during boot, but generally it should be initialized in server.js
    console.warn('⚠ Socket.io not initialized yet!');
  }
  return io;
};

module.exports = { init, getIO };
