import { Router } from "express";
import { getAbout, upsertAbout } from "../../controller/cms/aboutController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { aboutSchema } from "../../schemas/cms/about";

export const aboutRoutes = Router();

aboutRoutes.get("/", asyncHandler(getAbout));
aboutRoutes.put("/", validateBody(aboutSchema), asyncHandler(upsertAbout));
