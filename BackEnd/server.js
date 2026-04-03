const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db-ipv4');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

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
    retryAfter: '15 minutes'
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
    type: 'auth'
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
    type: 'admin'
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
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Static files
app.use('/uploads', express.static('uploads'));

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

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check and test endpoint
app.get('/api/test', async (req, res) => {
  try {
    // Test database connection
    const db = require('mongoose').connection;
    
    if (db.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database not connected',
        readyState: db.readyState
      });
    }

    // Test database operation
    const adminCheck = await require('./models/User').findOne({ role: 'admin' });

    res.status(200).json({
      status: 'success',
      message: 'Backend and database are connected!',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        host: db.host,
        database: db.name
      },
      admin: {
        exists: !!adminCheck,
        email: adminCheck?.email || 'No admin found'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Test endpoint error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Create HTTP server instead of using app.listen directly
const http = require('http');
const server = http.createServer(app);

// Socket.io initialization
const socketIO = require('./config/socket');
socketIO.init(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  📡 URL: http://localhost:${PORT}
  🛠️  Health Check: http://localhost:${PORT}/api/test
  `);
});

