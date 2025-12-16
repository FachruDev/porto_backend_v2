import { z } from "zod";

const orderField = z.coerce.number().int().nonnegative().optional();
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers, and dashes only");

  
export const contactFormCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  description: z.string().min(1),
});