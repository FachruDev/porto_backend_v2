import type { NextFunction, Request, Response } from "express";

export const asyncHandler =
  <TRequest extends Request = Request, TResponse extends Response = Response>(
    handler: (req: TRequest, res: TResponse, next: NextFunction) => Promise<unknown> | unknown,
  ) =>
  (req: TRequest, res: TResponse, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
