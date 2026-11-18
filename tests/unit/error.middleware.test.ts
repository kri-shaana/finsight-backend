import { Request, Response, NextFunction } from 'express';
import { errorMiddleware, AppError } from '../../src/middlewares/error.middleware';

const mockReq = (overrides = {}) =>
  ({ requestId: 'test-id', path: '/test', method: 'GET', ...overrides }) as Request;

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('errorMiddleware', () => {
  beforeEach(() => {
    process.env['NODE_ENV'] = 'test';
  });

  it('handles AppError with correct status and code', () => {
    const err = new AppError('Not found', 404, 'NOT_FOUND');
    const res = mockRes();

    errorMiddleware(err, mockReq(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'NOT_FOUND' }),
      }),
    );
  });

  it('returns 500 for unexpected errors without leaking details', () => {
    const err = new Error('DB connection string exposed');
    const res = mockRes();

    errorMiddleware(err, mockReq(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toBe('Something went wrong');
    expect(JSON.stringify(body)).not.toContain('DB connection string exposed');
  });
});
