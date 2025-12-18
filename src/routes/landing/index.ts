import { Router } from "express";
import prisma from "../../config/prisma";
import { asyncHandler } from "../../lib/asyncHandler";
import { getOrSetCache } from "../../lib/cache";

export const landingRouter = Router();

const TTL_MS = 60_000;

const withCache = <T>(key: string, loader: () => Promise<T>) => getOrSetCache(`landing:${key}`, TTL_MS, loader);

landingRouter.get(
  "/web-config",
  asyncHandler(async (_req, res) => {
    const data = await withCache("webConfig", () =>
      prisma.webConfig.findFirst({ orderBy: { id: "asc" } }),
    );
    res.json(data ?? null);
  }),
);

landingRouter.get(
  "/hero",
  asyncHandler(async (_req, res) => {
    const data = await withCache("hero", () =>
      prisma.hero.findFirst({
        orderBy: { id: "asc" },
        include: { translations: { orderBy: { locale: "asc" } } },
      }),
    );
    res.json(data ?? null);
  }),
);

landingRouter.get(
  "/about",
  asyncHandler(async (_req, res) => {
    const data = await withCache("about", () =>
      prisma.aboutMe.findFirst({
        orderBy: { id: "asc" },
        include: { translations: { orderBy: { locale: "asc" } } },
      }),
    );
    res.json(data ?? null);
  }),
);

landingRouter.get(
  "/experiences",
  asyncHandler(async (_req, res) => {
    const data = await withCache("experiences", () =>
      prisma.experience.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { translations: { orderBy: { locale: "asc" } } },
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/skills",
  asyncHandler(async (_req, res) => {
    const data = await withCache("skills", () =>
      prisma.skill.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/certificates",
  asyncHandler(async (_req, res) => {
    const data = await withCache("certificates", () =>
      prisma.certificate.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { translations: { orderBy: { locale: "asc" } } },
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const data = await withCache("projects", () =>
      prisma.project.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          translations: { orderBy: { locale: "asc" } },
          images: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        },
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/socials",
  asyncHandler(async (_req, res) => {
    const data = await withCache("socials", () =>
      prisma.socialMedia.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/contact-info",
  asyncHandler(async (_req, res) => {
    const data = await withCache("contactInfo", () =>
      prisma.contactInformation.findFirst({ orderBy: { id: "asc" } }),
    );
    res.json(data ?? null);
  }),
);
