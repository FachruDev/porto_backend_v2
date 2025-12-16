import { z } from "zod";
import { buildTranslations } from "./common";

const orderField = z.coerce.number().int().nonnegative().optional();

const certificateTranslations = buildTranslations({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const certificateCreateSchema = z.object({
  file: z.string().min(1),
  previewImg: z.string().optional(),
  issuedBy: z.string().optional(),
  issuedOn: z.coerce.date().optional(),
  order: orderField,
  translations: certificateTranslations,
});
export const certificateUpdateSchema = certificateCreateSchema.partial();
