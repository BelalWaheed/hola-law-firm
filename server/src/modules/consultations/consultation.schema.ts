import { Request } from "express";
import { ValidationResult } from "../../core/middlewares/validate.middleware";

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

export const validateCreateConsultation = (req: Request): ValidationResult => {
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

export const validateUpdateConsultation = (req: Request): ValidationResult => {
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
