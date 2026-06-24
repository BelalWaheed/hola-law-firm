import React from "react";
import type { LandingPageContent } from "../data/landingData";

interface ServicesSectionProps {
  settings?: LandingPageContent;
}

const renderServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "consultation":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "commercial":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "criminal":
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      );
    case "corporate":
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      );
    case "property":
    default:
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
  }
};

const defaultServices = [
  { title: "استشارات قانونية", description: "نقدم استشارات قانونية متخصصة في جميع المجالات مع ضمان السرية التامة والاحترافية العالية.", iconName: "consultation" },
  { title: "قضايا تجارية", description: "تمثيل ومتابعة القضايا التجارية والشركات بمهارة عالية وخبرة واسعة في هذا المجال.", iconName: "commercial" },
  { title: "قضايا الأحوال الشخصية", description: "معالجة قضايا الأسرة والطلاق والحضانة والنفقة بحساسية عالية واهتمام بجميع التفاصيل.", iconName: "family" },
  { title: "قضايا جنائية", description: "دفاع قوي ومحترف في القضايا الجنائية مع فريق متخصص في هذا النوع من القضايا.", iconName: "criminal" },
  { title: "تأسيس شركات وصيدليات", description: "نقدم خدمات تأسيس الشركات، صياغة لوائحها الداخلية، وإجراءات تراخيص الصيدليات والمنشآت التجارية.", iconName: "corporate" },
  { title: "عقارات ومقاولات", description: "صياغة ومراجعة العقود العقارية والتعامل مع نزاعات المقاولات والمباني.", iconName: "property" }
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ settings }) => {
  const sTitle = settings?.servicesTitle || "خدماتنا القانونية";
  const sSubtitle = settings?.servicesSubtitle || "نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لتلبية جميع احتياجاتك";
  const servicesList = settings?.services || defaultServices;

  return (
    <section className="py-20 md:py-32 relative" id="services">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title reveal">{sTitle}</h2>
          <div
            className="section-divider reveal"
            style={{ transitionDelay: "0.1s" }}
          />
          <p
            className="text-text-secondary mt-4 max-w-2xl mx-auto reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            {sSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="service-card reveal"
              style={{ transitionDelay: `${0.1 * (idx + 1)}s` }}
            >
              <div className="service-icon">
                {renderServiceIcon(service.iconName)}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
