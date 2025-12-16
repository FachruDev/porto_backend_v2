import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { getEnv } from "./env";

const env = getEnv();

const s3Url = env.S3 ? new URL(env.S3) : null;
const bucketFromUrl = s3Url?.pathname.replace(/^\//, "").split("/")[0];
const bucket = env.R2_BUCKET ?? bucketFromUrl;
const endpoint = s3Url ? `${s3Url.protocol}//${s3Url.host}` : undefined;

const hasCredentials =
  Boolean(env.R2_ACCESS_KEY_ID) &&
  Boolean(env.R2_SECRET_ACCESS_KEY) &&
  Boolean(bucket) &&
  Boolean(endpoint);

export const s3Client = hasCredentials
  ? new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const ensureClient = () => {
  if (!s3Client || !bucket) {
    throw new Error("R2 storage is not configured.");
  }
};

export const uploadObject = async (params: {
  key?: string;
  contentType?: string;
  body: Buffer | Uint8Array | Blob | string;
}) => {
  ensureClient();
  const objectKey = params.key ?? `uploads/${crypto.randomUUID()}`;

  await s3Client!.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );

  return {
    key: objectKey,
    url: buildPublicUrl(objectKey),
  };
};

export const deleteObject = async (key: string) => {
  ensureClient();

  await s3Client!.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};

const buildPublicUrl = (key: string) => {
  if (env.R2_PUBLIC_BASE_URL) {
    return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }

  if (env.S3) {
    return `${env.S3.replace(/\/$/, "")}/${key}`;
  }

  return key;
};
