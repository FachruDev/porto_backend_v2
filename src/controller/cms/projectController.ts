import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { HttpError } from "../../lib/httpError";
import { cleanSlug, normalizeTranslations, toId } from "./helpers";

export const listProjects = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      translations: true,
    },
  });
  res.json(projects);
};

export const getProject = async (req: Request, res: Response) => {
  const project = await prisma.project.findUnique({
    where: { id: toId(req.params.id) },
    include: { images: { orderBy: { sortOrder: "asc" } }, translations: true },
  });

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const payload = req.body as {
    slug?: string;
    order?: number;
    images?: Array<{ url: string; alt?: string; order?: number }>;
    translations: Array<{ locale: Locale; title: string; subtitle?: string; description?: string }>;
  };

  const enTitle = payload.translations.find((t) => t.locale === "EN")?.title ?? payload.translations[0]?.title;
  const slug = cleanSlug(payload.slug, enTitle);

  const project = await prisma.project.create({
    data: {
      slug,
      sortOrder: payload.order ?? 0,
      images: payload.images
        ? {
            create: payload.images.map((image: { url: string; alt?: string; order?: number }) => ({
              url: image.url,
              alt: image.alt,
              sortOrder: image.order ?? 0,
            })),
          }
        : undefined,
      translations: { create: normalizeTranslations(payload.translations) },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      translations: true,
    },
  });

  res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const payload = req.body as {
    slug?: string;
    order?: number;
    translations?: Array<{ locale: Locale; title: string; subtitle?: string; description?: string }>;
  };

  const enTitle = payload.translations?.find((t) => t.locale === "EN")?.title ?? payload.translations?.[0]?.title;
  const data = {
    sortOrder: payload.order,
    slug: payload.slug || enTitle ? cleanSlug(payload.slug, enTitle) : undefined,
    translations: payload.translations
      ? {
          deleteMany: {},
          create: normalizeTranslations(payload.translations),
        }
      : undefined,
  };

  const project = await prisma.project.update({
    where: { id: toId(req.params.id) },
    data,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      translations: true,
    },
  });

  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await prisma.project.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};

export const addProjectImage = async (req: Request, res: Response) => {
  const projectId = toId(req.params.id);
  const payload = req.body as typeof req.body;

  const image = await prisma.projectImage.create({
    data: {
      projectId,
      url: payload.url,
      alt: payload.alt,
      sortOrder: payload.order ?? 0,
    },
  });

  res.status(201).json(image);
};

export const deleteProjectImage = async (req: Request, res: Response) => {
  const projectId = toId(req.params.projectId);
  const imageId = toId(req.params.imageId);

  const image = await prisma.projectImage.findFirst({
    where: { id: imageId, projectId },
  });

  if (!image) {
    throw new HttpError(404, "Project image not found");
  }

  await prisma.projectImage.delete({ where: { id: imageId } });
  res.status(204).send();
};
