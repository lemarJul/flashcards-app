const { httpStatusCodes } = require("../utils/utils");
const BaseError = require("./base-error");

class Api400Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    isOperational = true,
    description = "Bad Request"
  ) {
    super(name, statusCode, isOperational, description);
  }
}

class Api401Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNAUTHORIZED,
    isOperational = true,
    description = "Unauthorized"
  ) {
    super(name, statusCode, isOperational, description);
  }
}

class Api403Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.FORBIDDEN,
    isOperational = true,
    description = "Forbidden"
  ) {
    super(name, statusCode, isOperational, description);
  }
}

class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true,
    description = "Not Found"
  ) {
    super(name, statusCode, isOperational, description);
  }
}

class Api500Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true,
    description = "Internal Server Error"
  ) {
    super(name, statusCode, isOperational, description);
  }
};

module.exports = {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api500Error,
};