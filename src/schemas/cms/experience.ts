import { z } from "zod";
import { buildTranslations } from "./common";

const orderField = z.coerce.number().int().nonnegative().optional();

const experienceTranslations = buildTranslations({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const experienceCreateSchema = z.object({
  institution: z.string().min(1),
  years: z.string().min(1),
  order: orderField,
  translations: experienceTranslations,
});
export const experienceUpdateSchema = experienceCreateSchema.partial();
