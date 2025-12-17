import { Router } from "express";
import multer from "multer";
import {
  createSocial,
  deleteSocial,
  listSocials,
  updateSocial,
  uploadSocialLogo,
} from "../../controller/cms/socialMediaController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { socialCreateSchema, socialUpdateSchema } from "../../schemas/cms/socialMedia";

export const socialRoutes = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

socialRoutes.get("/", asyncHandler(listSocials));
socialRoutes.post("/", validateBody(socialCreateSchema), asyncHandler(createSocial));
socialRoutes.put("/:id", validateBody(socialUpdateSchema), asyncHandler(updateSocial));
socialRoutes.delete("/:id", asyncHandler(deleteSocial));
socialRoutes.post("/:id/logo", upload.single("logo"), asyncHandler(uploadSocialLogo));
