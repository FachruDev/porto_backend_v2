import { Router } from "express";
import { createSkill, deleteSkill, listSkills, updateSkill } from "../../controller/cms/skillController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { skillCreateSchema, skillUpdateSchema } from "../../schemas/cms/skills";

export const skillRoutes = Router();

skillRoutes.get("/", asyncHandler(listSkills));
skillRoutes.post("/", validateBody(skillCreateSchema), asyncHandler(createSkill));
skillRoutes.put("/:id", validateBody(skillUpdateSchema), asyncHandler(updateSkill));
skillRoutes.delete("/:id", asyncHandler(deleteSkill));
