const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const Redis = require('ioredis');
const { handleSocketConnection } = require('../services/socketService');

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
    },
  });

  // Setup Redis Adapter for horizontal scaling (if enabled)
  if (process.env.NODE_ENV !== 'test' && process.env.REDIS_ENABLED === 'true') {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
      const redisOptions = {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => {
          if (times === 1) {
            console.warn('⚠ Redis connection failure. Retrying...');
          }
          // Never give up (don't return null), just keep retrying with a cap
          return Math.min(times * 1000, 10000);
        },
      };
      const pubClient = new Redis(redisUrl, redisOptions);
      const subClient = pubClient.duplicate();

      pubClient.on('error', (err) => console.error('Redis Adapter Pub Error:', err));
      subClient.on('error', (err) => console.error('Redis Adapter Sub Error:', err));

      io.adapter(createAdapter(pubClient, subClient));
      console.log('✅ Redis Adapter initialized for Socket.io');
    } catch (error) {
      console.error(
        '⚠ Failed to initialize Redis Adapter. Falling back to memory adapter.',
        error.message,
      );
    }
  } else if (process.env.REDIS_ENABLED !== 'true') {
    console.log('ℹ Redis disabled. Socket.io running in memory mode.');
  }

  // Handle incoming connections using the centralized socket service
  io.on('connection', (socket) => {
    handleSocketConnection(io, socket);
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
    console.warn('⚠ Socket.io not initialized yet!');
  }
  return io;
};

module.exports = { init, getIO };
