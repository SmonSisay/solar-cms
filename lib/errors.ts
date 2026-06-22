import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: any;

  constructor(message: string, code = 'INTERNAL_SERVER_ERROR', statusCode = 500, details: any = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details: any = null) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }

  static fromZod(error: ZodError): ValidationError {
    const details = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return new ValidationError('Validation failed', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, 'CONFLICT', 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details: any = null) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, details);
  }
}

/**
 * Normalizes any caught error into a standardized AppError format.
 */
export function normalizeError(error: any): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return ValidationError.fromZod(error);
  }

  // Handle mongoose validation error if passed directly
  if (error?.name === 'ValidationError' && error?.errors) {
    const details = Object.keys(error.errors).map((key) => ({
      path: key,
      message: error.errors[key]?.message ?? 'Invalid field',
    }));
    return new ValidationError('Validation failed', details);
  }

  const message = error instanceof Error ? error.message : String(error);
  const isDev = process.env.NODE_ENV === 'development';
  return new InternalServerError(
    isDev ? message : 'An unexpected error occurred',
    isDev && error instanceof Error ? { stack: error.stack } : null
  );
}
