import React, { useState } from "react";
import { updateConsultationStatus } from "../api/consultations";

export interface Consultation {
  _id: string;
  clientName: string;
  phone: string;
  consultationType: string;
  status: string;
  details: string;
  adminReply?: string;
  createdAt: string;
}

interface ConsultationsTableProps {
  consultations: Consultation[];
  onStatusChange: () => void;
  onViewDetails: (consultation: Consultation) => void;
}

type FilterState = "الكل" | "جديد" | "قيد المتابعة" | "تم الرد";

export const ConsultationsTable: React.FC<ConsultationsTableProps> = ({
  consultations,
  onStatusChange,
  onViewDetails,
}) => {
  const [filter, setFilter] = useState<FilterState>("الكل");

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateConsultationStatus(id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    if (filter === "الكل") return true;
    return c.status === filter;
  });

  return (
    <div className="p-8 rounded-[16px] bg-bg-card border border-border-color">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-accent-gold font-amiri">أحدث طلبات الاستشارة الواردة</h2>
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(["الكل", "جديد", "قيد المتابعة", "تم الرد"] as FilterState[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                filter === status
                  ? "bg-accent-gold text-bg-primary"
                  : "text-text-secondary bg-bg-primary hover:text-white border border-border-color"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-border-color text-text-secondary text-sm">
              <th className="pb-4 pr-4 font-bold">اسم العميل</th>
              <th className="pb-4 font-bold">رقم الجوال</th>
              <th className="pb-4 font-bold">نوع الاستشارة</th>
              <th className="pb-4 font-bold">الحالة</th>
              <th className="pb-4 font-bold">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.map((c) => (
              <tr key={c._id} className="border-b border-border-color/50 text-sm hover:bg-bg-secondary/40 transition-colors">
                <td className="py-4 pr-4">{c.clientName}</td>
                <td className="py-4">{c.phone}</td>
                <td className="py-4 text-accent-gold-light">{c.consultationType}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    c.status === 'جديد' ? 'bg-[rgba(232,197,71,0.1)] text-accent-gold-light' :
                    c.status === 'تم الرد' ? 'bg-[rgba(34,197,94,0.1)] text-green-400' :
                    'bg-[rgba(148,163,184,0.1)] text-text-secondary'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(c)}
                      className="inline-flex items-center justify-center py-1 px-3 text-xs bg-transparent border border-border-color text-text-primary hover:border-accent-gold hover:text-accent-gold rounded transition-colors whitespace-nowrap cursor-pointer font-medium"
                    >
                      تفاصيل
                    </button>
                    <select 
                      className="bg-bg-secondary border border-border-color text-white rounded p-1 [&>option]:bg-bg-card [&>option]:text-white text-xs"
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                    >
                      <option value="جديد">جديد</option>
                      <option value="تم الرد">تم الرد</option>
                      <option value="قيد المتابعة">قيد المتابعة</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filteredConsultations.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-secondary">لا يوجد طلبات تطابق الفلتر المختار</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
