// Runs inside each Jest worker before any module is imported.
// This ensures env validation in src/config/env.ts does not call process.exit.
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/finsight_test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['CORS_ORIGIN'] = 'http://localhost:5173';
