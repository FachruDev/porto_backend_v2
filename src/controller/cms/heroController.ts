import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { normalizeTranslations } from "./helpers";

export const getHero = async (_req: Request, res: Response) => {
  const hero = await prisma.hero.findFirst({
    include: { translations: true },
    orderBy: [{ createdAt: "desc" }],
  });
  res.json(hero ?? {});
};

export const upsertHero = async (req: Request, res: Response) => {
  const payload = req.body as { translations: Array<{ locale: Locale; title: string; subtitle?: string }> };

  const existing = await prisma.hero.findFirst();

  const hero = existing
    ? await prisma.hero.update({
        where: { id: existing.id },
        data: {
          translations: {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          },
        },
        include: { translations: true },
      })
    : await prisma.hero.create({
        data: {
          translations: { create: normalizeTranslations(payload.translations) },
        },
        include: { translations: true },
      });

  res.json(hero);
};
