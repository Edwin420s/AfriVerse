const axios = require('axios');
const logger = require('./utils/logger');

class HealthCheck {
  constructor(baseURL = 'http://localhost:4000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000
    });
  }

  async checkAllEndpoints() {
    const endpoints = [
      { path: '/health', method: 'GET', name: 'Health Check' },
      { path: '/health/ready', method: 'GET', name: 'Readiness' },
      { path: '/health/live', method: 'GET', name: 'Liveness' },
      { path: '/api/entries', method: 'GET', name: 'Entries API' },
      { path: '/api/community', method: 'GET', name: 'Community API' }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const response = await this.client.get(endpoint.path);
        const responseTime = Date.now() - start;

        results.push({
          endpoint: endpoint.name,
          status: 'healthy',
          statusCode: response.status,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        });

        logger.info(`✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          status: 'unhealthy',
          statusCode: error.response?.status || 'N/A',
          error: error.message,
          timestamp: new Date().toISOString()
        });

        logger.error(`❌ ${endpoint.name}: ${error.message}`);
      }
    }

    return results;
  }

  async checkDatabaseConnection() {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      
      return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'unhealthy', message: `Database error: ${error.message}` };
    }
  }

  async checkRedisConnection() {
    try {
      const CacheService = require('./services/cacheService');
      const health = await CacheService.health();
      return health;
    } catch (error) {
      return { status: 'unhealthy', message: `Redis error: ${error.message}` };
    }
  }

  async comprehensiveCheck() {
    const [endpoints, database, redis] = await Promise.all([
      this.checkAllEndpoints(),
      this.checkDatabaseConnection(),
      this.checkRedisConnection()
    ]);

    const allHealthy = endpoints.every(e => e.status === 'healthy') && 
                      database.status === 'healthy' && 
                      redis.status === 'healthy';

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      },
      services: {
        database,
        redis
      },
      endpoints
    };
  }

  async run() {
    try {
      const result = await this.comprehensiveCheck();
      
      console.log('\n=== AfriVerse Health Check ===');
      console.log(`Overall Status: ${result.status.toUpperCase()}`);
      console.log(`Timestamp: ${result.timestamp}`);
      console.log(`Node Version: ${result.system.nodeVersion}`);
      console.log(`Uptime: ${Math.floor(result.system.uptime)} seconds`);
      
      console.log('\n--- Service Status ---');
      console.log(`Database: ${result.services.database.status}`);
      console.log(`Redis: ${result.services.redis.status}`);
      
      console.log('\n--- Endpoint Status ---');
      result.endpoints.forEach(endpoint => {
        const icon = endpoint.status === 'healthy' ? '✅' : '❌';
        console.log(`${icon} ${endpoint.endpoint}: ${endpoint.statusCode} (${endpoint.responseTime || 'N/A'})`);
      });

      // Exit with appropriate code
      process.exit(result.status === 'healthy' ? 0 : 1);
      
    } catch (error) {
      console.error('Health check failed:', error);
      process.exit(1);
    }
  }
}

// If run directly
if (require.main === module) {
  const baseURL = process.env.HEALTH_CHECK_BASE_URL || 'http://localhost:4000';
  const healthCheck = new HealthCheck(baseURL);
  healthCheck.run();
}

module.exports = HealthCheck;