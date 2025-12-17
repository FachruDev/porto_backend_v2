import { Router } from "express";
import multer from "multer";
import {
  addProjectImage,
  createProject,
  deleteProject,
  deleteProjectImage,
  getProject,
  listProjects,
  updateProject,
  uploadProjectImages,
  replaceProjectImage,
} from "../../controller/cms/projectController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import {
  projectCreateSchema,
  projectImageCreateSchema,
  projectUpdateSchema,
} from "../../schemas/cms/project";

export const projectRoutes = Router();
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } });

projectRoutes.get("/", asyncHandler(listProjects));
projectRoutes.get("/:id", asyncHandler(getProject));
projectRoutes.post("/", validateBody(projectCreateSchema), asyncHandler(createProject));
projectRoutes.put("/:id", validateBody(projectUpdateSchema), asyncHandler(updateProject));
projectRoutes.delete("/:id", asyncHandler(deleteProject));

projectRoutes.post(
  "/:id/images",
  validateBody(projectImageCreateSchema),
  asyncHandler(addProjectImage),
);
projectRoutes.delete("/:projectId/images/:imageId", asyncHandler(deleteProjectImage));
projectRoutes.post(
  "/:id/images/upload",
  upload.array("images", 10),
  asyncHandler(uploadProjectImages),
);
projectRoutes.post(
  "/:projectId/images/:imageId/upload",
  upload.single("image"),
  asyncHandler(replaceProjectImage),
);
