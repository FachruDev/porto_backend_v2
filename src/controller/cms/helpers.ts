import { Locale, PublishStatus } from "@prisma/client";
import slugify from "slugify";
import { HttpError } from "../../lib/httpError";

export const toId = (raw: string) => {
  const id = Number(raw);
  if (Number.isNaN(id)) {
    throw new HttpError(400, "Invalid id");
  }
  return id;
};

export const mapOrder = <T extends { order?: number }>(
  payload: T,
  options?: { defaultValue?: number; skipWhenUndefined?: boolean },
) => {
  const { order, ...rest } = payload;

  if (order === undefined && options?.skipWhenUndefined) {
    return rest;
  }

  return { ...rest, sortOrder: order ?? options?.defaultValue ?? 0 };
};

export const cleanSlug = (slug?: string | null, fallback?: string) => {
  if (slug && slug.trim().length > 0) {
    return slugify(slug, { lower: true, strict: true });
  }

  if (fallback) {
    return slugify(fallback, { lower: true, strict: true });
  }

  throw new HttpError(400, "Slug or fallback title is required");
};

export const computePublishedAt = (
  status: PublishStatus,
  provided?: Date | null,
  existing?: Date | null,
) => {
  if (provided) return provided;
  if (status === PublishStatus.PUBLISHED) return existing ?? new Date();
  return null;
};

type TranslationDelegate = {
  deleteMany: (args: { where: Record<string, unknown> }) => Promise<unknown>;
  createMany: (args: { data: Record<string, unknown>[]; skipDuplicates?: boolean }) => Promise<unknown>;
};

export const replaceTranslations = async (
  delegate: TranslationDelegate,
  foreignKey: string,
  parentId: number,
  translations: Array<Record<string, unknown>>,
) => {
  await delegate.deleteMany({ where: { [foreignKey]: parentId } });
  if (translations.length > 0) {
    await delegate.createMany({
      data: translations.map((t) => ({ ...t, [foreignKey]: parentId })),
      skipDuplicates: true,
    });
  }
};

export const normalizeTranslations = <T extends { locale: string }>(translations: T[]) =>
  translations.map((t) => ({ ...t, locale: t.locale as Locale }));
