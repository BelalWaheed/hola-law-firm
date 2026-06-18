import { Router } from "express";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";
import { SettingsController } from "./settings.controller";
import { validateUpdateSettings } from "./settings.schema";
import { validate } from "../../core/middlewares/validate.middleware";
import { requireAuth } from "../../core/middlewares/auth.middleware";

const router = Router();
const repository = new SettingsRepository();
const service = new SettingsService(repository);
const controller = new SettingsController(service);

router.get("/", controller.getSettings);
router.put("/", requireAuth, validate(validateUpdateSettings), controller.updateSettings);

export default router;
