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

let emailQueue;
let aiTaskQueue;

if (process.env.REDIS_ENABLED === 'true') {
  // Create a queue for emails
  emailQueue = new Queue('email-queue', { connection });

  // Create a queue for AI tasks
  aiTaskQueue = new Queue('ai-task-queue', { connection });
} else {
  // Mock objects to prevent crashes when Redis is disabled
  const mockQueue = (name) => ({
    name,
    add: async (jobName) => {
      console.log(
        `ℹ [Mock Queue ${name}] Job "${jobName}" received but Redis is disabled. Skipping.`,
      );
      return { id: 'mock-id' };
    },
    on: () => {},
  });

  emailQueue = mockQueue('email-queue');
  aiTaskQueue = mockQueue('ai-task-queue');
  console.log('ℹ Redis disabled. BullMQ running in mock mode.');
}

module.exports = {
  emailQueue,
  aiTaskQueue,
  connection,
};
