export class AppError extends Error {
  public readonly isAppError = true;

  // noinspection JSUnusedGlobalSymbols
  constructor(
    public statusCode: number,
    message: string,
    public success: boolean = false,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
  static isAppError(error: any): error is AppError {
    return error && error.isAppError === true;
  }
}

export class RequestError extends AppError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(409, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}
