import { Router, Request, Response, NextFunction } from "express";
import { ConsultationModel } from "../models/Consultation";
import { SiteSettingsModel } from "../models/SiteSettings";
import { requireAuth } from "../middleware/auth";
import { validate, ValidationResult } from "../middleware/validate";

const router = Router();

export interface CreateConsultationDTO {
  clientName: string;
  phone: string;
  consultationType: string;
  details: string;
}

export interface UpdateConsultationDTO {
  status?: "جديد" | "تم الرد" | "قيد المتابعة";
  adminReply?: string;
}

const validateCreateConsultation = (req: Request): ValidationResult => {
  const body = req.body || {};
  const errors: any[] = [];

  if (!body.clientName || typeof body.clientName !== "string" || body.clientName.trim().length < 2) {
    errors.push({ message: "يجب أن يكون الاسم من حرفين على الأقل", path: ["body", "clientName"] });
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(body.clientName)) {
    errors.push({ message: "يجب أن يحتوي الاسم على حروف فقط", path: ["body", "clientName"] });
  }

  const phoneRegex = /^(01[0125]\d{8}|\+201[0125]\d{8})$/;
  if (!body.phone || typeof body.phone !== "string" || !phoneRegex.test(body.phone.trim())) {
    errors.push({ message: "رقم الجوال المصري غير صحيح (مثال: 01001234567)", path: ["body", "phone"] });
  }

  if (!body.consultationType || typeof body.consultationType !== "string" || body.consultationType.trim().length < 2) {
    errors.push({ message: "نوع الاستشارة مطلوب", path: ["body", "consultationType"] });
  }

  if (!body.details || typeof body.details !== "string" || body.details.trim().length < 10) {
    errors.push({ message: " ادخل تفاصيل الاستشارة", path: ["body", "details"] });
  }

  return {
    success: errors.length === 0,
    errors,
  };
};

const validateUpdateConsultation = (req: Request): ValidationResult => {
  const body = req.body || {};
  const params = req.params || {};
  const errors: any[] = [];

  if (body.status !== undefined) {
    const validStatuses = ["جديد", "تم الرد", "قيد المتابعة"];
    if (!validStatuses.includes(body.status)) {
      errors.push({ message: "حالة الاستشارة غير صحيحة", path: ["body", "status"] });
    }
  }

  if (!params.id || typeof params.id !== "string" || params.id.trim() === "") {
    errors.push({ message: "ID is required", path: ["params", "id"] });
  }

  return {
    success: errors.length === 0,
    errors,
  };
};

// 1. Create a consultation (Public)
router.post("/", validate(validateCreateConsultation), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateConsultationDTO;

    // Check if phone already registered with a different client name
    const existing = await ConsultationModel.find({ phone: data.phone }).exec();
    if (existing.length > 0) {
      const existingName = existing[0].clientName.trim().toLowerCase();
      const newName = data.clientName.trim().toLowerCase();
      if (existingName !== newName) {
        res.status(400).json({
          success: false,
          message: "رقم الجوال هذا مسجل بالفعل باسم آخر. يرجى استخدام الاسم المرتبط بهذا الرقم.",
        });
        return;
      }
    }

    const consultation = new ConsultationModel(data);
    await consultation.save();
    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
});

// 2. Check status by phone (Public)
router.get("/status", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const phone = req.query.phone as string;
    if (!phone) {
      res.status(400).json({ success: false, message: "Phone query parameter is required" });
      return;
    }

    const consultations = await ConsultationModel.find({ phone })
      .sort({ createdAt: -1 })
      .exec();

    const result = consultations.map((c) => ({
      _id: c._id,
      clientName: c.clientName,
      consultationType: c.consultationType,
      status: c.status,
      adminReply: c.adminReply,
      createdAt: c.createdAt,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Protected routes context wrapper
router.use(requireAuth);

// 3. Get all consultations (Protected)
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultations = await ConsultationModel.find()
      .sort({ createdAt: -1 })
      .exec();
    res.json({ success: true, data: consultations });
  } catch (error) {
    next(error);
  }
});

// 4. Get latest sync checkpoint (Protected)
router.get("/latest-sync", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await ConsultationModel.countDocuments().exec();
    const doc = await ConsultationModel.findOne({}, { updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    res.json({
      success: true,
      data: {
        count,
        lastUpdated: doc && doc.updatedAt ? new Date(doc.updatedAt).getTime() : 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 5. Get dashboard statistics and recent listings (Protected)
router.get("/dashboard-stats", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultations = await ConsultationModel.find()
      .sort({ createdAt: -1 })
      .exec();

    const total = consultations.length;
    const pending = consultations.filter((c) => c.status === "جديد").length;
    const activeCases = consultations.filter((c) => c.status === "قيد المتابعة").length;

    let availableLawyers = 0;
    try {
      const settings = await SiteSettingsModel.findOne();
      if (settings && settings.lawyers) {
        availableLawyers = settings.lawyers.length;
      }
    } catch (err) {
      console.error("Failed to load settings in dashboard stats:", err);
    }

    res.json({
      success: true,
      data: {
        totalConsultations: total,
        pendingRequests: pending,
        activeCases,
        availableLawyers,
        latestConsultations: consultations.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
});

// 6. Update status / admin reply for a consultation (Protected)
router.put("/:id", validate(validateUpdateConsultation), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const updated = await ConsultationModel.findByIdAndUpdate(id, req.body, { new: true }).exec();

    if (!updated) {
      res.status(404).json({ success: false, message: "Consultation not found" });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
