const { ZodError } = require('zod');

/**
 * validate(schemaSpec)
 * schemaSpec: { body?: ZodTypeAny, params?: ZodTypeAny, query?: ZodTypeAny }
 */
module.exports = function validate(schemaSpec = {}) {
  return (req, res, next) => {
    try {
      if (schemaSpec.params) {
        req.params = schemaSpec.params.parse(req.params);
      }
      if (schemaSpec.query) {
        req.query = schemaSpec.query.parse(req.query);
      }
      if (schemaSpec.body) {
        req.body = schemaSpec.body.parse(req.body);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          issues: err.issues
        });
      }
      return next(err);
    }
  };
}
