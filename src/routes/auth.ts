import { Router } from "express";
import { login, logout, register } from "../controller/authController";
import { asyncHandler } from "../lib/asyncHandler";
import { validateBody } from "../lib/validate";
import { authLoginSchema, authRegisterSchema } from "../schemas/auth";

export const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), asyncHandler(register));
authRouter.post("/login", validateBody(authLoginSchema), asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
