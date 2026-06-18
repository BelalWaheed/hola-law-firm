import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardStats } from "../features/dashboard/components/DashboardStats";
import { ConsultationsTable, type Consultation } from "../features/dashboard/components/ConsultationsTable";
import { getDashboardStats, updateConsultationStatus } from "../features/dashboard/api/dashboard.api";
import { getSiteSettings, updateSiteSettings } from "../features/landing/api/landing.api";
import type { LandingPageContent } from "../features/landing/data/landingData";
import { Logo } from "../components/Logo";

interface DashboardStatsData {
  totalConsultations: number;
  pendingRequests: number;
  activeCases: number;
  availableLawyers: number;
  latestConsultations: Consultation[];
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"consultations" | "settings">("consultations");

  // Site Settings Form States
  const [formData, setFormData] = useState<LandingPageContent | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<"hero" | "stats" | "services" | "lawyers" | "contact">("hero");

  // Consultation Details & Messaging Modal States
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Session expired or fetch failed:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await getSiteSettings();
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Failed to load settings in dashboard:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchSettings()]);
      setLoading(false);
    };
    initData();
  }, [navigate, fetchStats, fetchSettings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation) return;
    setSendingReply(true);
    setReplyError("");
    setReplySuccess(false);

    try {
      // Set status to 'تم الرد' when replying unless it is manually overridden
      const targetStatus = selectedConsultation.status === "جديد" ? "تم الرد" : selectedConsultation.status;
      
      await updateConsultationStatus(selectedConsultation._id, targetStatus, replyText);
      await fetchStats();
      
      setSelectedConsultation({
        ...selectedConsultation,
        status: targetStatus,
        adminReply: replyText,
      });
      
      setReplyText("");
      setReplySuccess(true);
      setTimeout(() => setReplySuccess(false), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الرد";
      setReplyError(msg);
    } finally {
      setSendingReply(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess(false);

    try {
      const response = await updateSiteSettings(formData);
      if (response.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ التعديلات";
      setSettingsError(msg);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleStatChange = (index: number, field: string, value: string | number) => {
    if (!formData) return;
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const handleLawyerChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newLawyers = [...formData.lawyers];
    newLawyers[index] = { ...newLawyers[index], [field]: value };
    setFormData({ ...formData, lawyers: newLawyers });
  };

  const handleAddLawyer = () => {
    if (!formData) return;
    const newLawyers = [
      ...formData.lawyers,
      {
        id: "l-" + Date.now(),
        name: "عضو جديد",
        title: "محامي",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        linkedin: "",
        twitter: "",
        email: ""
      }
    ];
    setFormData({ ...formData, lawyers: newLawyers });
  };

  const handleRemoveLawyer = (index: number) => {
    if (!formData) return;
    const newLawyers = formData.lawyers.filter((_, idx) => idx !== index);
    setFormData({ ...formData, lawyers: newLawyers });
  };

  const handleOfficeChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      office: { ...formData.office, [field]: value }
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="relative min-h-screen bg-bg-primary text-white font-sans">
      <div className="bg-pattern" />

      {/* Top Header bar */}
      <header className="navbar scrolled relative z-10 border-b border-border-color">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-bold text-accent-gold font-amiri">لوحة تحكم المشرف</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")} 
              className="btn-secondary px-4 py-2 text-sm border border-border-color hover:border-accent-gold hover:text-accent-gold rounded-[4px] transition-colors"
            >
              عرض الموقع
            </button>
            <button 
              onClick={handleLogout} 
              className="btn-secondary px-4 py-2 text-sm flex items-center gap-2 border border-border-color hover:border-accent-gold hover:text-accent-gold rounded-[4px] transition-colors"
            >
              <span>تسجيل الخروج</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body grid layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          
          {/* Welcome title message card */}
          <div className="p-8 rounded-[16px] bg-linear-to-r from-bg-card to-bg-secondary border border-border-color flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-gold mb-2 font-amiri">مرحباً بك، المدير المسؤول</h1>
              <p className="text-text-secondary text-sm">
                متابعة طلبات الاستشارة وتعديل محتوى وتفاصيل الموقع.
              </p>
            </div>
            {/* Tabs Trigger */}
            <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border-color shrink-0">
              <button 
                onClick={() => setActiveTab("consultations")}
                className={`px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors ${activeTab === "consultations" ? "bg-accent-gold text-bg-primary" : "text-text-secondary hover:text-white"}`}
              >
                طلبات الاستشارة
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors ${activeTab === "settings" ? "bg-accent-gold text-bg-primary" : "text-text-secondary hover:text-white"}`}
              >
                إعدادات الموقع
              </button>
            </div>
          </div>

          {activeTab === "consultations" ? (
            stats && (
              <>
                <DashboardStats stats={stats} />
                <ConsultationsTable
                  consultations={stats.latestConsultations}
                  onStatusChange={fetchStats}
                  onViewDetails={(c) => {
                    setSelectedConsultation(c);
                    setReplyText(c.adminReply || "");
                  }}
                />
              </>
            )
          ) : (
            formData && (
              <div className="p-8 rounded-[16px] bg-bg-card border border-border-color">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Settings sub-tabs sidebar */}
                  <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto pb-4 md:pb-0 border-b md:border-b-0 md:border-l border-border-color pr-0 md:pl-6">
                    <button
                      type="button"
                      onClick={() => setActiveSettingsSection("hero")}
                      className={`text-right w-full px-4 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeSettingsSection === "hero" ? "bg-accent-gold/10 text-accent-gold-light border-r-2 border-accent-gold" : "text-text-secondary hover:text-white"}`}
                    >
                      القسم الرئيسي والترويج
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsSection("stats")}
                      className={`text-right w-full px-4 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeSettingsSection === "stats" ? "bg-accent-gold/10 text-accent-gold-light border-r-2 border-accent-gold" : "text-text-secondary hover:text-white"}`}
                    >
                      إحصائيات المكتب
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsSection("services")}
                      className={`text-right w-full px-4 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeSettingsSection === "services" ? "bg-accent-gold/10 text-accent-gold-light border-r-2 border-accent-gold" : "text-text-secondary hover:text-white"}`}
                    >
                      الخدمات القانونية
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsSection("lawyers")}
                      className={`text-right w-full px-4 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeSettingsSection === "lawyers" ? "bg-accent-gold/10 text-accent-gold-light border-r-2 border-accent-gold" : "text-text-secondary hover:text-white"}`}
                    >
                      فريق المحامين
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsSection("contact")}
                      className={`text-right w-full px-4 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeSettingsSection === "contact" ? "bg-accent-gold/10 text-accent-gold-light border-r-2 border-accent-gold" : "text-text-secondary hover:text-white"}`}
                    >
                      الاتصال والتذييل
                    </button>
                  </div>

                  {/* Settings Editor Forms */}
                  <form onSubmit={handleSaveSettings} className="flex-1 space-y-6" noValidate>
                    {settingsSuccess && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm">
                        تم حفظ تعديلات الموقع بنجاح!
                      </div>
                    )}
                    {settingsError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                        {settingsError}
                      </div>
                    )}

                    {activeSettingsSection === "hero" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-accent-gold mb-4 border-b border-border-color pb-2">القسم الرئيسي (Hero & Navbar)</h3>
                        <div className="form-group">
                          <label className="form-label">عنوان شريط التنقل (اللوجو) والفوتر</label>
                          <input type="text" className="form-input" value={formData.navbarBrand} onChange={(e) => setFormData({ ...formData, navbarBrand: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">نص الشارة العلوية (Badge)</label>
                          <input type="text" className="form-input" value={formData.badgeText} onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })} required />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="form-group">
                            <label className="form-label">العنوان الرئيسي - سطر 1</label>
                            <input type="text" className="form-input" value={formData.heroTitlePrefix} onChange={(e) => setFormData({ ...formData, heroTitlePrefix: e.target.value })} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">العنوان الرئيسي - سطر 2 (ذهبي)</label>
                            <input type="text" className="form-input" value={formData.heroTitleSuffix} onChange={(e) => setFormData({ ...formData, heroTitleSuffix: e.target.value })} required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الفرعي (الوصف)</label>
                          <textarea className="form-input min-h-[100px]" value={formData.heroSubtitle} onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">نص زر الدعوة للإجراء (CTA)</label>
                          <input type="text" className="form-input" value={formData.heroCtaText} onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })} required />
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === "stats" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-accent-gold mb-4 border-b border-border-color pb-2">إحصائيات وأرقام المكتب</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {formData.stats.map((stat, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-3">
                              <span className="font-semibold text-xs text-accent-gold-light block border-b border-border-color pb-1">الرقم الإحصائي {idx + 1}</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="form-group m-0">
                                  <label className="form-label text-xs">الرقم المستهدف</label>
                                  <input type="number" className="form-input" value={stat.target} onChange={(e) => handleStatChange(idx, "target", parseInt(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group m-0">
                                  <label className="form-label text-xs">اللاحقة (مثال: + / %)</label>
                                  <input type="text" className="form-input" value={stat.suffix} onChange={(e) => handleStatChange(idx, "suffix", e.target.value)} required />
                                </div>
                              </div>
                              <div className="form-group m-0">
                                <label className="form-label text-xs">الوصف الإحصائي</label>
                                <input type="text" className="form-input" value={stat.label} onChange={(e) => handleStatChange(idx, "label", e.target.value)} required />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === "services" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-accent-gold mb-4 border-b border-border-color pb-2">الخدمات القانونية</h3>
                        <div className="form-group">
                          <label className="form-label">العنوان الرئيسي للقسم</label>
                          <input type="text" className="form-input" value={formData.servicesTitle} onChange={(e) => setFormData({ ...formData, servicesTitle: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الفرعي (الوصف)</label>
                          <input type="text" className="form-input" value={formData.servicesSubtitle} onChange={(e) => setFormData({ ...formData, servicesSubtitle: e.target.value })} required />
                        </div>

                        <div className="border-t border-border-color pt-4 space-y-4">
                          <h4 className="font-bold text-sm text-text-secondary">تفاصيل كروت الخدمات المتاحة</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {formData.services.map((service, idx) => (
                              <div key={idx} className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-3">
                                <span className="font-semibold text-xs text-accent-gold-light block border-b border-border-color pb-1">{service.title}</span>
                                <div className="form-group m-0">
                                  <label className="form-label text-xs">اسم الخدمة</label>
                                  <input type="text" className="form-input" value={service.title} onChange={(e) => handleServiceChange(idx, "title", e.target.value)} required />
                                </div>
                                <div className="form-group m-0">
                                  <label className="form-label text-xs">وصف الخدمة</label>
                                  <textarea className="form-input min-h-[80px] text-sm" value={service.description} onChange={(e) => handleServiceChange(idx, "description", e.target.value)} required />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === "lawyers" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-accent-gold mb-4 border-b border-border-color pb-2">فريق المحامين</h3>
                        <div className="form-group">
                          <label className="form-label">العنوان الرئيسي للقسم</label>
                          <input type="text" className="form-input" value={formData.lawyersTitle} onChange={(e) => setFormData({ ...formData, lawyersTitle: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الفرعي للقسم</label>
                          <input type="text" className="form-input" value={formData.lawyersSubtitle} onChange={(e) => setFormData({ ...formData, lawyersSubtitle: e.target.value })} required />
                        </div>

                        <div className="border-t border-border-color pt-4 space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm text-text-secondary m-0">أعضاء فريق العمل</h4>
                            <button
                              type="button"
                              onClick={handleAddLawyer}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] border border-accent-gold/20 text-accent-gold hover:bg-[rgba(201,162,39,0.15)] transition-all text-xs font-bold cursor-pointer"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              <span>إضافة محامي جديد</span>
                            </button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            {formData.lawyers.map((lawyer, idx) => (
                              <div key={idx} className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-3">
                                <div className="flex justify-between items-center border-b border-border-color pb-1">
                                  <span className="font-semibold text-xs text-accent-gold-light block">{lawyer.name || "عضو جديد"}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLawyer(idx)}
                                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-xs font-bold cursor-pointer"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    <span>حذف</span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="form-group m-0">
                                    <label className="form-label text-xs">الاسم</label>
                                    <input type="text" className="form-input text-sm" value={lawyer.name} onChange={(e) => handleLawyerChange(idx, "name", e.target.value)} required />
                                  </div>
                                  <div className="form-group m-0">
                                    <label className="form-label text-xs">المسمى الوظيفي</label>
                                    <input type="text" className="form-input text-sm" value={lawyer.title} onChange={(e) => handleLawyerChange(idx, "title", e.target.value)} required />
                                  </div>
                                </div>
                                <div className="form-group m-0">
                                  <label className="form-label text-xs">رابط الصورة (Unsplash أو أي عنوان URL)</label>
                                  <input type="url" className="form-input text-xs" value={lawyer.imageUrl} onChange={(e) => handleLawyerChange(idx, "imageUrl", e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="form-group m-0">
                                    <label className="form-label text-[10px]">LinkedIn</label>
                                    <input type="text" className="form-input text-xs p-1" value={lawyer.linkedin} onChange={(e) => handleLawyerChange(idx, "linkedin", e.target.value)} />
                                  </div>
                                  <div className="form-group m-0">
                                    <label className="form-label text-[10px]">Twitter</label>
                                    <input type="text" className="form-input text-xs p-1" value={lawyer.twitter} onChange={(e) => handleLawyerChange(idx, "twitter", e.target.value)} />
                                  </div>
                                  <div className="form-group m-0">
                                    <label className="form-label text-[10px]">Email</label>
                                    <input type="text" className="form-input text-xs p-1" value={lawyer.email} onChange={(e) => handleLawyerChange(idx, "email", e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === "contact" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-accent-gold mb-4 border-b border-border-color pb-2">الاتصال والتذييل (Contact & Footer)</h3>
                        
                        <div className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-4">
                          <span className="font-semibold text-xs text-accent-gold-light block border-b border-border-color pb-1">موقع المكتب وتفاصيل الاتصال</span>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group m-0">
                              <label className="form-label text-xs">العنوان</label>
                              <input type="text" className="form-input" value={formData.office.address} onChange={(e) => handleOfficeChange("address", e.target.value)} required />
                            </div>
                            <div className="form-group m-0">
                              <label className="form-label text-xs">رقم الهاتف</label>
                              <input type="text" className="form-input" value={formData.office.phone} onChange={(e) => handleOfficeChange("phone", e.target.value)} required />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group m-0">
                              <label className="form-label text-xs">البريد الإلكتروني للمكتب</label>
                              <input type="email" className="form-input" value={formData.office.email} onChange={(e) => handleOfficeChange("email", e.target.value)} required />
                            </div>
                            <div className="form-group m-0">
                              <label className="form-label text-xs">مواعيد العمل</label>
                              <input type="text" className="form-input" value={formData.office.hours} onChange={(e) => handleOfficeChange("hours", e.target.value)} required />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-4">
                          <span className="font-semibold text-xs text-accent-gold-light block border-b border-border-color pb-1">نصوص التذييل (Footer)</span>
                          <div className="form-group m-0">
                            <label className="form-label text-xs">وصف التذييل</label>
                            <textarea className="form-input min-h-[80px] text-sm" value={formData.footerDesc} onChange={(e) => setFormData({ ...formData, footerDesc: e.target.value })} required />
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-bg-secondary border border-border-color space-y-4">
                          <span className="font-semibold text-xs text-accent-gold-light block border-b border-border-color pb-1">روابط مواقع التواصل الاجتماعي في التذييل</span>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group m-0">
                              <label className="form-label text-xs">رابط فيسبوك (Facebook)</label>
                              <input type="url" className="form-input text-sm" value={formData.facebookLink || ""} onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })} />
                            </div>
                            <div className="form-group m-0">
                              <label className="form-label text-xs">رابط تويتر (Twitter / X)</label>
                              <input type="url" className="form-input text-sm" value={formData.twitterLink || ""} onChange={(e) => setFormData({ ...formData, twitterLink: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group m-0">
                              <label className="form-label text-xs">رابط لينكد إن (LinkedIn)</label>
                              <input type="url" className="form-input text-sm" value={formData.linkedinLink || ""} onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })} />
                            </div>
                            <div className="form-group m-0">
                              <label className="form-label text-xs">رابط إنستغرام (Instagram)</label>
                              <input type="url" className="form-input text-sm" value={formData.instagramLink || ""} onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-border-color pt-6 flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary px-8 py-3"
                        disabled={savingSettings}
                      >
                        {savingSettings ? "جاري الحفظ..." : "حفظ التعديلات"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )
          )}

        </div>
      </main>

      {/* Consultation Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-xs" 
            onClick={() => {
              setSelectedConsultation(null);
              setReplyText("");
              setReplyError("");
              setReplySuccess(false);
            }}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-bg-card border border-border-color rounded-[16px] overflow-hidden shadow-2xl z-10 animate-fade-in text-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <button
                type="button"
                className="text-text-secondary hover:text-white transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedConsultation(null);
                  setReplyText("");
                  setReplyError("");
                  setReplySuccess(false);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-accent-gold font-amiri">تفاصيل طلب الاستشارة</h3>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-text-secondary text-xs block mb-0.5">اسم العميل</span>
                  <span className="text-white font-bold text-base">{selectedConsultation.clientName}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-xs block mb-0.5">رقم الجوال</span>
                  <span className="text-white font-bold text-base" dir="ltr">{selectedConsultation.phone}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-xs block mb-0.5">نوع الاستشارة</span>
                  <span className="text-accent-gold-light font-medium text-base">{selectedConsultation.consultationType}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-xs block mb-0.5">تاريخ التقديم</span>
                  <span className="text-white text-sm">
                    {new Date(selectedConsultation.createdAt).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-text-secondary text-xs block mb-1">تفاصيل القضية</span>
                <p className="p-4 rounded-lg bg-bg-primary border border-border-color text-sm text-white leading-relaxed whitespace-pre-wrap">
                  {selectedConsultation.details}
                </p>
              </div>

              {/* Existing Reply Display */}
              {selectedConsultation.adminReply && (
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <span className="text-green-400 text-xs font-bold block mb-1">الرد الحالي المرسل للمستخدم</span>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                    {selectedConsultation.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-border-color">
                <div className="form-group m-0">
                  <label className="form-label text-xs" htmlFor="replyMessage">إرسال رسالة / رد جديد للمستخدم</label>
                  <textarea
                    id="replyMessage"
                    className="form-input min-h-[100px] text-sm"
                    placeholder="اكتب ردك أو التوجيهات القانونية هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                </div>

                {replyError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                    {replyError}
                  </div>
                )}

                {replySuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs">
                    تم إرسال الرد بنجاح! سيتمكن العميل من رؤيته فور الاستعلام برقم جواله.
                  </div>
                )}

                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-text-secondary text-xs">تغيير الحالة إلى:</label>
                    <select
                      className="bg-bg-secondary border border-border-color text-white rounded p-1 text-xs"
                      value={selectedConsultation.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await updateConsultationStatus(selectedConsultation._id, newStatus, selectedConsultation.adminReply);
                          await fetchStats();
                          setSelectedConsultation({
                            ...selectedConsultation,
                            status: newStatus
                          });
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      <option value="جديد">جديد</option>
                      <option value="قيد المتابعة">قيد المتابعة</option>
                      <option value="تم الرد">تم الرد</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="relative inline-flex items-center justify-center py-2 px-6 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary font-bold text-xs rounded-[4px] cursor-pointer hover:shadow-lg transition-all"
                    disabled={sendingReply}
                  >
                    {sendingReply ? "جاري الإرسال..." : "إرسال الرسالة للمستخدم"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
