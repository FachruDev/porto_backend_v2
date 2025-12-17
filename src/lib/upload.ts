import { deleteObject, resolveKeyFromUrl, uploadObject } from "../config/storage";
import { HttpError } from "./httpError";

type MulterFile = Express.Multer.File;

const DEFAULT_MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const ensureFile = (file?: MulterFile | null, opts?: { allowMime?: RegExp; field: string }) => {
  if (!file) {
    throw new HttpError(400, `${opts?.field ?? "file"} is required`);
  }

  if (opts?.allowMime && !opts.allowMime.test(file.mimetype)) {
    throw new HttpError(400, `Invalid file type for ${opts.field}`);
  }

  return file;
};

export const uploadMulterFile = async (
  file: MulterFile,
  keyPrefix: string,
  opts?: { contentType?: string; maxSize?: number },
) => {
  if (opts?.maxSize && file.size > opts.maxSize) {
    throw new HttpError(400, `File too large for ${keyPrefix}`);
  }

  const uploaded = await uploadObject({
    body: file.buffer,
    contentType: opts?.contentType ?? file.mimetype,
    key: `${keyPrefix}-${Date.now()}-${file.originalname}`,
  });

  return uploaded.url;
};

export const IMAGE_MIME_REGEX = /^image\//;
export const DEFAULT_MAX_IMAGE_SIZE = DEFAULT_MAX_IMAGE_BYTES;

export const replaceFile = async (params: {
  file: MulterFile;
  keyPrefix: string;
  oldUrl?: string | null;
  contentType?: string;
  maxSize?: number;
}) => {
  const { file, keyPrefix, oldUrl, contentType, maxSize } = params;
  if (oldUrl) {
    const key = resolveKeyFromUrl(oldUrl);
    if (key) {
      await deleteObject(key);
    }
  }
  return uploadMulterFile(file, keyPrefix, { contentType, maxSize });
};

export const replaceBuffer = async (params: {
  buffer: Buffer;
  keyPrefix: string;
  oldUrl?: string | null;
  contentType?: string;
  originalname?: string;
}) => {
  const { buffer, keyPrefix, oldUrl, contentType, originalname } = params;
  if (oldUrl) {
    const key = resolveKeyFromUrl(oldUrl);
    if (key) {
      await deleteObject(key);
    }
  }
  const uploaded = await uploadObject({
    body: buffer,
    contentType: contentType ?? "application/octet-stream",
    key: `${keyPrefix}-${Date.now()}-${originalname ?? "file"}`,
  });
  return uploaded.url;
};
