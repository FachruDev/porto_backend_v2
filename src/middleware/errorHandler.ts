import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/httpError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = err instanceof HttpError ? err.status : 500;

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: err.issues,
    });
  }

  // Avoid leaking internal errors to clients
  const message =
    err instanceof HttpError
      ? err.message
      : "Unexpected error, please try again or contact support.";

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(status).json({ message });
};
