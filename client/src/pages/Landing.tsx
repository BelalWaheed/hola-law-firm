import React, { useEffect, useState } from "react";
import { Navbar } from "../sections/Navbar";
import { HeroSection } from "../sections/HeroSection";
import { ServicesSection } from "../sections/ServicesSection";
import { LawyersSection } from "../sections/LawyersSection";
import { ContactSection } from "../sections/ContactSection";
import { Footer } from "../sections/Footer";
import { getSiteSettings } from "../api/settings";
import { defaultLandingData, type LandingPageContent } from "../data/landingData";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { clientCache } from "../data/cache";

export const Landing: React.FC = () => {
  const [settings, setSettings] = useState<LandingPageContent | null>(clientCache.settings);
  const [loading, setLoading] = useState(!clientCache.settings);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSiteSettings();
        if (response.success && response.data) {
          setSettings(response.data);
          clientCache.settings = response.data;
        } else {
          setSettings(defaultLandingData);
        }
      } catch (error) {
        console.error("Failed to fetch settings on Landing page:", error);
        setSettings(defaultLandingData);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Scroll reveal transitions - only setup after loading completes
  useEffect(() => {
    if (loading) return;

    // Smooth scroll to element if hash is present in URL on initial mount
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }

    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const siteData = settings || defaultLandingData;

  return (
    <div className="relative min-h-screen text-white bg-bg-primary overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="bg-pattern" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Navbar settings={siteData} />
      <HeroSection settings={siteData} />
      <ServicesSection settings={siteData} />
      <LawyersSection settings={siteData} />
      <ContactSection settings={siteData} />
      <Footer settings={siteData} />
    </div>
  );
};
