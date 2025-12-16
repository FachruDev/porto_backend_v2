import { z } from "zod";

export const localeEnum = z.enum(["EN", "ID"]);

export const buildTranslations = <T extends z.ZodRawShape>(shape: T) =>
  z
    .array(
      z.object({
        locale: localeEnum,
        ...shape,
      }),
    )
    .min(1);
