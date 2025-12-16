import { Router } from "express";
import {
  addProjectImage,
  createProject,
  deleteProject,
  deleteProjectImage,
  getProject,
  listProjects,
  updateProject,
} from "../../controller/cms/projectController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import {
  projectCreateSchema,
  projectImageCreateSchema,
  projectUpdateSchema,
} from "../../schemas/cms/project";

export const projectRoutes = Router();

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
