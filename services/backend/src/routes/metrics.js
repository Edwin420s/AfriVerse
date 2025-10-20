const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const { authenticateAPIKey } = require('../middleware/authMiddleware');

// Public metrics
router.get('/system', metricsController.getSystemMetrics);

// Protected metrics (require API key)
router.get('/user/:address', authenticateAPIKey, metricsController.getUserMetrics);
router.get('/queues', authenticateAPIKey, metricsController.getQueueMetrics);
router.get('/export', authenticateAPIKey, metricsController.exportMetrics);

module.exports = router;