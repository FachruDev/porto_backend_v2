import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../config/prisma";
import { uploadObject } from "../../config/storage";
import { HttpError } from "../../lib/httpError";
import { normalizeTranslations } from "./helpers";

export const getAbout = async (_req: Request, res: Response) => {
  const about = await prisma.aboutMe.findFirst({
    include: { translations: true },
  });
  res.json(about ?? {});
};

const parseDataUrl = (value?: string) => {
  if (!value) return null;
  const match = value.match(/^data:(.+);base64,(.*)$/);
  if (!match) return null;
  const [, contentType, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  return { buffer, contentType };
};

export const upsertAbout = async (req: Request, res: Response) => {
  const existing = await prisma.aboutMe.findFirst();
  const payload = req.body as {
    profile?: string;
    profileFile?: string;
    translations: Array<{ locale: Locale; title: string; content: string }>;
  };

  let profileUrl = payload.profile ?? existing?.profile ?? null;

  const parsedFile = parseDataUrl(payload.profileFile);
  if (parsedFile) {
    const uploaded = await uploadObject({
      key: `about/profile-${Date.now()}`,
      body: parsedFile.buffer,
      contentType: parsedFile.contentType,
    });
    profileUrl = uploaded.url;
  }

  const data = existing
    ? await prisma.aboutMe.update({
        where: { id: existing.id },
        data: {
          profile: profileUrl,
          translations: {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          },
        },
        include: { translations: true },
      })
    : await prisma.aboutMe.create({
        data: {
          profile: profileUrl,
          translations: { create: normalizeTranslations(payload.translations) },
        },
        include: { translations: true },
      });

  res.json(data);
};

export const uploadAboutProfile = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    throw new HttpError(400, "File is required");
  }
  if (!file.mimetype?.startsWith("image/")) {
    throw new HttpError(400, "Only image uploads are allowed");
  }

  const uploaded = await uploadObject({
    body: file.buffer,
    contentType: file.mimetype,
    key: `about/profile-${Date.now()}-${file.originalname}`,
  });

  const existing = await prisma.aboutMe.findFirst();

  const about = existing
    ? await prisma.aboutMe.update({
        where: { id: existing.id },
        data: { profile: uploaded.url },
        include: { translations: true },
      })
    : await prisma.aboutMe.create({
        data: { profile: uploaded.url },
        include: { translations: true },
      });

  res.json({ url: uploaded.url, about });
};
