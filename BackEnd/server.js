const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

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
const projectRoutes = require('./routes/projectRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');

// Security middleware
app.use(helmet()); // Set security HTTP headers

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true // Don't count successful requests
});

app.use(limiter); // Apply general rate limiter to all routes

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth/login', authLimiter); // Apply stricter limiter to login
app.use('/api/auth/admin-login', authLimiter); // Apply stricter limiter to admin login
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/daily-activities', dailyActivityRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/trainer-requests', require('./routes/trainerRequestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
