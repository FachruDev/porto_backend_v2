import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { cleanSlug, normalizeTranslations, toId } from "./helpers";

export const listBlogCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.blogCategory.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(categories);
};

export const createBlogCategory = async (req: Request, res: Response) => {
  const payload = req.body as {
    slug?: string;
    order?: number;
    translations: Array<{ locale: Locale; title: string }>;
  };
  const category = await prisma.blogCategory.create({
    data: {
      slug: cleanSlug(
        undefined,
        payload.translations.find((t) => t.locale === "EN")?.title ?? payload.translations[0]?.title,
      ),
      sortOrder: payload.order ?? 0,
      translations: { create: normalizeTranslations(payload.translations) },
    },
    include: { translations: true },
  });

  res.status(201).json(category);
};

export const updateBlogCategory = async (req: Request, res: Response) => {
  const payload = req.body as {
    slug?: string;
    order?: number;
    translations?: Array<{ locale: Locale; title: string }>;
  };
  const fallbackTitle = payload.translations?.find((t) => t.locale === "EN")?.title ?? payload.translations?.[0]?.title;
  const category = await prisma.blogCategory.update({
    where: { id: toId(req.params.id) },
    data: {
      slug: payload.translations ? cleanSlug(undefined, fallbackTitle) : undefined,
      sortOrder: payload.order,
      translations: payload.translations
        ? {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          }
        : undefined,
    },
    include: { translations: true },
  });

  res.json(category);
};

export const deleteBlogCategory = async (req: Request, res: Response) => {
  await prisma.blogCategory.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};
