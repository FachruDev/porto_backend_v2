import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../lib/httpError";
import { hashPassword } from "../lib/password";
import { toId } from "./cms/helpers";

type AuthPayload = { userId: number; email?: string };

const serializeUser = (user: { password: string; [key: string]: unknown }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

const getAuth = (req: Request) => {
  const user = (req as Request & { user?: AuthPayload }).user;
  if (!user?.userId) {
    throw new HttpError(401, "Unauthorized");
  }
  return user;
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(users.map(serializeUser));
};

export const getMe = async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json(serializeUser(user));
};

export const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: toId(req.params.id) } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json(serializeUser(user));
};

export const createUser = async (req: Request, res: Response) => {
  const payload = req.body as {
    name: string;
    email: string;
    password: string;
    bio?: string;
    profile?: string;
  };

  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const hashed = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: { name: payload.name, email: payload.email, password: hashed, bio: payload.bio, profile: payload.profile },
  });

  res.status(201).json(serializeUser(user));
};

export const updateUser = async (req: Request, res: Response) => {
  const id = toId(req.params.id);
  const payload = req.body as {
    name?: string;
    email?: string;
    password?: string;
    bio?: string;
    profile?: string;
  };

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, "User not found");
  }

  if (payload.email && payload.email !== existing.email) {
    const duplicate = await prisma.user.findUnique({ where: { email: payload.email } });
    if (duplicate) {
      throw new HttpError(409, "Email already registered");
    }
  }

  const hashed = payload.password ? await hashPassword(payload.password) : undefined;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      email: payload.email,
      password: hashed,
      bio: payload.bio,
      profile: payload.profile,
    },
  });

  res.json(serializeUser(user));
};

export const updateMe = async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const payload = req.body as {
    name?: string;
    email?: string;
    password?: string;
    bio?: string;
    profile?: string;
  };

  const existing = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!existing) {
    throw new HttpError(404, "User not found");
  }

  if (payload.email && payload.email !== existing.email) {
    const duplicate = await prisma.user.findUnique({ where: { email: payload.email } });
    if (duplicate) {
      throw new HttpError(409, "Email already registered");
    }
  }

  const hashed = payload.password ? await hashPassword(payload.password) : undefined;

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: {
      name: payload.name,
      email: payload.email,
      password: hashed,
      bio: payload.bio,
      profile: payload.profile,
    },
  });

  res.json(serializeUser(user));
};

export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};
