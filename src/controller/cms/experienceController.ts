import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, normalizeTranslations, toId } from "./helpers";

export const listExperiences = async (_req: Request, res: Response) => {
  const experiences = await prisma.experience.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(experiences);
};

export const createExperience = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { defaultValue: 0 }) as {
    institution: string;
    years: string;
    order?: number;
    translations: Array<{ locale: Locale; title: string; description?: string }>;
  };

  const experience = await prisma.experience.create({
    data: {
      institution: payload.institution,
      years: payload.years,
      sortOrder: payload.order ?? 0,
      translations: { create: normalizeTranslations(payload.translations) },
    },
    include: { translations: true },
  });
  res.status(201).json(experience);
};

export const updateExperience = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { skipWhenUndefined: true }) as {
    institution?: string;
    years?: string;
    order?: number;
    translations?: Array<{ locale: Locale; title: string; description?: string }>;
  };
  const experience = await prisma.experience.update({
    where: { id: toId(req.params.id) },
    data: {
      institution: payload.institution,
      years: payload.years,
      sortOrder: payload.order,
      translations: payload.translations
        ? { deleteMany: {}, create: normalizeTranslations(payload.translations) }
        : undefined,
    },
    include: { translations: true },
  });
  res.json(experience);
};

export const deleteExperience = async (req: Request, res: Response) => {
  await prisma.experience.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};
