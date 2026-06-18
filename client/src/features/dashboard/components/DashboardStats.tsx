import React from "react";

interface DashboardStatsProps {
  stats: {
    totalConsultations: number;
    pendingRequests: number;
    activeCases: number;
    availableLawyers: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="p-6 rounded-[12px] bg-bg-card border border-border-color flex flex-col gap-2">
        <span className="text-text-secondary text-xs font-semibold">إجمالي طلبات الاستشارة</span>
        <span className="text-3xl font-extrabold text-accent-gold font-amiri">{stats.totalConsultations}</span>
      </div>

      <div className="p-6 rounded-[12px] bg-bg-card border border-border-color flex flex-col gap-2">
        <span className="text-text-secondary text-xs font-semibold">طلبات بانتظار المراجعة</span>
        <span className="text-3xl font-extrabold text-accent-gold font-amiri">{stats.pendingRequests}</span>
        <span className="text-accent-gold-light text-xs flex items-center gap-1 font-sans">
          <span>● قيد التدقيق</span>
        </span>
      </div>

      <div className="p-6 rounded-[12px] bg-bg-card border border-border-color flex flex-col gap-2">
        <span className="text-text-secondary text-xs font-semibold">إجمالي القضايا النشطة</span>
        <span className="text-3xl font-extrabold text-accent-gold font-amiri">{stats.activeCases}</span>
        <span className="text-blue-400 text-xs flex items-center gap-1 font-sans">
          <span>قضايا جارية</span>
        </span>
      </div>

      <div className="p-6 rounded-[12px] bg-bg-card border border-border-color flex flex-col gap-2">
        <span className="text-text-secondary text-xs font-semibold">المحامون المتاحون</span>
        <span className="text-3xl font-extrabold text-accent-gold font-amiri">{stats.availableLawyers}</span>
        <span className="text-green-400 text-xs flex items-center gap-1 font-sans">
          <span>نشط الآن</span>
        </span>
      </div>
    </div>
  );
};
