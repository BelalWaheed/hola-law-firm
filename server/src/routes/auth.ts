import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validate, ValidationResult } from "../middleware/validate";
import { getJwtSecret } from "../middleware/auth";

const router = Router();

export interface LoginDTO {
  username?: string;
  password?: string;
}

const validateLogin = (req: Request): ValidationResult => {
  const body = req.body || {};
  const errors: any[] = [];

  if (!body.username || typeof body.username !== "string" || body.username.trim() === "") {
    errors.push({ message: "Username is required", path: ["body", "username"] });
  }

  if (!body.password || typeof body.password !== "string" || body.password.trim() === "") {
    errors.push({ message: "Password is required", path: ["body", "password"] });
  }

  return {
    success: errors.length === 0,
    errors,
  };
};

router.post("/login", validate(validateLogin), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body as LoginDTO;
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass || adminUser.trim() === "" || adminPass.trim() === "") {
      console.error("ADMIN_USER or ADMIN_PASS environment variables are not configured.");
      res.status(500).json({ success: false, message: "Server configuration error" });
      return;
    }

    if (username === adminUser && password === adminPass) {
      const secret = getJwtSecret();
      const token = jwt.sign({ role: "admin", username: adminUser }, secret, {
        expiresIn: "365d",
      });
      res.json({ success: true, data: { token } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
