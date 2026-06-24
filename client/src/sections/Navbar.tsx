import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { LandingPageContent } from "../data/landingData";
import { checkConsultationStatus } from "../api/consultations";
import { Logo } from "../components/Logo";

interface NavbarProps {
  settings?: LandingPageContent;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null);

  // Use lazy state initialization to prevent sync setState inside mount effect
  const [hasUserRegistered, setHasUserRegistered] = useState(() => {
    const phone = localStorage.getItem("hola_user_phone");
    const name = localStorage.getItem("hola_user_name");
    return !!(phone && name);
  });

  // const isLoggedIn = !!localStorage.getItem("token");

  const checkUserRegistration = useCallback(() => {
    const phone = localStorage.getItem("hola_user_phone");
    const name = localStorage.getItem("hola_user_name");
    const registered = !!(phone && name);
    setTimeout(() => {
      setHasUserRegistered(registered);
    }, 0);
  }, []);

  const checkNotifications = useCallback(async () => {
    const phone = localStorage.getItem("hola_user_phone");
    if (!phone) {
      setTimeout(() => {
        setUnreadCount(0);
        setFirstUnreadId(null);
      }, 0);
      return;
    }

    try {
      const response = await checkConsultationStatus(phone);
      if (response.success && Array.isArray(response.data)) {
        const seenStr = localStorage.getItem("hola_seen_replies");
        let seenIds: string[] = [];
        try {
          seenIds = seenStr ? JSON.parse(seenStr) : [];
          if (!Array.isArray(seenIds)) seenIds = [];
        } catch {
          seenIds = [];
        }

        const unreadItems = response.data.filter(
          (item: { _id: string; adminReply?: string }) =>
            item.adminReply && !seenIds.includes(item._id),
        );

        setTimeout(() => {
          setUnreadCount(unreadItems.length);
          if (unreadItems.length > 0) {
            setFirstUnreadId(unreadItems[0]._id);
          } else {
            setFirstUnreadId(null);
          }
        }, 0);
      }
    } catch (err) {
      console.error("Failed to check notifications in Navbar:", err);
    }
  }, []);

  const handlePhoneUpdate = useCallback(() => {
    checkNotifications();
    checkUserRegistration();
  }, [checkNotifications, checkUserRegistration]);

  // Navbar scrolled class toggle
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkNotifications();
    checkUserRegistration();

    window.addEventListener("hola_seen_replies_updated", checkNotifications);
    window.addEventListener("hola_user_phone_updated", handlePhoneUpdate);

    const interval = setInterval(checkNotifications, 15000);

    return () => {
      window.removeEventListener(
        "hola_seen_replies_updated",
        checkNotifications,
      );
      window.removeEventListener("hola_user_phone_updated", handlePhoneUpdate);
      clearInterval(interval);
    };
  }, [checkNotifications, checkUserRegistration, handlePhoneUpdate]);

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    // Let browser handle middle-click (scroll button click) or modified clicks natively
    if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Sticky Top Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="w-full max-w-7xl mx-auto  flex items-center justify-between">
          {/* Logo group (Right side in RTL) */}
          <Link
            to="/"
            className="flex items-center gap-3 text-lg sm:text-xl font-bold font-amiri text-accent-gold hover:opacity-90 transition-opacity"
          >
            <Logo size={40} />
            <span className="whitespace-nowrap">
              {settings?.navbarBrand || "عبدالمنعم أبو السعود السيد"}
            </span>
          </Link>

          {/* Center Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#home"
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, "home")}
            >
              الرئيسية
            </a>
            <a
              href="/#services"
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, "services")}
            >
              خدماتنا
            </a>
            <a
              href="/#lawyers"
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, "lawyers")}
            >
              فريق العمل
            </a>
            <a
              href="/#contact"
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, "contact")}
            >
              تواصل معنا
            </a>
            {hasUserRegistered && (
              <Link to="/status" className="nav-link">
                متابعة الطلبات
              </Link>
            )}
          </div>

          {/* Left Action Button (Hidden on mobile) / Hamburger Toggle */}
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Link
                to={
                  firstUnreadId ? `/status?replyId=${firstUnreadId}` : "/status"
                }
                className="relative flex items-center justify-center p-2 rounded-full text-accent-gold hover:text-accent-gold-light hover:bg-bg-secondary transition-all notification-bell-active"
                title="لديك ردود غير مقروءة"
              >
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shrink-0">
                  {unreadCount}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Link>
            )}
            {/*
            {isLoggedIn ? (
              <a
                href="/dashboard"
                className="hidden md:inline-flex relative items-center justify-center py-2.5 px-5 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary font-bold text-sm rounded-[4px] hover:shadow-lg transition-all whitespace-nowrap"
                onClick={(e) => {
                  if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
                    return;
                  }
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                لوحة التحكم
              </a>
            ) : (
              <a
                href="/login"
                className="hidden md:inline-flex relative items-center justify-center py-2.5 px-5 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary font-bold text-sm rounded-[4px] hover:shadow-lg transition-all whitespace-nowrap"
                onClick={(e) => {
                  if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
                    return;
                  }
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                تسجيل الدخول
              </a>
            )}
            */}

            {/* Mobile Status Link */}
            {hasUserRegistered && (
              <Link
                to="/status"
                className="flex md:hidden items-center justify-center py-1.5 px-2 m-2 border border-accent-gold/30 text-accent-gold hover:text-accent-gold-light hover:bg-[rgba(201,162,39,0.05)] text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap"
              >
                متابعة الطلبات
              </Link>
            )}

            {/* Hamburger Mobile Menu Toggle Button */}
            <div
              className="flex md:hidden mobile-menu-btn"
              id="mobileMenuBtn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span
                style={{
                  transform: mobileMenuOpen
                    ? "rotate(45deg) translate(6px, 5px)"
                    : "",
                }}
              />
              <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <span
                style={{
                  transform: mobileMenuOpen
                    ? "rotate(-45deg) translate(6px, -5px)"
                    : "",
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu Panel */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        id="mobileMenuOverlay"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
        id="mobileMenu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border-color pb-4 mb-6">
          <span className="font-amiri font-bold text-accent-gold text-lg">
            القائمة
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-text-secondary hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="/#home"
            className="text-lg font-medium py-2.5 border-b border-border-color/20 text-white hover:text-accent-gold transition-colors"
            onClick={(e) => handleScrollToSection(e, "home")}
          >
            الرئيسية
          </a>
          <a
            href="/#services"
            className="text-lg font-medium py-2.5 border-b border-border-color/20 text-white hover:text-accent-gold transition-colors"
            onClick={(e) => handleScrollToSection(e, "services")}
          >
            خدماتنا
          </a>
          <a
            href="/#lawyers"
            className="text-lg font-medium py-2.5 border-b border-border-color/20 text-white hover:text-accent-gold transition-colors"
            onClick={(e) => handleScrollToSection(e, "lawyers")}
          >
            فريق العمل
          </a>
          <a
            href="/#contact"
            className="text-lg font-medium py-2.5 border-b border-border-color/20 text-white hover:text-accent-gold transition-colors"
            onClick={(e) => handleScrollToSection(e, "contact")}
          >
            تواصل معنا
          </a>
          {/*
          {isLoggedIn ? (
            <a
              href="/dashboard"
              className="relative inline-flex items-center justify-center mt-6 py-3 px-5 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary font-bold text-sm rounded-[4px] hover:shadow-lg transition-all whitespace-nowrap text-center w-full"
              onClick={(e) => {
                if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
                  return;
                }
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate("/dashboard");
              }}
            >
              لوحة التحكم
            </a>
          ) : (
            <a
              href="/login"
              className="relative inline-flex items-center justify-center mt-6 py-3 px-5 bg-linear-to-r from-accent-gold to-accent-gold-light text-bg-primary font-bold text-sm rounded-[4px] hover:shadow-lg transition-all whitespace-nowrap text-center w-full"
              onClick={(e) => {
                if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) {
                  return;
                }
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate("/login");
              }}
            >
              تسجيل الدخول
            </a>
          )}
            */}
        </div>
      </div>
    </>
  );
};
