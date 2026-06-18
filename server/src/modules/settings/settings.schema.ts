import { Request } from "express";
import { ValidationResult } from "../../core/middlewares/validate.middleware";

export interface UpdateSettingsDTO {
  navbarBrand: string;
  badgeText: string;
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaText: string;
  stats: Array<{ target: number; label: string; suffix: string }>;
  servicesTitle: string;
  servicesSubtitle: string;
  services: Array<{ title: string; description: string; iconName: string }>;
  lawyersTitle: string;
  lawyersSubtitle: string;
  lawyers: Array<{ name: string; title: string; imageUrl: string; linkedin?: string; twitter?: string; email?: string }>;
  contactTitle: string;
  contactSubtitle: string;
  office: { address: string; phone: string; email: string; hours: string };
  footerBrand?: string;
  footerDesc: string;
  copyrightText?: string;
  facebookLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
}

export const validateUpdateSettings = (req: Request): ValidationResult => {
  const body = req.body || {};
  const errors: any[] = [];

  const requiredStringFields = [
    "navbarBrand", "badgeText", "heroTitlePrefix", "heroTitleSuffix", "heroSubtitle", "heroCtaText",
    "servicesTitle", "servicesSubtitle", "lawyersTitle", "lawyersSubtitle",
    "contactTitle", "contactSubtitle", "footerDesc"
  ];

  requiredStringFields.forEach(field => {
    if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
      errors.push({ message: `${field} is required`, path: ["body", field] });
    }
  });

  // Validate stats
  if (!Array.isArray(body.stats)) {
    errors.push({ message: "stats must be an array", path: ["body", "stats"] });
  } else {
    body.stats.forEach((stat: any, index: number) => {
      if (typeof stat.target !== "number" || stat.target < 0) {
        errors.push({ message: "target must be a non-negative number", path: ["body", "stats", index, "target"] });
      }
      if (!stat.label || typeof stat.label !== "string" || stat.label.trim() === "") {
        errors.push({ message: "label is required", path: ["body", "stats", index, "label"] });
      }
      if (typeof stat.suffix !== "string") {
        errors.push({ message: "suffix must be a string", path: ["body", "stats", index, "suffix"] });
      }
    });
  }

  // Validate services
  if (!Array.isArray(body.services)) {
    errors.push({ message: "services must be an array", path: ["body", "services"] });
  } else {
    body.services.forEach((service: any, index: number) => {
      if (!service.title || typeof service.title !== "string" || service.title.trim() === "") {
        errors.push({ message: "title is required", path: ["body", "services", index, "title"] });
      }
      if (!service.description || typeof service.description !== "string" || service.description.trim() === "") {
        errors.push({ message: "description is required", path: ["body", "services", index, "description"] });
      }
      if (!service.iconName || typeof service.iconName !== "string" || service.iconName.trim() === "") {
        errors.push({ message: "iconName is required", path: ["body", "services", index, "iconName"] });
      }
    });
  }

  // Validate lawyers
  if (!Array.isArray(body.lawyers)) {
    errors.push({ message: "lawyers must be an array", path: ["body", "lawyers"] });
  } else {
    body.lawyers.forEach((lawyer: any, index: number) => {
      if (!lawyer.name || typeof lawyer.name !== "string" || lawyer.name.trim() === "") {
        errors.push({ message: "name is required", path: ["body", "lawyers", index, "name"] });
      }
      if (!lawyer.title || typeof lawyer.title !== "string" || lawyer.title.trim() === "") {
        errors.push({ message: "title is required", path: ["body", "lawyers", index, "title"] });
      }
      if (!lawyer.imageUrl || typeof lawyer.imageUrl !== "string" || lawyer.imageUrl.trim() === "") {
        errors.push({ message: "imageUrl is required", path: ["body", "lawyers", index, "imageUrl"] });
      } else {
        try {
          new URL(lawyer.imageUrl);
        } catch (_) {
          errors.push({ message: "رابط الصورة غير صالح", path: ["body", "lawyers", index, "imageUrl"] });
        }
      }
      // Populate defaults if missing
      if (lawyer.linkedin === undefined || lawyer.linkedin === null) lawyer.linkedin = "";
      if (lawyer.twitter === undefined || lawyer.twitter === null) lawyer.twitter = "";
      if (lawyer.email === undefined || lawyer.email === null) lawyer.email = "";
    });
  }

  // Validate office
  const office = body.office || {};
  if (typeof body.office !== "object" || body.office === null) {
    errors.push({ message: "office must be an object", path: ["body", "office"] });
  } else {
    const requiredOfficeFields = ["address", "phone", "email", "hours"];
    requiredOfficeFields.forEach(field => {
      if (!office[field] || typeof office[field] !== "string" || office[field].trim() === "") {
        errors.push({ message: `${field} is required in office`, path: ["body", "office", field] });
      }
    });
  }

  // Populate defaults for social links if missing
  if (body.facebookLink === undefined || body.facebookLink === null) body.facebookLink = "";
  if (body.twitterLink === undefined || body.twitterLink === null) body.twitterLink = "";
  if (body.linkedinLink === undefined || body.linkedinLink === null) body.linkedinLink = "";
  if (body.instagramLink === undefined || body.instagramLink === null) body.instagramLink = "";

  return {
    success: errors.length === 0,
    errors,
  };
};
