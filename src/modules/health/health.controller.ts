import { Request, Response, NextFunction } from 'express';
import { getHealthStatus } from './health.service';
import { sendSuccess } from '../../utils/api-response';

export async function healthCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = await getHealthStatus();
    const httpStatus = status.status === 'healthy' ? 200 : 503;
    sendSuccess(res, status, 'Health check successful', httpStatus);
  } catch (err) {
    next(err);
  }
}
