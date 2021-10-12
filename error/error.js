// source: https://www.youtube.com/watch?v=DyqVqaf1KnA

class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static methodNotAllowed(message) {
    return new ApiError(405, message);
  }

  static notAcceptable(message) {
    return new ApiError(406, message);
  }

  static unsupportedMediaType(message) {
    return new ApiError(415, message);
  }

  static internalError(message) {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
