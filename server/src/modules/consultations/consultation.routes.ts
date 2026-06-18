import { Router } from "express";
import { ConsultationController } from "./consultation.controller";
import { ConsultationService } from "./consultation.service";
import { ConsultationRepository } from "./consultation.repository";
import { SettingsRepository } from "../settings/settings.repository";
import { validate } from "../../core/middlewares/validate.middleware";
import { validateCreateConsultation, validateUpdateConsultation } from "./consultation.schema";
import { requireAuth } from "../../core/middlewares/auth.middleware";

const router = Router();
const settingsRepository = new SettingsRepository();
const consultationRepository = new ConsultationRepository();
const consultationService = new ConsultationService(consultationRepository, settingsRepository);
const controller = new ConsultationController(consultationService);

// Public route for landing page
router.post("/", validate(validateCreateConsultation), controller.create);
router.get("/status", controller.checkStatus);

// Protected routes for dashboard
router.use(requireAuth);
router.get("/", controller.getAll);
router.get("/dashboard-stats", controller.getDashboardStats);
router.put("/:id", validate(validateUpdateConsultation), controller.updateStatus);

export default router;
