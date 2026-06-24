import React from "react";
import { ContactForm } from "./ContactForm";
import type { LandingPageContent } from "../data/landingData";

interface ContactSectionProps {
  settings?: LandingPageContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const cTitle = settings?.contactTitle || "تواصل معنا";
  const cSubtitle = settings?.contactSubtitle || "احصل على استشارة قانونية مجانية. اترك بياناتك وسيتواصل معك أحد محامينا خلال 24 ساعة.";
  const office = settings?.office || {
    address: "حدائق الأهرام",
    phone: "01019675108",
    email: "info@arabic-lawyer.com",
    hours: "الأحد - الخميس: 9 صباحاً - 5 مساءً"
  };

  return (
    <section className="py-20 md:py-32 relative" id="contact">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="reveal">
            <h2 className="section-title text-right">{cTitle}</h2>
            <div
              className="section-divider mr-0 ml-auto"
              style={{ transitionDelay: "0.1s" }}
            />
            <p className="text-text-secondary mt-4 mb-8">
              {cSubtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-gold)"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">العنوان</h4>
                  <p className="text-text-secondary">
                    {office.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-gold)"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">الهاتف</h4>
                  <p className="text-text-secondary" dir="ltr">
                    {office.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-gold)"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">البريد الإلكتروني</h4>
                  <p className="text-text-secondary">
                    {office.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-gold)"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">ساعات العمل</h4>
                  <p className="text-text-secondary">
                    {office.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="form-container reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
