import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  bio: z.string().optional(),
  profile: z.string().url().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  bio: z.string().optional(),
  profile: z.string().url().optional(),
});
