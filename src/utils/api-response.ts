import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  const body: SuccessResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 500,
  details?: unknown,
): void {
  const body: ErrorResponse = {
    success: false,
    message,
    error: { code, ...(details !== undefined ? { details } : {}) },
  };
  res.status(statusCode).json(body);
}
