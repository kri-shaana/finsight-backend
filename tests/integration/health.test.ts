import request from 'supertest';
import app from '../../src/app';

// Mock external dependencies so tests run without real DB/Redis
jest.mock('../../src/modules/health/health.service', () => ({
  getHealthStatus: jest.fn().mockResolvedValue({
    status: 'healthy',
    uptime: 100,
    timestamp: '2024-01-01T00:00:00.000Z',
    services: { database: 'up', redis: 'up' },
  }),
}));

describe('GET /api/v1/health', () => {
  it('returns 200 with healthy status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Health check successful');
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.services.database).toBe('up');
    expect(res.body.data.services.redis).toBe('up');
  });

  it('sets X-Request-Id header', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('respects incoming X-Request-Id', async () => {
    const id = 'test-request-id-123';
    const res = await request(app).get('/api/v1/health').set('X-Request-Id', id);
    expect(res.headers['x-request-id']).toBe(id);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
