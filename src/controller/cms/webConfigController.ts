import type { Request, Response } from "express";
import prisma from "../../config/prisma";

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
