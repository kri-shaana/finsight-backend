import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { globalRateLimit } from './middlewares/rate-limit.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import v1Routes from './routes/v1/index';
import { logger } from './utils/logger';

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Rate limiting
app.use(globalRateLimit);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request tracing
app.use(requestIdMiddleware);

// HTTP logging (skip in test)
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    }),
  );
}

// API routes
app.use('/api/v1', v1Routes);

// 404 and error handling (must be last)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
