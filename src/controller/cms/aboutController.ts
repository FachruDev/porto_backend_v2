import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { normalizeTranslations } from "./helpers";

export const getAbout = async (_req: Request, res: Response) => {
  const about = await prisma.aboutMe.findFirst({
    include: { translations: true },
  });
  res.json(about ?? {});
};

export const upsertAbout = async (req: Request, res: Response) => {
  const existing = await prisma.aboutMe.findFirst();
  const payload = req.body as {
    profile?: string;
    translations: Array<{ locale: Locale; title: string; content: string }>;
  };

  const data = existing
    ? await prisma.aboutMe.update({
        where: { id: existing.id },
        data: {
          profile: payload.profile,
          translations: {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          },
        },
        include: { translations: true },
      })
    : await prisma.aboutMe.create({
        data: {
          profile: payload.profile,
          translations: { create: normalizeTranslations(payload.translations) },
        },
        include: { translations: true },
      });

  res.json(data);
};
