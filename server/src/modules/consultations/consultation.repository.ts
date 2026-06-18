import { IRepository } from "../../core/interfaces/IRepository";
import { ConsultationModel, IConsultation } from "./consultation.model";
import { CreateConsultationDTO, UpdateConsultationDTO } from "./consultation.schema";

export class ConsultationRepository implements IRepository<IConsultation, CreateConsultationDTO, UpdateConsultationDTO> {
  async findById(id: string): Promise<IConsultation | null> {
    return ConsultationModel.findById(id).exec();
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IConsultation[]> {
    return ConsultationModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async create(data: CreateConsultationDTO): Promise<IConsultation> {
    const consultation = new ConsultationModel(data);
    return consultation.save();
  }

  async update(id: string, data: UpdateConsultationDTO): Promise<IConsultation | null> {
    return ConsultationModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await ConsultationModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
