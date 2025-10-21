const express = require('express');
const multer = require('multer');
const router = express.Router();
const validate = require('../middleware/validate');
const {
  paramsEntryId,
  updateTranscriptBody,
  updateAtomsBody,
  symbolizeBody,
  transcribeBody
} = require('../schemas/submitSchemas');
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
router.patch('/:entryId/transcript',
  validate({ params: paramsEntryId, body: updateTranscriptBody }),
  submitController.updateTranscript
);

// Update atoms (called by agents)
router.patch('/:entryId/atoms',
  validate({ params: paramsEntryId, body: updateAtomsBody }),
  submitController.updateAtoms
);

// Symbolize transcript (direct API)
router.post('/symbolize',
  validate({ body: symbolizeBody }),
  submitController.symbolizeTranscript
);

// Transcribe audio file (direct API)
router.post('/transcribe',
  upload.single('file'),
  validate({ body: transcribeBody }),
  submitController.transcribe
);

module.exports = router;