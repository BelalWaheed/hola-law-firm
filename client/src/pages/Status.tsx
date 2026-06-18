import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import {
  getSiteSettings,
  checkConsultationStatus,
} from "../features/landing/api/landing.api";
import {
  defaultLandingData,
  type LandingPageContent,
} from "../features/landing/data/landingData";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface ConsultationStatusItem {
  _id: string;
  clientName: string;
  consultationType: string;
  status: string;
  adminReply?: string;
  createdAt: string;
}

export const Status: React.FC = () => {
  const [settings, setSettings] = useState<LandingPageContent | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Use lazy state initialization to prevent sync state updates in mount effect
  const [phone, setPhone] = useState(() => {
    return sessionStorage.getItem("hola_status_phone") ||
      localStorage.getItem("hola_user_phone") || "";
  });

  const [querying, setQuerying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState<ConsultationStatusItem[] | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSiteSettings();
        if (response.success && response.data) {
          setSettings(response.data);
        } else {
          setSettings(defaultLandingData);
        }
      } catch {
        setSettings(defaultLandingData);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  const fetchStatus = useCallback(async (phoneVal: string) => {
    setErrorMsg("");
    setQuerying(true);
    try {
      const response = await checkConsultationStatus(phoneVal);
      if (response.success && response.data) {
        // Sort: show items with adminReply first, then sort by date descending
        const sorted = [...response.data].sort((a: ConsultationStatusItem, b: ConsultationStatusItem) => {
          const aHasReply = !!a.adminReply;
          const bHasReply = !!b.adminReply;
          if (aHasReply && !bHasReply) return -1;
          if (!aHasReply && bHasReply) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setResults(sorted);
        if (sorted.length > 0 && sorted[0].clientName) {
          localStorage.setItem("hola_user_name", sorted[0].clientName);
        }

        // Initialize expandedIds when fetching is complete (avoiding separate sync useEffect)
        if (sorted.length > 0) {
          const initialExpanded: Record<string, boolean> = {
            [sorted[0]._id]: true,
          };
          const urlParams = new URLSearchParams(window.location.search);
          const replyId = urlParams.get("replyId");
          if (replyId) {
            initialExpanded[replyId] = true;
          }
          setExpandedIds(initialExpanded);
        }
      } else {
        setResults([]);
      }
      sessionStorage.setItem("hola_status_phone", phoneVal);
      localStorage.setItem("hola_user_phone", phoneVal);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "حدث خطأ أثناء جلب حالة الطلب";
      setErrorMsg(msg);
      setResults(null);
    } finally {
      setQuerying(false);
    }
  }, []);

  useEffect(() => {
    if (phone) {
      const timer = setTimeout(() => {
        fetchStatus(phone);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [phone, fetchStatus]);

  // Set consultation replies as read when displayed
  useEffect(() => {
    if (results && results.length > 0) {
      const repliedIds = results
        .filter((item) => !!item.adminReply)
        .map((item) => item._id);

      if (repliedIds.length > 0) {
        const seenStr = localStorage.getItem("hola_seen_replies");
        let seenIds: string[];
        try {
          const parsed = seenStr ? JSON.parse(seenStr) : [];
          seenIds = Array.isArray(parsed) ? parsed : [];
        } catch {
          seenIds = [];
        }

        const updatedSeenIds = Array.from(new Set([...seenIds, ...repliedIds]));
        if (updatedSeenIds.length !== seenIds.length) {
          localStorage.setItem(
            "hola_seen_replies",
            JSON.stringify(updatedSeenIds),
          );
          // Dispatch a custom event to notify Navbar of badge state updates
          window.dispatchEvent(new Event("hola_seen_replies_updated"));
        }
      }
    }
  }, [results]);

  // Handle auto-scroll to reply card
  useEffect(() => {
    if (results && results.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const replyId = urlParams.get("replyId");
      if (replyId) {
        setTimeout(() => {
          const element = document.getElementById(`consultation-${replyId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("highlighted-reply-card");
          }
        }, 150);
      } else {
        // Fallback scroll to first reply if URL has no specific query but unread exist
        const firstReplied = results.find((r) => r.adminReply);
        if (firstReplied) {
          setTimeout(() => {
            const element = document.getElementById(
              `consultation-${firstReplied._id}`,
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 150);
        }
      }
    }
  }, [results]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhone = phone.trim();
    const phoneRegex = /^(01[0125]\d{8}|\+201[0125]\d{8})$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setErrorMsg("رقم الجوال المصري غير صحيح (مثال: 01001234567)");
      return;
    }
    await fetchStatus(trimmedPhone);
  };

  if (loadingSettings) {
    return <LoadingSpinner />;
  }

  const siteData = settings || defaultLandingData;

  const responded = results ? results.filter((item) => !!item.adminReply) : [];
  const pending = results ? results.filter((item) => !item.adminReply) : [];

  return (
    <div className="relative min-h-screen bg-bg-primary text-white font-sans overflow-x-hidden flex flex-col justify-between">
      <div className="bg-pattern" />
      <div>
        <Navbar settings={siteData} />

        {/* Header banner */}
        <div className="relative pt-32 pb-12 z-10 text-center bg-linear-to-b from-bg-secondary to-bg-primary border-b border-border-color">
          <h1 className="text-4xl font-extrabold text-accent-gold mb-3 font-amiri">
            متابعة طلب الاستشارة
          </h1>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            أدخل رقم الجوال الذي استخدمته لتقديم الطلب لمتابعة حالة استشارتك
          </p>
        </div>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 w-full">
          <div className="form-container p-6 md:p-8 rounded-[16px] bg-bg-card border border-border-color">
            <form
              onSubmit={handleQuery}
              className="flex flex-col md:flex-row gap-4 items-end"
              noValidate
            >
              <div className="form-group flex-1 m-0">
                <label className="form-label mb-2 block" htmlFor="queryPhone">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  id="queryPhone"
                  className="form-input w-full"
                  placeholder="01001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full md:w-auto shrink-0 py-4"
                disabled={querying}
              >
                {querying ? "جاري الاستعلام..." : "استعلام عن الطلب"}
              </button>
            </form>

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-100/10 border border-red-600/30 text-red-400 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Results section */}
          {results !== null && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-accent-gold mb-6 font-amiri border-b border-border-color pb-3">
                طلبات الاستشارة الخاصة بك
              </h2>

              {(() => {
                try {
                  const seen = JSON.parse(
                    localStorage.getItem("hola_seen_replies") || "[]",
                  );
                  const hasUnread = results.some(
                    (item) => item.adminReply && !seen.includes(item._id),
                  );
                  if (hasUnread) {
                    return (
                      <div className="mb-6 p-4 rounded-[12px] bg-[rgba(201,162,39,0.1)] border border-accent-gold text-accent-gold-light text-right flex items-center gap-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="shrink-0 text-accent-gold"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div>
                          <h4 className="font-bold text-base">
                            يوجد رد جديد على استشارتك!
                          </h4>
                          <p className="text-sm text-text-secondary">
                            تم الرد من قِبل المستشار القانوني. يمكنك مراجعة
                            تفاصيل الرد أدناه.
                          </p>
                        </div>
                      </div>
                    );
                  }
                } catch (e) {
                  console.error(e);
                }
                return null;
              })()}

              {results.length === 0 ? (
                <div className="p-8 text-center text-text-secondary bg-bg-card border border-border-color rounded-lg">
                  لا توجد طلبات استشارة مسجلة برقم الجوال هذا.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Responded Consultations */}
                  {responded.length > 0 && (
                    <div className="space-y-4">
                      {responded.map((item, index) => {
                        const isExpanded = !!expandedIds[item._id];
                        return (
                          <div
                            key={item._id}
                            id={`consultation-${item._id}`}
                            className="p-6 rounded-[12px] bg-bg-card border border-border-color hover:border-accent-gold transition-all"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-bold text-lg">
                                    {item.clientName}
                                  </span>

                                  <p className="text-text-secondary text-sm">
                                    نوع الاستشارة:{" "}
                                    <span className="text-white">
                                      {item.consultationType}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-text-secondary text-xs">
                                  تاريخ التقديم
                                </p>
                                <p className="text-white text-sm">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "ar-EG",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>

                            {item.adminReply && (
                              <div className="mt-4">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(item._id)}
                                    className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-[rgba(201,162,39,0.06)] border border-accent-gold/20 text-accent-gold-light hover:bg-[rgba(201,162,39,0.12)] hover:border-accent-gold/40 transition-all text-sm font-semibold cursor-pointer"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <span>إخفاء الرد القانوني</span>
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="transform rotate-180 transition-transform"
                                        >
                                          <polyline points="18 15 12 9 6 15"></polyline>
                                        </svg>
                                      </>
                                    ) : (
                                      <>
                                        <span>عرض الرد القانوني</span>
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="transition-transform"
                                        >
                                          <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                      </>
                                    )}
                                  </button>
                                )}

                                {(index === 0 || isExpanded) && (
                                  <div className="mt-4 p-4 rounded-lg bg-[rgba(201,162,39,0.05)] border border-accent-gold/20 text-right">
                                    <span className="text-accent-gold-light text-base font-bold block mb-1.5">
                                      رد المستشار القانوني:
                                    </span>
                                    <p className="text-white text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                      {item.adminReply}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Grouped Pending Consultations */}
                  {pending.length > 0 && (
                    <div className="mt-6">
                      <div className="p-6 rounded-[12px] bg-bg-card border border-border-color">
                        <div className="flex items-center gap-3 mb-4 border-b border-border-color pb-3">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-accent-gold shrink-0 animate-pulse"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <h3 className="text-lg font-bold text-accent-gold font-amiri m-0">
                            طلبات استشارة قيد المراجعة والرد
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {pending.map((item) => (
                            <div
                              key={item._id}
                              className="p-4 rounded-lg bg-bg-primary/30 border border-border-color/40 flex flex-wrap items-center justify-between gap-4"
                            >
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-bold text-base">
                                    {item.clientName}
                                  </span>

                                  <p className="text-text-secondary text-xs">
                                    نوع الاستشارة:{" "}
                                    <span className="text-white">
                                      {item.consultationType}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-text-secondary text-[10px]">
                                  تاريخ التقديم
                                </p>
                                <p className="text-white text-xs">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "ar-EG",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer settings={siteData} />
    </div>
  );
};
