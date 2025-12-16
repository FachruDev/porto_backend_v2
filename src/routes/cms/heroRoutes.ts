import { Router } from "express";
import { createHero, deleteHero, listHeroes, updateHero } from "../../controller/cms/heroController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { heroUpsertSchema } from "../../schemas/cms/hero";

export const heroRoutes = Router();

heroRoutes.get("/", asyncHandler(listHeroes));
heroRoutes.post("/", validateBody(heroUpsertSchema), asyncHandler(createHero));
heroRoutes.put("/:id", validateBody(heroUpsertSchema), asyncHandler(updateHero));
heroRoutes.delete("/:id", asyncHandler(deleteHero));
