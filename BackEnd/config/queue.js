const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    if (times === 1) {
      console.warn('⚠ BullMQ waiting for Redis connection...');
    }
    // Never give up, just keep retrying
    return Math.min(times * 1000, 10000);
  },
};

// Create a queue for emails
const emailQueue = new Queue('email-queue', { connection });

// Create a queue for AI tasks
const aiTaskQueue = new Queue('ai-task-queue', { connection });

module.exports = {
  emailQueue,
  aiTaskQueue,
  connection,
};
