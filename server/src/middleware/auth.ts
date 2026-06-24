import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error(
        "FATAL: JWT_SECRET environment variable is not configured. " +
        "You must configure JWT_SECRET in production/Vercel to prevent session invalidations on cold starts."
      );
    }
    return FALLBACK_SECRET;
  }

  return secret;
};

export interface AdminPayload extends jwt.JwtPayload {
  role: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AdminPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AdminPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
  }
};
