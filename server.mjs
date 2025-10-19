import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import database connection
import connectDB from './config/database.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/files.js';
import vitalsRoutes from './routes/vitals.js';
import timelineRoutes from './routes/timeline.js';
import familyRoutes from './routes/family.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - More permissive for Vercel deployment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://final-hackton-frontend.vercel.app',
      'https://final-hackton-frontend.vercel.app/',
      process.env.FRONTEND_URL
    ].filter(Boolean) // Remove undefined values
  : ['http://localhost:3000', 'http://localhost:3001'];

console.log('🌐 CORS Configuration:', {
  environment: process.env.NODE_ENV,
  allowedOrigins: allowedOrigins,
  frontendUrl: process.env.FRONTEND_URL,
  productionOrigins: process.env.NODE_ENV === 'production' 
    ? [
        'https://final-hackton-frontend.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : 'Not in production'
});

// AGGRESSIVE CORS FIX FOR VERCEL
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 Frontend URL:', process.env.FRONTEND_URL);

// Use a function-based origin checker for better Vercel compatibility
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS Request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'https://final-hackton-frontend.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    console.log('🔧 Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowing origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocking origin:', origin);
      // For now, let's be permissive to fix the issue
      console.log('⚠️ Temporarily allowing for debugging');
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HealthMate Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/family', familyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HealthMate - Sehat ka Smart Dost API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      files: '/api/files',
      vitals: '/api/vitals',
      timeline: '/api/timeline',
      family: '/api/family',
      health: '/health'
    },
    documentation: 'https://github.com/your-repo/healthmate-backend'
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HealthMate Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown:', err);
  process.exit(1);
});

export default app;
