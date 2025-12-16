import { Router } from "express";
import {
  createCertificate,
  deleteCertificate,
  listCertificates,
  updateCertificate,
} from "../../controller/cms/certificateController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { certificateCreateSchema, certificateUpdateSchema } from "../../schemas/cms/certificate";

export const certificateRoutes = Router();

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
