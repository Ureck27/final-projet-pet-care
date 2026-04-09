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
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const isDev = process.env.NODE_ENV === 'development';

    // In dev, we want to know quickly if Redis is down
    const redisOptions = {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > (isDev ? 3 : 10)) {
          console.error(
            `✗ Redis connection failed after ${times} attempts. Falling back to Memory mode.`,
          );
          return null; // Stop retrying
        }
        const delay = Math.min(times * 1000, 5000);
        if (isDev)
          console.warn(`⚠ Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
        return delay;
      },
      connectTimeout: 5000,
    };

    try {
      const pubClient = new Redis(redisUrl, redisOptions);
      const subClient = new Redis(redisUrl, redisOptions);

      // Listen for connection events to safely mount adapter
      let adapterMounted = false;
      const mountAdapter = () => {
        if (!adapterMounted && pubClient.status === 'ready' && subClient.status === 'ready') {
          io.adapter(createAdapter(pubClient, subClient));
          console.log('✅ Redis Adapter initialized for Socket.io');
          adapterMounted = true;
        }
      };

      pubClient.on('ready', mountAdapter);
      subClient.on('ready', mountAdapter);

      pubClient.on('error', (err) => {
        if (isDev && err.code === 'ECONNREFUSED') {
          // Silent warning for connection refused in dev to avoid spam
        } else {
          console.error('Redis Adapter Pub Error:', err.message);
        }
      });

      subClient.on('error', (err) => {
        if (!isDev) console.error('Redis Adapter Sub Error:', err.message);
      });
    } catch (error) {
      console.error('⚠ Failed to initialize Redis Adapter structure:', error.message);
    }
  } else {
    console.log(
      `ℹ Redis ${process.env.REDIS_ENABLED === 'true' ? 'enabled but in test mode' : 'disabled'}. Socket.io running in memory mode.`,
    );
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
