import { z } from "zod";
import { buildTranslations } from "./common";

const orderField = z.coerce.number().int().nonnegative().optional();
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers, and dashes only");

const blogCategoryTranslations = buildTranslations({
  title: z.string().min(1),
});

export const blogCategoryCreateSchema = z.object({
  slug: slugSchema.optional(),
  order: orderField,
  translations: blogCategoryTranslations,
});
export const blogCategoryUpdateSchema = blogCategoryCreateSchema.partial();
