import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { Logo } from "../components/Logo";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [particles] = useState<{ left: string; delay: string; duration: string; width: string; height: string }[]>(() => {
    return Array.from({ length: 20 }).map(() => {
      const size = 2 + Math.random() * 3;
      return {
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        width: `${size}px`,
        height: `${size}px`,
      };
    });
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-primary overflow-hidden text-white font-sans">
      <div className="bg-pattern" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="particles-container" id="particles">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.width,
              height: p.height,
            }}
          />
        ))}
      </div>

      <div className="login-card w-full max-w-[460px] m-8 p-12 rounded-[20px] bg-linear-to-br from-bg-card to-bg-secondary border border-border-color shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-transparent via-accent-gold to-transparent rounded-t-[20px]" />

        <div className="logo-wrapper flex flex-col items-center mb-10">
          <div className="logo-icon w-16 h-16 flex items-center justify-center bg-linear-to-br from-[rgba(201,162,39,0.15)] to-[rgba(201,162,39,0.05)] border border-[rgba(201,162,39,0.3)] rounded-[16px] mb-4">
            <Logo size={36} />
          </div>
          <div className="logo-title text-2xl font-extrabold text-white">عبدالمنعم أبو السعود</div>
          <div className="logo-sub text-[0.9rem] text-text-secondary mt-1 font-amiri">مكتب المحاماة والاستشارات القانونية</div>
          <div className="gold-divider w-[50px] h-[2px] bg-linear-to-r from-accent-gold to-accent-gold-light mx-auto mt-3 rounded-[2px]" />
        </div>

        <LoginForm onSuccess={() => navigate("/dashboard")} />

        <div className="card-footer text-center mt-8 text-[0.9rem] text-text-secondary">
          <a
            href="/"
            className="text-accent-gold font-semibold hover:opacity-75 transition-opacity"
            onClick={(e) => {
              if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
              }
              e.preventDefault();
              navigate("/");
            }}
          >
            ← العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
};
