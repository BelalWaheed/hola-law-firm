import { BaseService } from "../../core/base/BaseService";
import { IConsultation } from "./consultation.model";
import { CreateConsultationDTO, UpdateConsultationDTO } from "./consultation.schema";
import { ConsultationRepository } from "./consultation.repository";
import { SettingsRepository } from "../settings/settings.repository";

export class ConsultationService extends BaseService<IConsultation, CreateConsultationDTO, UpdateConsultationDTO> {
  constructor(
    protected readonly consultationRepository: ConsultationRepository,
    private readonly settingsRepository: SettingsRepository
  ) {
    super(consultationRepository);
  }

  async create(data: CreateConsultationDTO): Promise<IConsultation> {
    const existing = await this.consultationRepository.findAll({ phone: data.phone });
    if (existing.length > 0) {
      const existingName = existing[0].clientName.trim().toLowerCase();
      const newName = data.clientName.trim().toLowerCase();
      if (existingName !== newName) {
        throw new Error("رقم الجوال هذا مسجل بالفعل باسم آخر. يرجى استخدام الاسم المرتبط بهذا الرقم.");
      }
    }
    return this.consultationRepository.create(data);
  }

  async getDashboardStats() {
    const consultations = await this.findAll();
    const total = consultations.length;
    const pending = consultations.filter((c) => c.status === "جديد").length;
    const activeCases = consultations.filter((c) => c.status === "قيد المتابعة").length;

    let availableLawyers = 0;
    try {
      const settings = await this.settingsRepository.findOne();
      if (settings && settings.lawyers) {
        availableLawyers = settings.lawyers.length;
      }
    } catch (err) {
      console.error("Failed to load settings in dashboard stats:", err);
    }

    return {
      totalConsultations: total,
      pendingRequests: pending,
      activeCases,
      availableLawyers,
      latestConsultations: consultations.slice(0, 10),
    };
  }

  async findStatusByPhone(phone: string) {
    const consultations = await this.consultationRepository.findAll({ phone });
    return consultations.map((c) => ({
      _id: c._id,
      clientName: c.clientName,
      consultationType: c.consultationType,
      status: c.status,
      adminReply: c.adminReply,
      createdAt: c.createdAt,
    }));
  }
}
