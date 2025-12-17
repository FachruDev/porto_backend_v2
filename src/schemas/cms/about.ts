import { z } from "zod";
import { buildTranslations } from "./common";

const aboutTranslations = buildTranslations({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const aboutSchema = z.object({
  profile: z.string().optional(),
  profileFile: z
    .string()
    .regex(/^data:(.+);base64,(.*)$/)
    .max(5_000_000)
    .optional(),
  translations: aboutTranslations,
});
