import { Router } from "express";
import {
  createBlogCategory,
  deleteBlogCategory,
  listBlogCategories,
  updateBlogCategory,
} from "../../controller/cms/blogCategoryController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { blogCategoryCreateSchema, blogCategoryUpdateSchema } from "../../schemas/cms/blogCategory";

export const blogCategoryRoutes = Router();

blogCategoryRoutes.get("/", asyncHandler(listBlogCategories));
blogCategoryRoutes.post(
  "/",
  validateBody(blogCategoryCreateSchema),
  asyncHandler(createBlogCategory),
);
blogCategoryRoutes.put(
  "/:id",
  validateBody(blogCategoryUpdateSchema),
  asyncHandler(updateBlogCategory),
);
blogCategoryRoutes.delete("/:id", asyncHandler(deleteBlogCategory));
