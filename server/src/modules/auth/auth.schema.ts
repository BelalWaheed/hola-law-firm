import { Request } from "express";
import { ValidationResult } from "../../core/middlewares/validate.middleware";

export interface LoginDTO {
  username?: string;
  password?: string;
}

export const validateLogin = (req: Request): ValidationResult => {
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
