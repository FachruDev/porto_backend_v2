import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { getWebConfig, upsertWebConfig, uploadWebConfigAssets } from "../../controller/cms/webConfigController";
import { webConfigSchema } from "../../schemas/cms/webconfig";
import multer from "multer";

export const webConfigRoutes = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

webConfigRoutes.get("/web", asyncHandler(getWebConfig));
webConfigRoutes.put("/web", validateBody(webConfigSchema), asyncHandler(upsertWebConfig));
webConfigRoutes.post(
  "/web/upload",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  asyncHandler(uploadWebConfigAssets),
);
