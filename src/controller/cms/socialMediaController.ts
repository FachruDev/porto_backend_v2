import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, toId } from "./helpers";

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
