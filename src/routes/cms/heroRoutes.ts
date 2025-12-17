import { Router } from "express";
import { getHero, upsertHero } from "../../controller/cms/heroController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { heroUpsertSchema } from "../../schemas/cms/hero";

export const heroRoutes = Router();

heroRoutes.get("/", asyncHandler(getHero));
heroRoutes.put("/", validateBody(heroUpsertSchema), asyncHandler(upsertHero));
