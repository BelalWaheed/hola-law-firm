import React from "react";
import { Link } from "react-router-dom";
import type { LandingPageContent } from "../data/landingData";
import { Logo } from "../../../components/Logo";

interface FooterProps {
  settings?: LandingPageContent;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const fBrand = settings?.navbarBrand || "عبدالمنعم أبو السعود السيد";
  const fDesc = settings?.footerDesc || "مكتب محاماة متخصص يقدم خدمات قانونية شاملة بأعلى معايير الجودة والاحترافية منذ عام 1995.";
  const currentYear = new Date().getFullYear();
  const copyright = `جميع الحقوق محفوظة ${currentYear} - ${settings?.navbarBrand || "عبدالمنعم أبو السعود السيد"}`;

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    // Let browser handle middle-click (scroll button click) or modified clicks natively
    if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="footer">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 mb-4 text-accent-gold hover:opacity-85 transition-opacity"
            >
              <Logo size={40} />
              <span className="text-lg font-bold font-amiri">{fBrand}</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              {fDesc}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <div className="footer-links flex flex-col gap-2">
              <a
                href="/#home"
                className="hover:text-accent-gold"
                onClick={(e) => handleScrollToSection(e, "home")}
              >
                الرئيسية
              </a>
              <a
                href="/#services"
                className="hover:text-accent-gold"
                onClick={(e) => handleScrollToSection(e, "services")}
              >
                خدماتنا
              </a>
              <a
                href="/#lawyers"
                className="hover:text-accent-gold"
                onClick={(e) => handleScrollToSection(e, "lawyers")}
              >
                فريق العمل
              </a>
              <a
                href="/#contact"
                className="hover:text-accent-gold"
                onClick={(e) => handleScrollToSection(e, "contact")}
              >
                تواصل معنا
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">خدماتنا</h4>
            <div className="footer-links flex flex-col gap-2">
              {(settings?.services || []).slice(0, 4).map((service, idx) => (
                <a
                  key={idx}
                  href="/#services"
                  className="hover:text-accent-gold text-sm"
                  onClick={(e) => handleScrollToSection(e, "services")}
                >
                  {service.title}
                </a>
              ))}
              {(settings?.services || []).length === 0 && (
                <>
                  <span className="text-text-secondary text-sm">استشارات قانونية</span>
                  <span className="text-text-secondary text-sm">قضايا تجارية</span>
                  <span className="text-text-secondary text-sm">أحوال شخصية</span>
                  <span className="text-text-secondary text-sm">قضايا جنائية</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">تابعنا</h4>
            <div className="flex gap-3">
              {settings?.facebookLink && (
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg hover:bg-accent-gold transition-colors group"
                  aria-label="Facebook"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent-gold group-hover:text-bg-primary transition-colors"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {settings?.twitterLink && (
                <a
                  href={settings.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg hover:bg-accent-gold transition-colors group"
                  aria-label="Twitter"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent-gold group-hover:text-bg-primary transition-colors"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              )}
              {settings?.linkedinLink && (
                <a
                  href={settings.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg hover:bg-accent-gold transition-colors group"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent-gold group-hover:text-bg-primary transition-colors"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {settings?.instagramLink && (
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[rgba(201,162,39,0.1)] rounded-lg hover:bg-accent-gold transition-colors group"
                  aria-label="Instagram"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent-gold group-hover:text-bg-primary transition-colors"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border-color pt-6 text-center text-text-secondary text-sm">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
