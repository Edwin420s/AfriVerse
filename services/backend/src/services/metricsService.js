const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CacheService = require('./cacheService');
const logger = require('../utils/logger');

/**
 * MetricsService
 *
 * Provides system-wide metrics aggregations for AfriVerse including:
 * - Entry counts by status and daily/weekly trends
 * - Validation counts and approval rates
 * - Community activity and top communities
 * - Recent activity streams (entries, validations)
 * - Basic system info and cache health
 *
 * Methods support caching via `CacheService` to reduce DB load.
 */
class MetricsService {
  /**
   * Aggregate and cache high-level system metrics.
   *
   * Returns an object containing:
   * - timestamp: ISO timestamp of metrics generation
   * - entries: Entry metrics (see `getEntryMetrics`)
   * - validations: Validation metrics (see `getValidationMetrics`)
   * - communities: Community metrics (see `getCommunityMetrics`)
   * - activity: Recent activity streams (see `getRecentActivity`)
   * - system: Basic system info and cache health (see `getSystemInfo`)
   */
  async getSystemMetrics() {
    try {
      const cacheKey = 'metrics:system';
      const cached = await CacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const [
        entryCounts,
        validationCounts,
        communityCounts,
        recentActivity
      ] = await Promise.all([
        this.getEntryMetrics(),
        this.getValidationMetrics(),
        this.getCommunityMetrics(),
        this.getRecentActivity()
      ]);

      const metrics = {
        timestamp: new Date().toISOString(),
        entries: entryCounts,
        validations: validationCounts,
        communities: communityCounts,
        activity: recentActivity,
        system: await this.getSystemInfo()
      };

      await CacheService.set(cacheKey, metrics, 300); // Cache for 5 minutes
      return metrics;
    } catch (error) {
      logger.error('System metrics error:', error);
      throw new Error(`Failed to get system metrics: ${error.message}`);
    }
  }

  /**
   * Compute entry metrics: byStatus, dailySubmissions, weeklyTrend, avgProcessingTime.
   *
   * Returns an object containing:
   * - total: Total number of entries
   * - byStatus: Entry counts by status
   * - dailySubmissions: Number of entries submitted today
   * - weeklyTrend: Number of entries submitted this week
   * - avgProcessingTime: Average time from submission to validation
   */
  async getEntryMetrics() {
    const counts = await prisma.entry.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const total = counts.reduce((sum, stat) => sum + stat._count.id, 0);
    const byStatus = counts.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {});

    // Get daily submissions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailySubmissions = await prisma.entry.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Get weekly trend
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyTrend = await prisma.entry.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    });

    return {
      total,
      byStatus,
      dailySubmissions,
      weeklyTrend,
      avgProcessingTime: await this.getAverageProcessingTime()
    };
  }

  /**
   * Compute validation metrics including approval rate and top validators.
   *
   * Returns an object containing:
   * - total: Total number of validations
   * - byDecision: Validation counts by decision
   * - approvalRate: Approval rate (approved / total)
   * - validatorStats: Top 10 validators by validation count
   */
  async getValidationMetrics() {
    const counts = await prisma.validation.groupBy({
      by: ['decision'],
      _count: { id: true }
    });

    const total = counts.reduce((sum, stat) => sum + stat._count.id, 0);
    const byDecision = counts.reduce((acc, stat) => {
      acc[stat.decision] = stat._count.id;
      return acc;
    }, {});

    // Get validator performance
    const validatorStats = await prisma.validation.groupBy({
      by: ['validator'],
      _count: { id: true },
      _avg: { /* would need a confidence field */ }
    });

    return {
      total,
      byDecision,
      approvalRate: total > 0 ? (byDecision.approved || 0) / total : 0,
      validatorStats: validatorStats.slice(0, 10) // Top 10 validators
    };
  }

  /**
   * Aggregate per-community activity and totals.
   *
   * Returns an object containing:
   * - totalCommunities: Total number of communities
   * - activeCommunities: Number of communities with activity
   * - totalEntries: Total number of entries across all communities
   * - communities: Top 10 communities by entry count
   */
  async getCommunityMetrics() {
    const communityStats = await prisma.entry.groupBy({
      by: ['community'],
      _count: { id: true }
    });

    const activeCommunities = communityStats.length;
    const totalEntries = communityStats.reduce((sum, stat) => sum + stat._count.id, 0);

    return {
      totalCommunities: await prisma.community.count(),
      activeCommunities,
      totalEntries,
      communities: communityStats.sort((a, b) => b._count.id - a._count.id).slice(0, 10)
    };
  }

  /**
   * Fetch recent entries and validations for activity feeds.
   *
   * Returns an object containing:
   * - recentEntries: Recent entries (id, title, status, community, createdAt)
   * - recentValidations: Recent validations (id, entry title, community, createdAt)
   */
  async getRecentActivity() {
    const recentEntries = await prisma.entry.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        community: true,
        createdAt: true
      }
    });

    const recentValidations = await prisma.validation.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        entry: {
          select: {
            title: true,
            community: true
          }
        }
      }
    });

    return {
      recentEntries,
      recentValidations
    };
  }

  async getAverageProcessingTime() {
    // Calculate average time from submission to validation
    const validatedEntries = await prisma.entry.findMany({
      where: {
        status: 'validated',
        validations: {
          some: {}
        }
      },
      include: {
        validations: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      },
      take: 100 // Sample size
    });

    if (validatedEntries.length === 0) {
      return 0;
    }

    const totalTime = validatedEntries.reduce((sum, entry) => {
      if (entry.validations.length > 0) {
        const processingTime = entry.validations[0].createdAt - entry.createdAt;
        return sum + processingTime;
      }
      return sum;
    }, 0);

    return totalTime / validatedEntries.length;
  }

  async getSystemInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      redis: await CacheService.health(),
      database: await this.getDatabaseHealth(),
      timestamp: new Date().toISOString()
    };
  }

  async getDatabaseHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', message: 'Database is responding' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }

  async getUserMetrics(userAddress) {
    try {
      const [userEntries, userValidations] = await Promise.all([
        prisma.entry.findMany({
          where: { submitter: userAddress },
          select: {
            id: true,
            title: true,
            status: true,
            community: true,
            createdAt: true
          }
        }),
        prisma.validation.findMany({
          where: { validator: userAddress },
          include: {
            entry: {
              select: {
                title: true,
                community: true
              }
            }
          }
        })
      ]);

      const entryStats = userEntries.reduce((stats, entry) => {
        stats.total++;
        stats[entry.status] = (stats[entry.status] || 0) + 1;
        return stats;
      }, { total: 0 });

      const validationStats = userValidations.reduce((stats, validation) => {
        stats.total++;
        stats[validation.decision] = (stats[validation.decision] || 0) + 1;
        return stats;
      }, { total: 0 });

      return {
        user: userAddress,
        entries: {
          stats: entryStats,
          recent: userEntries.slice(0, 5)
        },
        validations: {
          stats: validationStats,
          recent: userValidations.slice(0, 5)
        },
        reputation: await this.calculateReputation(userAddress)
      };
    } catch (error) {
      logger.error('User metrics error:', error);
      throw new Error(`Failed to get user metrics: ${error.message}`);
    }
  }

  async calculateReputation(userAddress) {
    // Simple reputation calculation
    const [entries, validations] = await Promise.all([
      prisma.entry.count({
        where: { 
          submitter: userAddress,
          status: 'validated'
        }
      }),
      prisma.validation.count({
        where: { 
          validator: userAddress,
          decision: 'approved'
        }
      })
    ]);

    const entryScore = entries * 10; // 10 points per validated entry
    const validationScore = validations * 5; // 5 points per approved validation

    return {
      score: entryScore + validationScore,
      breakdown: {
        entries: entryScore,
        validations: validationScore
      },
      level: this.getReputationLevel(entryScore + validationScore)
    };
  }

  getReputationLevel(score) {
    if (score >= 1000) return 'elder';
    if (score >= 500) return 'senior';
    if (score >= 100) return 'contributor';
    if (score >= 10) return 'member';
    return 'newcomer';
  }

  async getQueueMetrics() {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      const [transcriptionMetrics, symbolizationMetrics] = await Promise.all([
        redis.get('queue:transcription:metrics'),
        redis.get('queue:symbolize:metrics')
      ]);

      await redis.quit();

      return {
        transcription: transcriptionMetrics ? JSON.parse(transcriptionMetrics) : {},
        symbolization: symbolizationMetrics ? JSON.parse(symbolizationMetrics) : {}
      };
    } catch (error) {
      logger.error('Queue metrics error:', error);
      return { transcription: {}, symbolization: {} };
    }
  }

  async exportMetrics(format = 'json') {
    const metrics = await this.getSystemMetrics();
    const queueMetrics = await this.getQueueMetrics();

    const fullMetrics = {
      ...metrics,
      queues: queueMetrics,
      exportTime: new Date().toISOString()
    };

    if (format === 'csv') {
      return this.convertToCSV(fullMetrics);
    }

    return fullMetrics;
  }

  convertToCSV(metrics) {
    // Simple CSV conversion for key metrics
    const rows = [];
    
    // Basic stats
    rows.push('Metric,Value');
    rows.push(`Total Entries,${metrics.entries.total}`);
    rows.push(`Pending Entries,${metrics.entries.byStatus.pending || 0}`);
    rows.push(`Validated Entries,${metrics.entries.byStatus.validated || 0}`);
    rows.push(`Daily Submissions,${metrics.entries.dailySubmissions}`);
    rows.push(`Approval Rate,${(metrics.validations.approvalRate * 100).toFixed(2)}%`);
    
    return rows.join('\n');
  }
}

module.exports = new MetricsService();