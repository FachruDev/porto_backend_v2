import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../lib/httpError";
import { signToken } from "../lib/jwt";
import { hashPassword, verifyPassword } from "../lib/password";

const serializeUser = (user: { password: string; [key: string]: unknown }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

export const register = async (req: Request, res: Response) => {
  const payload = req.body as { name: string; email: string; password: string; bio?: string; profile?: string };

  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const hashed = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: { name: payload.name, email: payload.email, password: hashed, bio: payload.bio, profile: payload.profile },
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ user: serializeUser(user), token });
};

export const login = async (req: Request, res: Response) => {
  const payload = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await verifyPassword(payload.password, user.password);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ user: serializeUser(user), token });
};

export const logout = async (_req: Request, res: Response) => {
  // Stateless JWT: client drops token to logout.
  res.json({ message: "Logged out" });
};
