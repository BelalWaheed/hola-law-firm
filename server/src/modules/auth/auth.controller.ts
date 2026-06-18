import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      if (!result) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
