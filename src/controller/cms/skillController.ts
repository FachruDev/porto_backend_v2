import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { mapOrder, toId } from "./helpers";
import { IMAGE_MIME_REGEX, ensureFile, replaceFile } from "../../lib/upload";

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

export const uploadSkillImage = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  const skillId = toId(req.params.id);
  ensureFile(file, { allowMime: IMAGE_MIME_REGEX, field: "image" });

  const existing = await prisma.skill.findUnique({ where: { id: skillId } });

  const url = await replaceFile({
    file: file!,
    keyPrefix: "skills/image",
    oldUrl: existing?.image,
  });

  const skill = await prisma.skill.update({
    where: { id: skillId },
    data: { image: url },
  });

  res.json(skill);
};
