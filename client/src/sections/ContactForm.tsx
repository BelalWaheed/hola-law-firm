import React, { useState } from "react";
import { createConsultation } from "../api/consultations";

interface SubmittedData {
  name: string;
  phone: string;
  service: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(() => {
    const saved = sessionStorage.getItem("hola_last_submission");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved submission from sessionStorage:", e);
      }
    }
    return null;
  });
  const [success, setSuccess] = useState<boolean>(() => {
    return !!sessionStorage.getItem("hola_last_submission");
  });
  const [name, setName] = useState<string>(() => {
    if (sessionStorage.getItem("hola_last_submission")) return "";
    return localStorage.getItem("hola_user_name") || "";
  });
  const [phone, setPhone] = useState<string>(() => {
    if (sessionStorage.getItem("hola_last_submission")) return "";
    return localStorage.getItem("hola_user_phone") || "";
  });
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorMsg("يجب أن يتكون الاسم من حرفين على الأقل");
      return;
    }
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setErrorMsg("يجب أن يحتوي الاسم على حروف فقط");
      return;
    }

    const trimmedPhone = phone.trim();
    const phoneRegex = /^(01[0125]\d{8}|\+201[0125]\d{8})$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setErrorMsg("رقم الجوال المصري غير صحيح (مثال: 01001234567)");
      return;
    }

    if (!service) {
      setErrorMsg("يرجى اختيار نوع الاستشارة");
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      setErrorMsg("يجب أن تحتوي تفاصيل القضية على 10 أحرف على الأقل");
      return;
    }

    setSubmitting(true);

    try {
      await createConsultation({
        clientName: trimmedName,
        phone: trimmedPhone,
        consultationType: service,
        details: trimmedMessage,
      });

      const dataToSave = {
        name: trimmedName,
        phone: trimmedPhone,
        service,
        message: trimmedMessage,
      };
      setSubmittedData(dataToSave);
      sessionStorage.setItem("hola_last_submission", JSON.stringify(dataToSave));
      if (localStorage.getItem("hola_user_phone") !== null) {
        localStorage.removeItem("hola_user_phone");
      }
      if (localStorage.getItem("hola_user_name") !== null) {
        localStorage.removeItem("hola_user_name");
      }
      localStorage.removeItem("hola_seen_replies");
      localStorage.setItem("hola_user_phone", trimmedPhone);
      localStorage.setItem("hola_user_name", trimmedName);
      window.dispatchEvent(new Event("hola_user_phone_updated"));
      setSuccess(true);
      setName("");
      setPhone("");
      setService("");
      setMessage("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success && submittedData) {
    return (
      <div className="text-right flex flex-col gap-6 animate-pulse-once">
        <div className="flex items-center gap-4 border-b border-border-color pb-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-400">تم إرسال الاستشارة بنجاح!</h3>
            <p className="text-text-secondary text-sm">سنتواصل معك في أقرب وقت ممكن</p>
          </div>
        </div>

        <div className="p-5 rounded-[12px] bg-bg-secondary border border-border-color space-y-4">
          <div>
            <span className="text-text-secondary text-xs block mb-0.5">الاسم الكامل</span>
            <span className="text-white font-medium text-base">{submittedData.name}</span>
          </div>
          <div>
            <span className="text-text-secondary text-xs block mb-0.5">رقم الجوال</span>
            <span className="text-white font-medium text-base" dir="ltr">{submittedData.phone}</span>
          </div>
          <div>
            <span className="text-text-secondary text-xs block mb-0.5">نوع الاستشارة</span>
            <span className="text-accent-gold-light font-medium text-base">{submittedData.service}</span>
          </div>
          <div>
            <span className="text-text-secondary text-xs block mb-0.5">تفاصيل القضية</span>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{submittedData.message}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary w-full justify-center"
          onClick={() => {
            setSubmittedData(null);
            setSuccess(false);
            sessionStorage.removeItem("hola_last_submission");
            const savedPhone = localStorage.getItem("hola_user_phone");
            const savedName = localStorage.getItem("hola_user_name");
            if (savedPhone) setPhone(savedPhone);
            if (savedName) setName(savedName);
          }}
        >
          <span>إرسال طلب آخر</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <form id="contactForm" onSubmit={handleFormSubmit} noValidate>
      {errorMsg && (
        <div className="alert alert-error mb-4 p-3 bg-red-100/10 border border-red-600/30 text-red-400 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label" htmlFor="name">الاسم الكامل</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="أدخل اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">رقم الجوال</label>
          <input
            type="tel"
            id="phone"
            className="form-input"
            placeholder="01006895586"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="service">نوع الاستشارة</label>
        <select
          id="service"
          className="form-input text-white [&>option]:bg-bg-card [&>option]:text-white"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        >
          <option value="" disabled>اختر نوع الاستشارة</option>
          <option value="قضايا تجارية">قضايا تجارية</option>
          <option value="أحوال شخصية">أحوال شخصية</option>
          <option value="قضايا جنائية">قضايا جنائية</option>
          <option value="عقارات ومقاولات">عقارات ومقاولات</option>
          <option value="تحصيل ديون">تحصيل ديون</option>
          <option value="أخرى">أخرى</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="message">تفاصيل القضية</label>
        <textarea
          id="message"
          className="form-input"
          placeholder="اشرح قضيتك باختصار..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            <span>جاري الإرسال...</span>
          </>
        ) : (
          <>
            <span>إرسال الطلب</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
};
