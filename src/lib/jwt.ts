import jwt, { type SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env";

const env = getEnv();
const EXPIRY = process.env.AUTH_JWT_EXPIRES_IN || "7d";
const signOptions: SignOptions = { expiresIn: EXPIRY as SignOptions["expiresIn"] };

export const signToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, env.AUTH_JWT_SECRET, signOptions);

export const verifyToken = <T>(token: string) => jwt.verify(token, env.AUTH_JWT_SECRET) as T;
