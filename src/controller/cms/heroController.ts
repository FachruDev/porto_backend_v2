import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { normalizeTranslations, toId } from "./helpers";

export const listHeroes = async (_req: Request, res: Response) => {
  const heroes = await prisma.hero.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: "desc" }],
  });
  res.json(heroes);
};

export const createHero = async (req: Request, res: Response) => {
  const payload = req.body as { translations: Array<{ locale: Locale; title: string; subtitle?: string }> };

  const hero = await prisma.hero.create({
    data: {
      translations: {
        create: normalizeTranslations(payload.translations),
      },
    },
    include: { translations: true },
  });

  res.status(201).json(hero);
};

export const updateHero = async (req: Request, res: Response) => {
  const id = toId(req.params.id);
  const payload = req.body as { translations?: Array<{ locale: string; title: string; subtitle?: string }> };

  const hero = await prisma.hero.update({
    where: { id },
    data: {
      translations: payload.translations
        ? {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          }
        : undefined,
    },
    include: { translations: true },
  });

  res.json(hero);
};

export const deleteHero = async (req: Request, res: Response) => {
  await prisma.hero.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};
