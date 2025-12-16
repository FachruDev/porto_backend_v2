import { Router } from "express";
import { getContactInfo, upsertContactInfo } from "../../controller/cms/contactInfoController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { contactInformationSchema } from "../../schemas/cms/contactInfo";

export const contactInfoRoutes = Router();

contactInfoRoutes.get("/", asyncHandler(getContactInfo));
contactInfoRoutes.put("/", validateBody(contactInformationSchema), asyncHandler(upsertContactInfo));
