const HealthService = require('../services/healthService');
const ResponseUtils = require('../utils/responseUtils');

class HealthController {
  async getHealth(req, res) {
    try {
      const health = await HealthService.getSystemHealth();
      
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 207 : 503;
      
      res.status(statusCode).json(
        ResponseUtils.success(health)
      );
    } catch (error) {
      res.status(503).json(
        ResponseUtils.error('Health check failed', error.message)
      );
    }
  }

  async getDetailedHealth(req, res) {
    try {
      const health = await HealthService.getDetailedHealth();
      
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 207 : 503;
      
      res.status(statusCode).json(
        ResponseUtils.success(health)
      );
    } catch (error) {
      res.status(503).json(
        ResponseUtils.error('Detailed health check failed', error.message)
      );
    }
  }

  async getReadiness(req, res) {
    try {
      const health = await HealthService.getSystemHealth();
      
      // For readiness, we require database and Redis to be healthy
      const databaseCheck = health.checks.find(check => check.service === 'Database');
      const redisCheck = health.checks.find(check => check.service === 'Redis');
      
      const isReady = databaseCheck?.status === 'healthy' && 
                     redisCheck?.status === 'healthy';
      
      const statusCode = isReady ? 200 : 503;
      
      res.status(statusCode).json(
        ResponseUtils.success({
          ready: isReady,
          timestamp: new Date().toISOString(),
          requiredServices: {
            database: databaseCheck,
            redis: redisCheck
          }
        })
      );
    } catch (error) {
      res.status(503).json(
        ResponseUtils.error('Readiness check failed', error.message)
      );
    }
  }

  async getLiveness(req, res) {
    try {
      // Liveness check - basic process health
      res.json(
        ResponseUtils.success({
          alive: true,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage()
        })
      );
    } catch (error) {
      res.status(503).json(
        ResponseUtils.error('Liveness check failed', error.message)
      );
    }
  }

  async getServiceMetrics(req, res) {
    try {
      const metrics = await HealthService.getServiceMetrics();
      
      res.json(
        ResponseUtils.success(metrics)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error('Failed to get service metrics', error.message)
      );
    }
  }
}

module.exports = new HealthController();