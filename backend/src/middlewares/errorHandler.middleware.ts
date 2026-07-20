import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';

// This error-handling middleware must be registered LAST in app.ts, after all routes.
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: 'Internal server error'
  });
};
