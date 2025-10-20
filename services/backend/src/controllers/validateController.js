const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const blockchainService = require('../services/blockchainService');

class ValidateController {
  async getPendingValidations(req, res) {
    try {
      const { community, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = { status: 'symbolized' };
      if (community) where.community = community;

      const [entries, total] = await Promise.all([
        prisma.entry.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            validations: true
          }
        }),
        prisma.entry.count({ where })
      ]);

      res.json({
        success: true,
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Get pending validations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pending validations'
      });
    }
  }

  async submitValidation(req, res) {
    try {
      const { entryId } = req.params;
      const { decision, notes, validator } = req.body;

      if (!['approved', 'rejected'].includes(decision)) {
        return res.status(400).json({
          success: false,
          error: 'Decision must be either "approved" or "rejected"'
        });
      }

      const entry = await prisma.entry.findUnique({
        where: { id: parseInt(entryId) }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }

      if (entry.status !== 'symbolized') {
        return res.status(400).json({
          success: false,
          error: 'Entry is not ready for validation'
        });
      }

      // Create validation record
      const validation = await prisma.validation.create({
        data: {
          entryId: parseInt(entryId),
          validator: validator || req.user?.address || 'anonymous',
          decision,
          notes: notes || ''
        }
      });

      // Update entry status based on validation
      const newStatus = decision === 'approved' ? 'validated' : 'rejected';
      await prisma.entry.update({
        where: { id: parseInt(entryId) },
        data: { status: newStatus }
      });

      // If approved, anchor to blockchain
      if (decision === 'approved') {
        try {
          const blockchainResult = await blockchainService.submitEntry(
            entry.cid,
            entry.license
          );

          if (blockchainResult.success) {
            await prisma.entry.update({
              where: { id: parseInt(entryId) },
              data: {
                blockchainTx: blockchainResult.transactionHash,
                blockchainEntryId: blockchainResult.entryId
              }
            });

            // Also submit validation to blockchain
            await blockchainService.validateEntry(
              blockchainResult.entryId,
              true
            );
          }
        } catch (blockchainError) {
          console.error('Blockchain anchoring failed:', blockchainError);
          // Continue anyway - blockchain is optional
        }
      }

      res.json({
        success: true,
        validation,
        message: `Entry ${decision} successfully`
      });

    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        success: false,
        error: 'Validation failed: ' + error.message
      });
    }
  }

  async getValidatorStats(req, res) {
    try {
      const { validator } = req.params;

      const stats = await prisma.validation.groupBy({
        by: ['decision'],
        where: {
          validator: validator
        },
        _count: {
          id: true
        }
      });

      const total = stats.reduce((sum, stat) => sum + stat._count.id, 0);
      
      const decisions = {
        approved: 0,
        rejected: 0
      };

      stats.forEach(stat => {
        decisions[stat.decision] = stat._count.id;
      });

      res.json({
        success: true,
        validator,
        stats: {
          total,
          ...decisions,
          approvalRate: total > 0 ? (decisions.approved / total) * 100 : 0
        }
      });

    } catch (error) {
      console.error('Validator stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get validator stats'
      });
    }
  }

  async getEntryValidations(req, res) {
    try {
      const { entryId } = req.params;

      const validations = await prisma.validation.findMany({
        where: { entryId: parseInt(entryId) },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const entry = await prisma.entry.findUnique({
        where: { id: parseInt(entryId) },
        select: {
          status: true,
          title: true
        }
      });

      res.json({
        success: true,
        validations,
        entryStatus: entry.status,
        entryTitle: entry.title
      });

    } catch (error) {
      console.error('Get entry validations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get entry validations'
      });
    }
  }

  async bulkValidate(req, res) {
    try {
      const { entries, decision, notes, validator } = req.body;

      if (!Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Entries array is required and cannot be empty'
        });
      }

      const results = [];
      
      for (const entryId of entries) {
        try {
          const validation = await prisma.validation.create({
            data: {
              entryId: parseInt(entryId),
              validator: validator || req.user?.address || 'anonymous',
              decision,
              notes: notes || `Bulk ${decision}`
            }
          });

          // Update entry status
          await prisma.entry.update({
            where: { id: parseInt(entryId) },
            data: { status: decision === 'approved' ? 'validated' : 'rejected' }
          });

          results.push({
            entryId,
            success: true,
            validationId: validation.id
          });
        } catch (error) {
          results.push({
            entryId,
            success: false,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        results,
        summary: {
          total: entries.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      });

    } catch (error) {
      console.error('Bulk validation error:', error);
      res.status(500).json({
        success: false,
        error: 'Bulk validation failed: ' + error.message
      });
    }
  }
}

module.exports = new ValidateController();