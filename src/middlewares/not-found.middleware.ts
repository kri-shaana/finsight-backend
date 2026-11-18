import { Request, Response } from 'express';
import { sendError } from '../utils/api-response';

export function notFoundMiddleware(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND', 404);
}
