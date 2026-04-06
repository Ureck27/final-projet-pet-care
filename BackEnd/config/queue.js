const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create a queue for emails
const emailQueue = new Queue('email-queue', { connection });

// Create a queue for AI tasks
const aiTaskQueue = new Queue('ai-task-queue', { connection });

module.exports = {
  emailQueue,
  aiTaskQueue,
  connection
};
