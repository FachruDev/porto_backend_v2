import { Router } from "express";
import {
  createExperience,
  deleteExperience,
  listExperiences,
  updateExperience,
} from "../../controller/cms/experienceController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { experienceCreateSchema, experienceUpdateSchema } from "../../schemas/cms/experience";

export const experienceRoutes = Router();

experienceRoutes.get("/", asyncHandler(listExperiences));
experienceRoutes.post("/", validateBody(experienceCreateSchema), asyncHandler(createExperience));
experienceRoutes.put("/:id", validateBody(experienceUpdateSchema), asyncHandler(updateExperience));
experienceRoutes.delete("/:id", asyncHandler(deleteExperience));
