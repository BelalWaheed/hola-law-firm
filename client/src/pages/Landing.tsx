import React, { useEffect, useState } from "react";
import { Navbar } from "../sections/Navbar";
import { HeroSection } from "../sections/HeroSection";
import { ServicesSection } from "../sections/ServicesSection";
import { LawyersSection } from "../sections/LawyersSection";
import { ContactSection } from "../sections/ContactSection";
import { Footer } from "../sections/Footer";
import { getSiteSettings } from "../api/settings";
import { defaultLandingData, type LandingPageContent } from "../data/landingData";
import { clientCache } from "../data/cache";

export const Landing: React.FC = () => {
  // Always start with cached or default data — never show a spinner on load
  const [settings, setSettings] = useState<LandingPageContent>(
    clientCache.settings || defaultLandingData
  );

  // Fetch real settings in background and silently update
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSiteSettings();
        if (response.success && response.data) {
          setSettings(response.data);
          clientCache.settings = response.data;
        }
      } catch (error) {
        console.error("Failed to fetch settings on Landing page:", error);
        // defaultLandingData is already showing — nothing to do
      }
    };
    fetchSettings();
  }, []);

  // Scroll reveal transitions
  useEffect(() => {
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
  }, []);

  return (
    <div className="relative min-h-screen text-white bg-bg-primary overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="bg-pattern" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <ServicesSection settings={settings} />
      <LawyersSection settings={settings} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </div>
  );
};
