import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { validate } from "../../core/middlewares/validate.middleware";
import { validateLogin } from "./auth.schema";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/login", validate(validateLogin), authController.login);

export default router;
