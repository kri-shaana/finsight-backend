import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/api-response';
import { env } from '../config/env';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Request error', {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
    error: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof AppError && err.isOperational) {
    sendError(res, err.message, err.code, err.statusCode);
    return;
  }

  sendError(res, 'Something went wrong', 'INTERNAL_SERVER_ERROR', 500);
}
