const MetricsService = require('../services/metricsService');
const ResponseUtils = require('../utils/responseUtils');

class MetricsController {
  async getSystemMetrics(req, res) {
    try {
      const metrics = await MetricsService.getSystemMetrics();

      res.json(
        ResponseUtils.success(metrics)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getUserMetrics(req, res) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json(
          ResponseUtils.error('User address is required')
        );
      }

      const metrics = await MetricsService.getUserMetrics(address);

      res.json(
        ResponseUtils.success(metrics)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getQueueMetrics(req, res) {
    try {
      const metrics = await MetricsService.getQueueMetrics();

      res.json(
        ResponseUtils.success(metrics)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async exportMetrics(req, res) {
    try {
      const { format = 'json' } = req.query;

      if (!['json', 'csv'].includes(format)) {
        return res.status(400).json(
          ResponseUtils.error('Format must be json or csv')
        );
      }

      const metrics = await MetricsService.exportMetrics(format);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=afriverse-metrics.csv');
        return res.send(metrics);
      }

      res.json(
        ResponseUtils.success(metrics)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }
}

module.exports = new MetricsController();