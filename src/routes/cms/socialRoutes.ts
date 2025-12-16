import { Router } from "express";
import {
  createSocial,
  deleteSocial,
  listSocials,
  updateSocial,
} from "../../controller/cms/socialMediaController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { socialCreateSchema, socialUpdateSchema } from "../../schemas/cms/socialMedia";

export const socialRoutes = Router();

socialRoutes.get("/", asyncHandler(listSocials));
socialRoutes.post("/", validateBody(socialCreateSchema), asyncHandler(createSocial));
socialRoutes.put("/:id", validateBody(socialUpdateSchema), asyncHandler(updateSocial));
socialRoutes.delete("/:id", asyncHandler(deleteSocial));
