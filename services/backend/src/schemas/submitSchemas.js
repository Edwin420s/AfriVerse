const { z } = require('zod');

const paramsEntryId = z.object({
  entryId: z.string().regex(/^\d+$/, 'entryId must be a number')
});

const updateTranscriptBody = z.object({
  transcript: z.string().min(1, 'transcript must be a non-empty string'),
  status: z.string().optional()
});

const updateAtomsBody = z.object({
  atoms: z.array(z.string().min(1, 'each atom must be a non-empty string')),
  status: z.string().optional()
});

const symbolizeBody = z.object({
  transcript: z.string().min(1, 'transcript is required'),
  context: z.record(z.any()).optional()
});

const transcribeBody = z.object({
  language: z.string().optional()
});

module.exports = {
  paramsEntryId,
  updateTranscriptBody,
  updateAtomsBody,
  symbolizeBody,
  transcribeBody
};
