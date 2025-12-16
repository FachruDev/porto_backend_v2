import { z } from "zod";
import { buildTranslations } from "./common";

const orderField = z.coerce.number().int().nonnegative().optional();
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers, and dashes only");

const projectImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
  order: orderField,
});

const projectTranslations = buildTranslations({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
});

export const projectCreateSchema = z.object({
  slug: slugSchema.optional(),
  order: orderField,
  images: z.array(projectImageSchema).optional(),
  translations: projectTranslations,
});
export const projectUpdateSchema = projectCreateSchema.partial();
export const projectImageCreateSchema = projectImageSchema;
