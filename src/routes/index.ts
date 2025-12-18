import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import prisma from "../config/prisma";
import { authRouter } from "./auth";
import { cmsRouter } from "./cms";
import { landingRouter } from "./landing";
import { userRouter } from "./users";

export const router = Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  }),
);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/cms", cmsRouter);
router.use("/landing", landingRouter);
