import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, toId } from "./helpers";

export const listSkills = async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(skills);
};

export const createSkill = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { defaultValue: 0 });
  const skill = await prisma.skill.create({ data: payload as any });
  res.status(201).json(skill);
};

export const updateSkill = async (req: Request, res: Response) => {
  const payload = mapOrder(req.body, { skipWhenUndefined: true });
  const skill = await prisma.skill.update({
    where: { id: toId(req.params.id) },
    data: payload,
  });
  res.json(skill);
};

export const deleteSkill = async (req: Request, res: Response) => {
  await prisma.skill.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};
