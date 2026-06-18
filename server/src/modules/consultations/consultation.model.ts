import { Schema, model, Document } from "mongoose";

export interface IConsultation extends Document {
  clientName: string;
  phone: string;
  consultationType: string;
  status: "جديد" | "تم الرد" | "قيد المتابعة";
  details: string;
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
  {
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    consultationType: { type: String, required: true },
    status: {
      type: String,
      enum: ["جديد", "تم الرد", "قيد المتابعة"],
      default: "جديد",
    },
    details: { type: String, required: true },
    adminReply: { type: String, required: false },
  },
  { timestamps: true }
);

export const ConsultationModel = model<IConsultation>("Consultation", consultationSchema);
