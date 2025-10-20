const CommunityService = require('../services/communityService');
const ResponseUtils = require('../utils/responseUtils');
const ValidationUtils = require('../utils/validationUtils');

class CommunityController {
  async createCommunity(req, res) {
    try {
      const { name, description, language, region, validators, rules } = req.body;

      if (!name) {
        return res.status(400).json(
          ResponseUtils.error('Community name is required')
        );
      }

      const community = await CommunityService.createCommunity({
        name,
        description,
        language,
        region,
        validators,
        rules
      });

      res.status(201).json(
        ResponseUtils.success(community, 'Community created successfully')
      );
    } catch (error) {
      res.status(400).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getCommunity(req, res) {
    try {
      const { name } = req.params;

      const community = await CommunityService.getCommunity(name);

      if (!community) {
        return res.status(404).json(
          ResponseUtils.notFound('Community')
        );
      }

      res.json(
        ResponseUtils.success(community)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getAllCommunities(req, res) {
    try {
      const communities = await CommunityService.getAllCommunities();

      res.json(
        ResponseUtils.success(communities)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async updateCommunity(req, res) {
    try {
      const { name } = req.params;
      const { description, language, region, validators, rules } = req.body;

      const community = await CommunityService.updateCommunity(name, {
        description,
        language,
        region,
        validators,
        rules
      });

      res.json(
        ResponseUtils.success(community, 'Community updated successfully')
      );
    } catch (error) {
      res.status(400).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async addValidator(req, res) {
    try {
      const { name } = req.params;
      const { validatorAddress } = req.body;

      if (!validatorAddress) {
        return res.status(400).json(
          ResponseUtils.error('Validator address is required')
        );
      }

      const community = await CommunityService.addValidator(name, validatorAddress);

      res.json(
        ResponseUtils.success(community, 'Validator added successfully')
      );
    } catch (error) {
      res.status(400).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async removeValidator(req, res) {
    try {
      const { name } = req.params;
      const { validatorAddress } = req.body;

      if (!validatorAddress) {
        return res.status(400).json(
          ResponseUtils.error('Validator address is required')
        );
      }

      const community = await CommunityService.removeValidator(name, validatorAddress);

      res.json(
        ResponseUtils.success(community, 'Validator removed successfully')
      );
    } catch (error) {
      res.status(400).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getCommunityValidators(req, res) {
    try {
      const { name } = req.params;

      const validators = await CommunityService.getCommunityValidators(name);

      res.json(
        ResponseUtils.success(validators)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async getCommunityStats(req, res) {
    try {
      const { name } = req.params;

      const stats = await CommunityService.getCommunityStats(name);

      res.json(
        ResponseUtils.success(stats)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async validateCommunityRules(req, res) {
    try {
      const { name } = req.params;
      const { entry } = req.body;

      if (!entry) {
        return res.status(400).json(
          ResponseUtils.error('Entry data is required')
        );
      }

      const validation = await CommunityService.validateCommunityRules(entry, name);

      res.json(
        ResponseUtils.success(validation)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async searchCommunities(req, res) {
    try {
      const { q, language, region, page = 1, limit = 20 } = req.query;

      const filters = {
        language,
        region,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      };

      const communities = await CommunityService.searchCommunities(q, filters);

      res.json(
        ResponseUtils.success(communities)
      );
    } catch (error) {
      res.status(500).json(
        ResponseUtils.error(error.message)
      );
    }
  }

  async deleteCommunity(req, res) {
    try {
      const { name } = req.params;

      await CommunityService.deleteCommunity(name);

      res.json(
        ResponseUtils.success(null, 'Community deleted successfully')
      );
    } catch (error) {
      res.status(400).json(
        ResponseUtils.error(error.message)
      );
    }
  }
}

module.exports = new CommunityController();