import { Router } from "express";
import multer from "multer";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  listBlogPosts,
  updateBlogPost,
  uploadBlogContentImage,
  uploadBlogFeaturedImage,
} from "../../controller/cms/blogPostController";
import { asyncHandler } from "../../lib/asyncHandler";
import { validateBody } from "../../lib/validate";
import { blogPostCreateSchema, blogPostUpdateSchema } from "../../schemas/cms/blogPost";

export const blogPostRoutes = Router();
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } });

blogPostRoutes.get("/", asyncHandler(listBlogPosts));
blogPostRoutes.get("/:id", asyncHandler(getBlogPost));
blogPostRoutes.post("/", validateBody(blogPostCreateSchema), asyncHandler(createBlogPost));
blogPostRoutes.put("/:id", validateBody(blogPostUpdateSchema), asyncHandler(updateBlogPost));
blogPostRoutes.delete("/:id", asyncHandler(deleteBlogPost));
blogPostRoutes.post("/:id/featured-image", upload.single("featured_image"), asyncHandler(uploadBlogFeaturedImage));
blogPostRoutes.post("/content-image", upload.single("image"), asyncHandler(uploadBlogContentImage));
