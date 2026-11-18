import { prisma } from '../../config/database';
import { getRedisClient } from '../../config/redis';

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  uptime: number;
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
  };
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const [dbStatus, redisStatus] = await Promise.all([checkDatabase(), checkRedis()]);

  const allUp = dbStatus === 'up' && redisStatus === 'up';

  return {
    status: allUp ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
    },
  };
}

async function checkDatabase(): Promise<'up' | 'down'> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'up';
  } catch {
    return 'down';
  }
}

async function checkRedis(): Promise<'up' | 'down'> {
  try {
    await getRedisClient().ping();
    return 'up';
  } catch {
    return 'down';
  }
}
