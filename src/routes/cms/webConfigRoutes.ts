import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { getWebConfig, upsertWebConfig } from "../../controller/cms/webConfigController";
import { webConfigSchema } from "../../schemas/cms/webconfig";

export const webConfigRoutes = Router();

webConfigRoutes.get("/web", asyncHandler(getWebConfig));
webConfigRoutes.put("/web", validateBody(webConfigSchema), asyncHandler(upsertWebConfig));
