const express = require('express');
const router = express.Router();
const validateController = require('../controllers/validateController');

// Get pending validations
router.get('/pending', validateController.getPendingValidations);

// Submit validation for an entry
router.post('/:entryId', validateController.submitValidation);

// Get validations for an entry
router.get('/:entryId/validations', validateController.getEntryValidations);

// Get validator statistics
router.get('/validator/:validator/stats', validateController.getValidatorStats);

// Bulk validation
router.post('/bulk/validate', validateController.bulkValidate);

module.exports = router;