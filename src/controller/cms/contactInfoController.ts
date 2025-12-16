import type { Request, Response } from "express";
import prisma from "../../config/prisma";

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
