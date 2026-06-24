import React, { useState } from "react";
import { login } from "../api/auth";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    if (!username.trim() || !password) {
      setErrorMsg("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setSubmitting(true);

    try {
      const response = await login({ username, password });
      if (response.success) {
        setSuccess(true);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "اسم المستخدم أو كلمة المرور غير صحيحة";
      setErrorMsg(message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="loginForm" noValidate>
      {/* Validation Error Banner */}
      {errorMsg && (
        <div className="flex items-center p-[0.9rem_1.25rem] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#fca5a5] rounded-[10px] text-[0.95rem] mb-6">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Validation Success Banner */}
      {success && (
        <div className="flex items-center p-[0.9rem_1.25rem] bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#86efac] rounded-[10px] text-[0.95rem] mb-6">
          <span>مرحباً بك! جارٍ تحويلك إلى لوحة التحكم...</span>
        </div>
      )}

      {/* Username field */}
      <div className="form-group mb-6">
        <label className="form-label block text-text-secondary text-[0.95rem] font-medium mb-2" htmlFor="username">
          اسم المستخدم
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            className={`form-input w-full py-[0.9rem] pr-12 pl-5 bg-[rgba(10,22,40,0.6)] border rounded-[10px] text-white text-base transition-all focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(201,162,39,0.12)] ${
              errorMsg && !username ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-border-color"
            }`}
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-text-secondary pointer-events-none transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Password field */}
      <div className="form-group mb-6">
        <label className="form-label block text-text-secondary text-[0.95rem] font-medium mb-2" htmlFor="password">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`form-input w-full py-[0.9rem] pr-12 pl-12 bg-[rgba(10,22,40,0.6)] border rounded-[10px] text-white text-base transition-all focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(201,162,39,0.12)] ${
              errorMsg && !password ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : "border-border-color"
            }`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-text-secondary pointer-events-none transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <button
            type="button"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-none border-none text-text-secondary cursor-pointer p-0 transition-colors hover:text-accent-gold flex"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        className={`w-full p-4 flex items-center justify-center gap-3 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary text-[1.1rem] font-extrabold rounded-[10px] border-none cursor-pointer overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_40px_rgba(201,162,39,0.4)] active:translate-y-0 ${
          submitting ? "opacity-75" : ""
        }`}
        type="submit"
        disabled={submitting}
      >
        {submitting ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
};
