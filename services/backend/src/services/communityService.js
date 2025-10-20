const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CacheService = require('./cacheService');
const logger = require('../utils/logger');

class CommunityService {
  async createCommunity(data) {
    try {
      const community = await prisma.community.create({
        data: {
          name: data.name,
          description: data.description,
          language: data.language || 'sw',
          region: data.region,
          validators: data.validators || [],
          rules: data.rules || {}
        }
      });

      // Clear community cache
      await CacheService.del('communities:all');
      
      logger.info(`Community created: ${community.name}`);
      return community;
    } catch (error) {
      logger.error('Community creation error:', error);
      throw new Error(`Failed to create community: ${error.message}`);
    }
  }

  async getCommunity(name) {
    try {
      const cacheKey = `community:${name}`;
      const cached = await CacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const community = await prisma.community.findUnique({
        where: { name }
      });

      if (community) {
        await CacheService.set(cacheKey, community, 3600); // Cache for 1 hour
      }

      return community;
    } catch (error) {
      logger.error('Community fetch error:', error);
      throw new Error(`Failed to fetch community: ${error.message}`);
    }
  }

  async getAllCommunities() {
    try {
      const cacheKey = 'communities:all';
      const cached = await CacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const communities = await prisma.community.findMany({
        orderBy: { name: 'asc' }
      });

      await CacheService.set(cacheKey, communities, 1800); // Cache for 30 minutes
      return communities;
    } catch (error) {
      logger.error('Communities fetch error:', error);
      throw new Error(`Failed to fetch communities: ${error.message}`);
    }
  }

  async updateCommunity(name, data) {
    try {
      const community = await prisma.community.update({
        where: { name },
        data: {
          description: data.description,
          language: data.language,
          region: data.region,
          validators: data.validators,
          rules: data.rules,
          updatedAt: new Date()
        }
      });

      // Clear cache
      await CacheService.del(`community:${name}`);
      await CacheService.del('communities:all');

      logger.info(`Community updated: ${name}`);
      return community;
    } catch (error) {
      logger.error('Community update error:', error);
      throw new Error(`Failed to update community: ${error.message}`);
    }
  }

  async addValidator(communityName, validatorAddress) {
    try {
      const community = await prisma.community.findUnique({
        where: { name: communityName }
      });

      if (!community) {
        throw new Error('Community not found');
      }

      const validators = community.validators || [];
      if (!validators.includes(validatorAddress)) {
        validators.push(validatorAddress);
      }

      const updatedCommunity = await prisma.community.update({
        where: { name: communityName },
        data: { validators }
      });

      // Clear cache
      await CacheService.del(`community:${communityName}`);
      await CacheService.del('communities:all');

      logger.info(`Validator added to ${communityName}: ${validatorAddress}`);
      return updatedCommunity;
    } catch (error) {
      logger.error('Add validator error:', error);
      throw new Error(`Failed to add validator: ${error.message}`);
    }
  }

  async removeValidator(communityName, validatorAddress) {
    try {
      const community = await prisma.community.findUnique({
        where: { name: communityName }
      });

      if (!community) {
        throw new Error('Community not found');
      }

      const validators = (community.validators || []).filter(
        addr => addr !== validatorAddress
      );

      const updatedCommunity = await prisma.community.update({
        where: { name: communityName },
        data: { validators }
      });

      // Clear cache
      await CacheService.del(`community:${communityName}`);
      await CacheService.del('communities:all');

      logger.info(`Validator removed from ${communityName}: ${validatorAddress}`);
      return updatedCommunity;
    } catch (error) {
      logger.error('Remove validator error:', error);
      throw new Error(`Failed to remove validator: ${error.message}`);
    }
  }

  async getCommunityValidators(communityName) {
    try {
      const cacheKey = `community:${communityName}:validators`;
      const cached = await CacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const community = await prisma.community.findUnique({
        where: { name: communityName },
        select: { validators: true }
      });

      const validators = community ? community.validators : [];
      await CacheService.set(cacheKey, validators, 1800); // Cache for 30 minutes

      return validators;
    } catch (error) {
      logger.error('Community validators fetch error:', error);
      throw new Error(`Failed to fetch community validators: ${error.message}`);
    }
  }

  async getCommunityStats(communityName) {
    try {
      const cacheKey = `community:${communityName}:stats`;
      const cached = await CacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const [entryStats, validationStats] = await Promise.all([
        prisma.entry.groupBy({
          by: ['status'],
          where: { community: communityName },
          _count: { id: true }
        }),
        prisma.validation.groupBy({
          by: ['decision'],
          where: {
            entry: {
              community: communityName
            }
          },
          _count: { id: true }
        })
      ]);

      const stats = {
        totalEntries: entryStats.reduce((sum, stat) => sum + stat._count.id, 0),
        entriesByStatus: entryStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {}),
        validationsByDecision: validationStats.reduce((acc, stat) => {
          acc[stat.decision] = stat._count.id;
          return acc;
        }, {}),
        lastUpdated: new Date().toISOString()
      };

      await CacheService.set(cacheKey, stats, 900); // Cache for 15 minutes
      return stats;
    } catch (error) {
      logger.error('Community stats fetch error:', error);
      throw new Error(`Failed to fetch community stats: ${error.message}`);
    }
  }

  async validateCommunityRules(entry, communityName) {
    try {
      const community = await this.getCommunity(communityName);
      if (!community) {
        return { valid: false, errors: ['Community not found'] };
      }

      const rules = community.rules || {};
      const errors = [];

      // Validate language
      if (rules.allowedLanguages && rules.allowedLanguages.length > 0) {
        if (!rules.allowedLanguages.includes(entry.language)) {
          errors.push(`Language ${entry.language} not allowed in this community`);
        }
      }

      // Validate content types
      if (rules.allowedContentTypes && rules.allowedContentTypes.length > 0) {
        // This would check the actual file type
        // For now, we'll assume it's validated elsewhere
      }

      // Validate minimum validators
      if (rules.minValidators && rules.minValidators > 0) {
        const validatorCount = community.validators ? community.validators.length : 0;
        if (validatorCount < rules.minValidators) {
          errors.push(`Community requires at least ${rules.minValidators} validators`);
        }
      }

      // Validate sensitive content
      if (rules.restrictSensitiveContent) {
        const sensitiveTerms = rules.sensitiveTerms || [];
        const content = `${entry.title} ${entry.transcript}`.toLowerCase();
        
        for (const term of sensitiveTerms) {
          if (content.includes(term.toLowerCase())) {
            errors.push(`Content contains restricted term: ${term}`);
            break;
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        rules
      };
    } catch (error) {
      logger.error('Community rules validation error:', error);
      return { valid: false, errors: [error.message] };
    }
  }

  async searchCommunities(query, filters = {}) {
    try {
      const where = {};
      
      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ];
      }
      
      if (filters.language) {
        where.language = filters.language;
      }
      
      if (filters.region) {
        where.region = filters.region;
      }

      const communities = await prisma.community.findMany({
        where,
        orderBy: { name: 'asc' },
        take: filters.limit || 50,
        skip: filters.offset || 0
      });

      return communities;
    } catch (error) {
      logger.error('Community search error:', error);
      throw new Error(`Failed to search communities: ${error.message}`);
    }
  }

  async deleteCommunity(name) {
    try {
      // Check if community has entries
      const entryCount = await prisma.entry.count({
        where: { community: name }
      });

      if (entryCount > 0) {
        throw new Error('Cannot delete community with existing entries');
      }

      await prisma.community.delete({
        where: { name }
      });

      // Clear cache
      await CacheService.del(`community:${name}`);
      await CacheService.del('communities:all');

      logger.info(`Community deleted: ${name}`);
      return true;
    } catch (error) {
      logger.error('Community deletion error:', error);
      throw new Error(`Failed to delete community: ${error.message}`);
    }
  }
}

module.exports = new CommunityService();