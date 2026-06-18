import { Request, Response, NextFunction } from "express";
import { ConsultationService } from "./consultation.service";

export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.consultationService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  checkStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const phone = req.query.phone;
      if (!phone || typeof phone !== "string") {
        res.status(400).json({ success: false, message: "رقم الجوال مطلوب للاستعلام" });
        return;
      }
      const trimmedPhone = phone.trim();
      const phoneRegex = /^(01[0125]\d{8}|\+201[0125]\d{8})$/;
      if (!phoneRegex.test(trimmedPhone)) {
        res.status(400).json({ success: false, message: "رقم الجوال المصري غير صحيح" });
        return;
      }
      const result = await this.consultationService.findStatusByPhone(trimmedPhone);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.consultationService.findAll();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.consultationService.getDashboardStats();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.consultationService.update(req.params.id as string, req.body);
      if (!result) {
        res.status(404).json({ success: false, message: "Consultation not found" });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
