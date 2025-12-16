import { Router } from "express";
import {
  createContactForm,
  listContactForms,
} from "../../controller/cms/contactFormController";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../lib/validate";
import { contactFormCreateSchema } from "../../schemas/cms/contactForm";

export const contactFormRoutes = Router();

contactFormRoutes.get("/", requireAuth, asyncHandler(listContactForms));
contactFormRoutes.post("/", validateBody(contactFormCreateSchema), asyncHandler(createContactForm));
