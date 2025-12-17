import { Router } from "express";
import multer from "multer";
import { getContactInfo, upsertContactInfo, uploadContactCv } from "../../controller/cms/contactInfoController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { contactInformationSchema } from "../../schemas/cms/contactInfo";

export const contactInfoRoutes = Router();
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });

contactInfoRoutes.get("/", asyncHandler(getContactInfo));
contactInfoRoutes.put("/", validateBody(contactInformationSchema), asyncHandler(upsertContactInfo));
contactInfoRoutes.post("/cv", upload.single("cv"), asyncHandler(uploadContactCv));
