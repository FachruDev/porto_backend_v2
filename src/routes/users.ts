import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controller/userController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../lib/asyncHandler";
import { validateBody } from "../lib/validate";
import { userCreateSchema, userUpdateSchema } from "../schemas/user";

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get("/", asyncHandler(listUsers));
userRouter.get("/:id", asyncHandler(getUser));
userRouter.post("/", validateBody(userCreateSchema), asyncHandler(createUser));
userRouter.put("/:id", validateBody(userUpdateSchema), asyncHandler(updateUser));
userRouter.delete("/:id", asyncHandler(deleteUser));
