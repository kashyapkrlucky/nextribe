export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export class ApiError extends BaseError {
  constructor(
    name: string,
    statusCode: number = 500,
    message: string = 'Internal Server Error',
    isOperational: boolean = true
  ) {
    super(name, statusCode, message, isOperational);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super('NOT_FOUND', 404, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super('VALIDATION_ERROR', 400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message);
  }
}
