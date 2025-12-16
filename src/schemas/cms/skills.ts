import { SkillLevel } from "@prisma/client";
import { z } from "zod";

const orderField = z.coerce.number().int().nonnegative().optional();

export const skillCreateSchema = z.object({
  title: z.string().min(1),
  image: z.string().optional(),
  level: z.nativeEnum(SkillLevel),
  order: orderField,
});
export const skillUpdateSchema = skillCreateSchema.partial();