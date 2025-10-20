const ipfsService = require('../services/ipfsService');
const transcriptionService = require('../services/transcriptionService');
const symbolizerService = require('../services/symbolizerService');
const blockchainService = require('../services/blockchainService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const queue = require('../jobs/transcribeJob');

class SubmitController {
  async submitEntry(req, res) {
    try {
      const { title, language, license, consent, community, metadata } = req.body;
      const file = req.file;

      // Validate required fields
      if (!file || !consent) {
        return res.status(400).json({
          success: false,
          error: 'File and consent are required'
        });
      }

      // Validate license
      const validLicenses = ['CC-BY-4.0', 'CC-BY-NC-4.0', 'CC-BY-SA-4.0', 'Community-Only'];
      if (!validLicenses.includes(license)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid license specified'
        });
      }

      // Upload to IPFS
      const ipfsResult = await ipfsService.uploadFile(file.buffer, file.originalname);

      // Create entry in database
      const entry = await prisma.entry.create({
        data: {
          cid: ipfsResult.cid,
          title: title || 'Untitled Cultural Entry',
          submitter: req.user?.address || 'anonymous',
          language: language || 'sw',
          license: license || 'CC-BY-NC-4.0',
          status: 'pending',
          metadata: metadata || {},
          community: community || 'general'
        }
      });

      // Enqueue transcription job
      await queue.add('transcribe', {
        entryId: entry.id,
        cid: ipfsResult.cid,
        language: language || 'sw'
      });

      res.json({
        success: true,
        entryId: entry.id,
        cid: ipfsResult.cid,
        message: 'Entry submitted successfully and queued for processing'
      });

    } catch (error) {
      console.error('Submit error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit entry: ' + error.message
      });
    }
  }

  async getSubmissionStatus(req, res) {
    try {
      const { entryId } = req.params;

      const entry = await prisma.entry.findUnique({
        where: { id: parseInt(entryId) },
        include: {
          validations: true
        }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }

      // Get blockchain status if available
      let blockchainStatus = null;
      try {
        blockchainStatus = await blockchainService.getEntry(entryId);
      } catch (error) {
        // Blockchain status might not be available yet
      }

      res.json({
        success: true,
        entry: {
          ...entry,
          blockchainStatus
        }
      });

    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get submission status'
      });
    }
  }

  async updateTranscript(req, res) {
    try {
      const { entryId } = req.params;
      const { transcript, status } = req.body;

      const entry = await prisma.entry.update({
        where: { id: parseInt(entryId) },
        data: {
          transcript: transcript,
          status: status || 'transcribed'
        }
      });

      // Enqueue symbolization job if transcript is available
      if (transcript) {
        await queue.add('symbolize', {
          entryId: parseInt(entryId),
          transcript: transcript,
          context: {
            language: entry.language,
            community: entry.community
          }
        });
      }

      res.json({
        success: true,
        message: 'Transcript updated successfully'
      });

    } catch (error) {
      console.error('Transcript update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update transcript'
      });
    }
  }

  async updateAtoms(req, res) {
    try {
      const { entryId } = req.params;
      const { atoms, status } = req.body;

      const entry = await prisma.entry.update({
        where: { id: parseInt(entryId) },
        data: {
          atoms: atoms || [],
          status: status || 'symbolized'
        }
      });

      // If atoms are validated, anchor to blockchain
      if (status === 'validated' && atoms && atoms.length > 0) {
        try {
          const blockchainResult = await blockchainService.submitEntry(
            entry.cid,
            entry.license
          );

          if (blockchainResult.success) {
            await prisma.entry.update({
              where: { id: parseInt(entryId) },
              data: {
                status: 'anchored',
                blockchainTx: blockchainResult.transactionHash,
                blockchainEntryId: blockchainResult.entryId
              }
            });
          }
        } catch (blockchainError) {
          console.error('Blockchain anchoring failed:', blockchainError);
          // Continue anyway - blockchain is optional for MVP
        }
      }

      res.json({
        success: true,
        message: 'Atoms updated successfully'
      });

    } catch (error) {
      console.error('Atoms update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update atoms'
      });
    }
  }

  async symbolizeTranscript(req, res) {
    try {
      const { transcript, context } = req.body;

      if (!transcript) {
        return res.status(400).json({
          success: false,
          error: 'Transcript is required'
        });
      }

      const symbolizerResult = await symbolizerService.extractAtoms(transcript, context);

      res.json({
        success: true,
        atoms: symbolizerResult.atoms,
        rawResponse: symbolizerResult.rawResponse,
        atomCount: symbolizerResult.atomCount
      });

    } catch (error) {
      console.error('Symbolization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to symbolize transcript: ' + error.message
      });
    }
  }
}

module.exports = new SubmitController();