import { Router } from "express";
import multer from "multer";
import { getAbout, upsertAbout, uploadAboutProfile } from "../../controller/cms/aboutController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { aboutSchema } from "../../schemas/cms/about";

export const aboutRoutes = Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

aboutRoutes.get("/", asyncHandler(getAbout));
aboutRoutes.put("/", validateBody(aboutSchema), asyncHandler(upsertAbout));
aboutRoutes.post(
  "/profile",
  upload.single("profile"),
  asyncHandler(uploadAboutProfile),
);
