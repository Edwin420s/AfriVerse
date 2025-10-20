const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Basic health check
router.get('/', healthController.getHealth);

// Detailed health information
router.get('/detailed', healthController.getDetailedHealth);

// Kubernetes readiness probe
router.get('/ready', healthController.getReadiness);

// Kubernetes liveness probe
router.get('/live', healthController.getLiveness);

// Service metrics
router.get('/metrics', healthController.getServiceMetrics);

module.exports = router;