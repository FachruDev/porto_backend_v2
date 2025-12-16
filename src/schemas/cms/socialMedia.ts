import { z } from "zod";

const orderField = z.coerce.number().int().nonnegative().optional();

export const socialCreateSchema = z.object({
  logo: z.string().optional(),
  link: z.string().min(1),
  title: z.string().min(1),
  order: orderField,
});
export const socialUpdateSchema = socialCreateSchema.partial();