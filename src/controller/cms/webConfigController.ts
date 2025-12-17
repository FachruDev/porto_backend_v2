import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { HttpError } from "../../lib/httpError";
import { IMAGE_MIME_REGEX, ensureFile, replaceFile } from "../../lib/upload";

export const getWebConfig = async (_req: Request, res: Response) => {
  const config = await prisma.webConfig.findFirst();
  res.json(config ?? {});
};

export const upsertWebConfig = async (req: Request, res: Response) => {
  const existing = await prisma.webConfig.findFirst();
  const payload = req.body as typeof req.body;

  const data = existing
    ? await prisma.webConfig.update({ where: { id: existing.id }, data: payload })
    : await prisma.webConfig.create({ data: payload });

  res.json(data);
};

export const uploadWebConfigAssets = async (req: Request, res: Response) => {
  const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files ?? {};
  const logoFile = files.logo?.[0];
  const faviconFile = files.favicon?.[0];

  if (!logoFile && !faviconFile) {
    throw new HttpError(400, "logo or favicon file is required");
  }

  const existing = await prisma.webConfig.findFirst();
  const uploads: { logo?: string; favicon?: string } = {};

  if (logoFile) {
    ensureFile(logoFile, { allowMime: IMAGE_MIME_REGEX, field: "logo" });
    uploads.logo = await replaceFile({
      file: logoFile,
      keyPrefix: "webconfig/logo",
      oldUrl: existing?.logo,
    });
  }

  if (faviconFile) {
    ensureFile(faviconFile, { field: "favicon" });
    uploads.favicon = await replaceFile({
      file: faviconFile,
      keyPrefix: "webconfig/favicon",
      oldUrl: existing?.favicon,
    });
  }

  const data = existing
    ? await prisma.webConfig.update({
        where: { id: existing.id },
        data: uploads,
      })
    : await prisma.webConfig.create({ data: uploads });

  res.json(data);
};
