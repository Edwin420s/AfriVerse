const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const mettaService = require('../services/mettaService');

class EntryController {
  async getEntry(req, res) {
    try {
      const { id } = req.params;

      const entry = await prisma.entry.findUnique({
        where: { id: parseInt(id) },
        include: {
          validations: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }

      // Generate reasoning trace if atoms exist
      let reasoningTrace = [];
      if (entry.atoms && entry.atoms.length > 0) {
        reasoningTrace = await this.generateReasoningTrace(entry.atoms);
      }

      res.json({
        success: true,
        entry: {
          ...entry,
          reasoningTrace
        }
      });

    } catch (error) {
      console.error('Get entry error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get entry'
      });
    }
  }

  async listEntries(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        community,
        language 
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      if (status) where.status = status;
      if (community) where.community = community;
      if (language) where.language = language;

      const [entries, total] = await Promise.all([
        prisma.entry.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            validations: {
              select: {
                decision: true,
                createdAt: true
              }
            }
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
      console.error('List entries error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list entries'
      });
    }
  }

  async searchEntries(req, res) {
    try {
      const { q, type, community, page = 1, limit = 20 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "q" is required'
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Search in transcripts and titles
      const where = {
        OR: [
          {
            transcript: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            title: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      };

      if (type) where.status = type;
      if (community) where.community = community;

      const [entries, total] = await Promise.all([
        prisma.entry.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'desc'
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
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed'
      });
    }
  }

  async queryKnowledge(req, res) {
    try {
      const { query, context = {} } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required'
        });
      }

      // Get relevant entries based on query
      const relevantEntries = await this.findRelevantEntries(query);
      
      // Extract atoms from relevant entries
      const allAtoms = relevantEntries.flatMap(entry => entry.atoms || []);
      
      // Use MeTTa service to process query
      const mettaResult = await mettaService.generateInference(allAtoms, query);

      // Generate human-readable answer
      const answer = await this.generateAnswer(mettaResult, query, context);

      res.json({
        success: true,
        answer: answer.text,
        reasoningTrace: answer.reasoningTrace,
        sources: relevantEntries.map(entry => ({
          id: entry.id,
          title: entry.title,
          community: entry.community,
          confidence: 0.8 // This would be calculated based on relevance
        })),
        confidence: answer.confidence,
        rawInferences: mettaResult
      });

    } catch (error) {
      console.error('Knowledge query error:', error);
      res.status(500).json({
        success: false,
        error: 'Knowledge query failed: ' + error.message
      });
    }
  }

  async findRelevantEntries(query) {
    // Simple keyword-based relevance matching
    // In production, this would use vector similarity search
    const keywords = query.toLowerCase().split(' ');
    
    const entries = await prisma.entry.findMany({
      where: {
        OR: [
          {
            transcript: {
              contains: keywords[0],
              mode: 'insensitive'
            }
          },
          {
            title: {
              contains: keywords[0],
              mode: 'insensitive'
            }
          }
        ],
        status: 'validated'
      },
      take: 10
    });

    return entries;
  }

  async generateReasoningTrace(atoms) {
    const trace = [];
    
    atoms.forEach(atom => {
      trace.push({
        step: trace.length + 1,
        type: 'fact',
        content: atom,
        confidence: 1.0
      });
    });

    // Add inference steps
    if (atoms.some(atom => atom.includes('treats'))) {
      trace.push({
        step: trace.length + 1,
        type: 'inference',
        content: 'Based on treatment relationships, identified medicinal uses',
        confidence: 0.9
      });
    }

    return trace;
  }

  async generateAnswer(inferences, query, context) {
    // Simple answer generation
    // In production, this would use an LLM
    let answer = "I found some relevant cultural knowledge:";
    let confidence = 0.7;

    if (inferences.length > 0) {
      inferences.forEach(inference => {
        answer += `\n- ${inference.plant} is used to treat ${inference.condition}`;
      });
      confidence = 0.85;
    } else {
      answer = "I couldn't find specific information about that in our cultural knowledge base. This knowledge might not be recorded yet.";
      confidence = 0.3;
    }

    return {
      text: answer,
      reasoningTrace: inferences,
      confidence
    };
  }

  async getCommunityStats(req, res) {
    try {
      const stats = await prisma.entry.groupBy({
        by: ['community', 'status'],
        _count: {
          id: true
        }
      });

      const communityStats = {};
      stats.forEach(stat => {
        if (!communityStats[stat.community]) {
          communityStats[stat.community] = {
            total: 0,
            pending: 0,
            validated: 0,
            rejected: 0
          };
        }
        communityStats[stat.community].total += stat._count.id;
        communityStats[stat.community][stat.status] = stat._count.id;
      });

      res.json({
        success: true,
        stats: communityStats
      });

    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get community stats'
      });
    }
  }
}

module.exports = new EntryController();