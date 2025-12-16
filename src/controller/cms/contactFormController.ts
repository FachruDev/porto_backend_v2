import type { Request, Response } from "express";
import prisma from "../../config/prisma";

export const listContactForms = async (_req: Request, res: Response) => {
  const forms = await prisma.contactForm.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  res.json(forms);
};

export const createContactForm = async (req: Request, res: Response) => {
  const form = await prisma.contactForm.create({ data: req.body as typeof req.body });
  res.status(201).json(form);
};
