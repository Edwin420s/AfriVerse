const express = require('express');
const multer = require('multer');
const router = express.Router();
const submitController = require('../controllers/submitController');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow audio, video, and text files
    const allowedMimes = [
      'audio/*',
      'video/*',
      'text/plain',
      'application/json'
    ];
    
    if (allowedMimes.some(mime => file.mimetype.includes(mime.replace('/*', '')))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio, video, and text files are allowed.'));
    }
  }
});

// Submit new cultural knowledge entry
router.post('/', upload.single('file'), submitController.submitEntry);

// Get submission status
router.get('/status/:entryId', submitController.getSubmissionStatus);

// Update transcript (called by agents)
router.patch('/:entryId/transcript', submitController.updateTranscript);

// Update atoms (called by agents)
router.patch('/:entryId/atoms', submitController.updateAtoms);

// Symbolize transcript (direct API)
router.post('/symbolize', submitController.symbolizeTranscript);

module.exports = router;