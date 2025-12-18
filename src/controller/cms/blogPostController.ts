import type { Locale } from "@prisma/client";
import type { Request, Response } from "express";
import { PublishStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { HttpError } from "../../lib/httpError";
import { cleanSlug, computePublishedAt, normalizeTranslations, toId } from "./helpers";
import { ensureFile, replaceFile, uploadMulterFile } from "../../lib/upload";

type AuthPayload = { userId: number; email?: string; name?: string };

const getAuth = (req: Request): AuthPayload => {
  const user = (req as Request & { user?: AuthPayload }).user;
  if (!user?.userId) {
    throw new HttpError(401, "Unauthorized");
  }
  return user;
};

export const listBlogPosts = async (_req: Request, res: Response) => {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      blogCategory: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profile: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      translations: true,
    },
  });
  res.json(posts);
};

export const getBlogPost = async (req: Request, res: Response) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: toId(req.params.id) },
    include: {
      blogCategory: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profile: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      translations: true,
    },
  });

  if (!post) {
    throw new HttpError(404, "Blog post not found");
  }

  res.json(post);
};

export const createBlogPost = async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const payload = req.body as {
    blogCategoryId: number;
    slug?: string;
    featuredImage?: string;
    status?: PublishStatus;
    publishedAt?: Date;
    translations: Array<{
      locale: Locale;
      title: string;
      content: string;
      metaTitle?: string;
      metaDescription?: string;
    }>;
  };
  const status = payload.status ?? PublishStatus.DRAFT;
  const enTitle = payload.translations.find((t) => t.locale === "EN")?.title ?? payload.translations[0]?.title;

  const post = await prisma.blogPost.create({
    data: {
      blogCategoryId: payload.blogCategoryId,
      authorId: auth.userId,
      slug: cleanSlug(payload.slug, enTitle),
      featuredImage: payload.featuredImage,
      status,
      publishedAt: computePublishedAt(status, payload.publishedAt),
      createdBy: auth.email ?? auth.name ?? `user-${auth.userId}`,
      translations: {
        create: normalizeTranslations(payload.translations),
      },
    },
    include: {
      blogCategory: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profile: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      translations: true,
    },
  });

  res.status(201).json(post);
};

export const updateBlogPost = async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const id = toId(req.params.id);
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  if (!existing) {
    throw new HttpError(404, "Blog post not found");
  }

  const payload = req.body as {
    blogCategoryId?: number;
    slug?: string;
    featuredImage?: string;
    status?: PublishStatus;
    publishedAt?: Date;
    translations?: Array<{
      locale: Locale;
      title: string;
      content: string;
      metaTitle?: string;
      metaDescription?: string;
    }>;
  };
  const status = payload.status ?? existing.status;
  const publishedAt = computePublishedAt(status, payload.publishedAt, existing.publishedAt);
  const enTitle = payload.translations?.find((t) => t.locale === "EN")?.title ?? payload.translations?.[0]?.title;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      blogCategoryId: payload.blogCategoryId,
      authorId: existing.authorId ?? auth.userId,
      slug: payload.slug || enTitle ? cleanSlug(payload.slug, enTitle) : undefined,
      featuredImage: payload.featuredImage,
      status,
      publishedAt,
      createdBy: existing.createdBy ?? auth.email ?? auth.name ?? `user-${auth.userId}`,
      translations: payload.translations
        ? {
            deleteMany: {},
            create: normalizeTranslations(payload.translations),
          }
        : undefined,
    },
    include: {
      blogCategory: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profile: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      translations: true,
    },
  });

  res.json(post);
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  await prisma.blogPost.delete({ where: { id: toId(req.params.id) } });
  res.status(204).send();
};

export const uploadBlogFeaturedImage = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  ensureFile(file, { allowMime: /^image\//, field: "featured_image" });

  const id = toId(req.params.id);
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const url = await replaceFile({
    file: file!,
    keyPrefix: `blog/${id}/featured`,
    oldUrl: existing?.featuredImage,
  });

  const post = await prisma.blogPost.update({
    where: { id },
    data: { featuredImage: url },
    include: {
      blogCategory: true,
      author: true,
      translations: true,
    },
  });

  res.json(post);
};

export const uploadBlogContentImage = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  ensureFile(file, { allowMime: /^image\//, field: "image" });

  const url = await uploadMulterFile(file!, `blog/content/${Date.now()}`);
  res.json({ url });
};
