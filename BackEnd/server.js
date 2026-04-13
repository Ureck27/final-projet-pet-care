const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB } = require('./config/db-ipv4');

// Load env vars
dotenv.config();

// Connect to database (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const taskRoutes = require('./routes/taskRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const dailyActivityRoutes = require('./routes/dailyActivityRoutes');
const routineRoutes = require('./routes/routineRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const petUpdateRoutes = require('./routes/petUpdateRoutes');

// Security middleware
app.use(helmet()); // Set security HTTP headers

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiting for regular user login
const userAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 20, // Increased limits
  message: {
    error: 'Too many login attempts. Please try again later.',
    retryAfter: '15 minutes',
    type: 'auth',
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// More lenient rate limiting for admin login
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 20 : 50, // Much higher limits for admin
  message: {
    error: 'Too many admin login attempts. Please try again later.',
    retryAfter: '15 minutes',
    type: 'admin',
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  // Optional: Add IP whitelisting for admin access
  // skip: (req) => {
  //   const adminIPs = process.env.ADMIN_IPS?.split(',') || [];
  //   return adminIPs.includes(req.ip);
  // }
});

app.use(limiter); // Apply general rate limiter to all routes

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  }),
);
app.use(express.json());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Static files
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth/login', userAuthLimiter); // Apply user limiter to regular login
app.use('/api/auth/admin-login', adminAuthLimiter); // Apply admin limiter to admin login
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/daily-activities', dailyActivityRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/pet-updates', petUpdateRoutes);
app.use('/api/trainer-requests', require('./routes/trainerRequestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); // New Review Routes
app.use('/api/applications', require('./routes/applicationRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check and test endpoint with enhanced diagnostics
app.get('/api/test', async (req, res) => {
  const diagnostics = {
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: { connected: false },
    redis: { enabled: process.env.REDIS_ENABLED === 'true', connected: false },
  };

  try {
    // 1. Test database connection
    const db = require('mongoose').connection;
    diagnostics.database = {
      connected: db.readyState === 1,
      readyState: db.readyState,
      host: db.host,
      name: db.name,
    };

    if (db.readyState === 1) {
      // Test database operation (quick read)
      const adminCheck = await require('./models/User')
        .findOne({ role: 'admin' })
        .select('email')
        .lean();
      diagnostics.admin = {
        exists: !!adminCheck,
        email: adminCheck?.email || 'No admin found',
      };
    }

    // 2. Test Redis (if enabled)
    if (diagnostics.redis.enabled) {
      // In a real app, you'd check a global redis client
      // For now, we'll just check if the adapter would have been initialized
      diagnostics.redis.adapter = 'redis-adapter';
    } else {
      diagnostics.redis.adapter = 'memory';
    }

    // 3. DNS check for Atlas (if applicable)
    if (db.host && db.host.includes('mongodb.net')) {
      try {
        const dns = require('dns').promises;
        const lookup = await dns.lookup(db.host);
        diagnostics.network = { dnsResolved: true, ip: lookup.address };
      } catch (_e) {
        diagnostics.network = { dnsResolved: false, error: 'DNS resolution failed for Atlas host' };
      }
    }

    const statusCode = diagnostics.database.connected ? 200 : 503;
    res.status(statusCode).json(diagnostics);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Test endpoint error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      diagnostics,
    });
  }
});

// 404 handler for unknown routes
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(errorHandler);

// Create HTTP server instead of using app.listen directly
const http = require('http');
const server = http.createServer(app);

// Socket.io initialization
const socketIO = require('./config/socket');
socketIO.init(server);

// Start the server
// Export app for testing
module.exports = app;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
    📡 URL: http://localhost:${PORT}
    🛠️  Health Check: http://localhost:${PORT}/api/test
    `);

    // Initialize Background Jobs and Cron System
    try {
      const { startReminderCron } = require('./cron/automatedReminders');
      startReminderCron();

      // Only start BullMQ workers if Redis is enabled
      if (process.env.REDIS_ENABLED === 'true') {
        require('./workers/jobWorker');
        console.log('✅ Background workers initialized successfully.');
      } else {
        console.log('ℹ Redis disabled. Background workers skipped.');
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.warn(
          '⚠️  Could not start cron/job queue. Please run: npm install bullmq ioredis node-cron',
        );
      } else {
        console.error('Error starting cron/workers:', error.message);
      }
    }
  });
}
