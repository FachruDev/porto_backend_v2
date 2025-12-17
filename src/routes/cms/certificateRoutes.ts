import { Router } from "express";
import multer from "multer";
import {
  createCertificate,
  deleteCertificate,
  listCertificates,
  updateCertificate,
  uploadCertificateFiles,
} from "../../controller/cms/certificateController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { certificateCreateSchema, certificateUpdateSchema } from "../../schemas/cms/certificate";

export const certificateRoutes = Router();
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });

certificateRoutes.get("/", asyncHandler(listCertificates));
certificateRoutes.post(
  "/",
  validateBody(certificateCreateSchema),
  asyncHandler(createCertificate),
);
certificateRoutes.put(
  "/:id",
  validateBody(certificateUpdateSchema),
  asyncHandler(updateCertificate),
);
certificateRoutes.delete("/:id", asyncHandler(deleteCertificate));
certificateRoutes.post(
  "/:id/files",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "preview_img", maxCount: 1 },
  ]),
  asyncHandler(uploadCertificateFiles),
);
