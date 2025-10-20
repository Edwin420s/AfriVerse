const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');

// Get specific entry
router.get('/:id', entryController.getEntry);

// List entries with pagination and filtering
router.get('/', entryController.listEntries);

// Search entries
router.get('/search/all', entryController.searchEntries);

// Query knowledge graph
router.post('/query', entryController.queryKnowledge);

// Get community statistics
router.get('/stats/communities', entryController.getCommunityStats);

module.exports = router;