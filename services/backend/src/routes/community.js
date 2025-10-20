const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { authenticateAPIKey, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', communityController.getAllCommunities);
router.get('/search', communityController.searchCommunities);
router.get('/:name', communityController.getCommunity);
router.get('/:name/validators', communityController.getCommunityValidators);
router.get('/:name/stats', communityController.getCommunityStats);

// Protected routes (require API key or admin access)
router.post('/:name/validate-rules', authenticateAPIKey, communityController.validateCommunityRules);

// Admin routes
router.post('/', authenticateAPIKey, authorize(['admin']), communityController.createCommunity);
router.put('/:name', authenticateAPIKey, authorize(['admin']), communityController.updateCommunity);
router.post('/:name/validators', authenticateAPIKey, authorize(['admin']), communityController.addValidator);
router.delete('/:name/validators', authenticateAPIKey, authorize(['admin']), communityController.removeValidator);
router.delete('/:name', authenticateAPIKey, authorize(['admin']), communityController.deleteCommunity);

module.exports = router;