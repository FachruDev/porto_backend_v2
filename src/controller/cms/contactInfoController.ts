import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ensureFile, replaceFile } from "../../lib/upload";

export const getContactInfo = async (_req: Request, res: Response) => {
  const info = await prisma.contactInformation.findFirst();
  res.json(info ?? {});
};

export const upsertContactInfo = async (req: Request, res: Response) => {
  const existing = await prisma.contactInformation.findFirst();
  const payload = req.body as typeof req.body;

  const data = existing
    ? await prisma.contactInformation.update({ where: { id: existing.id }, data: payload })
    : await prisma.contactInformation.create({ data: payload });

  res.json(data);
};

export const uploadContactCv = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  ensureFile(file, { field: "cv" });

  const existing = await prisma.contactInformation.findFirst();
  const url = await replaceFile({
    file: file!,
    keyPrefix: "contact/cv",
    oldUrl: existing?.cv,
  });

  const data = existing
    ? await prisma.contactInformation.update({ where: { id: existing.id }, data: { cv: url } })
    : await prisma.contactInformation.create({ data: { cv: url } });

  res.json({ url, contact: data });
};
