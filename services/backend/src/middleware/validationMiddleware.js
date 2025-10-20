const ValidationUtils = require('../utils/validationUtils');
const ResponseUtils = require('../utils/responseUtils');

const validateSubmitEntry = (req, res, next) => {
  const schema = ValidationUtils.submitEntrySchema();
  const { valid, errors } = ValidationUtils.validate(schema, req.body);
  
  if (!valid) {
    return res.status(400).json(ResponseUtils.validationError(errors));
  }
  
  // Validate file
  const fileValidation = ValidationUtils.validateFile(
    req.file,
    ['audio/', 'video/', 'text/plain'],
    50 * 1024 * 1024 // 50MB
  );
  
  if (!fileValidation.valid) {
    return res.status(400).json(ResponseUtils.validationError(fileValidation.errors));
  }
  
  next();
};

const validateValidation = (req, res, next) => {
  const schema = ValidationUtils.validationSchema();
  const { valid, errors } = ValidationUtils.validate(schema, req.body);
  
  if (!valid) {
    return res.status(400).json(ResponseUtils.validationError(errors));
  }
  
  next();
};

const validateQuery = (req, res, next) => {
  const schema = ValidationUtils.querySchema();
  const { valid, errors } = ValidationUtils.validate(schema, req.body);
  
  if (!valid) {
    return res.status(400).json(ResponseUtils.validationError(errors));
  }
  
  next();
};

const validatePagination = (req, res, next) => {
  const schema = ValidationUtils.paginationSchema();
  const { valid, errors } = ValidationUtils.validate(schema, req.query);
  
  if (!valid) {
    return res.status(400).json(ResponseUtils.validationError(errors));
  }
  
  // Set validated query parameters
  req.validatedQuery = { ...req.query, ...(valid ? schema.value : {}) };
  next();
};

const validateAtoms = (req, res, next) => {
  const { atoms } = req.body;
  
  if (!atoms || !Array.isArray(atoms)) {
    return res.status(400).json(
      ResponseUtils.error('Atoms must be provided as an array')
    );
  }
  
  const validation = ValidationUtils.validateAtoms(atoms);
  
  if (!validation.valid) {
    return res.status(400).json(
      ResponseUtils.validationError(validation.errors)
    );
  }
  
  // Replace with validated atoms
  req.body.atoms = validation.validAtoms;
  next();
};

module.exports = {
  validateSubmitEntry,
  validateValidation,
  validateQuery,
  validatePagination,
  validateAtoms
};