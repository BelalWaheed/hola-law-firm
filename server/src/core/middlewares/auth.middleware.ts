import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/security";

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

