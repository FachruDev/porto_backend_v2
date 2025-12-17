import { Router } from "express";
import multer from "multer";
import { createSkill, deleteSkill, listSkills, updateSkill, uploadSkillImage } from "../../controller/cms/skillController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { skillCreateSchema, skillUpdateSchema } from "../../schemas/cms/skills";

export const skillRoutes = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

skillRoutes.get("/", asyncHandler(listSkills));
skillRoutes.post("/", validateBody(skillCreateSchema), asyncHandler(createSkill));
skillRoutes.put("/:id", validateBody(skillUpdateSchema), asyncHandler(updateSkill));
skillRoutes.delete("/:id", asyncHandler(deleteSkill));
skillRoutes.post("/:id/image", upload.single("image"), asyncHandler(uploadSkillImage));
