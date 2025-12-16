import { Router } from "express";
import { aboutRoutes } from "./cms/aboutRoutes";
import { blogCategoryRoutes } from "./cms/blogCategoryRoutes";
import { blogPostRoutes } from "./cms/blogPostRoutes";
import { certificateRoutes } from "./cms/certificateRoutes";
import { contactFormRoutes } from "./cms/contactFormRoutes";
import { contactInfoRoutes } from "./cms/contactInfoRoutes";
import { experienceRoutes } from "./cms/experienceRoutes";
import { heroRoutes } from "./cms/heroRoutes";
import { projectRoutes } from "./cms/projectRoutes";
import { skillRoutes } from "./cms/skillRoutes";
import { socialRoutes } from "./cms/socialRoutes";
import { webConfigRoutes } from "./cms/webConfigRoutes";
import { requireAuthForWrite } from "../middleware/requireAuth";

export const cmsRouter = Router();

// Public routes (view + contact form submission)
cmsRouter.use("/contact/forms", contactFormRoutes);

// Protected for non-GET mutations
cmsRouter.use(requireAuthForWrite);

cmsRouter.use("/config", webConfigRoutes);
cmsRouter.use("/heroes", heroRoutes);
cmsRouter.use("/about", aboutRoutes);
cmsRouter.use("/experiences", experienceRoutes);
cmsRouter.use("/skills", skillRoutes);
cmsRouter.use("/certificates", certificateRoutes);
cmsRouter.use("/projects", projectRoutes);
cmsRouter.use("/socials", socialRoutes);
cmsRouter.use("/contact/info", contactInfoRoutes);
cmsRouter.use("/blog/categories", blogCategoryRoutes);
cmsRouter.use("/blog/posts", blogPostRoutes);
