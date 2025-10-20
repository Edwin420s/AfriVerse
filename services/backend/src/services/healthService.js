const { PrismaClient } = require('@prisma/client');
const CacheService = require('./cacheService');
const logger = require('../utils/logger');

/**
 * HealthService
 *
 * Aggregates health and diagnostics across AfriVerse dependencies:
 * - Database (Prisma)
 * - Redis cache
 * - IPFS (Pinata)
 * - Blockchain provider/contract reachability
 * - MeTTa service (or fallback)
 *
 * Exposes helpers used by routes to report detailed health and metrics.
 */
class HealthService {
  constructor() {
    this.prisma = new PrismaClient();
    this.startTime = new Date();
  }

  /**
   * Run parallel health checks and return overall status snapshot.
   * @returns {Promise<{status:string,timestamp:string,uptime:number,version:string,checks:Array}>}
   */
  async getSystemHealth() {
    try {
      const checks = await Promise.allSettled([
        this.checkDatabase(),
        this.checkRedis(),
        this.checkIPFS(),
        this.checkBlockchain(),
        this.checkMeTTa()
      ]);

      const results = checks.map((check, index) => {
        const serviceName = ['Database', 'Redis', 'IPFS', 'Blockchain', 'MeTTa'][index];
        return {
          service: serviceName,
          status: check.status === 'fulfilled' ? check.value.status : 'unhealthy',
          message: check.status === 'fulfilled' ? check.value.message : check.reason.message,
          responseTime: check.status === 'fulfilled' ? check.value.responseTime : null
        };
      });

      const allHealthy = results.every(result => result.status === 'healthy');
      const overallStatus = allHealthy ? 'healthy' : 'degraded';

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        checks: results
      };
    } catch (error) {
      logger.error('Health check error:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Check DB connectivity via a trivial query.
   */
  async checkDatabase() {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        message: 'Database is responding',
        responseTime: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database error: ${error.message}`,
        responseTime: Date.now() - start
      };
    }
  }

  /**
   * Check Redis connectivity via CacheService.ping.
   */
  async checkRedis() {
    const start = Date.now();
    try {
      const health = await CacheService.health();
      return {
        status: health.status,
        message: health.message,
        responseTime: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Redis error: ${error.message}`,
        responseTime: Date.now() - start
      };
    }
  }

  /**
   * Verify IPFS pin/unpin flow using a tiny test payload.
   */
  async checkIPFS() {
    const start = Date.now();
    try {
      const IPFSService = require('./ipfsService');
      // Test IPFS connectivity by checking if we can create a simple pin
      const testData = Buffer.from('health-check');
      const result = await IPFSService.uploadFile(testData, 'health-check.txt');
      
      if (result && result.cid) {
        // Clean up test pin
        await IPFSService.unpinFile(result.cid);
        return {
          status: 'healthy',
          message: 'IPFS service is responding',
          responseTime: Date.now() - start
        };
      }
      
      throw new Error('IPFS upload failed');
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `IPFS error: ${error.message}`,
        responseTime: Date.now() - start
      };
    }
  }

  /**
   * Check blockchain reachability by attempting to fetch fee data.
   */
  async checkBlockchain() {
    const start = Date.now();
    try {
      const BlockchainService = require('./blockchainService');
      const gasEstimate = await BlockchainService.getGasEstimate();
      
      if (gasEstimate) {
        return {
          status: 'healthy',
          message: 'Blockchain connection is active',
          responseTime: Date.now() - start,
          details: {
            gasPrice: gasEstimate.gasPrice?.toString(),
            network: process.env.WEB3_PROVIDER
          }
        };
      }
      
      throw new Error('Unable to get gas estimate');
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Blockchain error: ${error.message}`,
        responseTime: Date.now() - start
      };
    }
  }

  /**
   * Check MeTTa service by evaluating a trivial expression.
   */
  async checkMeTTa() {
    const start = Date.now();
    try {
      const MeTTaService = require('./mettaService');
      const result = await MeTTaService.evaluateExpression('(+ 1 1)');
      
      if (result.success) {
        return {
          status: 'healthy',
          message: 'MeTTa service is responding',
          responseTime: Date.now() - start
        };
      }
      
      throw new Error('MeTTa evaluation failed');
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `MeTTa error: ${error.message}`,
        responseTime: Date.now() - start
      };
    }
  }

  /**
   * Compose high-level service metrics including queues and cache stats.
   */
  async getServiceMetrics() {
    const [systemHealth, queueMetrics, cacheStats] = await Promise.all([
      this.getSystemHealth(),
      this.getQueueMetrics(),
      this.getCacheStats()
    ]);

    return {
      system: systemHealth,
      queues: queueMetrics,
      cache: cacheStats,
      timestamp: new Date().toISOString()
    };
  }

  async getQueueMetrics() {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      const [transcriptionQueue, symbolizationQueue] = await Promise.all([
        redis.get('queue:transcription:metrics'),
        redis.get('queue:symbolize:metrics')
      ]);

      await redis.quit();

      return {
        transcription: transcriptionQueue ? JSON.parse(transcriptionQueue) : {},
        symbolization: symbolizationQueue ? JSON.parse(symbolizationQueue) : {}
      };
    } catch (error) {
      logger.error('Queue metrics error:', error);
      return { transcription: {}, symbolization: {} };
    }
  }

  async getCacheStats() {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      const info = await redis.info();
      await redis.quit();

      // Parse Redis info to get cache statistics
      const lines = info.split('\r\n');
      const stats = {};
      
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          stats[key] = value;
        }
      }

      return {
        used_memory: stats.used_memory,
        connected_clients: stats.connected_clients,
        keyspace_hits: stats.keyspace_hits,
        keyspace_misses: stats.keyspace_misses,
        hit_rate: stats.keyspace_hits && stats.keyspace_misses ? 
          (parseInt(stats.keyspace_hits) / (parseInt(stats.keyspace_hits) + parseInt(stats.keyspace_misses))).toFixed(4) : 0
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return { error: error.message };
    }
  }

  async getDetailedHealth() {
    const [systemHealth, dbStats, cacheStats, serviceMetrics] = await Promise.all([
      this.getSystemHealth(),
      this.getDatabaseStats(),
      this.getCacheStats(),
      this.getServiceMetrics()
    ]);

    return {
      ...systemHealth,
      database: dbStats,
      cache: cacheStats,
      services: serviceMetrics,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  async getDatabaseStats() {
    try {
      const [entryCounts, validationCounts, communityCounts] = await Promise.all([
        this.prisma.entry.groupBy({
          by: ['status'],
          _count: { id: true }
        }),
        this.prisma.validation.groupBy({
          by: ['decision'],
          _count: { id: true }
        }),
        this.prisma.community.count()
      ]);

      return {
        entries: entryCounts.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
        validations: validationCounts.reduce((acc, item) => {
          acc[item.decision] = item._count.id;
          return acc;
        }, {}),
        communities: communityCounts,
        totalEntries: entryCounts.reduce((sum, item) => sum + item._count.id, 0),
        totalValidations: validationCounts.reduce((sum, item) => sum + item._count.id, 0)
      };
    } catch (error) {
      logger.error('Database stats error:', error);
      return { error: error.message };
    }
  }

  // Graceful shutdown
  async shutdown() {
    try {
      logger.info('Shutting down health service...');
      await this.prisma.$disconnect();
      await CacheService.disconnect();
      logger.info('Health service shutdown complete');
    } catch (error) {
      logger.error('Error during health service shutdown:', error);
    }
  }
}

module.exports = new HealthService();