import { z } from "zod";
import { buildTranslations } from "./common";

const heroTranslations = buildTranslations({
  title: z.string().min(1),
  subtitle: z.string().optional(),
});

export const heroUpsertSchema = z.object({
  translations: heroTranslations,
});
