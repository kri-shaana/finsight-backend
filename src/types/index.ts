import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export interface AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}

export type { Request };
