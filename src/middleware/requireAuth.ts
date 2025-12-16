import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError";
import { verifyToken } from "../lib/jwt";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Unauthorized");
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyToken<{ userId: number; email: string }>(token);

  (req as Request & { user?: unknown }).user = payload;
  next();
};

export const requireAuthForWrite = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  try {
    requireAuth(req, res, next);
  } catch (err) {
    next(err);
  }
};
