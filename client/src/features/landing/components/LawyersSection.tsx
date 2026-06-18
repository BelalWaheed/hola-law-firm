import React from "react";
import type { LandingPageContent } from "../data/landingData";

interface LawyersSectionProps {
  settings?: LandingPageContent;
}

const defaultLawyers = [
  { name: "محمد علي", title: "محامي أول - القانون التجاري", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "https://youtu.be/guI8282wn5Q?si=tZWhHCg-u7Gf-wtD", email: "#" },
  { name: "سارة العتيبي", title: "محامية - الأحوال الشخصية", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" },
  { name: "رمضان فؤاد", title: "محامي - القانون الجنائي", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" },
  { name: "محمود ابو السعود", title: "محامي - العقارات", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", linkedin: "#", twitter: "#", email: "#" }
];

export const LawyersSection: React.FC<LawyersSectionProps> = ({ settings }) => {
  const lTitle = settings?.lawyersTitle || "فريق المحامين";
  const lSubtitle = settings?.lawyersSubtitle || "نخبة من أفضل المحامين المتخصصين ذوي الخبرة والكفاءة العالية";
  const lawyersList = settings?.lawyers || defaultLawyers;

  return (
    <section className="py-20 md:py-32 relative bg-bg-secondary" id="lawyers">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title reveal">{lTitle}</h2>
          <div
            className="section-divider reveal"
            style={{ transitionDelay: "0.1s" }}
          />
          <p
            className="text-text-secondary mt-4 max-w-2xl mx-auto reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            {lSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lawyersList.map((lawyer, idx) => (
            <div
              key={idx}
              className="lawyer-card reveal"
              style={{ transitionDelay: `${0.1 * (idx + 1)}s` }}
            >
              <img
                src={lawyer.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"}
                alt={lawyer.name}
                className="lawyer-image"
              />
              <div className="lawyer-info">
                <h3 className="lawyer-name">{lawyer.name}</h3>
                <p className="lawyer-title">{lawyer.title}</p>
                <div className="lawyer-social">
                  {lawyer.linkedin && (
                    <a href={lawyer.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {lawyer.twitter && (
                    <a href={lawyer.twitter} aria-label="Twitter" target="_blank" rel="noreferrer">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  )}
                  {lawyer.email && (
                    <a href={`mailto:${lawyer.email}`} aria-label="Email">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
