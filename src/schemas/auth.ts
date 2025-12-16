import { userCreateSchema } from "./user";
import { z } from "zod";

export const authRegisterSchema = userCreateSchema;

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
