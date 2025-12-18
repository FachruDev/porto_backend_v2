import { PublishStatus } from "@prisma/client";
import { z } from "zod";
import { buildTranslations } from "./common";

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers, and dashes only");

const blogPostTranslations = buildTranslations({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const blogPostCreateSchema = z.object({
  blogCategoryId: z.coerce.number().int(),
  slug: slugSchema.optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT),
  publishedAt: z.coerce.date().optional(),
  createdBy: z.string().optional(),
  translations: blogPostTranslations,
});
export const blogPostUpdateSchema = blogPostCreateSchema.partial();
