const Joi = require('joi');

class ValidationUtils {
  static submitEntrySchema() {
    return Joi.object({
      title: Joi.string().max(255).optional(),
      language: Joi.string().max(10).default('sw'),
      license: Joi.string().valid(
        'CC-BY-4.0',
        'CC-BY-NC-4.0', 
        'CC-BY-SA-4.0',
        'Community-Only'
      ).default('CC-BY-NC-4.0'),
      consent: Joi.boolean().required().valid(true),
      community: Joi.string().max(100).default('general'),
      metadata: Joi.object().optional()
    });
  }

  static validationSchema() {
    return Joi.object({
      decision: Joi.string().valid('approved', 'rejected').required(),
      notes: Joi.string().max(1000).optional(),
      validator: Joi.string().optional()
    });
  }

  static querySchema() {
    return Joi.object({
      query: Joi.string().min(1).max(1000).required(),
      context: Joi.object().optional()
    });
  }

  static paginationSchema() {
    return Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      status: Joi.string().optional(),
      community: Joi.string().optional(),
      language: Joi.string().optional()
    });
  }

  static validate(schema, data) {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return { valid: false, errors };
    }

    return { valid: true, data: value };
  }

  static validateFile(file, allowedTypes, maxSize) {
    const errors = [];

    if (!file) {
      errors.push('File is required');
      return { valid: false, errors };
    }

    // Check file type
    const mimeType = file.mimetype;
    const isAllowed = allowedTypes.some(type => mimeType.includes(type));
    if (!isAllowed) {
      errors.push(`File type ${mimeType} is not allowed`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateAtoms(atoms) {
    const errors = [];
    const validAtoms = [];

    if (!Array.isArray(atoms)) {
      errors.push('Atoms must be an array');
      return { valid: false, errors, validAtoms };
    }

    atoms.forEach((atom, index) => {
      if (typeof atom !== 'string') {
        errors.push(`Atom at index ${index} must be a string`);
        return;
      }

      if (!atom.startsWith('(') || !atom.endsWith(')')) {
        errors.push(`Atom at index ${index} must be enclosed in parentheses`);
        return;
      }

      const content = atom.slice(1, -1).trim();
      if (content.length === 0) {
        errors.push(`Atom at index ${index} is empty`);
        return;
      }

      const parts = content.split(' ');
      if (parts.length < 2) {
        errors.push(`Atom at index ${index} must have at least 2 parts`);
        return;
      }

      validAtoms.push(atom);
    });

    return {
      valid: errors.length === 0,
      errors,
      validAtoms,
      validCount: validAtoms.length
    };
  }
}

module.exports = ValidationUtils;