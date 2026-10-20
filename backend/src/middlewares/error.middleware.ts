import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error Middleware]:', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(status).json({
    error: message,
    codigo: err.code || 'INTERNAL_SERVER_ERROR',
  });
}
