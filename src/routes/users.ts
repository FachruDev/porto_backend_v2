import { Router } from "express";
import multer from "multer";
import {
  createUser,
  deleteUser,
  getMe,
  getUser,
  listUsers,
  updateMe,
  updateUser,
  uploadMyProfile,
  uploadUserProfile,
} from "../controller/userController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../lib/asyncHandler";
import { validateBody } from "../lib/validate";
import { userCreateSchema, userUpdateSchema } from "../schemas/user";

export const userRouter = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

userRouter.use(requireAuth);

userRouter.get("/", asyncHandler(listUsers));
userRouter.get("/me", asyncHandler(getMe));
userRouter.put("/me", validateBody(userUpdateSchema), asyncHandler(updateMe));
userRouter.post("/me/profile", upload.single("profile"), asyncHandler(uploadMyProfile));
userRouter.get("/:id", asyncHandler(getUser));
userRouter.post("/", validateBody(userCreateSchema), asyncHandler(createUser));
userRouter.put("/:id", validateBody(userUpdateSchema), asyncHandler(updateUser));
userRouter.post("/:id/profile", upload.single("profile"), asyncHandler(uploadUserProfile));
userRouter.delete("/:id", asyncHandler(deleteUser));
