import { Router } from "express";
import { PublishStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { asyncHandler } from "../../lib/asyncHandler";
import { getOrSetCache } from "../../lib/cache";

export const landingRouter = Router();

const TTL_MS = 60_000;

const withCache = <T>(key: string, loader: () => Promise<T>) => getOrSetCache(`landing:${key}`, TTL_MS, loader);
const toInt = (val: unknown, fallback: number) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

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

landingRouter.get(
  "/blog/categories",
  asyncHandler(async (_req, res) => {
    const data = await withCache("blogCategories", () =>
      prisma.blogCategory.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { translations: { orderBy: { locale: "asc" } } },
      }),
    );
    res.json(data);
  }),
);

landingRouter.get(
  "/blog/posts",
  asyncHandler(async (_req, res) => {
    const req = _req as typeof _req & {
      query: {
        categoryId?: string;
        categorySlug?: string;
        authorId?: string;
        page?: string;
        limit?: string;
        sort?: string;
        search?: string;
      };
    };

    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;
    const order = (req.query.sort ?? "").toLowerCase() === "old" ? "asc" : "desc";
    const categoryId = toInt(req.query.categoryId, NaN);
    const authorId = toInt(req.query.authorId, NaN);
    const categorySlug = req.query.categorySlug?.trim();
    const search = req.query.search?.trim();

    const where: any = { status: PublishStatus.PUBLISHED };
    if (Number.isFinite(categoryId)) where.blogCategoryId = categoryId;
    if (categorySlug) where.blogCategory = { slug: categorySlug };
    if (Number.isFinite(authorId)) where.authorId = authorId;
    if (search) {
      where.translations = {
        some: {
          title: { contains: search, mode: "insensitive" },
        },
      };
    }

    const [items, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        orderBy: [
          { publishedAt: order },
          { createdAt: order },
        ],
        skip,
        take: limit,
        include: {
          translations: { orderBy: { locale: "asc" } },
          blogCategory: {
            include: { translations: { orderBy: { locale: "asc" } } },
          },
          author: {
            select: { id: true, name: true, email: true, profile: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),
);

landingRouter.get(
  "/blog/posts/:slug",
  asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const key = `blogPost:${slug}`;
    const data = await withCache(key, () =>
      prisma.blogPost.findFirst({
        where: { slug, status: PublishStatus.PUBLISHED },
        include: {
          translations: { orderBy: { locale: "asc" } },
          blogCategory: {
            include: { translations: { orderBy: { locale: "asc" } } },
          },
          author: {
            select: { id: true, name: true, email: true, profile: true },
          },
        },
      }),
    );
    res.json(data ?? null);
  }),
);
