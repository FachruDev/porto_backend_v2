import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, toId } from "./helpers";
import { ensureFile, replaceFile, IMAGE_MIME_REGEX } from "../../lib/upload";

export const listSocials = async (_req: Request, res: Response) => {
  const socials = await prisma.socialMedia.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(socials);
};

export const createSocial = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { defaultValue: 0 });
  const social = await prisma.socialMedia.create({ data: payload as any });
  res.status(201).json(social);
};

export const updateSocial = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { skipWhenUndefined: true });
  const social = await prisma.socialMedia.update({
    where: { id: toId(req.params.id) },
    data: payload,
  });
  res.json(social);
};

export const deleteSocial = async (req: Request, res: Response) => {
  await prisma.socialMedia.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};

export const uploadSocialLogo = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  ensureFile(file, { allowMime: IMAGE_MIME_REGEX, field: "logo" });
  const id = toId(req.params.id);

  const existing = await prisma.socialMedia.findUnique({ where: { id } });
  const url = await replaceFile({
    file: file!,
    keyPrefix: `social/${id}/logo`,
    oldUrl: existing?.logo,
  });

  const social = await prisma.socialMedia.update({
    where: { id },
    data: { logo: url },
  });

  res.json(social);
};
