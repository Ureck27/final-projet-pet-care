const { Worker } = require('bullmq');
const connection = require('../config/queue').connection;

// Implement an email worker
const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`[EmailWorker] Processing job ${job.id} for ${job.data.to}`);
    // Simulate sending email logic...
    // const emailService = require('../services/emailService');
    // await emailService.sendEmail(job.data.to, job.data.subject, job.data.body);
    
    // Simulating delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[EmailWorker] Finished job ${job.id}`);
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`[EmailWorker] Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[EmailWorker] Job ${job.id} has failed with ${err.message}`);
});

// Implement an AI task worker
const aiTaskWorker = new Worker(
  'ai-task-queue',
  async (job) => {
    console.log(`[AITaskWorker] Processing job ${job.id} with data`, job.data);
    // Simulate AI scanning...
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`[AITaskWorker] Finished job ${job.id}`);
  },
  { connection }
);

aiTaskWorker.on('completed', (job) => {
  console.log(`[AITaskWorker] Job ${job.id} has completed!`);
});

aiTaskWorker.on('failed', (job, err) => {
  console.error(`[AITaskWorker] Job ${job.id} has failed with ${err.message}`);
});

module.exports = {
  emailWorker,
  aiTaskWorker
};
