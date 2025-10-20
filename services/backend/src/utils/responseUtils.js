class ResponseUtils {
  static success(data = null, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static error(message = 'Error', details = null, code = 'ERROR') {
    return {
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString()
      }
    };
  }

  static paginated(data, pagination) {
    return {
      success: true,
      data,
      pagination,
      timestamp: new Date().toISOString()
    };
  }

  static validationError(errors) {
    return this.error(
      'Validation failed',
      errors,
      'VALIDATION_ERROR'
    );
  }

  static notFound(resource = 'Resource') {
    return this.error(
      `${resource} not found`,
      null,
      'NOT_FOUND'
    );
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(
      message,
      null,
      'UNAUTHORIZED'
    );
  }

  static forbidden(message = 'Forbidden') {
    return this.error(
      message,
      null,
      'FORBIDDEN'
    );
  }

  static rateLimit(message = 'Too many requests') {
    return this.error(
      message,
      null,
      'RATE_LIMIT_EXCEEDED'
    );
  }
}

module.exports = ResponseUtils;