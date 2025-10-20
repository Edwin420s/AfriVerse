const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Import routes
const submitRoutes = require('./routes/submit');
const entryRoutes = require('./routes/entries');
const validateRoutes = require('./routes/validate');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit submissions to 10 per hour per IP
  message: {
    success: false,
    error: 'Too many submissions from this IP, please try again later.'
  }
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/submit', submitLimiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AfriVerse API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/submit', submitRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/validate', validateRoutes);

// Additional utility endpoints
app.post('/api/transcribe', async (req, res) => {
  try {
    const transcriptionService = require('./services/transcriptionService');
    
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    const { language = 'sw' } = req.body;
    const audioBuffer = req.files.file.data;

    const result = await transcriptionService.transcribeAudio(audioBuffer, language);
    
    res.json({
      success: true,
      transcript: result.text,
      language: result.language,
      duration: result.duration
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: 'Transcription failed: ' + error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum size is 50MB.'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field'
    });
  }

  // Default error
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

module.exports = app;