// Load environment variables first
require('dotenv').config();

const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Environment variables
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close Prisma connection
    await prisma.$disconnect();
    console.log('Database connections closed');
    
    // Close server
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);

  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Start server
const server = app.listen(PORT, HOST, async () => {
  console.log(`🚀 AfriVerse API server running on http://${HOST}:${PORT}`);
  console.log(`📚 API Documentation available at http://${HOST}:${PORT}/api/docs`);
  console.log(`❤️  Health check at http://${HOST}:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection (non-blocking)
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.warn('⚠️  Database connection failed:', error.message);
    console.warn('   Server will continue but database features will be unavailable');
  }

  // Test Redis connection (non-blocking)
  if (process.env.REDIS_URL) {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL, { lazyConnect: true });
      await redis.connect();
      await redis.ping();
      console.log('✅ Redis connected successfully');
      redis.disconnect();
    } catch (error) {
      console.warn('⚠️  Redis connection failed:', error.message);
      console.warn('   Cache features will be disabled');
    }
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Export for testing
module.exports = server;