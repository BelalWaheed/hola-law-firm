import { Request, Response, NextFunction } from "express";

export interface ValidationError {
  message: string;
  path?: (string | number)[];
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
}

export type ValidatorFn = (req: Request) => ValidationResult;

export const validate =
  (validator: ValidatorFn) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = validator(req);
      if (!result.success) {
        res.status(400).json({ success: false, errors: result.errors });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
