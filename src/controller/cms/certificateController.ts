import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, normalizeTranslations, toId } from "./helpers";
import { ensureFile, replaceFile } from "../../lib/upload";

export const listCertificates = async (_req: Request, res: Response) => {
  const certificates = await prisma.certificate.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(certificates);
};

export const createCertificate = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { defaultValue: 0 }) as {
    file: string;
    previewImg?: string;
    issuedBy?: string;
    issuedOn?: Date;
    order?: number;
    translations: Array<{ locale: Locale; title: string; description?: string }>;
  };
  const certificate = await prisma.certificate.create({
    data: {
      file: payload.file,
      previewImg: payload.previewImg,
      issuedBy: payload.issuedBy,
      issuedOn: payload.issuedOn,
      sortOrder: payload.order ?? 0,
      translations: { create: normalizeTranslations(payload.translations) },
    },
    include: { translations: true },
  });
  res.status(201).json(certificate);
};

export const updateCertificate = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { skipWhenUndefined: true }) as {
    file?: string;
    previewImg?: string;
    issuedBy?: string;
    issuedOn?: Date;
    order?: number;
    translations?: Array<{ locale: Locale; title: string; description?: string }>;
  };
  const certificate = await prisma.certificate.update({
    where: { id: toId(req.params.id) },
    data: {
      file: payload.file,
      previewImg: payload.previewImg,
      issuedBy: payload.issuedBy,
      issuedOn: payload.issuedOn,
      sortOrder: payload.order,
      translations: payload.translations
        ? { deleteMany: {}, create: normalizeTranslations(payload.translations) }
        : undefined,
    },
    include: { translations: true },
  });
  res.json(certificate);
};

export const deleteCertificate = async (req: Request, res: Response) => {
  await prisma.certificate.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};

export const uploadCertificateFiles = async (req: Request, res: Response) => {
  const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files ?? {};
  const file = files.file?.[0];
  const preview = files.preview_img?.[0];

  if (!file && !preview) {
    throw new Error("file or preview_img is required");
  }

  const id = toId(req.params.id);
  const existing = await prisma.certificate.findUnique({ where: { id } });
  const data: { file?: string; previewImg?: string } = {};

  if (file) {
    ensureFile(file, { field: "file" });
    data.file = await replaceFile({
      file,
      keyPrefix: "certificates/file",
      oldUrl: existing?.file,
    });
  }

  if (preview) {
    ensureFile(preview, { field: "preview_img" });
    data.previewImg = await replaceFile({
      file: preview,
      keyPrefix: "certificates/preview",
      oldUrl: existing?.previewImg,
    });
  }

  const certificate = await prisma.certificate.update({
    where: { id },
    data,
    include: { translations: true },
  });

  res.json(certificate);
};
