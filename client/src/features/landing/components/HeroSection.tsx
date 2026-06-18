import React, { useEffect, useState, useRef } from "react";
import type { LandingPageContent } from "../data/landingData";

interface StatCardProps {
  target: number;
  label: string;
  suffix: string;
}

const defaultStats = [
  { target: 25, label: "سنة خبرة", suffix: "+" },
  { target: 3500, label: "قضية ناجحة", suffix: "+" },
  { target: 50, label: "محامي متخصص", suffix: "+" },
  { target: 98, label: "نسبة الرضا", suffix: "%" }
];

const StatCard: React.FC<StatCardProps> = ({ target, label, suffix }) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const stepTime = 16;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, stepTime);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={cardRef} className="stat-card">
      <div className="stat-number">
        {count}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

interface HeroSectionProps {
  settings?: LandingPageContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const [particles] = useState<
    { left: string; delay: string; duration: string }[]
  >(() =>
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 4 + 6}s`,
    }))
  );

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />

      <div className="hero-scales">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <path
            d="M50 10 L50 30 M30 30 L70 30 M20 40 L35 70 L20 70 Z M80 40 L65 70 L80 70 Z M35 40 L50 70 L35 70 Z M65 40 L50 70 L65 70 Z"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "var(--accent-gold)" }}
          />
        </svg>
      </div>

      {/* Floating Ambient Particles */}
      <div className="particles-container" id="particles">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[rgba(201,162,39,0.1)] border border-accent-gold rounded-full px-4 py-2 mb-6 reveal">
            <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
            <span className="text-accent-gold text-sm font-medium">
              {settings?.badgeText || "محامون معتمدون منذ 1995"}
            </span>
          </div>

          <h1
            className="hero-title reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            {settings?.heroTitlePrefix || "خبرة قانونية"}
            <br />
            <span className="font-amiri">{settings?.heroTitleSuffix || "تحمي حقوقك"}</span>
          </h1>

          <p
            className="hero-subtitle reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            {settings?.heroSubtitle || "نقدم خدمات قانونية متكاملة بأعلى معايير الاحترافية والسرية. فريق من أفضل المحامين المتخصصين في جميع المجالات القانونية."}
          </p>

          <div
            className="flex flex-wrap gap-4 mt-10 reveal"
            style={{ transitionDelay: "0.3s" }}
          >
            <button
              className="btn-primary"
              onClick={() => {
                const target = document.getElementById("contact");
                if (target)
                  target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              <span>{settings?.heroCtaText || "احصل على استشارة مجانية"}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Interactive Counters Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 reveal"
          style={{ transitionDelay: "0.4s" }}
        >
          {(settings?.stats || defaultStats).map((s, idx) => (
            <StatCard key={idx} target={s.target} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      </div>
    </section>
  );
};
