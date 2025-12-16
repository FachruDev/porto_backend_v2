import { Router } from "express";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  listBlogPosts,
  updateBlogPost,
} from "../../controller/cms/blogPostController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { blogPostCreateSchema, blogPostUpdateSchema } from "../../schemas/cms/blogPost";

export const blogPostRoutes = Router();

blogPostRoutes.get("/", asyncHandler(listBlogPosts));
blogPostRoutes.get("/:id", asyncHandler(getBlogPost));
blogPostRoutes.post("/", validateBody(blogPostCreateSchema), asyncHandler(createBlogPost));
blogPostRoutes.put("/:id", validateBody(blogPostUpdateSchema), asyncHandler(updateBlogPost));
blogPostRoutes.delete("/:id", asyncHandler(deleteBlogPost));
