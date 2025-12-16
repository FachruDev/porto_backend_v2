import { z } from "zod";

export const webConfigSchema = z.object({
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  copyright: z.string().optional(),
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),
});